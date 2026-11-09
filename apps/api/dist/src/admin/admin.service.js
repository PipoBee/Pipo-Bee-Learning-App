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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const progress_service_1 = require("../progress/progress.service");
const local_storage_service_1 = require("../storage/local-storage.service");
let AdminService = class AdminService {
    constructor(prisma, storage, progressService) {
        this.prisma = prisma;
        this.storage = storage;
        this.progressService = progressService;
    }
    async listUsers() {
        const users = await this.prisma.user.findMany({
            include: { students: { orderBy: { createdAt: 'asc' } } },
            orderBy: { createdAt: 'desc' },
        });
        return users.map((user) => ({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
            children: user.students.map((child) => ({
                id: child.id,
                displayName: child.displayName,
                avatarId: child.avatarId,
                age: child.age,
                totalStars: child.totalStars,
                totalCoins: child.totalCoins,
                streakDays: child.streakDays,
            })),
        }));
    }
    async listStudents() {
        const students = await this.prisma.studentProfile.findMany({
            include: {
                user: { select: { id: true, fullName: true, email: true, role: true } },
                progress: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return students.map((student) => {
            const completed = student.progress.filter((item) => item.isCompleted).length;
            const pending = student.progress.filter((item) => item.isUnlocked && !item.isCompleted).length;
            return {
                id: student.id,
                displayName: student.displayName,
                avatarId: student.avatarId,
                age: student.age,
                totalStars: student.totalStars,
                totalCoins: student.totalCoins,
                streakDays: student.streakDays,
                owner: student.user,
                completedLevels: completed,
                pendingLevels: pending,
                totalLevels: student.progress.length,
            };
        });
    }
    async getLearnerAnalytics(studentId) {
        if (studentId) {
            return this.progressService.buildDashboard(studentId);
        }
        const first = await this.prisma.studentProfile.findFirst({
            orderBy: { createdAt: 'asc' },
        });
        if (!first) {
            throw new common_1.NotFoundException('No learner profile found in system');
        }
        return this.progressService.buildDashboard(first.id);
    }
    async getStudentDashboard(studentId) {
        return this.progressService.buildDashboard(studentId);
    }
    async listAudioAssets() {
        return this.prisma.audioAsset.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async uploadAudio(file, category, transcript) {
        const stored = await this.storage.uploadFile(file.buffer, file.originalname, file.mimetype, {
            category,
            transcript,
        });
        return this.prisma.audioAsset.create({
            data: {
                fileName: stored.fileName,
                storageKey: stored.storageKey,
                publicUrl: stored.fileUrl,
                mimeType: stored.mimeType,
                sizeBytes: stored.sizeBytes,
                category: stored.category,
                transcript: stored.transcript || null,
            },
        });
    }
    async deleteAudio(id) {
        const asset = await this.prisma.audioAsset.findUnique({ where: { id } });
        if (!asset) {
            throw new common_1.NotFoundException(`Asset ${id} not found`);
        }
        await this.storage.deleteFile(asset.storageKey);
        await this.prisma.audioAsset.delete({ where: { id } });
        return { success: true, message: `Deleted asset ${asset.fileName}` };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        local_storage_service_1.LocalStorageService,
        progress_service_1.ProgressService])
], AdminService);
//# sourceMappingURL=admin.service.js.map