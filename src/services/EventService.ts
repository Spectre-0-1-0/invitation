import { PrismaClient } from '@prisma/client';

export class EventService {
  constructor(private prisma: PrismaClient) {}

  async getEventWithMedia(eventId: string) {
    return this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        media: true,
        memories: {
          include: {
            people: true
          }
        },
        people: true,
        tags: true
      }
    });
  }

  async listEventsByDate() {
    return this.prisma.event.findMany({
      orderBy: { date: 'desc' },
      include: {
        _count: {
          select: { media: true, memories: true }
        }
      }
    });
  }
}
