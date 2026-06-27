# Deployment Guide

## 1. Prerequisites
- **Supabase Project**: Ensure you have a Supabase project created.
- **Vercel Account**: For hosting the Next.js application.
- **GitHub Repository**: Connected to your Vercel account.

## 2. Environment Variables
Configure these in Vercel (and Supabase where applicable):

| Variable | Source | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | Supabase (Transaction) | Prisma connection |
| `DIRECT_URL` | Supabase (Session) | Prisma migration connection |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings | Client/Server storage access |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings | Client-side public access |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings | Server-side storage management |
| `STORAGE_PROVIDER` | Manual (`supabase`) | Activates Supabase storage |
| `ADMIN_SECRET` | Manual | Passcode for Admin access |

## 3. Supabase Storage Setup
1. Go to **Storage** in the Supabase Dashboard.
2. Create the following buckets:
   - `people`
   - `events`
   - `gallery`
   - `memories`
   - `documents`
   - `general`
3. Set all buckets to **Public**.
4. (Optional) Configure bucket CORS if you encounter issues with `next/image`.

## 4. Deployment Steps
1. **Push Code**: Push your changes to the main branch.
2. **Database Migration**:
   ```bash
   npx prisma migrate deploy
   ```
3. **Build**: Vercel will automatically start the build. If manual, run:
   ```bash
   npm run build
   ```

## 5. Rollback Strategy
- **Code**: Revert the last commit in GitHub; Vercel will redeploy the previous version.
- **Storage**: If Supabase fails, set `STORAGE_PROVIDER=local`. *Note: Any files uploaded to Supabase during the failure period will not be available locally without manual migration.*
- **Database**: Use `prisma migrate diff` to generate a rollback script if schema changes were made (none in this sprint).
