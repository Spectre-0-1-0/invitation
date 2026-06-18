import { PrismaClient } from '@prisma/client';

export class PersonService {
  constructor(private prisma: PrismaClient) {}

  async createPerson(data: any) {
    return this.prisma.person.create({ data });
  }

  async getPersonWithFullProfile(id: string) {
    return this.prisma.person.findUnique({
      where: { id },
      include: {
        events: {
          orderBy: { date: 'desc' },
          include: { tags: true }
        },
        mediaTagged: {
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: { event: true }
        },
        memories: {
          include: { event: true }
        },
        messagesRecv: {
          orderBy: { createdAt: 'desc' }
        },
        achievements: {
          orderBy: { date: 'desc' }
        },
        relationships: {
          include: { target: { select: { id: true, name: true, image: true } } }
        },
        relatedBy: {
          include: { person: { select: { id: true, name: true, image: true } } }
        }
      }
    });
  }

  async getPersonStats(id: string) {
    const stats = await this.prisma.person.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            events: true,
            mediaTagged: true,
            memories: true,
            messagesRecv: true,
            achievements: true
          }
        }
      }
    });
    return stats?._count;
  }

  async searchPeople(query: {
    name?: string;
    branch?: string;
    batch?: string;
    year?: number;
  }) {
    return this.prisma.person.findMany({
      where: {
        name: query.name ? { contains: query.name, mode: 'insensitive' } : undefined,
        branch: query.branch,
        batch: query.batch,
        graduationYear: query.year
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        nickname: true,
        image: true,
        branch: true,
        major: true
      }
    });
  }

  async getRelatedPeople(id: string) {
    // Finds people who have participated in the same events
    const person = await this.prisma.person.findUnique({
      where: { id },
      include: { events: { select: { id: true } } }
    });

    if (!person) return [];

    const eventIds = person.events.map(e => e.id);

    return this.prisma.person.findMany({
      where: {
        events: { some: { id: { in: eventIds } } },
        NOT: { id }
      },
      take: 10,
      select: { id: true, name: true, image: true }
    });
  }
}
