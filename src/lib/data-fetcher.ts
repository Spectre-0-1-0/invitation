import { Senior, Memory, TimelineEvent, Message, Meme, GalleryAlbum, Achievement } from '@/types/archive';
import seniorsData from '@/data/seniors.json';
import memoriesData from '@/data/memories.json';
import timelineData from '@/data/timeline.json';
import messagesData from '@/data/messages.json';
import memesData from '@/data/memes.json';
import albumsData from '@/data/albums.json';
import achievementsData from '@/data/achievements.json';

export async function getSeniors(): Promise<Senior[]> {
  return seniorsData as Senior[];
}

export async function getSeniorBySlug(slug: string): Promise<Senior | undefined> {
  const seniors = await getSeniors();
  return seniors.find((s) => s.id === slug);
}

export async function getMemories(): Promise<Memory[]> {
  return memoriesData as Memory[];
}

export async function getMemoriesBySenior(seniorId: string): Promise<Memory[]> {
  const memories = await getMemories();
  return memories.filter((m) => m.taggedSeniors.includes(seniorId));
}

export async function getTimeline(): Promise<TimelineEvent[]> {
  // Sort timeline by date descending
  return [...(timelineData as TimelineEvent[])].sort((a, b) =>
    new Date(b.period).getTime() - new Date(a.period).getTime()
  );
}

export async function getMessages(): Promise<Message[]> {
  return messagesData as Message[];
}

export async function getMemes(): Promise<Meme[]> {
  return memesData as Meme[];
}

export async function getAlbums(): Promise<GalleryAlbum[]> {
  return albumsData as GalleryAlbum[];
}

export async function getAchievements(): Promise<Achievement[]> {
  return achievementsData as Achievement[];
}
