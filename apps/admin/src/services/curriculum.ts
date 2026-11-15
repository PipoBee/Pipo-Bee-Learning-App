import { AuthAPI } from './api';
import { supabase } from '../utils/supabase';

export type Band = 'beginner' | 'intermediate' | 'advanced';
export type LessonStatus = 'locked' | 'ready' | 'in_progress' | 'completed';

export type CurriculumLevel = {
  id: string;
  code: string;
  title: string;
  band: Band;
  orderIndex: number;
  description: string;
  unlockScore: number;
};

export type CurriculumLesson = {
  id: string;
  code: string;
  title: string;
  orderIndex: number;
  description: string;
  letterKey: string | null;
  unitId: string;
  unitTitle: string;
  levelCode: string;
  status: LessonStatus;
  bestScore: number;
  starsEarned: number;
};

export type StudentLearnData = {
  displayName: string;
  totalStars: number;
  streakDays: number;
  levels: CurriculumLevel[];
  lessons: CurriculumLesson[];
  completedCount: number;
  totalLessons: number;
  percent: number;
  currentLesson: CurriculumLesson | null;
  overallAccuracy: number;
};

const UNLOCK_SCORE = 80;

function mapStatus(raw: string | null | undefined): LessonStatus {
  if (raw === 'ready' || raw === 'in_progress' || raw === 'completed' || raw === 'locked') {
    return raw;
  }
  return 'locked';
}

function deriveStatuses(
  lessons: Omit<CurriculumLesson, 'status' | 'bestScore' | 'starsEarned'>[],
  progressByLesson: Map<string, { status: string; best_score: number; stars_earned: number }>,
): CurriculumLesson[] {
  return lessons.map((lesson, index) => {
    const progress = progressByLesson.get(lesson.id);
    const bestScore = progress?.best_score ?? 0;
    const starsEarned = progress?.stars_earned ?? 0;
    let status = mapStatus(progress?.status);

    if (bestScore >= UNLOCK_SCORE) {
      status = 'completed';
    } else if (index === 0) {
      status = status === 'locked' ? 'ready' : status;
    } else {
      const prev = progressByLesson.get(lessons[index - 1].id);
      const prevBest = prev?.best_score ?? 0;
      const prevDone = prevBest >= UNLOCK_SCORE || prev?.status === 'completed';
      if (!prevDone) {
        status = 'locked';
      } else if (status === 'locked') {
        status = 'ready';
      }
    }

    return { ...lesson, status, bestScore, starsEarned };
  });
}

