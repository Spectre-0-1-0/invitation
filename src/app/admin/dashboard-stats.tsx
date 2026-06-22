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
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return null;
  }
}
