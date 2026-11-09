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
var SyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let SyncService = SyncService_1 = class SyncService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SyncService_1.name);
    }
    async processPush(studentId, attempts, progressUpdates) {
        const syncedAttempts = [];
        const syncedLevels = [];
        let student = await this.prisma.studentProfile.findFirst({
            where: {
                OR: [
                    { id: studentId },
                    { userId: studentId },
                ],
            },
        });
        if (!student) {
            student = await this.prisma.studentProfile.findFirst();
            if (!student) {
                throw new Error('No learner profile available to sync');
            }
        }
        const defaultTask = await this.prisma.task.findFirst();
        const defaultLevel = await this.prisma.level.findFirst();
        for (const att of attempts || []) {
            const existing = await this.prisma.attempt.findUnique({
                where: { clientId: att.clientId },
            });
            if (!existing) {
                let targetTaskId = att.taskId;
                const taskExists = await this.prisma.task.findUnique({
                    where: { id: targetTaskId },
                });
                if (!taskExists) {
                    const fallbackTask = await this.prisma.task.findFirst({
                        where: {
                            OR: [
                                { levelId: att.taskId.replace('task_', '') },
                                { level: { soundLabel: att.taskId } },
                            ],
                        },
                    });
                    targetTaskId = fallbackTask ? fallbackTask.id : (defaultTask ? defaultTask.id : att.taskId);
                }
                await this.prisma.attempt.create({
                    data: {
                        clientId: att.clientId,
                        studentId: student.id,
                        taskId: targetTaskId,
                        taskItemId: att.taskItemId || null,
                        isCorrect: att.isCorrect,
                        score: att.score,
                        speechConfidence: att.speechConfidence || null,
                        durationMs: att.durationMs || 0,
                        attemptNumber: att.attemptNumber || 1,
                        createdAt: att.createdAt ? new Date(att.createdAt) : new Date(),
                        syncedAt: new Date(),
                    },
                });
            }
            syncedAttempts.push(att.clientId);
        }
        for (const prog of progressUpdates || []) {
            let targetLevelId = prog.levelId;
            const levelExists = await this.prisma.level.findUnique({
                where: { id: targetLevelId },
            });
            if (!levelExists) {
                const fallbackLevel = await this.prisma.level.findFirst({
                    where: {
                        OR: [
                            { soundLabel: prog.levelId },
                            { id: { contains: prog.levelId } },
                        ],
                    },
                });
                targetLevelId = fallbackLevel ? fallbackLevel.id : (defaultLevel ? defaultLevel.id : prog.levelId);
            }
            const existing = await this.prisma.studentProgress.findUnique({
                where: {
                    studentId_levelId: {
                        studentId: student.id,
                        levelId: targetLevelId,
                    },
                },
            });
            if (existing) {
                await this.prisma.studentProgress.update({
                    where: { id: existing.id },
                    data: {
                        isCompleted: existing.isCompleted || prog.isCompleted,
                        starsEarned: Math.max(existing.starsEarned, prog.starsEarned),
                        highScore: Math.max(existing.highScore, prog.highScore),
                        totalAttempts: existing.totalAttempts + 1,
                        lastAttemptAt: new Date(),
                        syncedAt: new Date(),
                    },
                });
            }
            else {
                await this.prisma.studentProgress.create({
                    data: {
                        studentId: student.id,
                        levelId: targetLevelId,
                        isUnlocked: true,
                        isCompleted: prog.isCompleted,
                        starsEarned: prog.starsEarned,
                        highScore: prog.highScore,
                        totalAttempts: 1,
                        lastAttemptAt: new Date(),
                        syncedAt: new Date(),
                    },
                });
            }
            syncedLevels.push(prog.levelId);
        }
        const allProgress = await this.prisma.studentProgress.findMany({
            where: { studentId: student.id },
        });
        const progressStars = allProgress.reduce((sum, p) => sum + p.starsEarned, 0);
        const totalStars = Math.max(student.totalStars, progressStars);
        const totalCoins = student.totalCoins;
        await this.prisma.studentProfile.update({
            where: { id: student.id },
            data: {
                totalStars,
                totalCoins,
                lastActiveDate: new Date(),
            },
        });
        this.logger.log(`Synced ${syncedAttempts.length} attempts and ${syncedLevels.length} levels for student ${student.displayName}`);
        return {
            success: true,
            syncedAttempts: syncedAttempts.length,
            syncedLevels: syncedLevels.length,
            totalStars,
            totalCoins,
            syncedAt: new Date().toISOString(),
        };
    }
    async processPull(studentId, since) {
        let student = studentId
            ? await this.prisma.studentProfile.findUnique({ where: { id: studentId } })
            : await this.prisma.studentProfile.findFirst();
        if (!student) {
            student = await this.prisma.studentProfile.findFirst();
        }
        if (!student) {
            return { progress: [], soundMastery: [] };
        }
        const sinceDate = since ? new Date(since) : new Date(0);
        const progress = await this.prisma.studentProgress.findMany({
            where: {
                studentId: student.id,
                updatedAt: { gte: sinceDate },
            },
        });
        const soundMastery = await this.prisma.studentSoundMastery.findMany({
            where: { studentId: student.id },
        });
        return {
            studentId: student.id,
            displayName: student.displayName,
            totalStars: student.totalStars,
            totalCoins: student.totalCoins,
            streakDays: student.streakDays,
            progress,
            soundMastery,
            pulledAt: new Date().toISOString(),
        };
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = SyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SyncService);
//# sourceMappingURL=sync.service.js.map