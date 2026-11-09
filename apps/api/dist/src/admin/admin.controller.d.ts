import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    listUsers(): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: string;
        children: {
            id: string;
            displayName: string;
            avatarId: string;
            age: number;
            totalStars: number;
            totalCoins: number;
            streakDays: number;
        }[];
    }[]>;
    listStudents(): Promise<{
        id: string;
        displayName: string;
        avatarId: string;
        age: number;
        totalStars: number;
        totalCoins: number;
        streakDays: number;
        owner: {
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.Role;
        };
        completedLevels: number;
        pendingLevels: number;
        totalLevels: number;
    }[]>;
    getStudentDashboard(id: string): Promise<{
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
    getLearnerAnalytics(studentId?: string): Promise<{
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
    listAudioAssets(): Promise<{
        id: string;
        createdAt: Date;
        storageKey: string;
        fileName: string;
        publicUrl: string;
        mimeType: string;
        sizeBytes: number;
        category: string;
        transcript: string | null;
    }[]>;
    uploadAudio(file: Express.Multer.File, category: 'PHONEME' | 'WORD' | 'INSTRUCTION' | 'SFX', transcript?: string): Promise<{
        id: string;
        createdAt: Date;
        storageKey: string;
        fileName: string;
        publicUrl: string;
        mimeType: string;
        sizeBytes: number;
        category: string;
        transcript: string | null;
    }>;
    deleteAudio(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
