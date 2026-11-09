import { Task } from './activities';
export interface World {
    id: string;
    code: string;
    title: string;
    description: string;
    orderIndex: number;
    themeColor: string;
    accentColor: string;
    iconName: string;
    levels: Level[];
}
export interface Level {
    id: string;
    worldId: string;
    title: string;
    subtitle: string;
    soundLabel: string;
    orderIndex: number;
    requiredStars: number;
    passThresholdScore: number;
    isTestLevel: boolean;
    tasks: Task[];
}
export interface StudentProgress {
    levelId: string;
    isUnlocked: boolean;
    isCompleted: boolean;
    starsEarned: number;
    highScore: number;
    attemptsCount: number;
    lastAttemptAt?: string;
}
export interface StudentProfile {
    id: string;
    displayName: string;
    avatarId: string;
    age: number;
    totalStars: number;
    totalCoins: number;
    streakDays: number;
}
//# sourceMappingURL=curriculum.d.ts.map