import { getPrisma } from '@/lib/prisma/client';

export class PersonService {
  static async getAllPeople() {
    return getPrisma().person.findMany({
      orderBy: { name: 'asc' },
      include: { achievements: true }
    });
  }

  static async getPersonBySlug(slug: string) {
    return getPrisma().person.findUnique({
      where: { slug },
      include: {
        memories: true,
        achievements: true,
        messagesReceived: true,
      }
    });
  }
}
