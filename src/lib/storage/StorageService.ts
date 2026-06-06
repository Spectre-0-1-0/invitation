export type MediaCategory = 'photos' | 'videos' | 'documents' | 'memes';

export interface StorageProvider {
  uploadFile(file: Buffer, path: string, mimeType: string): Promise<string>;
  getSignedUrl(path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
}

export class StorageService {
  private provider: StorageProvider;

  constructor(provider: StorageProvider) {
    this.provider = provider;
  }

  async uploadMemoryMedia(
    file: Buffer,
    fileName: string,
    category: MediaCategory,
    eventId: string
  ): Promise<string> {
    const timestamp = Date.now();
    const path = `memories/${category}/${eventId}/${timestamp}-${fileName}`;
    return this.provider.uploadFile(file, path, this.getMimeType(fileName));
  }

  private getMimeType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'mp4': return 'video/mp4';
      case 'pdf': return 'application/pdf';
      default: return 'application/octet-stream';
    }
  }
}

// Example S3 Provider Implementation (Skeleton)
export class S3StorageProvider implements StorageProvider {
  async uploadFile(file: Buffer, path: string, mimeType: string): Promise<string> {
    // S3/R2 upload logic here
    return `https://storage.provider.com/${path}`;
  }
  async getSignedUrl(path: string): Promise<string> {
    return `https://storage.provider.com/${path}?token=...`;
  }
  async deleteFile(path: string): Promise<void> {
    // delete logic
  }
}
