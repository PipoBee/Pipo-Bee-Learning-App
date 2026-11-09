import { PrismaService } from '../database/prisma.service';
interface AttemptDto {
    clientId: string;
    taskId: string;
    taskItemId?: string;
    isCorrect: boolean;
    score: number;
    speechConfidence?: number;
    durationMs: number;
    attemptNumber: number;
    createdAt: string;
}
interface ProgressDto {
    levelId: string;
    isCompleted: boolean;
    starsEarned: number;
    highScore: number;
}
export declare class SyncService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    processPush(studentId: string, attempts: AttemptDto[], progressUpdates: ProgressDto[]): Promise<{
        success: boolean;
        syncedAttempts: number;
        syncedLevels: number;
        totalStars: number;
        totalCoins: number;
        syncedAt: string;
    }>;
    processPull(studentId?: string, since?: string): Promise<{
        progress: any[];
        soundMastery: any[];
        studentId?: undefined;
        displayName?: undefined;
        totalStars?: undefined;
        totalCoins?: undefined;
        streakDays?: undefined;
        pulledAt?: undefined;
    } | {
        studentId: string;
        displayName: string;
        totalStars: number;
        totalCoins: number;
        streakDays: number;
        progress: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isUnlocked: boolean;
            isCompleted: boolean;
            starsEarned: number;
            highScore: number;
            totalAttempts: number;
            lastAttemptAt: Date | null;
            syncedAt: Date;
            studentId: string;
            levelId: string;
        }[];
        soundMastery: {
            id: string;
            updatedAt: Date;
            totalAttempts: number;
            studentId: string;
            phoneme: string;
            masteryScore: number;
            correctAttempts: number;
            isWeakFlag: boolean;
            lastPracticedAt: Date;
        }[];
        pulledAt: string;
    }>;
}
export {};
