import { create } from 'zustand';
import { INITIAL_CURRICULUM, Level, StudentProgress, World } from '@phonicsquest/shared';
import { ApiSyncService } from '../services/apiSync';

interface GameState {
  worlds: World[];
  activeLevelId: string | null;
  progress: Record<string, StudentProgress>;
  totalStars: number;
  totalCoins: number;
  streakDays: number;
  soundEnabled: boolean;
  isSpeechLabOpen: boolean;
  isAlphabetSoundsOpen: boolean;
  isOnlineSynced: boolean;
  
  // Actions
  setActiveLevelId: (levelId: string | null) => void;
  getActiveLevel: () => Level | null;
  completeLevel: (levelId: string, stars: number, score: number) => { newStars: number; newCoins: number };
  toggleSound: () => void;
  setSpeechLabOpen: (open: boolean) => void;
  setAlphabetSoundsOpen: (open: boolean) => void;
  resetProgress: () => void;
  syncWithBackend: () => Promise<void>;
}

const STORAGE_KEY = 'phonicsquest_progress_v1';

const getInitialProgress = (): Record<string, StudentProgress> => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore parse error
    }
  }

  // Initial progression state: Level 1 unlocked, all other 14 levels locked
  const defaultMap: Record<string, StudentProgress> = {};
  for (const w of INITIAL_CURRICULUM) {
    for (const lvl of w.levels) {
      defaultMap[lvl.id] = {
        levelId: lvl.id,
        isUnlocked: lvl.orderIndex === 1,
        isCompleted: false,
        starsEarned: 0,
        highScore: 0,
        attemptsCount: 0,
      };
    }
  }
  return defaultMap;
};

const saveProgressToStorage = (progress: Record<string, StudentProgress>) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore
    }
  }
};

export const useGameStore = create<GameState>((set, get) => {
  const initialProgress = getInitialProgress();
  
  const calcStars = (prog: Record<string, StudentProgress>) =>
    Object.values(prog).reduce((acc, curr) => acc + curr.starsEarned, 0);

  return {
    worlds: INITIAL_CURRICULUM,
    activeLevelId: null,
    progress: initialProgress,
    totalStars: calcStars(initialProgress),
    totalCoins: calcStars(initialProgress) * 15,
    streakDays: 3,
    soundEnabled: true,
    isSpeechLabOpen: false,
    isAlphabetSoundsOpen: false,
    isOnlineSynced: false,

    setActiveLevelId: (levelId) => set({ activeLevelId: levelId, isAlphabetSoundsOpen: false }),

    setSpeechLabOpen: (open) => set({ isSpeechLabOpen: open }),

    setAlphabetSoundsOpen: (open) => set({ isAlphabetSoundsOpen: open, activeLevelId: null }),

    getActiveLevel: () => {
      const { worlds, activeLevelId } = get();
      if (!activeLevelId) return null;
      for (const world of worlds) {
        const found = world.levels.find((l) => l.id === activeLevelId);
        if (found) return found;
      }
      return null;
    },

    completeLevel: (levelId, stars, score) => {
      const { progress, worlds } = get();
      const current = progress[levelId] || {
        levelId,
        isUnlocked: true,
        isCompleted: false,
        starsEarned: 0,
        highScore: 0,
        attemptsCount: 0,
      };

      const starsEarned = Math.max(current.starsEarned, stars);
      const highScore = Math.max(current.highScore, score);
      const attemptsCount = current.attemptsCount + 1;

      const updatedProgress: Record<string, StudentProgress> = {
        ...progress,
        [levelId]: {
          ...current,
          isCompleted: true,
          starsEarned,
          highScore,
          attemptsCount,
          lastAttemptAt: new Date().toISOString(),
        },
      };

      const newTotalStars = calcStars(updatedProgress);

      // Unlock subsequent level in progression
      let allLevels: Level[] = [];
      worlds.forEach((w) => allLevels.push(...w.levels));
      allLevels.sort((a, b) => a.orderIndex - b.orderIndex);

      allLevels.forEach((lvl) => {
        if (newTotalStars >= lvl.requiredStars) {
          if (updatedProgress[lvl.id]) {
            updatedProgress[lvl.id].isUnlocked = true;
          } else {
            updatedProgress[lvl.id] = {
              levelId: lvl.id,
              isUnlocked: true,
              isCompleted: false,
              starsEarned: 0,
              highScore: 0,
              attemptsCount: 0,
            };
          }
        }
      });

      saveProgressToStorage(updatedProgress);

      const coinReward = stars * 10;
      set((state) => ({
        progress: updatedProgress,
        totalStars: newTotalStars,
        totalCoins: state.totalCoins + coinReward,
      }));

      // Background sync to NestJS PostgreSQL API (idempotent)
      ApiSyncService.pushProgress('learner-leo-profile-client-id', levelId, starsEarned, highScore).then(
        (res) => {
          if (res.synced) {
            set({ isOnlineSynced: true });
          }
        }
      );

      return { newStars: starsEarned, newCoins: coinReward };
    },

    toggleSound: () =>
      set((state) => ({
        soundEnabled: !state.soundEnabled,
      })),

    resetProgress: () => {
      const defaultMap: Record<string, StudentProgress> = {};
      const { worlds } = get();
      for (const w of worlds) {
        for (const lvl of w.levels) {
          defaultMap[lvl.id] = {
            levelId: lvl.id,
            isUnlocked: lvl.orderIndex === 1,
            isCompleted: false,
            starsEarned: 0,
            highScore: 0,
            attemptsCount: 0,
          };
        }
      }
      saveProgressToStorage(defaultMap);
      set({
        progress: defaultMap,
        totalStars: 0,
        totalCoins: 0,
        activeLevelId: null,
      });
    },

    syncWithBackend: async () => {
      const remoteWorlds = await ApiSyncService.downloadCurriculumBundle();
      if (remoteWorlds && remoteWorlds.length > 0) {
        set({ worlds: remoteWorlds, isOnlineSynced: true });
      }
    },
  };
});
