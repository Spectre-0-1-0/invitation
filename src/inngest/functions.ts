import { randomUUID } from "node:crypto";
import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import AdmZip from "adm-zip";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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
      const fileData = await step.run("download-file", async () => {
        // Parse Supabase URL to get bucket and path
        const url = new URL(media.url);
        const pathSegments = url.pathname.split('/');
        const publicIndex = pathSegments.indexOf('public');
        if (publicIndex === -1 || pathSegments.length <= publicIndex + 2) {
            throw new Error("Invalid Supabase URL format");
        }

        const bucket = pathSegments[publicIndex + 1];
        const path = pathSegments.slice(publicIndex + 2).join('/');

        const { data, error } = await supabase.storage.from(bucket).download(path);
        if (error) throw error;
        return {
            buffer: Buffer.from(await data.arrayBuffer()).toString('base64'),
            bucket,
            path
        };
      });

      const buffer = Buffer.from(fileData.buffer, 'base64');

      if (media.type === "PHOTO") {
        const metadataResult = await step.run("process-image", async () => {
          const image = sharp(buffer);
          const metadata = await image.metadata();

          const thumbBuffer = await image
            .resize(600, 600, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

          // Put thumbnail in the same bucket but in a thumbnails folder
          const pathParts = fileData.path.split('/');
          const fileName = pathParts.pop();
          const folderPath = pathParts.join('/');
          const thumbPath = `${folderPath}/thumbnails/${fileName?.split('.')[0]}.webp`;

          const { data: thumbData, error: thumbError } = await supabase.storage
            .from(fileData.bucket)
            .upload(thumbPath, thumbBuffer, { contentType: 'image/webp', upsert: true });

          if (thumbError) throw thumbError;

          const { data: { publicUrl } } = supabase.storage.from(fileData.bucket).getPublicUrl(thumbData.path);

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
         await step.run("mark-completed", async () => {
           await prisma.media.update({
             where: { id: mediaId },
             data: { status: "COMPLETED", fileSize: buffer.length },
           });
         });
      }

      if (media.uploadSessionId) {
        await step.run("update-session-progress", async () => {
          const session = await prisma.uploadSession.findUnique({
            where: { id: media.uploadSessionId! }
          });

          if (session) {
            const newSuccessCount = session.successCount + 1;
            const isFinished = newSuccessCount + session.failureCount >= session.fileCount;

            await prisma.uploadSession.update({
              where: { id: media.uploadSessionId! },
              data: {
                successCount: newSuccessCount,
                status: isFinished ? "COMPLETED" : "PROCESSING",
                completedAt: isFinished ? new Date() : null
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
      });
      throw err;
    }
  }
);

export const processZipExtraction = inngest.createFunction(
  { id: "process-zip-extraction" },
  { event: "media/zip.uploaded" },
  async ({ event, step }) => {
    const { uploadId, zipUrl, eventId } = event.data;

    const zipData = await step.run("download-zip", async () => {
      const url = new URL(zipUrl);
      const pathSegments = url.pathname.split('/');
      const publicIndex = pathSegments.indexOf('public');
      const bucket = pathSegments[publicIndex + 1];
      const path = pathSegments.slice(publicIndex + 2).join('/');

      const { data, error } = await supabase.storage.from(bucket).download(path);
      if (error) throw error;
      return { buffer: Buffer.from(await data.arrayBuffer()).toString('base64') };
    });

    const zip = new AdmZip(Buffer.from(zipData.buffer, 'base64'));
    const zipEntries = zip.getEntries();
    const validEntries = zipEntries.filter(entry => !entry.isDirectory && !entry.entryName.startsWith('__MACOSX'));

    await step.run("update-total-files", async () => {
      await prisma.uploadSession.update({
        where: { id: uploadId },
        data: { fileCount: validEntries.length }
      });
    });

    for (const entry of validEntries) {
      await step.run(`process-entry-${entry.entryName}`, async () => {
        const buffer = entry.getData();
        const fileName = entry.entryName.split('/').pop() || entry.entryName;

        const bucket = 'gallery';
        const uuid = randomUUID();
        const ext = fileName.split('.').pop()?.toLowerCase() || '';
        const targetPath = `${eventId || 'uncategorized'}/${uuid}${ext ? '.' + ext : ''}`;

        const mimeType = getMimeTypeFromExt(fileName);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(targetPath, buffer, { contentType: mimeType, upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(uploadData.path);

        const media = await prisma.media.create({
          data: {
            url: publicUrl,
            type: mimeType.startsWith('video') ? 'VIDEO' : (mimeType.includes('pdf') ? 'DOCUMENT' : 'PHOTO'),
            originalName: fileName,
            mimeType,
            eventId,
            uploadSessionId: uploadId,
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