export const CurriculumAPI = {
  async getLearnData(): Promise<StudentLearnData> {
    const user = AuthAPI.getStoredUser();
    if (!user) {
      throw new Error('Please sign in to see your progress');
    }

    const [levelsRes, progressRes, streakRes, profileRes] = await Promise.all([
      supabase
        .from('levels')
        .select('id, code, title, band, order_index, description, unlock_score')
        .order('order_index'),
      supabase
        .from('lesson_progress')
        .select('lesson_id, status, best_score, stars_earned')
        .eq('user_id', user.id),
      supabase.from('streaks').select('current_days').eq('user_id', user.id).maybeSingle(),
      supabase.from('users').select('full_name, total_stars').eq('id', user.id).maybeSingle(),
    ]);

    if (levelsRes.error) throw new Error(levelsRes.error.message);
    if (progressRes.error) throw new Error(progressRes.error.message);

    const levels: CurriculumLevel[] = (levelsRes.data || []).map((row) => ({
      id: row.id,
      code: row.code,
      title: row.title,
      band: row.band as Band,
      orderIndex: row.order_index,
      description: row.description,
      unlockScore: row.unlock_score,
    }));

    const levelOne = levels.find((level) => level.code === 'L1');
    if (!levelOne) throw new Error('Level 1 is missing. Run the curriculum seed.');

    const unitsRes = await supabase
      .from('units')
      .select('id, title, code')
      .eq('level_id', levelOne.id)
      .eq('code', 'alphabet')
      .maybeSingle();

    if (unitsRes.error) throw new Error(unitsRes.error.message);
    if (!unitsRes.data) throw new Error('Level 1 alphabet unit is missing. Run the curriculum seed.');

    const lessonsRes = await supabase
      .from('lessons')
      .select('id, code, title, order_index, description, letter_key, unit_id')
      .eq('unit_id', unitsRes.data.id)
      .order('order_index');

    if (lessonsRes.error) throw new Error(lessonsRes.error.message);

    const progressByLesson = new Map(
      (progressRes.data || []).map((row) => [
        row.lesson_id as string,
        {
          status: row.status as string,
          best_score: row.best_score as number,
          stars_earned: row.stars_earned as number,
        },
      ]),
    );

    const l1LessonsRaw = (lessonsRes.data || []).map((row) => ({
      id: row.id as string,
      code: row.code as string,
      title: row.title as string,
      orderIndex: row.order_index as number,
      description: row.description as string,
      letterKey: (row.letter_key as string | null) ?? null,
      unitId: row.unit_id as string,
      unitTitle: unitsRes.data!.title as string,
      levelCode: 'L1',
    }));

    const lessons = deriveStatuses(l1LessonsRaw, progressByLesson);

    // Ensure first ready lesson has a progress row (non-destructive upsert)
    const firstReady = lessons.find((l) => l.status === 'ready' || l.status === 'in_progress');
    if (firstReady && !progressByLesson.has(firstReady.id)) {
      await supabase.from('lesson_progress').upsert(
        {
          user_id: user.id,
          lesson_id: firstReady.id,
          status: 'ready',
          best_score: 0,
          stars_earned: 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,lesson_id' },
      );
    }

    if (!streakRes.error && !streakRes.data) {
      await supabase.from('streaks').upsert(
        {
          user_id: user.id,
          current_days: 0,
          longest_days: 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );
    }

    const completedCount = lessons.filter((l) => l.status === 'completed').length;
    const totalLessons = lessons.length || 1;
    const percent = Math.round((completedCount / totalLessons) * 100);
    const scored = lessons.filter((l) => l.bestScore > 0);
    const overallAccuracy =
      scored.length > 0
        ? Math.round(scored.reduce((sum, l) => sum + l.bestScore, 0) / scored.length)
        : 0;

    return {
      displayName: profileRes.data?.full_name || user.fullName,
      totalStars: profileRes.data?.total_stars ?? lessons.reduce((sum, l) => sum + l.starsEarned, 0),
      streakDays: streakRes.data?.current_days ?? 0,
      levels,
      lessons,
      completedCount,
      totalLessons: lessons.length,
      percent,
      currentLesson: lessons.find((l) => l.status === 'ready' || l.status === 'in_progress') || null,
      overallAccuracy,
    };
  },

  toDashboardShape(data: StudentLearnData) {
    const levels = data.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      subtitle: lesson.description,
      soundLabel: lesson.letterKey || lesson.code,
      worldTitle: 'Level 1 · Letter Sounds',
      isTestLevel: false,
      isUnlocked: lesson.status !== 'locked',
      isCompleted: lesson.status === 'completed',
      starsEarned: lesson.starsEarned,
      highScore: lesson.bestScore,
    }));

    return {
      displayName: data.displayName,
      avatarId: 'pipo',
      totalStars: data.totalStars,
      totalCoins: data.totalStars,
      streakDays: data.streakDays,
      currentLevelTitle: data.currentLesson?.title || 'Letter Sounds',
      overallAccuracy: data.overallAccuracy,
      completion: {
        completedCount: data.completedCount,
        totalLevels: data.totalLessons,
        percent: data.percent,
        levels,
      },
      pending: {
        ready: levels.filter((l) => l.isUnlocked && !l.isCompleted).slice(0, 3),
        upcoming: levels.filter((l) => !l.isUnlocked).slice(0, 5),
      },
    };
  },
};
