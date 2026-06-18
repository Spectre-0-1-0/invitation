# Sprint 3: People System & Profile Architecture

## 1. Expanded Person Schema
The `Person` model is now a comprehensive identity hub:
*   **Narrative Fields:** `bio`, `favoriteMemory`, `quote`, and `signatureMoment`.
*   **Organization:** `branch`, `batch`, `status`, and `graduationYear`.
*   **Social Connectivity:** `socialLinks` (JSON) and `contactInfo`.
*   **Scrapbook Bridge:** `handwritingPersona`, `highlightPhotoUrl`, and `personalityNotes` to drive immersive character rendering.

## 2. Relationship System
Implemented a self-referencing `Relationship` model:
*   **Types:** Supports `friend`, `roommate`, `club-member`, `teammate`, and `class-rep`.
*   **Context:** Every relationship can capture "where it started" (e.g., "Hostel Block C").
*   **Discovery:** Enables navigating the archive by "seeing memories shared with roommates."

## 3. PersonService Capabilities
*   **Full Profile Fetching:** `getPersonWithFullProfile` returns a deep tree including Participation, Media, Memories, Messages, and Relationships.
*   **Advanced Search:** Multi-vector discovery via `searchPeople` (Name, Branch, Batch, Year).
*   **Smart Discovery:** `getRelatedPeople` suggests connections based on shared event participation.
*   **Analytics:** `getPersonStats` provides a snapshot of an individual's digital legacy (media counts, message counts).

## 4. API Contract: The Profile Page
Defined the data structure for the Profile Memory Hub:
```json
{
  "id": "person-uuid",
  "name": "Jane Doe",
  "profile": { "bio": "...", "major": "CS", "image": "..." },
  "scrapbook": { "handwriting": "chaotic", "highlight": "..." },
  "stats": { "events": 12, "photos": 85 },
  "connections": { "friends": [...], "roommates": [...] },
  "timeline": {
    "events": [...],
    "memories": [...],
    "achievements": [...]
  }
}
```

## 5. Seed Data
Generated 10-20 recurring identities across different engineering branches (B.Arch, B.Tech CS, B.Tech ME) and established their social web (roommates, friends) to validate the discovery model.

## 6. Remaining Work
*   Integration with the Search engine (Sprint 6).
*   Implementation of the "People Gallery" UI (Sprint 4).
*   Advanced "Personality" tagging for scrapbook rendering.

**The platform now enables deep exploration through the personal lens of the class.**
