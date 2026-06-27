import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StorageProvider } from './StorageService';

export class SupabaseStorageProvider implements StorageProvider {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Service Role Key are required for SupabaseStorageProvider');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadFile(file: Buffer, filePath: string, mimeType: string): Promise<string> {
    // Expected filePath format: "bucket/folder/filename.ext"
    const parts = filePath.split('/');
    const bucket = parts[0];
    const pathWithinBucket = parts.slice(1).join('/');

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(pathWithinBucket, file, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload to Supabase: ${error.message}`);
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  }

  async getSignedUrl(filePath: string): Promise<string> {
    const parts = filePath.split('/');
    const bucket = parts[0];
    const pathWithinBucket = parts.slice(1).join('/');

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(pathWithinBucket, 3600); // 1 hour

    if (error) {
      throw new Error(`Failed to get signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  async deleteFile(filePath: string): Promise<void> {
    // If it's a full URL, we need to extract the path.
    // However, the interface expects the same path format as uploadFile.
    // If filePath is a URL from Supabase, we might need parsing.
    // Let's assume for now the caller provides "bucket/path/to/file"

    let bucket: string;
    let pathWithinBucket: string;

    if (filePath.startsWith('http')) {
        // Simple extraction from public URL: https://.../storage/v1/object/public/bucket/path/to/file
        const url = new URL(filePath);
        const pathSegments = url.pathname.split('/');
        // Path matches /storage/v1/object/public/bucket/path...
        // Index of 'public' is usually 5
        const publicIndex = pathSegments.indexOf('public');
        if (publicIndex !== -1 && pathSegments.length > publicIndex + 1) {
            bucket = pathSegments[publicIndex + 1];
            pathWithinBucket = pathSegments.slice(publicIndex + 2).join('/');
        } else {
            throw new Error(`Could not parse bucket and path from URL: ${filePath}`);
        }
    } else {
        const parts = filePath.split('/');
        bucket = parts[0];
        pathWithinBucket = parts.slice(1).join('/');
    }

    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([pathWithinBucket]);

    if (error) {
      console.error(`Failed to delete from Supabase: ${error.message}`);
    }
  }
}
