import { Senior, Memory, TimelineEvent, Message, Meme, GalleryAlbum, Achievement } from '@/types/archive';
import seniorsData from '@/data/seniors.json';
import memoriesData from '@/data/memories.json';
import timelineData from '@/data/timeline.json';
import messagesData from '@/data/messages.json';
import memesData from '@/data/memes.json';
import albumsData from '@/data/albums.json';
import achievementsData from '@/data/achievements.json';
import { PersonService } from '@/services/PersonService';
import { MediaService } from '@/services/MediaService';
import { EventService } from '@/services/EventService';
import { MessageService } from '@/services/MessageService';

const hasDb = () => typeof process.env.DATABASE_URL === 'string' && process.env.DATABASE_URL.length > 0;

export async function getSeniors(): Promise<Senior[]> {
  if (!hasDb()) return seniorsData as Senior[];
  try {
    const people = await PersonService.getAllPeople();
    return people.map(p => ({
      id: p.slug,
      name: p.name,
      nickname: p.nickname || undefined,
      major: p.major,
      branch: p.branch || undefined,
      graduationYear: p.graduationYear,
      quote: p.quote || '',
      image: p.image || '',
      achievements: [],
      socialLinks: (p.socialLinks as any) || {}
    }));
  } catch (e) {
    console.error("DB Fetch Error (Seniors):", e);
    return seniorsData as Senior[];
  }
}

export async function getSeniorBySlug(slug: string): Promise<Senior | undefined> {
  if (!hasDb()) {
     const seniors = await getSeniors();
     return seniors.find((s) => s.id === slug);
  }
  try {
    const p = await PersonService.getPersonBySlug(slug);
    if (!p) return undefined;
    return {
      id: p.slug,
      name: p.name,
      nickname: p.nickname || undefined,
      major: p.major,
      branch: p.branch || undefined,
      graduationYear: p.graduationYear,
      quote: p.quote || '',
      image: p.image || '',
      achievements: p.achievements.map(a => a.title),
      socialLinks: (p.socialLinks as any) || {}
    };
  } catch (e) {
    console.error("DB Fetch Error (SeniorBySlug):", e);
    const seniors = await getSeniors();
    return seniors.find((s) => s.id === slug);
  }
}

export async function getMemories(): Promise<Memory[]> {
  if (!hasDb()) return memoriesData as Memory[];
  try {
    const media = await MediaService.getAllMedia();
    return media.map(m => ({
      id: m.id,
      type: m.type as any,
      category: (m.category as any) || 'candid',
      title: m.title || '',
      description: m.description || '',
      location: m.location || undefined,
      peopleInvolved: m.people.map(p => p.slug),
      url: m.url,
      thumbnail: m.thumbnailUrl || undefined,
      date: m.date?.toISOString() || new Date().toISOString(),
      tags: m.tags,
      featured: m.featured
    }));
  } catch (e) {
    console.error("DB Fetch Error (Memories):", e);
    return memoriesData as Memory[];
  }
}

export async function getMemoriesBySenior(seniorId: string): Promise<Memory[]> {
  if (!hasDb()) {
     const memories = await getMemories();
     return memories.filter((m) => m.peopleInvolved?.includes(seniorId));
  }
  try {
    const p = await PersonService.getPersonBySlug(seniorId);
    if (!p) return [];
    return p.memories.map(m => ({
      id: m.id,
      type: m.type as any,
      category: (m.category as any) || 'candid',
      title: m.title || '',
      description: m.description || '',
      location: m.location || undefined,
      peopleInvolved: [],
      url: m.url,
      thumbnail: m.thumbnailUrl || undefined,
      date: m.date?.toISOString() || new Date().toISOString(),
      tags: m.tags,
      featured: m.featured
    }));
  } catch (e) {
    console.error("DB Fetch Error (MemoriesBySenior):", e);
    const memories = await getMemories();
    return memories.filter((m) => m.peopleInvolved?.includes(seniorId));
  }
}

export async function getTimeline(): Promise<TimelineEvent[]> {
  if (!hasDb()) return timelineData as TimelineEvent[];
  try {
    const events = await EventService.getAllEvents();
    return events.map(e => ({
      id: e.slug,
      period: e.date.getFullYear().toString(),
      milestone: e.title,
      description: e.description || '',
      importance: e.importance as any,
      relatedMemoryIds: e.media.map(m => m.id)
    }));
  } catch (e) {
    console.error("DB Fetch Error (Timeline):", e);
    return timelineData as TimelineEvent[];
  }
}

export async function getMessages(): Promise<Message[]> {
  if (!hasDb()) return messagesData as Message[];
  try {
    const msgs = await MessageService.getAllMessages();
    return msgs.map(m => ({
      id: m.id,
      from: m.fromName,
      targetId: m.toPerson?.slug,
      content: m.content,
      category: m.category as any,
      relationship: m.relationship || undefined,
      timestamp: m.createdAt.toISOString()
    }));
  } catch (e) {
    console.error("DB Fetch Error (Messages):", e);
    return messagesData as Message[];
  }
}

export async function getMemes(): Promise<Meme[]> {
  if (!hasDb()) return memesData as Meme[];
  try {
    const memes = await MediaService.getAllMedia('meme');
    return memes.map(m => ({
      id: m.id,
      url: m.url,
      caption: m.title || undefined,
      originContext: m.description || ''
    }));
  } catch (e) {
    console.error("DB Fetch Error (Memes):", e);
    return memesData as Meme[];
  }
}

export async function getAlbums(): Promise<GalleryAlbum[]> {
  return albumsData as GalleryAlbum[];
}

export async function getAchievements(): Promise<Achievement[]> {
  if (!hasDb()) return achievementsData as Achievement[];
  try {
    const people = await PersonService.getAllPeople();
    const achs = people.flatMap(p => p.achievements.map(a => ({...a, person: p})));
    return achs.map(a => ({
      id: a.id,
      title: a.title,
      recipientId: (a as any).person.slug,
      date: a.date?.toISOString() || new Date().toISOString(),
      category: a.category as any,
      description: a.description || undefined
    }));
  } catch (e) {
    console.error("DB Fetch Error (Achievements):", e);
    return achievementsData as Achievement[];
  }
}
