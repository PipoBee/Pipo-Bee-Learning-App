import { ProgressService } from '../progress/progress.service';
import { StudentsService } from './students.service';
declare class CompleteLevelDto {
    score: number;
    correctCount: number;
    totalCount: number;
}
export declare class StudentsController {
    private readonly progressService;
    private readonly studentsService;
    constructor(progressService: ProgressService, studentsService: StudentsService);
    getDashboard(req: {
        user: {
            students?: {
                id: string;
            }[];
        };
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
    getFirstLevel(req: {
        user: {
            students?: {
                id: string;
            }[];
        };
    }): Promise<{
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
    completeLevel(req: {
        user: {
            students?: {
                id: string;
            }[];
        };
    }, id: string, body: CompleteLevelDto): Promise<{
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
    private requireProfile;
}
export {};
