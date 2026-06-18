# Sprint 1 Foundation: Memory Archive Infrastructure

## 1. Database Schema (PostgreSQL)
We have implemented a relational schema designed for high-volume media discovery.
*   **Central Entities:** `Event`, `Person`, `MediaFile`.
*   **Relational Logic:** Media is tied to Events and tagged with People, allowing for multi-vector discovery (Find by Year, Find by Friend, Find by Event).
*   **Scalability:** Added indexes on `date`, `category`, `name`, and `major` to ensure fast retrieval of 10,000+ artifacts.

## 2. Prisma Implementation
Created `prisma/schema.prisma` with:
*   **Enforced Relationships:** Strict FKs between media, events, and people.
*   **Scrapbook Metadata:** Fields like `importance`, `chapterId`, and `handwriting` are baked into the core models to ensure future compatibility.

## 3. Storage Architecture
Implemented a provider-agnostic `StorageService`.
*   **Folder Structure:** `memories/{category}/{event_id}/{timestamp}-{filename}`.
*   **Vendor Neutrality:** Abstracted interface allows switching between AWS S3 and Cloudflare R2 by simply swapping the provider.

## 4. Upload Pipeline
Designed an ingestion flow that handles batch uploads.
*   **Batch Tracking:** Every upload is tracked as a `Batch`, allowing for rollback or audit.
*   **Auto-Association:** Files uploaded within an event context are automatically linked, reducing manual metadata entry.

## 5. Search Foundation
Architecture prepared for:
*   **Event Search:** By category and date.
*   **Person Search:** By name, nickname, and major.
*   **Media Search:** By type and association.

## 6. Remaining Work
*   Implementation of the actual S3/R2 client logic (requires credentials).
*   Search implementation (Postgres Full Text Search or Meilisearch/Elastic).
*   Frontend ingestion UI (Sprint 5).

**The foundation is now capable of supporting a full college memory archive.**
