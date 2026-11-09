import { World } from '@phonicsquest/shared';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

export interface SyncResult {
  synced: boolean;
  message: string;
}

export const ApiSyncService = {
  getApiBaseUrl: (): string => API_BASE,

  // Download latest curriculum bundle from local API
  downloadCurriculumBundle: async (): Promise<World[] | null> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${API_BASE}/content/bundle`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) return null;
      const data = await res.json();
      return data.worlds || null;
    } catch {
      // Offline fallback: keep pre-bundled curriculum
      return null;
    }
  },

  // Submit offline queued attempts and level progress to API
  pushProgress: async (
    studentId: string,
    levelId: string,
    stars: number,
    score: number
  ): Promise<SyncResult> => {
    try {
      const clientId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const payload = {
        studentId,
        attempts: [
          {
            clientId,
            taskId: `task_${levelId}`,
            isCorrect: true,
            score,
            durationMs: 4500,
            attemptNumber: 1,
            createdAt: new Date().toISOString(),
          },
        ],
        progressUpdates: [
          {
            levelId,
            isCompleted: true,
            starsEarned: stars,
            highScore: score,
          },
        ],
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`${API_BASE}/sync/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return { synced: true, message: 'Synced to local API database' };
      }
      return { synced: false, message: 'Server error, saved locally' };
    } catch {
      return { synced: false, message: 'Offline mode: progress saved locally' };
    }
  },
};
