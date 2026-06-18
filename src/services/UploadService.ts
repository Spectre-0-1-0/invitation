import { PrismaClient } from '@prisma/client';
import { StorageService } from '@/lib/storage/StorageService';

export class UploadService {
  constructor(
    private prisma: PrismaClient,
    private storage: StorageService
  ) {}

  async processBatchUpload(
    files: { buffer: Buffer; name: string }[],
    eventId: string,
    source: 'zip' | 'folder' | 'manual'
  ) {
    const upload = await this.prisma.upload.create({
      data: {
        batchName: `Batch-${Date.now()}`,
        source,
        status: 'processing'
      }
    });

    try {
      for (const file of files) {
        const url = await this.storage.uploadMemoryMedia(
          file.buffer,
          file.name,
          this.inferCategory(file.name),
          eventId
        );

        await this.prisma.mediaFile.create({
          data: {
            url,
            type: this.inferType(file.name),
            eventId,
            uploadId: upload.id,
            mimeType: 'image/jpeg', // simplified
            size: file.buffer.length
          }
        });
      }

      await this.prisma.upload.update({
        where: { id: upload.id },
        data: { status: 'completed' }
      });
    } catch (error) {
      await this.prisma.upload.update({
        where: { id: upload.id },
        data: { status: 'failed' }
      });
      throw error;
    }
  }

  private inferCategory(name: string): any {
    return name.endsWith('.mp4') ? 'videos' : 'photos';
  }

  private inferType(name: string): string {
    return name.endsWith('.mp4') ? 'video' : 'image';
  }
}
