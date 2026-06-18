# Sprint 2: Event System Backbone

## 1. Expanded Event Schema
The `Event` model now supports full chronological and thematic metadata:
*   **Timeframes:** `startDate`, `endDate`, and `academicYear` for precise timeline mapping.
*   **Organization:** `location` and `organizers` fields.
*   **Scrapbook Bridge:** Added `chapterCover`, `chapterQuote`, and `chapterMood` to drive future immersive rendering.
*   **Extended Relationships:** Integrated `Achievements` and `Documents` directly into the event context.

## 2. EventService Capabilities
*   **CRUD Operations:** Robust management of events.
*   **Intelligent Fetching:** `getEvent` returns a deep tree of related media, people, and memories.
*   **Analytics:** `getEventStats` provides a quick snapshot of event density (media/participant counts).
*   **Discovery:** `getRelatedEvents` suggests content based on shared categories or years.

## 3. Query Architecture
*   **Filtering:** Multi-vector discovery supported via `listEvents` (Year, Category, Batch, Tag).
*   **Optimization:** Used Prisma `_count` for lightweight list views to ensure performance with high event volumes.

## 4. API Contract: The Event Page
A standardized data structure for the Event Page is now defined:
```json
{
  "id": "event-uuid",
  "title": "Orientation 2021",
  "metadata": { "date": "...", "year": "2021-22", "category": "academic" },
  "scrapbook": { "mood": "nostalgic", "quote": "..." },
  "stats": { "photos": 45, "participants": 120 },
  "content": {
    "media": [...],
    "memories": [...],
    "participants": [...],
    "documents": [...]
  }
}
```

## 5. Seed Data
Generated realistic engineering college milestones (Orientation, Freshers, etc.) to validate the relational depth and query performance.

## 6. Remaining Work
*   Integration with the ZIP/Folder ingestion service (Sprint 5).
*   Implementation of the frontend "Archive Gallery" (Sprint 4).
*   Mapping more complex "Event Story" fragments.

**The platform now has its primary organizational backbone.**
