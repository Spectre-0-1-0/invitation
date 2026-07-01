import { randomUUID } from 'node:crypto';
import { LocalStorageProvider } from './LocalStorageProvider';
import { SupabaseStorageProvider } from './SupabaseStorageProvider';

// Business domain buckets
export type MediaCategory = 'people' | 'events' | 'gallery' | 'documents' | 'memories' | 'general';

export interface StorageProvider {
  uploadFile(file: Buffer, path: string, mimeType: string): Promise<string>;
  getSignedUrl(path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
}

export class StorageService {
  private provider: StorageProvider;

  constructor() {
    // In production (Vercel), we should default to Supabase
    const isProduction = process.env.NODE_ENV === 'production';
    const providerType = process.env.STORAGE_PROVIDER || (isProduction ? 'supabase' : 'local');

    if (providerType === 'supabase') {
      this.provider = new SupabaseStorageProvider();
    } else {
      this.provider = new LocalStorageProvider();
    }
  }

  async uploadMedia(
    file: Buffer,
    fileName: string,
    category: MediaCategory,
    subFolder?: string
  ): Promise<string> {
    const uuid = randomUUID();
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const newFileName = `${uuid}${extension ? '.' + extension : ''}`;

    // Determine internal folder structure within the bucket
    let internalFolder = 'misc';
    switch (category) {
      case 'people':
        internalFolder = 'profile';
        break;
      case 'events':
        internalFolder = 'covers';
        break;
      case 'gallery':
        internalFolder = subFolder || 'uncategorized';
        break;
      case 'memories':
        internalFolder = 'attachments';
        break;
      case 'documents':
        internalFolder = 'admin';
        break;
      case 'general':
        internalFolder = 'misc';
        break;
    }

    // Path format: bucket/folder/filename.ext
    const filePath = `${category}/${internalFolder}/${newFileName}`;

    return this.provider.uploadFile(file, filePath, this.getMimeType(fileName));
  }

  async deleteMedia(url: string): Promise<void> {
    await this.provider.deleteFile(url);
  }

  private getMimeType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'gif': return 'image/gif';
      case 'webp': return 'image/webp';
      case 'mp4': return 'video/mp4';
      case 'pdf': return 'application/pdf';
      case 'zip': return 'application/zip';
      default: return 'application/octet-stream';
    }
  }
}

export const storageService = new StorageService();
