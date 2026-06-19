# Deployment & Operations Guide - College Memory Archive

This guide outlines the steps to deploy and maintain the archive for production use.

## 1. Infrastructure Requirements
- **Framework:** Next.js 15 (Vercel is the recommended host).
- **Database:** PostgreSQL (Supabase or Neon recommended).
- **Storage:** Supabase Storage (Required for media assets).
- **Processing:** Inngest (Required for background jobs like thumbnail generation).

## 2. Environment Setup
Create a `.env.production` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase (Storage)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Admin Security
ADMIN_SECRET="your-secure-passcode"

# Inngest (Background Jobs)
INNGEST_EVENT_KEY="your-inngest-key"
INNGEST_SIGNING_KEY="your-signing-key"
```

## 3. Deployment Steps
1. **Initialize Database:**
   ```bash
   npx prisma db push
   ```
2. **Setup Storage Buckets:**
   Create the following buckets in Supabase Storage and set them to "Public":
   - `photos`
   - `videos`
   - `documents`
   - `posters`
   - `memes`
   - `general`
3. **Build & Deploy:**
   ```bash
   npm run build
   ```
   Connect your repository to Vercel and it will handle the deployment automatically.

## 4. Backup Strategy
- **Database:** Enable automated daily backups in your Supabase dashboard.
- **Media:** Periodically mirror the Supabase Storage buckets to a secondary S3 bucket or local drive using the Supabase CLI.
- **Code:** The repository itself serves as the versioned backup of the system logic.

## 5. Recovery Procedures
- **Database Failure:** Use Supabase "Point-in-Time Recovery" (PITR) to restore to a previous healthy state.
- **Media Loss:** Re-upload assets from the secondary mirror if a bucket is accidentally deleted.
- **System Lockout:** Reset the `ADMIN_SECRET` environment variable to regain access to the management console.

## 6. Future Batches
To prepare for a new graduating batch:
1. Log in to the Admin Dashboard.
2. Create a new **Batch** (e.g., "Class of 2026").
3. Update the `metadataBase` in `src/app/layout.tsx` if the domain changes.
