import { PrismaClient, Event } from '@prisma/client';

export interface EventCreateInput {
  title: string;
  description?: string;
  date: Date;
  startDate?: Date;
  endDate?: Date;
  academicYear: string;
  category: string;
  location?: string;
  organizers?: string;
  importance?: number;
  chapterMood?: string;
  featured?: boolean;
}

export class EventService {
  constructor(private prisma: PrismaClient) {}

  async createEvent(data: EventCreateInput) {
    return this.prisma.event.create({
      data
    });
  }

  async updateEvent(id: string, data: Partial<EventCreateInput>) {
    return this.prisma.event.update({
      where: { id },
      data
    });
  }

  async getEvent(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        media: {
          orderBy: { createdAt: 'desc' }
        },
        memories: {
          include: { people: true }
        },
        people: {
          select: { id: true, name: true, image: true, major: true }
        },
        achievements: true,
        documents: true,
        tags: true
      }
    });
  }

  async getEventStats(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            media: true,
            memories: true,
            people: true,
            achievements: true
          }
        }
      }
    });
    return event?._count;
  }

  async getRelatedEvents(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) return [];

    return this.prisma.event.findMany({
      where: {
        OR: [
          { category: event.category },
          { academicYear: event.academicYear }
        ],
        NOT: { id }
      },
      take: 5,
      orderBy: { date: 'desc' }
    });
  }

  async listEvents(filters: {
    year?: string;
    category?: string;
    batch?: string;
    tag?: string;
  }) {
    return this.prisma.event.findMany({
      where: {
        academicYear: filters.year,
        category: filters.category,
        tags: filters.tag ? { some: { name: filters.tag } } : undefined,
        people: filters.batch ? { some: { batch: filters.batch } } : undefined
      },
      orderBy: { date: 'desc' },
      include: {
        _count: {
          select: { media: true }
        }
      }
    });
  }
}
