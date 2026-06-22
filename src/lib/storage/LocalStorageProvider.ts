import fs from 'fs/promises';
import path from 'path';
import { StorageProvider } from './StorageService';

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), 'public');
  }

  async uploadFile(file: Buffer, filePath: string, mimeType: string): Promise<string> {
    const fullPath = path.join(this.baseDir, filePath);
    const dir = path.dirname(fullPath);

    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });

    // Write file
    await fs.writeFile(fullPath, file);

    // Return the public URL
    return `/${filePath}`;
  }

  async getSignedUrl(filePath: string): Promise<string> {
    // For local storage, the signed URL is just the public URL
    return filePath.startsWith('/') ? filePath : `/${filePath}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    // Remove leading slash if present for path.join
    const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    const fullPath = path.join(this.baseDir, relativePath);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      console.error(`Failed to delete local file: ${fullPath}`, error);
    }
  }
}
