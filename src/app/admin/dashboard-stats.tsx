import { prisma } from '@/lib/prisma';

export async function getArchiveStats() {
  try {
    const [batches, events, people, media, messages] = await Promise.all([
      prisma.batch.count(),
      prisma.event.count(),
      prisma.person.count(),
      prisma.media.count(),
      prisma.message.count(),
    ]);

    // Data Quality Checks
    // In Prisma, we check for null/undefined foreign keys
    const orphanedMedia = await prisma.media.count({
      where: { eventId: undefined }
    });

    const eventsWithoutBatch = await prisma.event.count({
      where: { batchId: undefined }
    });

    return {
      batches,
      events,
      people,
      media,
      messages,
      health: {
        orphanedMedia,
        eventsWithoutBatch,
        totalIssues: orphanedMedia + eventsWithoutBatch
      }
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return null;
  }
}
