export interface Senior {
  id: string;
  name: string;
  nickname?: string;
  major: string;
  branch?: string;
  graduationYear: number;
  quote: string;
  image: string;
  achievements: string[];
  memoryHighlights?: string[];
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface Memory {
  id: string;
  type: 'photo' | 'video' | 'text';
  category: 'candid' | 'event' | 'milestone' | 'farewell' | 'trip' | 'classroom';
  title: string;
  description: string;
  location?: string;
  peopleInvolved?: string[]; // IDs of seniors
  url: string;
  thumbnail?: string;
  date: string;
  tags: string[];
  featured: boolean;
}

export interface TimelineEvent {
  id: string;
  period: string;
  milestone: string;
  description: string;
  importance: 'major' | 'minor';
  photoUrl?: string;
  relatedMemoryIds?: string[];
}

export interface Message {
  id: string;
  from: string;
  targetId?: string; // ID of senior
  content: string;
  category: 'thank-you' | 'funny' | 'appreciation' | 'farewell';
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
  description?: string;
  coverImage: string;
  memoryIds: string[];
}

export interface Achievement {
  id: string;
  title: string;
  recipientId: string;
  date: string;
  category: 'academic' | 'placement' | 'research' | 'club' | 'sports';
  description?: string;
}
