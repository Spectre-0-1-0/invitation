# GitHub Release Checklist

## 1. Pre-Release Verification
- [ ] Run `npm run build` and ensure it passes with zero errors.
- [ ] Run `npx playwright test` smoke tests.
- [ ] Verify `DEPLOYMENT_GUIDE.md` is up to date.

## 2. Infrastructure Check
- [ ] Database migrations applied: `npx prisma migrate deploy`.
- [ ] Supabase storage buckets created and public access verified.
- [ ] Vercel Environment Variables matches `LAUNCH_CHECKLIST.md`.

## 3. Git Operations
- [ ] Merge hardening branch into `main`.
- [ ] Create a new tag: `git tag -a v1.0.0 -m "Release v1.0.0"`.
- [ ] Push tags: `git push origin --tags`.

## 4. Release Publication
- [ ] Draft new release on GitHub.
- [ ] Select the version tag (`v1.0.0`).
- [ ] Copy content from `docs/RELEASE_NOTES_v1.0.md` into the release description.
- [ ] Attach any relevant build artifacts or documentation PDFs.
- [ ] Publish!
