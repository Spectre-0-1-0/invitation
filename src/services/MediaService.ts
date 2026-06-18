import { PrismaClient } from '@prisma/client';

export class MediaService {
  constructor(private prisma: PrismaClient) {}

  async registerMedia(data: {
    url: string;
    type: string;
    eventId?: string;
    memoryId?: string;
    mimeType: string;
    size: number;
  }) {
    return this.prisma.mediaFile.create({
      data: {
        url: data.url,
        type: data.type,
        eventId: data.eventId,
        memoryId: data.memoryId,
        mimeType: data.mimeType,
        size: data.size
      }
    });
  }

  async getMediaByPerson(personId: string) {
    return this.prisma.mediaFile.findMany({
      where: {
        taggedPeople: {
          some: { id: personId }
        }
      },
      include: {
        event: true
      }
    });
  }
}
