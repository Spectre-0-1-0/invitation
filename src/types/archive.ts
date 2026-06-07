import {
  Batch as PrismaBatch,
  Event as PrismaEvent,
  Person as PrismaPerson,
  Media as PrismaMedia,
  Achievement as PrismaAchievement,
  Message as PrismaMessage,
  Meme as PrismaMeme
} from '@prisma/client'

export type Batch = PrismaBatch & {
  events?: Event[]
  people?: Person[]
}

export type Event = PrismaEvent & {
  batch?: Batch
  media?: Media[]
  messages?: Message[]
  participants?: Person[]
}

export type Person = PrismaPerson & {
  batch?: Batch
  achievements?: Achievement[]
  taggedInMedia?: Media[]
  eventsParticipated?: Event[]
}

export type Media = PrismaMedia & {
  event?: Event
  participants?: Person[]
}

export type Achievement = PrismaAchievement & {
  person?: Person
}

export type Message = PrismaMessage & {
  fromPerson?: Person
  targetPerson?: Person
  event?: Event
}

export type Meme = PrismaMeme

// Compatibility types for existing components
export interface Senior extends Person {
  memoryHighlights?: string[]
}
export interface Memory extends Media {}
export interface TimelineEvent extends Event {
  period: string
  milestone: string
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  coverImage: string;
  memoryIds: string[];
}
