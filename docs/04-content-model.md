# 04 Content Model & Data Schemas

Since this project is static-first, all data will be stored as JSON files in `src/data/` and images/videos in `public/content/`.

## 1. Senior Profile (`seniors.json`)
```typescript
interface SeniorProfile {
  id: string;          // Unique identifier (slug)
  name: string;        // Full name
  major: string;       // Academic major
  quote: string;       // Graduation quote
  image: string;       // Path to headshot
  achievements: string[]; // List of honors/awards
  favoriteMemory: string; // Brief text
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
  };
}
```

## 2. Memory (`memories.json`)
```typescript
interface Memory {
  id: string;
  type: 'photo' | 'video' | 'text';
  category: 'candid' | 'event' | 'milestone';
  title: string;
  description: string;
  url: string;         // Path to asset
  thumbnail?: string;  // For videos
  date: string;        // YYYY-MM-DD
  tags: string[];      // ['freshman-year', 'finals-week']
  featured: boolean;   // Show on home page?
}
```

## 3. Timeline Event (`timeline.json`)
```typescript
interface TimelineEvent {
  id: string;
  date: string;        // Month Year (e.g., "September 2021")
  title: string;
  description: string;
  importance: 'major' | 'minor';
  relatedMemoryIds?: string[]; // Links to Gallery items
}
```

## 4. Message (`messages.json`)
```typescript
interface Message {
  id: string;
  from: string;        // Name of sender
  content: string;     // The message body
  target?: string;     // Optional: specific senior's name/id
  timestamp: string;
}
```

## 5. Meme (`memes.json`)
```typescript
interface Meme {
  id: string;
  url: string;
  caption?: string;
  origin?: string;      // Context for the inside joke
}
```

## Folder Structure for Assets
- `/public/content/profiles/`: Senior headshots.
- `/public/content/gallery/`: Photos and video thumbnails.
- `/public/content/videos/`: Video files.
- `/public/content/memes/`: Meme assets.
