export interface SyncAttemptDto {
  clientId: string;
  taskId: string;
  taskItemId: string;
  isCorrect: boolean;
  score: number;
  speechConfidence?: number;
  durationMs: number;
  attemptNumber: number;
  createdAt: string;
}

export interface SyncProgressDto {
  levelId: string;
  isCompleted: boolean;
  starsEarned: number;
  highScore: number;
}

export interface SyncPushRequest {
  studentId: string;
  lastSyncTimestamp?: string;
  attempts: SyncAttemptDto[];
  progressUpdates: SyncProgressDto[];
}

export interface SyncPushResponse {
  success: boolean;
  syncedAttempts: string[];
  syncedLevels: string[];
  syncedAt: string;
}
