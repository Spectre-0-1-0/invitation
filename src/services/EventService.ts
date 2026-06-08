import { getPrisma } from '@/lib/prisma/client';

export class EventService {
  static async getAllEvents() {
    return getPrisma().event.findMany({
      orderBy: { date: 'asc' },
      include: {
        media: true,
      }
    });
  }

  static async getEventBySlug(slug: string) {
    return getPrisma().event.findUnique({
      where: { slug },
      include: {
        media: true,
        messages: true,
      }
    });
  }
}
