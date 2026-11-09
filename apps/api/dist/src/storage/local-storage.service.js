"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LocalStorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let LocalStorageService = LocalStorageService_1 = class LocalStorageService {
    constructor() {
        this.logger = new common_1.Logger(LocalStorageService_1.name);
        this.uploadDir = path.resolve(process.cwd(), process.env.UPLOADS_DIR || './uploads');
        this.baseUrl = process.env.API_PUBLIC_URL || 'http://localhost:3000';
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
            this.logger.log(`Created local uploads directory at ${this.uploadDir}`);
        }
    }
    async uploadFile(fileBuffer, fileName, mimeType, options) {
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
    async deleteFile(storageKey) {
        try {
            const filePath = path.join(this.uploadDir, storageKey);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return true;
            }
            return false;
        }
        catch (err) {
            this.logger.error(`Error deleting file ${storageKey}:`, err);
            return false;
        }
    }
    getFileUrl(storageKey) {
        return `${this.baseUrl}/uploads/${storageKey}`;
    }
};
exports.LocalStorageService = LocalStorageService;
exports.LocalStorageService = LocalStorageService = LocalStorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LocalStorageService);
//# sourceMappingURL=local-storage.service.js.map