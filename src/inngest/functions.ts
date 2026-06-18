import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase-storage";
import sharp from "sharp";
import AdmZip from "adm-zip";
import { getBucketFromMimeType } from "@/lib/supabase-storage";

export const processMediaUpload = inngest.createFunction(
  { id: "process-media-upload" },
  { event: "media/upload.created" },
  async ({ event, step }) => {
    const { mediaId } = event.data;

    const media = await step.run("get-media", async () => {
      return await prisma.media.findUnique({
        where: { id: mediaId },
        include: { event: true },
      });
    });

    if (!media) return;

    await step.run("update-status-processing", async () => {
      await prisma.media.update({
        where: { id: mediaId },
        data: { status: "PROCESSING" },
      });
    });

    try {
      // 1. Download file from Supabase
      const fileData = await step.run("download-file", async () => {
        const urlParts = media.url.split("/storage/v1/object/public/");
        if (urlParts.length < 2) throw new Error("Invalid Supabase URL");

        const remaining = urlParts[1];
        const bucket = remaining.substring(0, remaining.indexOf('/'));
        const path = remaining.substring(remaining.indexOf('/') + 1);

        const { data, error } = await supabase.storage.from(bucket).download(path);
        if (error) throw error;
        return { buffer: Buffer.from(await data.arrayBuffer()).toString('base64') };
      });

      const buffer = Buffer.from(fileData.buffer, 'base64');

      // 2. Process based on type
      if (media.type === "PHOTO") {
        const metadataResult = await step.run("process-image", async () => {
          const image = sharp(buffer);
          const metadata = await image.metadata();

          const thumbBuffer = await image
            .resize(600, 600, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

          const thumbPath = `thumbnails/${media.id}.webp`;
          const { data: thumbData, error: thumbError } = await supabase.storage
            .from('photos')
            .upload(thumbPath, thumbBuffer, { contentType: 'image/webp', upsert: true });

          if (thumbError) throw thumbError;

          const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(thumbData.path);

          return {
            thumbnailUrl: publicUrl,
            width: metadata.width,
            height: metadata.height,
            fileSize: buffer.length
          };
        });

        await step.run("update-media-metadata", async () => {
          await prisma.media.update({
            where: { id: mediaId },
            data: {
              thumbnailUrl: metadataResult.thumbnailUrl,
              width: metadataResult.width,
              height: metadataResult.height,
              fileSize: metadataResult.fileSize,
              status: "COMPLETED"
            },
          });
        });
      } else {
         // Handle other types
         await step.run("mark-completed", async () => {
           await prisma.media.update({
             where: { id: mediaId },
             data: { status: "COMPLETED", fileSize: buffer.length },
           });
         });
      }

      // Update Upload progress if linked
      if (media.uploadId) {
        await step.run("update-upload-progress", async () => {
          const upload = await prisma.upload.findUnique({
            where: { id: media.uploadId! },
            include: { _count: { select: { media: true } } }
          });

          if (upload) {
            const newProcessedCount = upload.processedFiles + 1;
            const isFinished = newProcessedCount >= upload.totalFiles;

            await prisma.upload.update({
              where: { id: media.uploadId! },
              data: {
                processedFiles: newProcessedCount,
                status: isFinished ? "COMPLETED" : "PROCESSING"
              }
            });
          }
        });
      }

    } catch (err: any) {
      await step.run("mark-failed", async () => {
        await prisma.media.update({
          where: { id: mediaId },
          data: { status: "FAILED", errorMessage: err.message },
        });
        if (media.uploadId) {
          await prisma.upload.update({
            where: { id: media.uploadId! },
            data: { failedFiles: { increment: 1 } }
          });
        }
      });
      throw err; // Re-throw for Inngest retry logic
    }
  }
);

export const processZipExtraction = inngest.createFunction(
  { id: "process-zip-extraction" },
  { event: "media/zip.uploaded" },
  async ({ event, step }) => {
    const { uploadId, zipUrl, eventId } = event.data;

    const zipData = await step.run("download-zip", async () => {
      const urlParts = zipUrl.split("/storage/v1/object/public/");
      const remaining = urlParts[1];
      const bucket = remaining.substring(0, remaining.indexOf('/'));
      const path = remaining.substring(remaining.indexOf('/') + 1);

      const { data, error } = await supabase.storage.from(bucket).download(path);
      if (error) throw error;
      return { buffer: Buffer.from(await data.arrayBuffer()).toString('base64') };
    });

    const zip = new AdmZip(Buffer.from(zipData.buffer, 'base64'));
    const zipEntries = zip.getEntries();

    const validEntries = zipEntries.filter(entry => !entry.isDirectory && !entry.entryName.startsWith('__MACOSX'));

    await step.run("update-total-files", async () => {
      await prisma.upload.update({
        where: { id: uploadId },
        data: { totalFiles: validEntries.length }
      });
    });

    for (const entry of validEntries) {
      await step.run(`process-entry-${entry.entryName}`, async () => {
        const buffer = entry.getData();
        const fileName = entry.entryName.split('/').pop() || entry.entryName;
        const mimeType = getMimeTypeFromExt(fileName);
        const targetBucket = getBucketFromMimeType(mimeType, fileName);

        const targetPath = `uploads/${uploadId}/${Date.now()}-${fileName}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(targetBucket)
          .upload(targetPath, buffer, { contentType: mimeType, upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from(targetBucket).getPublicUrl(uploadData.path);

        const media = await prisma.media.create({
          data: {
            url: publicUrl,
            type: mapBucketToMediaType(targetBucket),
            originalName: fileName,
            mimeType,
            eventId,
            uploadId,
            status: "QUEUED"
          }
        });

        await inngest.send({
          name: "media/upload.created",
          data: { mediaId: media.id }
        });
      });
    }

    return { processed: validEntries.length };
  }
);

function getMimeTypeFromExt(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    case 'mp4': return 'video/mp4';
    case 'mov': return 'video/quicktime';
    case 'pdf': return 'application/pdf';
    default: return 'application/octet-stream';
  }
}

function mapBucketToMediaType(bucket: string): any {
  switch (bucket) {
    case 'photos': return 'PHOTO';
    case 'videos': return 'VIDEO';
    case 'documents': return 'DOCUMENT';
    case 'memes': return 'MEME';
    case 'posters': return 'POSTER';
    default: return 'PHOTO';
  }
}
