import { PrismaService } from '../database/prisma.service';
export type LevelSummary = {
    id: string;
    title: string;
    subtitle: string;
    soundLabel: string;
    worldTitle: string;
    isTestLevel: boolean;
    isUnlocked: boolean;
    isCompleted: boolean;
    starsEarned: number;
    highScore: number;
    totalAttempts: number;
};
export declare class ProgressService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    initializeProgress(studentId: string): Promise<void>;
    buildDashboard(studentId: string): Promise<{
        studentId: string;
        displayName: string;
        avatarId: string;
        age: number;
        totalStars: number;
        totalCoins: number;
        streakDays: number;
        currentLevelTitle: string;
        overallAccuracy: number;
        soundMastery: {
            phoneme: string;
            masteryScore: number;
            attempts: number;
            isWeak: boolean;
        }[];
        weakWords: string[];
        recentAttempts: {
            id: string;
            taskTitle: string;
            taskType: import(".prisma/client").$Enums.TaskType;
            isCorrect: boolean;
            score: number;
            createdAt: string;
        }[];
        completion: {
            completedCount: number;
            totalLevels: number;
            percent: number;
            levels: LevelSummary[];
        };
        pending: {
            ready: LevelSummary[];
            upcoming: LevelSummary[];
        };
    }>;
}
