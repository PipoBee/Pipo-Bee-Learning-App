import React from 'react';
import { CheckCircle2, Flame, Lock, Star, Target, Trophy } from 'lucide-react';

/** Kept for admin/parent screens that still map avatar ids. */
export const AVATAR_EMOJI: Record<string, string> = {
  parrot_01: 'P',
  mascot_parrot_01: 'P',
  owl_01: 'O',
  fox_01: 'F',
  bear_01: 'B',
  bunny_01: 'B',
};

type LevelWork = {
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
};

type Dashboard = {
  displayName: string;
  avatarId: string;
  age?: number;
  totalStars: number;
  totalCoins: number;
  streakDays: number;
  currentLevelTitle: string;
  overallAccuracy: number;
  soundMastery?: {
    phoneme: string;
    masteryScore: number;
    attempts: number;
    isWeak: boolean;
  }[];
  weakWords?: string[];
  completion?: {
    completedCount: number;
    totalLevels: number;
    percent: number;
    levels: LevelWork[];
  };
  pending?: {
    ready: LevelWork[];
    upcoming: LevelWork[];
  };
};

interface Props {
  data: Dashboard;
  heading?: string;
  onPlayLevel?: () => void;
}

export const StudentProgressPanel: React.FC<Props> = ({ data, heading, onPlayLevel }) => {
  const completion = data.completion || { completedCount: 0, totalLevels: 0, percent: 0, levels: [] };
  const pending = data.pending || { ready: [], upcoming: [] };
  const initial = (data.displayName?.trim()?.[0] || 'P').toUpperCase();

  return (
    <div style={styles.container}>
      <div style={styles.studentBanner}>
        <div style={styles.avatarCircle} aria-hidden="true">{initial}</div>
        <div style={styles.studentInfo}>
          <div style={styles.studentTitleRow}>
            <h2 style={styles.studentName}>{heading || data.displayName}</h2>
            <span style={styles.streakBadge}>
              <Flame size={14} strokeWidth={2.2} aria-hidden="true" />
              {data.streakDays} Day Streak
            </span>
          </div>
          <p style={styles.studentSubtitle}>
            {data.age ? `Age ${data.age} • ` : ''}
            Current focus: {data.currentLevelTitle}
          </p>
        </div>
      </div>

      <div style={styles.kpiGrid}>
        <Kpi icon={<Star size={22} strokeWidth={2.2} aria-hidden="true" />} value={data.totalStars} label="Total Stars" />
        <Kpi icon={<Trophy size={22} strokeWidth={2.2} aria-hidden="true" />} value={data.totalCoins} label="Earned Coins" />
        <Kpi icon={<Target size={22} strokeWidth={2.2} aria-hidden="true" />} value={`${data.overallAccuracy}%`} label="Accuracy" />
        <Kpi icon={<CheckCircle2 size={22} strokeWidth={2.2} aria-hidden="true" />} value={`${completion.percent}%`} label="Course Complete" />
      </div>

      {data.weakWords && data.weakWords.length > 0 && (
        <div style={styles.alertCard}>
          <div>
            <h3 style={styles.alertTitle}>Needs practice</h3>
            <p style={styles.alertDesc}>These words are linked to weaker sounds.</p>
          </div>
          <div style={styles.weakWordChips}>
            {data.weakWords.map((word) => (
              <span key={word} style={styles.weakWordChip}>{word}</span>
            ))}
          </div>
        </div>
      )}

      <section style={styles.sectionCard}>
        <h3 style={styles.sectionTitle}>Progress</h3>
        <p style={styles.sectionSubtitle}>Sound accuracy and current mastery.</p>
        {data.soundMastery && data.soundMastery.length > 0 ? (
          <div style={styles.masteryGrid}>
            {data.soundMastery.map((item) => {
              const pct = Math.round(item.masteryScore * 100);
              const isWeak = item.isWeak || pct < 65;
              return (
                <div key={item.phoneme} style={styles.masteryItem}>
                  <div style={styles.masteryTopRow}>
                    <div style={styles.soundCircle}>/{item.phoneme}/</div>
                    <div>
                      <span style={styles.masteryPercent}>{pct}%</span>
                      <span style={styles.masteryAttempts}>{item.attempts} attempts</span>
                    </div>
                  </div>
                  <div style={styles.progressBarTrack}>
                    <div
                      style={{
                        ...styles.progressBarFill,
                        width: `${pct}%`,
                        backgroundColor: isWeak ? 'var(--danger)' : pct >= 85 ? 'var(--leaf)' : 'var(--honey)',
                      }}
                    />
                  </div>
                  <div style={styles.masteryStatus}>
                    {isWeak ? (
                      <span style={styles.statusWeak}>Needs Practice</span>
                    ) : pct >= 85 ? (
                      <span style={styles.statusMastered}>Mastered</span>
                    ) : (
                      <span style={styles.statusProficient}>Proficient</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>No sound attempts yet. Start the first unlocked lesson.</div>
        )}
      </section>

      <section style={styles.sectionCard}>
        <div style={styles.sectionHead}>
          <div>
            <h3 style={styles.sectionTitle}>Completion</h3>
            <p style={styles.sectionSubtitle}>
              {completion.completedCount} of {completion.totalLevels} levels finished
            </p>
          </div>
          <span style={styles.countPill}>{completion.percent}%</span>
        </div>
        {completion.levels.length === 0 ? (
          <div style={styles.emptyState}>No levels completed yet.</div>
        ) : (
          <div style={styles.levelList}>
            {completion.levels.map((level) => (
              <LevelRow key={level.id} level={level} tone="done" onPlay={onPlayLevel} />
            ))}
          </div>
        )}
      </section>

      <section style={styles.sectionCard}>
        <h3 style={styles.sectionTitle}>Pending work</h3>
        <p style={styles.sectionSubtitle}>Ready now, then upcoming locked lessons.</p>
        {pending.ready.length === 0 && pending.upcoming.length === 0 ? (
          <div style={styles.emptyState}>All caught up — no pending lessons.</div>
        ) : (
          <div style={styles.levelList}>
            {pending.ready.map((level) => (
              <LevelRow key={level.id} level={level} tone="ready" onPlay={onPlayLevel} />
            ))}
            {pending.upcoming.map((level) => (
              <LevelRow key={level.id} level={level} tone="locked" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const Kpi: React.FC<{ icon: React.ReactNode; value: string | number; label: string }> = ({
  icon,
  value,
  label,
}) => (
  <div style={styles.kpiCard}>
    <span style={styles.kpiIcon}>{icon}</span>
    <div>
      <div style={styles.kpiValue}>{value}</div>
      <div style={styles.kpiLabel}>{label}</div>
    </div>
  </div>
);

const LevelRow: React.FC<{
  level: LevelWork;
  tone: 'done' | 'ready' | 'locked';
  onPlay?: () => void;
}> = ({ level, tone, onPlay }) => {
  const canPlay = Boolean(onPlay) && (level.soundLabel === 's' || level.title?.includes('/s/') || level.title?.toLowerCase().includes('alphabet'));

  return (
    <div style={styles.levelRow}>
      <div style={styles.soundBadge}>{level.soundLabel}</div>
      <div style={{ flex: 1 }}>
        <div style={styles.levelTitleRow}>
          <strong>{level.title}</strong>
          {level.isTestLevel && <span style={styles.testBadge}>Test</span>}
        </div>
        <p style={styles.levelMeta}>
          {level.worldTitle} • {level.subtitle}
        </p>
      </div>
      {canPlay ? (
        <button onClick={onPlay} style={styles.playChip}>
          {tone === 'done' ? 'Practice' : 'Play'}
        </button>
      ) : (
        <span
          style={{
            ...styles.statusChip,
            backgroundColor: tone === 'done' ? 'var(--mint)' : tone === 'ready' ? 'var(--sky)' : 'var(--mist)',
            color: 'var(--forest)',
          }}
        >
          {tone === 'done'
            ? `${level.starsEarned || 1} star${(level.starsEarned || 1) === 1 ? '' : 's'} • Done`
            : tone === 'ready'
              ? 'Ready now'
              : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Lock size={12} strokeWidth={2.2} aria-hidden="true" /> Locked
                </span>
              )}
        </span>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  studentBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    backgroundColor: 'var(--white)',
    padding: '24px',
    borderRadius: '26px',
    border: '1px solid var(--mist)',
    boxShadow: 'var(--shadow-card)',
  },
  avatarCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '32px',
    backgroundColor: 'var(--honey)',
    color: 'var(--forest)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    fontWeight: 700,
  },
  studentInfo: {
    flex: 1,
  },
  studentTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  studentName: {
    fontSize: '24px',
    fontWeight: 600,
    color: 'var(--forest)',
  },
  streakBadge: {
    backgroundColor: 'var(--meadow)',
    color: 'var(--forest)',
    fontWeight: 600,
    fontSize: '12px',
    padding: '6px 10px',
    borderRadius: '999px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  },
  studentSubtitle: {
    fontSize: '14px',
    color: 'var(--muted)',
    marginTop: '4px',
    fontWeight: 500,
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  kpiCard: {
    backgroundColor: 'var(--white)',
    padding: '20px',
    borderRadius: '18px',
    border: '1px solid var(--mist)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: 'var(--shadow-card)',
  },
  kpiIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: 'var(--meadow)',
    color: 'var(--forest)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    fontSize: '26px',
    fontWeight: 700,
    color: 'var(--forest)',
  },
  kpiLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--muted)',
  },
  alertCard: {
    backgroundColor: 'var(--danger-soft)',
    borderRadius: '18px',
    padding: '20px 24px',
  },
  alertTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--danger)',
  },
  alertDesc: {
    fontSize: '14px',
    color: 'var(--danger)',
    marginTop: '4px',
  },
  weakWordChips: {
    display: 'flex',
    gap: '10px',
    marginTop: '14px',
    flexWrap: 'wrap',
  },
  weakWordChip: {
    backgroundColor: 'var(--white)',
    color: 'var(--danger)',
    fontWeight: 700,
    fontSize: '14px',
    padding: '6px 14px',
    borderRadius: '999px',
  },
  sectionCard: {
    backgroundColor: 'var(--white)',
    borderRadius: '26px',
    padding: '24px',
    border: '1px solid var(--mist)',
    boxShadow: 'var(--shadow-card)',
  },
  sectionHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--forest)',
  },
  sectionSubtitle: {
    fontSize: '13px',
    color: 'var(--muted)',
    marginTop: '4px',
    marginBottom: '16px',
  },
  countPill: {
    backgroundColor: 'var(--honey)',
    color: 'var(--forest)',
    fontWeight: 700,
    fontSize: '13px',
    padding: '6px 12px',
    borderRadius: '999px',
  },
  masteryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  masteryItem: {
    backgroundColor: 'var(--meadow)',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid var(--mist)',
  },
  masteryTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  soundCircle: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--forest)',
    backgroundColor: 'var(--sky)',
    padding: '6px 12px',
    borderRadius: '10px',
  },
  masteryPercent: {
    display: 'block',
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--forest)',
    textAlign: 'right',
  },
  masteryAttempts: {
    display: 'block',
    fontSize: '11px',
    color: 'var(--muted)',
    textAlign: 'right',
  },
  progressBarTrack: {
    height: '8px',
    backgroundColor: 'var(--mist)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '4px',
  },
  masteryStatus: {
    fontSize: '12px',
    fontWeight: 700,
  },
  statusWeak: { color: 'var(--danger)' },
  statusMastered: { color: 'var(--leaf)' },
  statusProficient: { color: 'var(--deep-leaf)' },
  emptyState: {
    padding: '20px',
    textAlign: 'center',
    color: 'var(--muted)',
    fontSize: '14px',
  },
  levelList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  levelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '12px 14px',
    borderRadius: '18px',
    backgroundColor: 'var(--meadow)',
    border: '1px solid var(--mist)',
  },
  soundBadge: {
    width: '42px',
    height: '42px',
    borderRadius: '21px',
    backgroundColor: 'var(--honey)',
    color: 'var(--forest)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: 700,
  },
  levelTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  levelMeta: {
    fontSize: '12px',
    color: 'var(--muted)',
    marginTop: '2px',
  },
  testBadge: {
    backgroundColor: 'var(--mint)',
    color: 'var(--forest)',
    fontWeight: 700,
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '999px',
  },
  statusChip: {
    fontSize: '12px',
    fontWeight: 700,
    padding: '6px 10px',
    borderRadius: '999px',
    whiteSpace: 'nowrap',
  },
  playChip: {
    fontSize: '12px',
    fontWeight: 700,
    padding: '10px 14px',
    borderRadius: '999px',
    backgroundColor: 'var(--forest)',
    color: 'var(--white)',
    minHeight: 44,
  },
};
