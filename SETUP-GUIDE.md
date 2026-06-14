# Sprint 4: Upload & Media Pipeline Setup Guide

This guide provides instructions for setting up the new Supabase, Prisma, and Inngest infrastructure implemented in Sprint 4.

## 1. Supabase Setup

### Project Creation
1. Create a new project at [database.new](https://database.new).
2. Note your **Project Ref**, **Database Password**, and **API Keys** (Anon Key).

### Storage Buckets
Create the following public buckets in the Supabase Dashboard:
- `photos`
- `videos`
- `documents`
- `posters`
- `memes`
- `general` (for ZIP storage)

Ensure "Public" access is enabled for read operations on these buckets.

## 2. Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```

## 3. Database Migration
Run the following commands to initialize your database schema:
```bash
# Apply migrations to the database
npx prisma migrate dev --name init_sprint_4

# Generate Prisma client
npx prisma generate
```

## 4. Data Migration & Seeding
To migrate existing JSON data to the new database:
```bash
# Run migration script (requires ts-node)
npx ts-node src/scripts/migrate-json-to-pg.ts

# Seed realistic scenarios
npx ts-node src/scripts/seed-realistic-data.ts
```

## 5. Inngest (Background Jobs)
For local development, use the Inngest Dev Server to trigger and monitor background jobs (thumbnails, ZIP processing):
```bash
# Start Inngest Dev Server
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

## 6. Accessing the Dashboard
The new upload and tracking tools are available at:
- **Upload Dashboard**: `/admin/upload`
- **Ingestion Tracking**: `/admin/tracking`

## 7. Storage Structure
- Files are organized by Event ID: `events/{eventId}/{timestamp}-{filename}`
- Thumbnails are stored in: `thumbnails/{mediaId}.jpg`
- Path metadata is preserved in the database for folder/ZIP uploads.
