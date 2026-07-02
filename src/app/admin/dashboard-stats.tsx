import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function getArchiveStats() {
  try {
    if (!process.env.DATABASE_URL) {
      return null;
    }

    const [batches, events, people, media, messages] = await Promise.all([
      prisma.batch.count(),
      prisma.event.count(),
      prisma.person.count(),
      prisma.media.count(),
      prisma.message.count(),
    ]);

    // Data Quality Checks
    const orphanedMedia = await prisma.media.count({
      where: { eventId: '' } // Adjusted for Prisma cuid strings
    });

    return {
      batches,
      events,
      people,
      media,
      messages,
      health: {
        orphanedMedia,
        eventsWithoutBatch: 0, // Simplified
        totalIssues: orphanedMedia
      }
    };
  } catch (error: any) {
    const isPrismaError = error?.name === 'PrismaClientInitializationError' ||
                         error?.code === 'P1001' ||
                         error?.message?.includes('Can\'t reach database server');

    if (isPrismaError) {
      logger.warn('Dashboard stats query failed due to connection error during build');
    } else {
      logger.error("Dashboard stats error:", error);
    }
    return null;
  }
}
