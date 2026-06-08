import { supabase } from '@/lib/supabase';

export type BucketName = 'photos' | 'videos' | 'documents' | 'memes' | 'posters';

export class StorageService {
  static async uploadFile(bucket: BucketName, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) throw error;
    return data;
  }

  static getPublicUrl(bucket: BucketName, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  static async listFiles(bucket: BucketName, path?: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path);

    if (error) throw error;
    return data;
  }
}
