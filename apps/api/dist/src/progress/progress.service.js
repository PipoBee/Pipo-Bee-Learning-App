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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const WEAK_WORDS = {
    p: ['pig', 'pan', 'pin', 'pat'],
    n: ['net', 'nut', 'nap'],
    m: ['map', 'mat', 'moon'],
    d: ['dog', 'duck', 'drum'],
    b: ['bat', 'ball', 'bed'],
};
let ProgressService = class ProgressService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async initializeProgress(studentId) {
        const levels = await this.prisma.level.findMany({
            include: { world: true },
            orderBy: [{ world: { orderIndex: 'asc' } }, { orderIndex: 'asc' }],
        });
        if (levels.length === 0) {
            return;
        }
        await this.prisma.studentProgress.createMany({
            data: levels.map((level, index) => ({
                studentId,
                levelId: level.id,
                isUnlocked: index === 0,
                isCompleted: false,
            })),
            skipDuplicates: true,
        });
    }
    async buildDashboard(studentId) {
        const student = await this.prisma.studentProfile.findUnique({
            where: { id: studentId },
            include: {
                soundMastery: { orderBy: { masteryScore: 'asc' } },
                attempts: {
                    take: 12,
                    orderBy: { createdAt: 'desc' },
                    include: { task: { select: { title: true, taskType: true } } },
                },
                progress: {
                    include: {
                        level: { include: { world: true } },
                    },
                },
            },
        });
        if (!student) {
            throw new common_1.NotFoundException('Learner profile not found');
        }
        const progressSorted = [...student.progress].sort((a, b) => {
            const worldOrder = a.level.world.orderIndex - b.level.world.orderIndex;
            if (worldOrder !== 0) {
                return worldOrder;
            }
            return a.level.orderIndex - b.level.orderIndex;
        });
        const completed = progressSorted.filter((item) => item.isCompleted);
        const pendingReady = progressSorted.filter((item) => item.isUnlocked && !item.isCompleted);
        const upcoming = progressSorted.filter((item) => !item.isUnlocked && !item.isCompleted);
        const current = pendingReady[0] || upcoming[0] || completed[completed.length - 1];
        const totalAttempts = student.attempts.length;
        const correctAttempts = student.attempts.filter((item) => item.isCorrect).length;
        const overallAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
        const weakPhonemes = student.soundMastery
            .filter((item) => item.isWeakFlag || item.masteryScore < 0.65)
            .map((item) => item.phoneme);
        const weakWords = [];
        weakPhonemes.forEach((phoneme) => {
            if (WEAK_WORDS[phoneme]) {
                weakWords.push(...WEAK_WORDS[phoneme]);
            }
        });
        const mapLevel = (item) => ({
            id: item.level.id,
            title: item.level.title,
            subtitle: item.level.subtitle,
            soundLabel: item.level.soundLabel,
            worldTitle: item.level.world.title,
            isTestLevel: item.level.isTestLevel,
            isUnlocked: item.isUnlocked,
            isCompleted: item.isCompleted,
            starsEarned: item.starsEarned,
            highScore: item.highScore,
            totalAttempts: item.totalAttempts,
        });
        return {
            studentId: student.id,
            displayName: student.displayName,
            avatarId: student.avatarId,
            age: student.age,
            totalStars: student.totalStars,
            totalCoins: student.totalCoins,
            streakDays: student.streakDays,
            currentLevelTitle: current ? current.level.title : 'Ready to begin',
            overallAccuracy,
            soundMastery: student.soundMastery.map((item) => ({
                phoneme: item.phoneme,
                masteryScore: item.masteryScore,
                attempts: item.totalAttempts,
                isWeak: item.isWeakFlag || item.masteryScore < 0.65,
            })),
            weakWords,
            recentAttempts: student.attempts.map((item) => ({
                id: item.id,
                taskTitle: item.task.title,
                taskType: item.task.taskType,
                isCorrect: item.isCorrect,
                score: item.score,
                createdAt: item.createdAt.toISOString(),
            })),
            completion: {
                completedCount: completed.length,
                totalLevels: progressSorted.length,
                percent: progressSorted.length
                    ? Math.round((completed.length / progressSorted.length) * 100)
                    : 0,
                levels: completed.map(mapLevel),
            },
            pending: {
                ready: pendingReady.map(mapLevel),
                upcoming: upcoming.slice(0, 8).map(mapLevel),
            },
        };
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map