import { inngest } from "../client";
import { prisma } from "../../prisma/client";
import { ProcessingStatus, MediaType } from "@prisma/client";
import { downloadFile, uploadFile } from "../../storage/supabase-storage";
import sharp from "sharp";

export const processMedia = inngest.createFunction(
  { id: "process-media" },
  { event: "media/uploaded" } as any,
  // @ts-ignore
  async ({ event, step }) => {
    const { mediaId, bucket, path: filePath } = event.data;

    await step.run("update-status-to-processing", async () => {
      return await prisma.media.update({
        where: { id: mediaId },
        data: { processingStatus: ProcessingStatus.PROCESSING },
      });
    });

    const result = await step.run("generate-thumbnail", async () => {
      const media = await prisma.media.findUnique({ where: { id: mediaId } });
      if (!media || media.type !== MediaType.PHOTO) return null;

      try {
        const fileData = await downloadFile(filePath, bucket);
        const buffer = Buffer.from(await fileData.arrayBuffer());

        const thumbnailBuffer = await sharp(buffer)
          .resize(400, 400, { fit: 'inside' })
          .jpeg({ quality: 80 })
          .toBuffer();

        const thumbnailPath = `thumbnails/${mediaId}.jpg`;
        const { publicUrl } = await uploadFile(thumbnailBuffer, thumbnailPath, bucket, 'image/jpeg');

        return publicUrl;
      } catch (error) {
        console.error("Thumbnail generation failed", error);
        return null;
      }
    });

    await step.run("complete-processing", async () => {
      return await prisma.media.update({
        where: { id: mediaId },
        data: {
          processingStatus: ProcessingStatus.COMPLETED,
          thumbnailUrl: result || undefined,
        },
      });
    });

    return { success: true };
  }
);
