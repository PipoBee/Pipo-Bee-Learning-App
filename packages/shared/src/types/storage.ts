export interface StoredFile {
  id: string;
  fileName: string;
  fileUrl: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  category: 'PHONEME' | 'WORD' | 'INSTRUCTION' | 'SFX' | 'AVATAR';
  transcript?: string;
  createdAt: string;
}

export interface UploadOptions {
  category: 'PHONEME' | 'WORD' | 'INSTRUCTION' | 'SFX' | 'AVATAR';
  transcript?: string;
}

export interface IStorageService {
  uploadFile(
    fileBuffer: Uint8Array,
    fileName: string,
    mimeType: string,
    options?: UploadOptions
  ): Promise<StoredFile>;
  deleteFile(storageKey: string): Promise<boolean>;
  getFileUrl(storageKey: string): string;
}
