import { IStorageService, StoredFile, UploadOptions } from '@phonicsquest/shared';
export declare class LocalStorageService implements IStorageService {
    private readonly logger;
    private readonly uploadDir;
    private readonly baseUrl;
    constructor();
    uploadFile(fileBuffer: Buffer | Uint8Array, fileName: string, mimeType: string, options?: UploadOptions): Promise<StoredFile>;
    deleteFile(storageKey: string): Promise<boolean>;
    getFileUrl(storageKey: string): string;
}
