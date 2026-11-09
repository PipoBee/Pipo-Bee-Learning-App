import { PrismaService } from '../database/prisma.service';
import { ProgressService } from '../progress/progress.service';
export declare class StudentsService {
    private readonly prisma;
    private readonly progressService;
    constructor(prisma: PrismaService, progressService: ProgressService);
    getFirstLevel(studentId: string): Promise<{
        level: {
            id: string;
            title: string;
            subtitle: string;
            soundLabel: string;
            worldTitle: string;
            passThresholdScore: number;
            isUnlocked: boolean;
            isCompleted: boolean;
            starsEarned: number;
            highScore: number;
        };
        tasks: {
            id: string;
            taskType: import(".prisma/client").$Enums.TaskType;
            title: string;
            instructionText: string;
            items: {
                id: string;
                orderIndex: number;
                targetGrapheme: string;
                targetPhoneme: string;
                targetWord: string;
                promptText: string;
                options: import("@prisma/client/runtime/library").JsonArray;
            }[];
        }[];
    }>;
    completeLevel(studentId: string, levelId: string, body: {
        score: number;
        correctCount: number;
        totalCount: number;
    }): Promise<{
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
}
