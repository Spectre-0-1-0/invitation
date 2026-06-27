# Migration Checklist: LocalStorage to Supabase Storage

## 1. Overview
The current application uses `LocalStorageProvider` which stores media assets in the `public/uploads` directory. This needs to be replaced with a `SupabaseStorageProvider` for production use.

## 2. Files to Modify
- `src/lib/storage/SupabaseStorageProvider.ts`: Create this new provider implementing the `StorageProvider` interface.
- `src/lib/storage/StorageService.ts`: Update the constructor to instantiate `SupabaseStorageProvider` instead of `LocalStorageProvider` when in production.
- `next.config.ts`: Add the Supabase storage domain to `images.remotePatterns`.

## 3. Interfaces Affected
- `StorageProvider`: The interface is already well-defined and should support Supabase without changes.
- `StorageService`: The high-level `uploadMedia` method will remain the same, ensuring compatibility with the rest of the app.

## 4. Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (for server-side uploads)

## 5. Estimated Effort
- **Implementation**: 2-4 hours.
- **Testing**: 1-2 hours.
- **Migration of existing files**: 1 hour (if any local files need to be moved).

## 6. Implementation Notes
- The `SupabaseStorageProvider` should use the `@supabase/supabase-js` client.
- It should handle bucket selection based on the `category` passed to the provider.
- Signed URLs should be generated using `supabase.storage.from(bucket).createSignedUrl()`.
