# Production Readiness Checklist

## Storage & Assets
- [ ] `STORAGE_PROVIDER` set to `supabase` in production environment.
- [ ] Supabase buckets (`people`, `events`, `gallery`, `memories`, `documents`, `general`) created and set to **Public**.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is configured in Vercel (Secret).
- [ ] `next.config.ts` includes the production Supabase hostname in `remotePatterns`.
- [ ] Local `public/uploads` is empty or ignored in production.

## Database
- [ ] `DATABASE_URL` and `DIRECT_URL` correctly pointing to Supabase Postgres.
- [ ] All migrations applied (`prisma migrate deploy`).

## Security
- [ ] `ADMIN_SECRET` is a strong, unique value.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NOT exposed in `NEXT_PUBLIC_` variables.

## Verification
- [ ] Senior profile photo upload successful.
- [ ] Event gallery bulk upload successful.
- [ ] Media deletion removes file from Supabase Storage.
- [ ] All images render correctly on the public site.
