import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IStorageService, StoredFile, UploadOptions } from '@phonicsquest/shared';

@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly logger = new Logger(LocalStorageService.name);
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), process.env.UPLOADS_DIR || './uploads');
    this.baseUrl = process.env.API_PUBLIC_URL || 'http://localhost:3000';

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`Created local uploads directory at ${this.uploadDir}`);
    }
  }

  async uploadFile(
    fileBuffer: Buffer | Uint8Array,
    fileName: string,
    mimeType: string,
    options?: UploadOptions
  ): Promise<StoredFile> {
    const cleanExt = path.extname(fileName) || '.wav';
    const timestamp = Date.now();
    const safeName = path.basename(fileName, cleanExt).replace(/[^a-zA-Z0-9_-]/g, '_');
    const storageKey = `${options?.category?.toLowerCase() || 'general'}/${timestamp}_${safeName}${cleanExt}`;
    const destinationPath = path.join(this.uploadDir, storageKey);

    const targetSubDir = path.dirname(destinationPath);
    if (!fs.existsSync(targetSubDir)) {
      fs.mkdirSync(targetSubDir, { recursive: true });
    }

    fs.writeFileSync(destinationPath, Buffer.from(fileBuffer));
    this.logger.log(`Saved file to disk: ${destinationPath}`);

    const fileUrl = `${this.baseUrl}/uploads/${storageKey}`;

    return {
      id: `file_${timestamp}`,
      fileName,
      fileUrl,
      storageKey,
      mimeType,
      sizeBytes: fileBuffer.length,
      category: options?.category || 'PHONEME',
      transcript: options?.transcript,
      createdAt: new Date().toISOString(),
    };
  }

  async deleteFile(storageKey: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, storageKey);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (err) {
      this.logger.error(`Error deleting file ${storageKey}:`, err);
      return false;
    }
  }

  getFileUrl(storageKey: string): string {
    return `${this.baseUrl}/uploads/${storageKey}`;
  }
}
