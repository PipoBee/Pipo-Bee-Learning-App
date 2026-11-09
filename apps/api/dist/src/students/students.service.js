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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../database/prisma.service");
const progress_service_1 = require("../progress/progress.service");
let StudentsService = class StudentsService {
    constructor(prisma, progressService) {
        this.prisma = prisma;
        this.progressService = progressService;
    }
    async getFirstLevel(studentId) {
        const level = await this.prisma.level.findFirst({
            include: {
                world: true,
                tasks: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        items: { orderBy: { orderIndex: 'asc' } },
                    },
                },
            },
            orderBy: [{ world: { orderIndex: 'asc' } }, { orderIndex: 'asc' }],
        });
        if (!level) {
            throw new common_1.NotFoundException('Level 1 has not been seeded yet');
        }
        const progress = await this.prisma.studentProgress.findUnique({
            where: { studentId_levelId: { studentId, levelId: level.id } },
        });
        return {
            level: {
                id: level.id,
                title: level.title,
                subtitle: level.subtitle,
                soundLabel: level.soundLabel,
                worldTitle: level.world.title,
                passThresholdScore: level.passThresholdScore,
                isUnlocked: progress?.isUnlocked ?? true,
                isCompleted: progress?.isCompleted ?? false,
                starsEarned: progress?.starsEarned ?? 0,
                highScore: progress?.highScore ?? 0,
            },
            tasks: level.tasks.map((task) => ({
                id: task.id,
                taskType: task.taskType,
                title: task.title,
                instructionText: task.instructionText,
                items: task.items.map((item) => ({
                    id: item.id,
                    orderIndex: item.orderIndex,
                    targetGrapheme: item.targetGrapheme,
                    targetPhoneme: item.targetPhoneme,
                    targetWord: item.targetWord,
                    promptText: item.promptText,
                    options: Array.isArray(item.optionsJson) ? item.optionsJson : [],
                })),
            })),
        };
    }
    async completeLevel(studentId, levelId, body) {
        const level = await this.prisma.level.findUnique({
            where: { id: levelId },
            include: {
                world: true,
                tasks: { orderBy: { orderIndex: 'asc' }, take: 1 },
            },
        });
        if (!level) {
            throw new common_1.NotFoundException('Level not found');
        }
        const existing = await this.prisma.studentProgress.findUnique({
            where: { studentId_levelId: { studentId, levelId } },
        });
        const passed = body.score >= (level.passThresholdScore || 70);
        const stars = passed ? (body.score >= 90 ? 3 : body.score >= 80 ? 2 : 1) : 0;
        const firstClear = passed && !existing?.isCompleted;
        await this.prisma.studentProgress.upsert({
            where: { studentId_levelId: { studentId, levelId } },
            create: {
                studentId,
                levelId,
                isUnlocked: true,
                isCompleted: passed,
                starsEarned: stars,
                highScore: body.score,
                totalAttempts: 1,
                lastAttemptAt: new Date(),
            },
            update: {
                isUnlocked: true,
                isCompleted: existing?.isCompleted || passed,
                starsEarned: Math.max(existing?.starsEarned ?? 0, stars),
                highScore: Math.max(existing?.highScore ?? 0, body.score),
                totalAttempts: { increment: 1 },
                lastAttemptAt: new Date(),
            },
        });
        if (passed) {
            const levels = await this.prisma.level.findMany({
                include: { world: true },
                orderBy: [{ world: { orderIndex: 'asc' } }, { orderIndex: 'asc' }],
            });
            const index = levels.findIndex((item) => item.id === levelId);
            const next = levels[index + 1];
            if (next) {
                await this.prisma.studentProgress.upsert({
                    where: { studentId_levelId: { studentId, levelId: next.id } },
                    create: {
                        studentId,
                        levelId: next.id,
                        isUnlocked: true,
                        isCompleted: false,
                    },
                    update: { isUnlocked: true },
                });
            }
        }
        if (firstClear && stars > 0) {
            await this.prisma.studentProfile.update({
                where: { id: studentId },
                data: {
                    totalStars: { increment: stars },
                    totalCoins: { increment: stars * 10 },
                },
            });
        }
        const phoneme = (level.soundLabel || 's').toLowerCase();
        const masteryScore = body.score / 100;
        const previous = await this.prisma.studentSoundMastery.findUnique({
            where: { studentId_phoneme: { studentId, phoneme } },
        });
        await this.prisma.studentSoundMastery.upsert({
            where: { studentId_phoneme: { studentId, phoneme } },
            create: {
                studentId,
                phoneme,
                masteryScore,
                totalAttempts: body.totalCount,
                correctAttempts: body.correctCount,
                isWeakFlag: body.score < 65,
            },
            update: {
                masteryScore: Math.max(previous?.masteryScore ?? 0, masteryScore),
                totalAttempts: { increment: body.totalCount },
                correctAttempts: { increment: body.correctCount },
                isWeakFlag: Math.max(previous?.masteryScore ?? 0, masteryScore) < 0.65,
                lastPracticedAt: new Date(),
            },
        });
        const firstTaskId = level.tasks[0]?.id;
        if (firstTaskId) {
            await this.prisma.attempt.create({
                data: {
                    clientId: (0, crypto_1.randomUUID)(),
                    studentId,
                    taskId: firstTaskId,
                    isCorrect: passed,
                    score: body.score,
                    attemptNumber: (existing?.totalAttempts ?? 0) + 1,
                },
            });
        }
        return this.progressService.buildDashboard(studentId);
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        progress_service_1.ProgressService])
], StudentsService);
//# sourceMappingURL=students.service.js.map