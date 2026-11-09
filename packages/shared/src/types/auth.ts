export type UserRole = 'ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT';

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

export interface ChildProfileDto {
  id: string;
  displayName: string;
  avatarId: string;
  age: number;
  totalStars: number;
  totalCoins: number;
  streakDays: number;
}

export interface AuthResponse {
  user: UserDto;
  accessToken: string;
  refreshToken?: string;
  studentProfile?: ChildProfileDto;
  children?: ChildProfileDto[];
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: Extract<UserRole, 'STUDENT' | 'PARENT'>;
}

export interface LevelWorkSummary {
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
}

export interface StudentDashboard {
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
    taskTitle?: string;
    taskType: string;
    isCorrect: boolean;
    score: number;
    createdAt: string;
  }[];
  completion: {
    completedCount: number;
    totalLevels: number;
    percent: number;
    levels: LevelWorkSummary[];
  };
  pending: {
    ready: LevelWorkSummary[];
    upcoming: LevelWorkSummary[];
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
