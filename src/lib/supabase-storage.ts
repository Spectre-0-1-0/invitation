import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export type BucketName = 'photos' | 'videos' | 'documents' | 'memes' | 'posters';

export async function uploadFile(
  file: Buffer | File,
  bucket: BucketName,
  path: string,
  contentType?: string
) {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check environment variables.');
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload to Supabase: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}

export function getBucketFromMimeType(mimeType: string, originalName?: string): BucketName {
  if (mimeType.startsWith('image/')) {
    return 'photos';
  }
  if (mimeType.startsWith('video/')) {
    return 'videos';
  }
  if (mimeType === 'application/pdf' || mimeType.includes('msword') || mimeType.includes('officedocument')) {
    return 'documents';
  }

  const ext = originalName?.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'photos';
  if (['mp4', 'mov', 'avi', 'mkv'].includes(ext || '')) return 'videos';
  if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) return 'documents';

  return 'photos';
}
