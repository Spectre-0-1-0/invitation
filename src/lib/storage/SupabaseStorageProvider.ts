import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StorageProvider } from './StorageService';
import { logger } from '../logger';

export class SupabaseStorageProvider implements StorageProvider {
  private supabase: SupabaseClient | null = null;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // During build, environment variables might be missing.
    // We should not throw in the constructor to avoid breaking the build.
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      logger.warn('Supabase credentials missing. SupabaseStorageProvider will be inactive.');
    }
  }

  private getClient(): SupabaseClient {
    if (!this.supabase) {
      throw new Error('SupabaseStorageProvider is not configured. Missing environment variables.');
    }
    return this.supabase;
  }

  async uploadFile(file: Buffer, filePath: string, mimeType: string): Promise<string> {
    const client = this.getClient();
    const parts = filePath.split('/');
    const bucket = parts[0];
    const pathWithinBucket = parts.slice(1).join('/');

    const { data, error } = await client.storage
      .from(bucket)
      .upload(pathWithinBucket, file, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload to Supabase: ${error.message}`);
    }

    const { data: { publicUrl } } = client.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  }

  async getSignedUrl(filePath: string): Promise<string> {
    const client = this.getClient();
    const parts = filePath.split('/');
    const bucket = parts[0];
    const pathWithinBucket = parts.slice(1).join('/');

    const { data, error } = await client.storage
      .from(bucket)
      .createSignedUrl(pathWithinBucket, 3600); // 1 hour

    if (error) {
      throw new Error(`Failed to get signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  async deleteFile(filePath: string): Promise<void> {
    const client = this.getClient();
    let bucket: string;
    let pathWithinBucket: string;

    if (filePath.startsWith('http')) {
        const url = new URL(filePath);
        const pathSegments = url.pathname.split('/');
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

    const { error } = await client.storage
      .from(bucket)
      .remove([pathWithinBucket]);

    if (error) {
      logger.error(`Failed to delete from Supabase: ${error.message}`);
    }
  }
}
