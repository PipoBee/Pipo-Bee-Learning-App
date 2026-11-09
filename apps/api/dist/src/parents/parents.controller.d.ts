import { ParentsService } from './parents.service';
export declare class CreateChildDto {
    displayName: string;
    age?: number;
    avatarId?: string;
}
export declare class ParentsController {
    private readonly parentsService;
    constructor(parentsService: ParentsService);
    listChildren(req: {
        user: {
            id: string;
        };
    }): Promise<{
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
    createChild(req: {
        user: {
            id: string;
        };
    }, body: CreateChildDto): Promise<{
        id: string;
        displayName: string;
        avatarId: string;
        age: number;
        totalStars: number;
        totalCoins: number;
        streakDays: number;
    }>;
    getChildDashboard(req: {
        user: {
            id: string;
        };
    }, id: string): Promise<{
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
    deleteChild(req: {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        success: boolean;
    }>;
}
