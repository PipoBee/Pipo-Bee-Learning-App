import { SyncService } from './sync.service';
export declare class SyncPushDto {
    studentId: string;
    attempts?: any[];
    progressUpdates?: any[];
}
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    push(body: SyncPushDto): Promise<{
        success: boolean;
        syncedAttempts: number;
        syncedLevels: number;
        totalStars: number;
        totalCoins: number;
        syncedAt: string;
    }>;
    pull(studentId?: string, since?: string): Promise<{
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
