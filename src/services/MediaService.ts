import { getPrisma } from '@/lib/prisma/client';

export class MediaService {
  static async getAllMedia(type?: string) {
    return getPrisma().media.findMany({
      where: type ? { type } : {},
      orderBy: { date: 'desc' },
      include: {
        people: true,
        event: true,
      }
    });
  }

  static async getFeaturedMedia() {
    return getPrisma().media.findMany({
      where: { featured: true },
      take: 10,
    });
  }
}
