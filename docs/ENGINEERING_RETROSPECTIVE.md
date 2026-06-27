# Engineering Retrospective - Sprint 12 Hardening

## Architectural Wins
1. **Fallback Resilience**: The implementation of the `withFallback` utility in `data-fetcher.ts` proved critical. It allowed the build process to succeed even when the database was inaccessible, which is a common pain point in Next.js CI/CD pipelines.
2. **Unified Storage Provider**: The provider-based abstraction (`StorageService`) allowed us to swap Local Storage for Supabase with minimal changes to the business logic.
3. **Implicit to Explicit Auth**: Moving from middleware-only protection to explicit route-level verification significantly reduced the application's attack surface.

## Technical Debt Removed
- Replaced 100+ lines of static JSON mapping with dynamic Prisma queries.
- Eliminated over 20 instances of `: any` types, moving towards a strictly-typed domain model.
- Removed multiple development-only `console.log` statements, replacing them with a structured `logger.ts`.

## Lessons Learned
- **The "Build Trap"**: Relying on environment variables during static generation can silently break builds. Always implement a "Build-Safe" mode for data fetchers.
- **Feature Drift**: In early sprints, some features (Achievements, Memes) were partially implemented in UI but not in schema. Hardening required reconciling these "ghost features" with the real database model.

## Recommendations for Future Contributors
- **Inngest for Media**: The background job system is powerful but requires local dev setup. See `DEPLOYMENT_GUIDE.md` for the Inngest Dev Server instructions.
- **Typing**: When adding new fields to `schema.prisma`, ensure they are mirrored in `src/types/archive.ts` to maintain the UI compatibility layer.
