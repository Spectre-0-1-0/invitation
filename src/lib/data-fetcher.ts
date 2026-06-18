import { prisma } from './prisma';
import {
  Senior,
  Memory,
  TimelineEvent,
  Message,
  Meme,
  GalleryAlbum,
  Achievement
} from '@/types/archive';

import seniorsData from '@/data/seniors.json';
import memoriesData from '@/data/memories.json';
import timelineData from '@/data/timeline.json';
import messagesData from '@/data/messages.json';
import memesData from '@/data/memes.json';
import albumsData from '@/data/albums.json';
import achievementsData from '@/data/achievements.json';

async function withFallback<T>(dbQuery: () => Promise<T>, fallback: T): Promise<T> {
  if (!process.env.DATABASE_URL) {
    return fallback;
  }
  try {
    return await dbQuery();
  } catch (error) {
    console.error('Database query failed, using fallback:', error);
    return fallback;
  }
}

export async function getSeniors(): Promise<Senior[]> {
  return withFallback(async () => {
    const people = await prisma.person.findMany({
      include: { batch: true }
    });
    return people.map(p => ({
      id: p.slug,
      name: p.name,
      nickname: p.nickname || undefined,
      major: p.major || '',
      graduationYear: p.graduationYear || 2025,
      quote: p.yearbookQuote || '',
      image: p.image || '',
      achievements: [] as string[],
      memoryHighlights: [] as string[],
      socialLinks: {}
    })) as Senior[];
  }, seniorsData as Senior[]);
}

export async function getSeniorBySlug(slug: string): Promise<Senior | undefined> {
  return withFallback(async () => {
    const p = await prisma.person.findUnique({
      where: { slug },
      include: { batch: true }
    });
    if (!p) return undefined;
    return {
      id: p.slug,
      name: p.name,
      nickname: p.nickname || undefined,
      major: p.major || '',
      graduationYear: p.graduationYear || 2025,
      quote: p.yearbookQuote || '',
      image: p.image || '',
      achievements: [] as string[],
      memoryHighlights: [] as string[],
      socialLinks: {}
    } as Senior;
  }, (seniorsData as Senior[]).find(s => s.id === slug));
}

export async function getMemories(): Promise<Memory[]> {
  return withFallback(async () => {
    const media = await prisma.media.findMany({
      include: { taggedPeople: true }
    });
    return media.map(m => ({
      id: m.id,
      type: m.type.toLowerCase() as any,
      category: m.category as any,
      title: m.title || '',
      description: m.description || '',
      url: m.url,
      thumbnail: m.thumbnailUrl || undefined,
      date: m.createdAt.toISOString(),
      tags: [] as string[],
      featured: m.featured,
      peopleInvolved: m.taggedPeople.map(p => p.slug)
    })) as Memory[];
  }, memoriesData as Memory[]);
}

export async function getMemoriesBySenior(seniorSlug: string): Promise<Memory[]> {
  return withFallback(async () => {
    const media = await prisma.media.findMany({
      where: {
        taggedPeople: {
          some: { slug: seniorSlug }
        }
      },
      include: { taggedPeople: true }
    });
    return media.map(m => ({
      id: m.id,
      type: m.type.toLowerCase() as any,
      category: m.category as any,
      title: m.title || '',
      description: m.description || '',
      url: m.url,
      thumbnail: m.thumbnailUrl || undefined,
      date: m.createdAt.toISOString(),
      tags: [] as string[],
      featured: m.featured,
      peopleInvolved: m.taggedPeople.map(p => p.slug)
    })) as Memory[];
  }, (memoriesData as Memory[]).filter(m => m.peopleInvolved?.includes(seniorSlug)));
}

export async function getTimeline(): Promise<TimelineEvent[]> {
  return withFallback(async () => {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' }
    });
    return events.map(e => ({
      id: e.slug,
      period: e.date ? e.date.toLocaleDateString() : 'Various',
      milestone: e.title,
      description: e.description || '',
      importance: 'major' as const,
      photoUrl: undefined,
      relatedMemoryIds: [] as string[]
    })) as TimelineEvent[];
  }, timelineData as TimelineEvent[]);
}

export async function getMessages(): Promise<Message[]> {
  return withFallback(async () => {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return messages.map(m => ({
      id: m.id,
      from: m.from,
      content: m.content,
      category: m.category as any,
      timestamp: m.timestamp.toISOString()
    })) as Message[];
  }, messagesData as Message[]);
}

export async function getMemes(): Promise<Meme[]> {
  return withFallback(async () => {
    const memes = await prisma.media.findMany({
      where: { type: 'MEME' }
    });
    return memes.map(m => ({
      id: m.id,
      url: m.url,
      caption: m.description || undefined,
      originContext: ''
    })) as Meme[];
  }, memesData as Meme[]);
}

export async function getAlbums(): Promise<GalleryAlbum[]> {
  return withFallback(async () => {
    const events = await prisma.event.findMany({
      include: { media: { select: { id: true } } }
    });
    return events.map(e => ({
      id: e.slug,
      title: e.title,
      description: e.description || undefined,
      coverImage: '',
      memoryIds: e.media.map(m => m.id)
    })) as GalleryAlbum[];
  }, albumsData as GalleryAlbum[]);
}

export async function getAchievements(): Promise<Achievement[]> {
  return withFallback(async () => {
    return [] as Achievement[];
  }, achievementsData as Achievement[]);
}

/**
 * PRODUCTION MEDIA INTEGRATION
 * Uploaded media automatically appears in public pages via the database queries above.
 * No manual synchronization is required as the data-fetcher prioritizes DB results.
 */
