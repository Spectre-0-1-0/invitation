import { prisma } from './prisma/client'
import {
  Senior,
  Memory,
  TimelineEvent,
  Message,
  Meme,
  GalleryAlbum,
  Achievement,
  Batch,
  Event
} from '@/types/archive'

export async function getBatches(): Promise<Batch[]> {
  return prisma.batch.findMany({
    include: { events: true }
  }) as unknown as Batch[]
}

export async function getSeniors(): Promise<Senior[]> {
  const people = await prisma.person.findMany({
    include: { achievements: true }
  })
  return people.map(p => ({
    ...p,
    memoryHighlights: []
  })) as unknown as Senior[]
}

export async function getSeniorBySlug(slug: string): Promise<Senior | undefined> {
  const senior = await prisma.person.findUnique({
    where: { slug },
    include: { achievements: true }
  })
  if (!senior) return undefined
  return {
    ...senior,
    memoryHighlights: []
  } as unknown as Senior
}

export async function getMemories(): Promise<Memory[]> {
  const media = await prisma.media.findMany({
    include: { participants: true, event: true },
    orderBy: { date: 'desc' }
  })
  return media as unknown as Memory[]
}

export async function getMemoriesBySenior(seniorId: string): Promise<Memory[]> {
  const media = await prisma.media.findMany({
    where: {
      participants: {
        some: { id: seniorId }
      }
    },
    include: { participants: true, event: true }
  })
  return media as unknown as Memory[]
}

export async function getTimeline(): Promise<TimelineEvent[]> {
  const events = await prisma.event.findMany({
    where: { featured: true },
    orderBy: { startDate: 'asc' }
  })
  return events.map(e => ({
    ...e,
    period: e.academicYear || '',
    milestone: e.title
  })) as unknown as TimelineEvent[]
}

export async function getMessages(): Promise<Message[]> {
  const messages = await prisma.message.findMany({
    orderBy: { timestamp: 'desc' }
  })
  return messages as unknown as Message[]
}

export async function getMemes(): Promise<Meme[]> {
  return prisma.meme.findMany() as unknown as Meme[]
}

export async function getAlbums(): Promise<GalleryAlbum[]> {
  const events = await prisma.event.findMany({
    include: { media: { select: { id: true } } }
  })
  return events.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description || '',
    coverImage: '',
    memoryIds: e.media.map(m => m.id)
  })) as unknown as GalleryAlbum[]
}

export async function getAchievements(): Promise<Achievement[]> {
  return prisma.achievement.findMany() as unknown as Achievement[]
}
