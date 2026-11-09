import { PrismaService } from '../database/prisma.service';
import { ProgressService } from '../progress/progress.service';
export declare class ParentsService {
    private readonly prisma;
    private readonly progressService;
    constructor(prisma: PrismaService, progressService: ProgressService);
    listChildren(parentId: string): Promise<{
        maxChildren: number;
        remainingSlots: number;
        children: {
            id: string;
            displayName: string;
            avatarId: string;
            age: number;
            totalStars: number;
            totalCoins: number;
            streakDays: number;
        }[];
    }>;
    createChild(parentId: string, input: {
        displayName: string;
        age?: number;
        avatarId?: string;
    }): Promise<{
        id: string;
        displayName: string;
        avatarId: string;
        age: number;
        totalStars: number;
        totalCoins: number;
        streakDays: number;
    }>;
    getChildDashboard(parentId: string, childId: string): Promise<{
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
            levels: import("../progress/progress.service").LevelSummary[];
        };
        pending: {
            ready: import("../progress/progress.service").LevelSummary[];
            upcoming: import("../progress/progress.service").LevelSummary[];
        };
    }>;
    deleteChild(parentId: string, childId: string): Promise<{
        success: boolean;
    }>;
    private assertOwnsChild;
    private toChildCard;
}
