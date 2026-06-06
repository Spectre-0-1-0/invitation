export interface Senior {
  id: string;
  name: string;
  major: string;
  quote: string;
  image: string;
  achievements: string[];
  favoriteMemoryId?: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
  };
}

export interface Memory {
  id: string;
  type: 'photo' | 'video' | 'text';
  category: 'candid' | 'event' | 'milestone';
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  date: string;
  taggedSeniors: string[];
  tags: string[];
  featured: boolean;
}

export interface TimelineEvent {
  id: string;
  period: string;
  title: string;
  description: string;
  importance: 'major' | 'minor';
  memoryId?: string;
}

export interface Message {
  id: string;
  from: string;
  content: string;
  targetId?: string;
  relationship?: string;
  timestamp: string;
}

export interface Meme {
  id: string;
  url: string;
  caption?: string;
  originContext: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  coverImage: string;
  memoryIds: string[];
}

export interface Achievement {
  id: string;
  title: string;
  recipientId: string;
  date: string;
  category: string;
}
