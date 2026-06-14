import { inngest } from "../client";
import { prisma } from "../../prisma/client";
import { downloadFile, uploadFile, getBucketFromMediaType } from "../../storage/supabase-storage";
import AdmZip from "adm-zip";
import { MediaType } from "@prisma/client";
import path from "path";

function getMediaTypeFromExtension(ext: string): MediaType {
  const extension = ext.toLowerCase().replace('.', '');
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) return MediaType.PHOTO;
  if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) return MediaType.VIDEO;
  if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) return MediaType.DOCUMENT;
  return MediaType.PHOTO; // Default
}

export const processZip = inngest.createFunction(
  { id: "process-zip" },
  { event: "media/zip-uploaded" } as any,
  // @ts-ignore
  async ({ event, step }) => {
    const { zipPath, bucket, eventId } = event.data;

    const files = await step.run("extract-zip", async () => {
      const zipData = await downloadFile(zipPath, bucket);
      const buffer = Buffer.from(await zipData.arrayBuffer());
      const zip = new AdmZip(buffer);
      const zipEntries = zip.getEntries();

      const extractedFiles = [];

      for (const entry of zipEntries) {
        if (entry.isDirectory) continue;

        const entryBuffer = entry.getData();
        const entryPath = entry.entryName;
        const ext = path.extname(entryPath);
        const type = getMediaTypeFromExtension(ext);
        const targetBucket = getBucketFromMediaType(type);

        const storagePath = `events/${eventId}/${path.basename(entryPath)}`;
        const { publicUrl } = await uploadFile(entryBuffer, storagePath, targetBucket);

        extractedFiles.push({
          url: publicUrl,
          type,
          title: path.basename(entryPath),
          folderPath: path.dirname(entryPath),
        });
      }

      return extractedFiles;
    });

    await step.run("create-media-records", async () => {
      for (const file of files) {
        const media = await prisma.media.create({
          data: {
            eventId,
            type: file.type,
            url: file.url,
            title: file.title,
            folderPath: file.folderPath,
            processingStatus: "PENDING"
          },
        });

        // Trigger processing for each extracted file
        await inngest.send({
          name: "media/uploaded",
          data: {
            mediaId: media.id,
            bucket: getBucketFromMediaType(file.type),
            path: `events/${eventId}/${file.title}`
          } as any,
        });
      }
    });

    return { count: files.length };
  }
);
