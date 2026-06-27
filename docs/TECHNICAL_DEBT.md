# Technical Debt Audit - College Memory Archive

## 1. Type Safety ( `: any` usage)
- Multiple route handlers and functions use `: any` for parameters or variables, bypassing TypeScript's type checking.
- Affected files:
    - `src/app/(main)/events/[slug]/page.tsx`
    - `src/app/(main)/gallery/[id]/page.tsx`
    - `src/app/(main)/people/[slug]/page.tsx`
    - `src/inngest/functions.ts`
    - `src/app/(main)/videos/page.tsx` (uses `any[]`)

## 2. Error Handling
- Catch blocks often use `error: any` and log to console without user-friendly feedback in some admin operations.
- `withFallback` in `data-fetcher.ts` swallows database errors and silently returns fallback JSON or empty arrays.

## 3. Environment Fallbacks
- `src/lib/supabase-storage.ts` uses `placeholder.supabase.co` and `placeholder-key` if environment variables are missing, which can cause confusing failures in production.

## 4. Unimplemented Features / Stubs
- `src/app/(main)/videos/page.tsx` appears to be a stub with an empty `any[]` array.
- `getAchievements` in `data-fetcher.ts` returns an empty array.

## 5. Security
- `ADMIN_SECRET` is a shared passcode. While functional, it lacks individual user auditing.

## 6. Storage
- Currently using `LocalStorageProvider` by default, which is unsuitable for multi-instance or serverless deployments. (See `STORAGE_MIGRATION_CHECKLIST.md`).
