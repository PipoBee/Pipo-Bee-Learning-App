export type UserRole = 'ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT';
export interface UserDto {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    createdAt: string;
}
export interface AuthResponse {
    user: UserDto;
    accessToken: string;
    refreshToken?: string;
    studentProfile?: {
        id: string;
        displayName: string;
        avatarId: string;
        age: number;
        totalStars: number;
        totalCoins: number;
        streakDays: number;
    };
}
export interface LearnerProgressReport {
    studentId: string;
    displayName: string;
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
        targetWord?: string;
        targetPhoneme?: string;
        taskType: string;
        isCorrect: boolean;
        score: number;
        createdAt: string;
    }[];
}
//# sourceMappingURL=auth.d.ts.map