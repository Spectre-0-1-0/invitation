# Unified Architecture: Memory Archive & Digital Scrapbook

This document defines the integration of the **Production-Grade Memory Archive** with the **Immersive Digital Scrapbook**. It serves as the master blueprint for a long-term platform that handles mass media ingestion, event-based organization, and nostalgic storytelling.

---

## PART 1: ARCHITECTURE REVIEW & GAP ANALYSIS

### What Remains Valid
*   **Visual Language:** The "Elegant Nostalgia" palette and tactile assets (Paper, Tape, Doodles).
*   **Interaction Model:** The "Discovery-based" navigation and human-hand motion.
*   **Archetypes:** The page layouts (Friendship Wall, Memory Cluster) remain the presentation layer.

### What Needs Expansion
*   **Data Model:** Transition from isolated JSON files to a relational schema centered on **Events**.
*   **Scale:** Support for thousands of photos/videos rather than curated samples.
*   **Storage:** Moving from local `/public` assets to S3/R2 cloud storage.

### New Required Systems
*   **Ingestion Engine:** To handle bulk ZIP/Folder uploads.
*   **Metadata Layer:** PostgreSQL database for lightning-fast search and relationships.
*   **Translation Layer:** A system that maps "Archive Data" into "Scrapbook Artifacts."

---

## PART 2: REVISED PRODUCT MODEL (THE 5-LAYER STACK)

1.  **Layer 1: Archive Platform (Foundation):** Handles storage (S3/R2), database (PostgreSQL), and media processing (CDN/Optimizations).
2.  **Layer 2: Event System (The Backbone):** Organizes everything chronologically and by theme (Orientation, Fest, Graduation).
3.  **Layer 3: People System (The Soul):** Maps events and media to individual Senior Profiles.
4.  **Layer 4: Memory System (The Content):** The individual photos, videos, and fragments of text.
5.  **Layer 5: Scrapbook Experience (The Interface):** The immersive, tactile presentation layer where data becomes a story.

---

## PART 3: EVENT-FIRST CONTENT ARCHITECTURE

The **Event** is the primary organizational entity. Every piece of media must belong to an Event.

### Data Relationships
*   **Event**
    *   `id, title, date, description, category, tags`
    *   **Has Many:** `Media` (Photos, Videos)
    *   **Has Many:** `People` (Participants/Seniors)
    *   **Has Many:** `Messages` (Farewells, Comments)
    *   **Has Many:** `Fragments` (Inside jokes, stories)

### Event Categories
*   **Academic:** Orientation, Labs, Lectures, Viva.
*   **Social:** Parties, Canteen hangouts, Hostel life.
*   **Monumental:** Cultural Fests, Sports Meets, Graduation.
*   **Transitions:** Move-in Day, Placement Drive, Last Day.

---

## PART 4: THE PEOPLE SYSTEM

People are a primary discovery vector. Users find memories by looking for themselves and their friends.

*   **Senior Profile:**
    *   Links to every **Event** they participated in.
    *   Displays **Media** they are tagged in.
    *   Hosts **Messages** specifically written for them.
    *   Connects to their personal **Scrapbook Page**.

---

## PART 5: MEDIA ARCHIVE & STORAGE SYSTEM

### Storage Architecture (S3/R2)
*   **Structure:** `bucket/memories/{year}/{event_id}/{media_id}.ext`
*   **Optimization:** Automatic generation of WebP thumbnails and HLS video streaming.

### Metadata Model (PostgreSQL)
*   **Table: `media`**
    *   `id, url, thumbnail_url, type (image/video), event_id, uploader_id, created_at`
*   **Table: `media_tags`**
    *   `id, media_id, senior_id (FK)`
*   **Table: `search_index` (Postgres FTS)**
    *   Enables searching by person, event, date, or tag.

---

## PART 6: UPLOAD & INGESTION SYSTEM

Designed for non-technical collectors to upload hundreds of files easily.

1.  **Selection:** User selects an Event (or creates a new one).
2.  **Upload:** Drag & Drop Folder, ZIP, or Batch selection.
3.  **Processing:**
    *   Files are pushed to S3.
    *   Metadata is written to Postgres.
    *   AI-assisted tagging (optional/future) suggests People in photos.
4.  **Verification:** Admin or Lead Collector approves the batch for the archive.

---

## PART 7: SCRAPBOOK INTEGRATION (THE TRANSLATION LAYER)

The "Archive" is a database; the "Scrapbook" is a book. We map them as follows:

| Archive Entity | Scrapbook Artifact | Transformation |
| :--- | :--- | :--- |
| **Event** | **Chapter** | A cluster of related pages in the scrapbook. |
| **Media (Photo)** | **Polaroid/Print** | Rendered with tactile stock and tape. |
| **Media (Video)** | **Augmented Card** | A "Memory Card" that plays on tap. |
| **Message** | **Handwritten Note** | Rendered with a specific contributor's persona. |
| **Senior Profile** | **Friendship Page** | A dedicated layout for that individual. |
| **Metadata (Date)** | **Margin Scribble** | Dates appear as handwritten notes in corners. |

---

## PART 8: REVISED IMPLEMENTATION ROADMAP

### Sprint 1: Archive Foundation
*   Database schema setup (Postgres).
*   S3/R2 storage integration.
*   Media model and tagging foundation.

### Sprint 2: Ingestion & Upload
*   Bulk upload UI (ZIP/Folder support).
*   Background processing for thumbnails and optimization.

### Sprint 3: Event & People Management
*   Admin dashboards for creating Events.
*   People directory and tagging interface.

### Sprint 4: Scrapbook Presentation (The Bridge)
*   The "Translation Layer": Fetching Event data into the Scrapbook Archetypes.
*   Integrating archive media into the Sprint 1 validation page.

### Sprint 5: Discovery & Search
*   Event-based timeline navigation.
*   People-based media discovery.

### Sprint 6: Polish & Performance
*   Motion language application across the archive views.
*   Tactile wear applied to dynamically loaded media.

---

## PART 9: ARCHITECTURAL PRINCIPLES

1.  **Unified Source of Truth:** Data lives in Postgres/S3; the Scrapbook is a view of that data.
2.  **Mobile-First Performance:** Dynamic loading of media to ensure the "Scrapbook" stays fast on phones.
3.  **Seamless Transition:** Moving from the "Archive View" (Grid/Search) to the "Scrapbook View" (Tactile/Manual) must feel like a natural progression from "looking" to "remembering."

---

**Authenticity Rule:**
The database stores the facts. The scrapbook stores the feelings. The architecture must never confuse the two.
