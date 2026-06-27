import fs from 'fs/promises';
import path from 'path';
import { StorageProvider } from './StorageService';

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), 'public', 'uploads');
  }

  async uploadFile(file: Buffer, filePath: string, mimeType: string): Promise<string> {
    const fullPath = path.join(this.baseDir, filePath);
    const dir = path.dirname(fullPath);

    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });

    // Write file
    await fs.writeFile(fullPath, file);

    // Return the public URL
    return `/uploads/${filePath}`;
  }

  async getSignedUrl(filePath: string): Promise<string> {
    // For local storage, the signed URL is just the public URL
    return filePath.startsWith('/') ? filePath : `/uploads/${filePath}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    // If it's a URL like /uploads/bucket/folder/file, strip /uploads/
    let relativePath = filePath;
    if (filePath.startsWith('/uploads/')) {
      relativePath = filePath.substring('/uploads/'.length);
    } else if (filePath.startsWith('uploads/')) {
      relativePath = filePath.substring('uploads/'.length);
    }

    const fullPath = path.join(this.baseDir, relativePath);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      console.error(`Failed to delete local file: ${fullPath}`, error);
    }
  }
}
