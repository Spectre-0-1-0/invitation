# Production Launch Checklist - College Memory Archive

## 1. Environment Variables (Vercel)
- [ ] `DATABASE_URL`: Supabase PostgreSQL connection string (Transaction mode).
- [ ] `DIRECT_URL`: Supabase PostgreSQL direct connection string (Session mode for migrations).
- [ ] `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key for public storage access.
- [ ] `SUPABASE_SERVICE_ROLE_KEY`: **SECRET** - Used for server-side storage management.
- [ ] `ADMIN_SECRET`: **SECRET** - Passcode for management console access.
- [ ] `STORAGE_PROVIDER`: Set to `supabase` for production.
- [ ] `NEXT_PUBLIC_APP_URL`: Final production URL (e.g., `https://archive2025.com`).

## 2. Infrastructure Setup (Supabase)
- [ ] Create Storage Buckets: `photos`, `videos`, `documents`, `posters`, `memes`.
- [ ] Set Bucket Privacy: All buckets should be **Public** (read-only) for archive access.
- [ ] Run Migrations: `npx prisma db push` or `prisma migrate deploy`.

## 3. Security & Domain
- [ ] HTTPS: Ensure Vercel SSL is active.
- [ ] DNS: Point custom domain to Vercel CNAME.
- [ ] Robots.ts: Verified `/admin/` is blocked from indexing.
- [ ] Sitemap.ts: Verified public routes are included for discovery.

## 4. Final Verification
- [ ] Run `npm run build` to ensure no static generation errors.
- [ ] Execute smoke tests: `npx playwright test`.
- [ ] Verify Admin login with production `ADMIN_SECRET`.
- [ ] Test a single media upload to ensure storage permissions are correct.

## 5. Monitoring & Rollback
- [ ] Vercel Logs: Ensure log stream is active.
- [ ] Database Backup: Enable daily backups in Supabase dashboard.
- [ ] Rollback Plan: Vercel "Instant Rollback" verified.
