# 13 Data Models

This document defines the production-grade TypeScript interfaces and the corresponding JSON structures for all archive data.

## 1. Senior Profile (`seniors.json`)
```typescript
export interface Senior {
  id: string;             // slug format: 'jane-doe'
  name: string;
  major: string;
  quote: string;
  image: string;          // path: '/content/profiles/jane-doe.jpg'
  achievements: string[];
  favoriteMemoryId?: string; // Link to a Memory object
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
  };
}
```

### Sample Record
```json
{
  "id": "alex-rivera",
  "name": "Alex Rivera",
  "major": "Architecture",
  "quote": "Building dreams, one brick at a time.",
  "image": "/content/profiles/alex-rivera.jpg",
  "achievements": ["Dean's List 2024", "National Design Award"],
  "favoriteMemoryId": "freshman-studio-night",
  "socialLinks": {
    "instagram": "arivera_arch"
  }
}
```

## 2. Memory (`memories.json`)
```typescript
export interface Memory {
  id: string;
  type: 'photo' | 'video' | 'text';
  category: 'candid' | 'event' | 'milestone';
  title: string;
  description: string;
  url: string;            // path: '/content/gallery/midnight-pizza.jpg'
  thumbnail?: string;     // required for videos
  date: string;           // ISO format: YYYY-MM-DD
  taggedSeniors: string[]; // List of Senior IDs
  tags: string[];
  featured: boolean;
}
```

### Sample Record
```json
{
  "id": "midnight-pizza-2023",
  "type": "photo",
  "category": "candid",
  "title": "The Final 3 AM Pizza",
  "description": "Celebrating the completion of the thesis projects at the local parlor.",
  "url": "/content/gallery/pizza-night.jpg",
  "date": "2023-11-15",
  "taggedSeniors": ["alex-rivera", "jane-doe"],
  "tags": ["senior-year", "thesis-completed"],
  "featured": true
}
```

## 3. Timeline Event (`timeline.json`)
```typescript
export interface TimelineEvent {
  id: string;
  period: string;         // e.g., "Fall 2021"
  title: string;
  description: string;
  importance: 'major' | 'minor';
  memoryId?: string;      // Link to primary memory asset
}
```

## 4. Message (`messages.json`)
```typescript
export interface Message {
  id: string;
  from: string;
  content: string;
  targetId?: string;      // Optional: Specific Senior ID
  relationship?: string;  // e.g., "Junior Year Roommate"
  timestamp: string;
}
```

## 5. Meme (`memes.json`)
```typescript
export interface Meme {
  id: string;
  url: string;
  caption?: string;
  originContext: string;  // Brief explanation of the joke
}
```

## 6. Gallery Album (`albums.json`)
```typescript
export interface GalleryAlbum {
  id: string;
  title: string;
  coverImage: string;
  memoryIds: string[];
}
```
