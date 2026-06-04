# 10 Component Inventory

This inventory lists every custom component required for the College Memory Archive. Components are categorized by their role in the atomic design structure or their specific page context.

## Navigation & Layout
### Navbar
- **Purpose:** Provide persistent navigation across all pages.
- **Parent Page:** Root Layout (App-wide)
- **Props:** `currentPath: string`
- **Data Dependencies:** None
- **Reusability Score:** 10/10
- **Priority:** High

### Footer
- **Purpose:** Display copyright, credits, and emotional sign-off.
- **Parent Page:** Root Layout (App-wide)
- **Props:** None
- **Data Dependencies:** None
- **Reusability Score:** 10/10
- **Priority:** Medium

## Hero & Landing
### HeroSection
- **Purpose:** Initial high-impact emotional entry point with "Enter" CTA.
- **Parent Page:** Home (/)
- **Props:** `title: string`, `subtitle: string`, `backgroundVideoUrl?: string`
- **Data Dependencies:** None (Static)
- **Reusability Score:** 2/10
- **Priority:** High

### StorySection
- **Purpose:** Provide a narrative introduction to the archive.
- **Parent Page:** Home (/)
- **Props:** `content: MDXRemoteSerializeResult`
- **Data Dependencies:** MDX content
- **Reusability Score:** 5/10
- **Priority:** Medium

## Memories & Gallery
### MemoryGallery
- **Purpose:** Display a masonry grid of photos and videos with filtering.
- **Parent Page:** Gallery (/gallery)
- **Props:** `initialMemories: Memory[]`
- **Data Dependencies:** `memories.json`
- **Reusability Score:** 7/10
- **Priority:** High

### MemoryCard
- **Purpose:** Individual grid item representing a memory.
- **Parent Page:** MemoryGallery, SeniorProfile
- **Props:** `memory: Memory`, `variant: 'compact' | 'full'`
- **Data Dependencies:** `Memory` interface
- **Reusability Score:** 9/10
- **Priority:** High

### MemoryLightbox
- **Purpose:** Full-screen modal for detailed viewing of a memory.
- **Parent Page:** Gallery, SeniorProfile
- **Props:** `memoryId: string`, `isOpen: boolean`, `onClose: () => void`
- **Data Dependencies:** `Memory` detail
- **Reusability Score:** 8/10
- **Priority:** High

## People & Profiles
### SeniorGrid
- **Purpose:** Searchable and filterable directory of seniors.
- **Parent Page:** People (/people)
- **Props:** `seniors: Senior[]`
- **Data Dependencies:** `seniors.json`
- **Reusability Score:** 6/10
- **Priority:** High

### ProfileCard
- **Purpose:** Individual card in the directory showing headshot and name.
- **Parent Page:** SeniorGrid
- **Props:** `senior: Senior`
- **Data Dependencies:** `Senior` interface
- **Reusability Score:** 8/10
- **Priority:** High

### SeniorProfileHeader
- **Purpose:** Large, elegant header for the individual profile page.
- **Parent Page:** Profile (/people/[slug])
- **Props:** `senior: Senior`
- **Data Dependencies:** `Senior` interface
- **Reusability Score:** 4/10
- **Priority:** High

### AchievementShowcase
- **Purpose:** Display a list of honors and awards in a stylized format.
- **Parent Page:** Profile (/people/[slug])
- **Props:** `achievements: string[]`
- **Data Dependencies:** None (Props-driven)
- **Reusability Score:** 7/10
- **Priority:** Medium

## Interactive & Narrative
### Timeline
- **Purpose:** Chronological scrollable experience of university events.
- **Parent Page:** Timeline (/timeline)
- **Props:** `events: TimelineEvent[]`
- **Data Dependencies:** `timeline.json`
- **Reusability Score:** 5/10
- **Priority:** High

### MessageWall
- **Purpose:** Bento-style grid of farewell messages.
- **Parent Page:** Messages (/messages)
- **Props:** `messages: Message[]`
- **Data Dependencies:** `messages.json`
- **Reusability Score:** 6/10
- **Priority:** High

### MessagePostIt
- **Purpose:** Stylized text card for an individual message.
- **Parent Page:** MessageWall
- **Props:** `message: Message`
- **Data Dependencies:** `Message` interface
- **Reusability Score:** 9/10
- **Priority:** Medium

### MemeGrid
- **Purpose:** Fun, less formal grid for shared inside jokes.
- **Parent Page:** Memes (/memes)
- **Props:** `memes: Meme[]`
- **Data Dependencies:** `memes.json`
- **Reusability Score:** 5/10
- **Priority:** Low

### TributeVideoPlayer
- **Purpose:** Featured video player with customized controls for the Tribute page.
- **Parent Page:** Tribute (/tribute)
- **Props:** `url: string`, `autoplay: boolean`
- **Data Dependencies:** Video asset
- **Reusability Score:** 4/10
- **Priority:** Medium
