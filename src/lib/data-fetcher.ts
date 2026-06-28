import { logger } from "./logger";
import { prisma } from './prisma';

/**
 * Utility to fetch data with a fallback to static JSON if the database is unavailable.
 * This ensures the application remains buildable and testable in environments
 * without a live database connection.
 */
async function withFallback<T>(fetcher: () => Promise<T>, fallback: T): Promise<T> {
  try {
    if (!process.env.DATABASE_URL) {
      return fallback;
    }
    return await fetcher();
  } catch (error) {
    logger.error('Database query failed, using fallback', { data: error });
    return fallback;
  }
}

export async function getBatches() {
  return withFallback(
    () => prisma.batch.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: 'desc' }
    }),
    []
  );
}

export async function getSeniors() {
  return withFallback(
    () => prisma.person.findMany({
      include: { batch: true },
      orderBy: { displayOrder: 'asc' }
    }),
    []
  );
}

export async function getSeniorBySlug(slug: string) {
  return withFallback(
    () => prisma.person.findUnique({
      where: { slug },
      include: {
        batch: true,
        events: { include: { batch: true, media: true } },
        taggedMedia: true
      }
    }),
    null
  );
}

export async function getEvents() {
  return withFallback(
    () => prisma.event.findMany({
      include: { batch: true, media: true },
      orderBy: { date: 'desc' }
    }),
    []
  );
}

export async function getEventBySlug(slug: string) {
  return withFallback(
    () => prisma.event.findUnique({
      where: { slug },
      include: {
        batch: true,
        media: true,
        participants: true,
        messages: true
      }
    }),
    null
  );
}

export async function getMemories() {
  return withFallback(
    () => prisma.media.findMany({
      where: { featured: true },
      include: { event: true },
      orderBy: { createdAt: 'desc' }
    }),
    []
  );
}

export async function getFeaturedSenior() {
  const seniors = await getSeniors();
  const featured = seniors.filter(s => s.featured);
  return featured.length > 0 ? featured[0] : (seniors.length > 0 ? seniors[0] : null);
}

export async function getFeaturedEvents() {
  const events = await getEvents();
  return events.filter(e => e.featured).slice(0, 3);
}


export async function getTimelineItems() {
  const events = await getEvents();
  return events.map(event => ({
    id: event.id,
    date: event.date?.toISOString() || '',
    title: event.title,
    description: event.chapterQuote || '',
    category: 'event' as const,
    slug: event.slug
  }));
}

export async function getMemoriesBySenior(personId: string) {
  return withFallback(
    () => prisma.media.findMany({
      where: {
        taggedPeople: {
          some: { id: personId }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    []
  );
}
