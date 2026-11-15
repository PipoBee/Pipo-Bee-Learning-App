import React, { useState } from 'react';
import { Award, CheckCircle2, Flame, Lock, Sparkles, Star, Target, Trophy, Volume2 } from 'lucide-react';

/** Kept for admin/parent screens that still map avatar ids. */
export const AVATAR_EMOJI: Record<string, string> = {
  parrot_01: 'P',
  mascot_parrot_01: 'P',
  owl_01: 'O',
  fox_01: 'F',
  bear_01: 'B',
  bunny_01: 'B',
};

export type LevelWork = {
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

export type DashboardData = {
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
  data: DashboardData;
  heading?: string;
  onPlayLevel?: () => void;
  compactHeader?: boolean;
}

type PanelTab = 'mastery' | 'upnext' | 'completed';

export const StudentProgressPanel: React.FC<Props> = ({
  data,
  heading,
  onPlayLevel,
  compactHeader = false,
}) => {
  const completion = data.completion || { completedCount: 0, totalLevels: 0, percent: 0, levels: [] };
  const pending = data.pending || { ready: [], upcoming: [] };
  const mastery = data.soundMastery || [];
  const initial = (data.displayName?.trim()?.[0] || 'P').toUpperCase();

  const defaultTab: PanelTab =
    mastery.length > 0 ? 'mastery' : pending.ready.length > 0 ? 'upnext' : 'completed';
  const [tab, setTab] = useState<PanelTab>(defaultTab);

  return (
    <div className="spp-root">
      {!compactHeader && (
        <div className="spp-banner">
          <div className="spp-banner-glow" aria-hidden="true" />
          <div className="spp-avatar" aria-hidden="true">
            <span>{initial}</span>
            <span className="spp-avatar-ring" />
          </div>
          <div className="spp-banner-info">
            <div className="spp-banner-top">
              <h2 className="spp-name">{heading || data.displayName}</h2>
              <span className="spp-streak">
                <Flame size={14} strokeWidth={2.4} aria-hidden="true" />
                {data.streakDays} Day Streak
              </span>
            </div>
            <p className="spp-focus">
              {data.age ? `Age ${data.age} • ` : ''}
              Current focus: <strong>{data.currentLevelTitle}</strong>
            </p>
          </div>
          <div className="spp-ring-wrap" aria-label={`${completion.percent}% course complete`}>
            <svg className="spp-ring" viewBox="0 0 64 64">
              <circle className="spp-ring-track" cx="32" cy="32" r="26" />
              <circle
                className="spp-ring-fill"
                cx="32"
                cy="32"
                r="26"
                strokeDasharray={`${Math.round((completion.percent / 100) * 163.36)} 163.36`}
              />
            </svg>
            <div className="spp-ring-label">
              <strong>{completion.percent}%</strong>
              <span>Done</span>
            </div>
          </div>
        </div>
      )}

      {/* Rich 4-card KPI Bento Row */}
      <div className="spp-kpi-grid">
        <div className="spp-kpi-card spp-kpi-honey">
          <div className="spp-kpi-icon">
            <Star size={20} strokeWidth={2.3} aria-hidden="true" />
          </div>
          <div className="spp-kpi-body">
            <div className="spp-kpi-value">{data.totalStars}</div>
            <div className="spp-kpi-label">Total Stars</div>
          </div>
          <Sparkles className="spp-kpi-watermark" size={44} strokeWidth={1.5} aria-hidden="true" />
        </div>

        <div className="spp-kpi-card spp-kpi-mint">
          <div className="spp-kpi-icon">
            <Trophy size={20} strokeWidth={2.3} aria-hidden="true" />
          </div>
          <div className="spp-kpi-body">
            <div className="spp-kpi-value">{data.totalCoins}</div>
            <div className="spp-kpi-label">Earned Coins</div>
          </div>
          <Award className="spp-kpi-watermark" size={44} strokeWidth={1.5} aria-hidden="true" />
        </div>

        <div className="spp-kpi-card spp-kpi-sky">
          <div className="spp-kpi-icon">
            <Target size={20} strokeWidth={2.3} aria-hidden="true" />
          </div>
          <div className="spp-kpi-body">
            <div className="spp-kpi-value">{data.overallAccuracy}%</div>
            <div className="spp-kpi-label">Accuracy</div>
          </div>
          <Target className="spp-kpi-watermark" size={44} strokeWidth={1.5} aria-hidden="true" />
        </div>

        <div className="spp-kpi-card spp-kpi-blossom">
          <div className="spp-kpi-icon">
            <CheckCircle2 size={20} strokeWidth={2.3} aria-hidden="true" />
          </div>
          <div className="spp-kpi-body">
            <div className="spp-kpi-value">
              {completion.completedCount}
              <span className="spp-kpi-denom">/{completion.totalLevels || 26}</span>
            </div>
            <div className="spp-kpi-label">Levels Done</div>
          </div>
          <CheckCircle2 className="spp-kpi-watermark" size={44} strokeWidth={1.5} aria-hidden="true" />
        </div>
      </div>

      {/* Practice Boost Strip (if weak words exist) */}
      {data.weakWords && data.weakWords.length > 0 && (
        <div className="spp-boost-strip">
          <div className="spp-boost-head">
            <span className="spp-boost-dot" aria-hidden="true" />
            <strong>Practice boost:</strong>
            <span>tricky words to review</span>
          </div>
          <div className="spp-boost-chips">
            {data.weakWords.slice(0, 6).map((word) => (
              <span key={word} className="spp-boost-chip">{word}</span>
            ))}
          </div>
        </div>
      )}

      {/* Segmented Activity & Mastery Card (replaces 3 long stacked sections) */}
      <section className="spp-card">
        <div className="spp-card-head">
          <div className="spp-seg" role="tablist" aria-label="Progress details">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'mastery'}
              className={`spp-seg-btn${tab === 'mastery' ? ' is-on' : ''}`}
              onClick={() => setTab('mastery')}
            >
              <Volume2 size={15} strokeWidth={2.3} aria-hidden="true" />
              Sound Mastery
              <span className="spp-seg-count">{mastery.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'upnext'}
              className={`spp-seg-btn${tab === 'upnext' ? ' is-on' : ''}`}
              onClick={() => setTab('upnext')}
            >
              <Sparkles size={15} strokeWidth={2.3} aria-hidden="true" />
              Up Next
              <span className="spp-seg-count">{pending.ready.length + pending.upcoming.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'completed'}
              className={`spp-seg-btn${tab === 'completed' ? ' is-on' : ''}`}
              onClick={() => setTab('completed')}
            >
              <CheckCircle2 size={15} strokeWidth={2.3} aria-hidden="true" />
              Completed
              <span className="spp-seg-count">{completion.levels.length}</span>
            </button>
          </div>
        </div>

        {tab === 'mastery' && (
          <div className="spp-panel">
            {mastery.length > 0 ? (
              <div className="spp-mastery-grid">
                {mastery.map((item) => {
                  const pct = Math.round(item.masteryScore * 100);
                  const isWeak = item.isWeak || pct < 65;
                  const tone = isWeak ? 'weak' : pct >= 85 ? 'mastered' : 'good';
                  return (
                    <div key={item.phoneme} className={`spp-sound-tile spp-sound-${tone}`}>
                      <div className="spp-sound-top">
                        <span className="spp-sound-badge">/{item.phoneme}/</span>
                        <span className="spp-sound-pct">{pct}%</span>
                      </div>
                      <div className="spp-sound-bar">
                        <div className="spp-sound-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="spp-sound-meta">
                        <span>{isWeak ? 'Needs practice' : pct >= 85 ? 'Mastered' : 'Growing'}</span>
                        <span>{item.attempts} tries</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="spp-empty">
                <div className="spp-empty-badge" aria-hidden="true">Aa</div>
                <div>
                  <strong>No sound attempts yet</strong>
                  <p>Start your first unlocked lesson to light up your sound mastery board.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'upnext' && (
          <div className="spp-panel">
            {pending.ready.length === 0 && pending.upcoming.length === 0 ? (
              <div className="spp-empty">
                <strong>All caught up!</strong>
                <p>Every lesson in this world is complete.</p>
              </div>
            ) : (
              <div className="spp-level-grid">
                {pending.ready.map((level) => (
                  <CompactLevelCard key={level.id} level={level} tone="ready" onPlay={onPlayLevel} />
                ))}
                {pending.upcoming.slice(0, 6).map((level) => (
                  <CompactLevelCard key={level.id} level={level} tone="locked" />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'completed' && (
          <div className="spp-panel">
            {completion.levels.length === 0 ? (
              <div className="spp-empty">
                <strong>No completed levels yet</strong>
                <p>Finish a lesson to earn stars and see your trophies here.</p>
              </div>
            ) : (
              <div className="spp-level-grid">
                {completion.levels.map((level) => (
                  <CompactLevelCard key={level.id} level={level} tone="done" onPlay={onPlayLevel} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

const CompactLevelCard: React.FC<{
  level: LevelWork;
  tone: 'done' | 'ready' | 'locked';
  onPlay?: () => void;
}> = ({ level, tone, onPlay }) => {
  const canPlay =
    Boolean(onPlay) &&
    (level.soundLabel === 's' ||
      level.title?.includes('/s/') ||
      level.title?.toLowerCase().includes('alphabet') ||
      tone === 'ready');

  return (
    <div className={`spp-lcard spp-lcard-${tone}`}>
      <div className="spp-lcard-badge">{level.soundLabel}</div>
      <div className="spp-lcard-info">
        <div className="spp-lcard-title-row">
          <strong>{level.title}</strong>
          {level.isTestLevel && <span className="spp-test-tag">Test</span>}
        </div>
        <span className="spp-lcard-sub">
          {level.worldTitle} • {level.subtitle}
        </span>
      </div>
      {canPlay ? (
        <button type="button" onClick={onPlay} className="spp-lcard-btn">
          {tone === 'done' ? 'Replay' : 'Play'}
        </button>
      ) : (
        <span className={`spp-lcard-pill spp-lcard-pill-${tone}`}>
          {tone === 'done' ? (
            `${'★'.repeat(Math.max(1, level.starsEarned || 1))}`
          ) : tone === 'ready' ? (
            'Ready'
          ) : (
            <Lock size={13} strokeWidth={2.2} aria-hidden="true" />
          )}
        </span>
      )}
    </div>
  );
};
