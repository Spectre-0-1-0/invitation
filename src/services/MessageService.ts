import { getPrisma } from '@/lib/prisma/client';

export class MessageService {
  static async getAllMessages(category?: string) {
    return getPrisma().message.findMany({
      where: category ? { category } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        toPerson: true,
        fromPerson: true,
      }
    });
  }
}
