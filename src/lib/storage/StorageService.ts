import { LocalStorageProvider } from './LocalStorageProvider';

export type MediaCategory = 'people' | 'events' | 'gallery' | 'documents' | 'memes';

export interface StorageProvider {
  uploadFile(file: Buffer, path: string, mimeType: string): Promise<string>;
  getSignedUrl(path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
}

export class StorageService {
  private provider: StorageProvider;

  constructor(provider?: StorageProvider) {
    // Default to LocalStorageProvider for now
    this.provider = provider || new LocalStorageProvider();
  }

  async uploadMedia(
    file: Buffer,
    fileName: string,
    category: MediaCategory,
    subFolder?: string
  ): Promise<string> {
    const timestamp = Date.now();
    const sanitizedFileName = this.sanitizeFileName(fileName);
    const folder = subFolder ? `${category}/${subFolder}` : category;
    const filePath = `uploads/${folder}/${timestamp}-${sanitizedFileName}`;

    return this.provider.uploadFile(file, filePath, this.getMimeType(fileName));
  }

  private sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
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
      default: return 'application/octet-stream';
    }
  }
}

// Export a singleton instance
export const storageService = new StorageService();
