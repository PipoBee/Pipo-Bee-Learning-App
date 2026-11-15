import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Flame,
  Lock,
  Mic,
  Pencil,
  Rocket,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Star,
  Volume2,
} from 'lucide-react';
import { DashboardData, StudentProgressPanel } from '../components/StudentProgressPanel';
import { LevelDifficulty } from '../data/levelOne';
import { AuthAPI, StudentAPI } from '../services/api';
import { LevelOneSound } from './LevelOneSound';

const LEVELS = [
  {
    id: 'beginner',
    label: 'Beginner',
    sub: '26 Letter Sounds • CVC Words',
    badge: 'Active',
    locked: false,
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    sub: 'Blends & Digraphs',
    badge: 'Level 2',
    locked: true,
  },
  {
    id: 'advanced',
    label: 'Advanced',
    sub: 'Long Vowels & Stories',
    badge: 'Level 3',
    locked: true,
  },
] as const;

const HOW_CARDS = [
  {
    title: 'Hear it',
    body: 'Tap any letter to hear its pure phonics sound.',
    tone: 'how-bento-honey',
    Icon: Volume2,
  },
  {
    title: 'Choose',
    body: 'Pick Easy, Medium, or Hard practice words.',
    tone: 'how-bento-mint',
    Icon: SlidersHorizontal,
  },
  {
    title: 'Practice',
    body: 'Explore 10 illustrated words per letter.',
    tone: 'how-bento-sky',
    Icon: Pencil,
  },
  {
    title: 'Voice test',
    body: 'Read aloud & spell with the voice coach.',
    tone: 'how-bento-blossom',
    Icon: Mic,
  },
] as const;

export const StudentDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [choosing, setChoosing] = useState(false);
  const [difficulty, setDifficulty] = useState<LevelDifficulty | null>(null);
  const [levelTab, setLevelTab] = useState(0);

  const storedUser = useMemo(() => AuthAPI.getStoredUser(), []);
  const firstName = (data?.displayName || storedUser?.fullName || 'friend').split(' ')[0];

  const loadDashboard = () =>
    StudentAPI.getDashboard()
      .then(setData)
      .catch((err) => setError(err.response?.data?.message || 'Could not load your dashboard'));

  useEffect(() => {
    loadDashboard();
  }, []);

  if (difficulty) {
    return (
      <LevelOneSound
        difficulty={difficulty}
        onExit={() => setDifficulty(null)}
        onCompleted={(next) => {
          setData(next);
        }}
      />
    );
  }

  if (!data && !error) {
    return (
      <div className="sd-page kid-theme">
        <div className="sd-topbar">
          <div>
            <p className="sd-greeting-label">Student Dashboard</p>
            <h1 className="sd-greeting-title">Welcome back</h1>
          </div>
        </div>
        <div className="sd-skeleton" aria-hidden="true" />
      </div>
    );
  }

  const completion = data?.completion || { completedCount: 0, totalLevels: 26, percent: 0, levels: [] };
  const levelOneDone = completion.levels?.some(
    (level) =>
      level.soundLabel === 's' ||
      level.title?.includes('/s/') ||
      level.title?.toLowerCase().includes('alphabet'),
  );
  const readyLevel = data?.pending?.ready?.[0];

  return (
    <div className="sd-page kid-theme">
      {/* Top Welcome Bar with Quick Badges */}
      <header className="sd-topbar fade-up fade-up-1">
        <div className="sd-topbar-left">
          <span className="sd-eyebrow">
            <Sparkles size={13} strokeWidth={2.4} aria-hidden="true" />
            Student Adventures
          </span>
          <h1 className="sd-greeting-title">Welcome back, {firstName}!</h1>
        </div>
        {data && (
          <div className="sd-topbar-pills">
            <div className="sd-stat-pill sd-stat-pill-streak">
              <Flame size={16} strokeWidth={2.4} aria-hidden="true" />
              <strong>{data.streakDays}</strong>
              <span>day streak</span>
            </div>
            <div className="sd-stat-pill sd-stat-pill-stars">
              <Star size={16} strokeWidth={2.4} aria-hidden="true" />
              <strong>{data.totalStars}</strong>
              <span>stars</span>
            </div>
          </div>
        )}
      </header>

      {/* Main Bento Grid: Left = Hero Mission, Right = Level Path + How It Works */}
      <div className="sd-bento-grid fade-up fade-up-2">
        {/* Left: Rich Hero Card */}
        <section className="sd-hero-card" aria-labelledby="next-up-title">
          <div className="sd-hero-orb sd-hero-orb-1" aria-hidden="true" />
          <div className="sd-hero-orb sd-hero-orb-2" aria-hidden="true" />

          <div className="sd-hero-top">
            <div className="sd-hero-badges">
              <span className="sd-next-pill">
                <Sparkles size={12} strokeWidth={2.5} aria-hidden="true" />
                Next Mission
              </span>
              <span className="sd-level-chip">Level 1 • Beginner</span>
            </div>
            <div className="sd-floating-tiles" aria-hidden="true">
              <span className="sd-mini-tile sd-mini-tile-1">/s/</span>
              <span className="sd-mini-tile sd-mini-tile-2">/a/</span>
              <div className="sd-aa-tile">Aa</div>
            </div>
          </div>

          <div className="sd-hero-content">
            <h2 id="next-up-title" className="sd-hero-heading">
              Alphabet Letter Sounds
            </h2>
            <p className="sd-hero-copy">
              Master all 26 letter sounds with interactive voice coaching and 10 illustrated practice words per letter.
              {readyLevel && !levelOneDone ? ` Up next: ${readyLevel.title}.` : ''}
            </p>

            {/* Progress Bar inside Hero */}
            <div className="sd-hero-progress">
              <div className="sd-hero-progress-head">
                <span>Course progress</span>
                <strong>
                  {completion.completedCount} / {completion.totalLevels || 26} completed ({completion.percent}%)
                </strong>
              </div>
              <div className="sd-hero-progress-track">
                <div
                  className="sd-hero-progress-fill"
                  style={{ width: `${Math.max(6, completion.percent)}%` }}
                />
              </div>
            </div>

            <div className="sd-hero-footer">
              <button type="button" className="sd-cta-rich" onClick={() => setChoosing(true)}>
                <span>{levelOneDone ? 'Practice Level 1' : 'Start Level 1'}</span>
                <span className="sd-cta-arrow">
                  <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
                </span>
              </button>
              <div className="sd-hero-tags">
                <span>26 Letters</span>
                <span>•</span>
                <span>260 Words</span>
                <span>•</span>
                <span>Voice AI</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Learning Path + How It Works Bento */}
        <div className="sd-bento-side">
          {/* Level Selector Card */}
          <section className="sd-side-card" aria-labelledby="your-level-title">
            <div className="sd-side-head">
              <h3 id="your-level-title" className="sd-side-title">Learning Path</h3>
              <span className="sd-side-sub">3 Stages</span>
            </div>
            <div className="sd-stage-pills" role="tablist" aria-label="Learning levels">
              {LEVELS.map((level, index) => {
                const selected = levelTab === index;
                return (
                  <button
                    key={level.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setLevelTab(index)}
                    className={`sd-stage-pill${selected ? ' is-on' : ''}${level.locked ? ' is-locked' : ''}`}
                  >
                    <div className="sd-stage-pill-top">
                      <strong>{level.label}</strong>
                      {level.locked ? (
                        <Lock size={13} strokeWidth={2.3} aria-hidden="true" />
                      ) : (
                        <span className="sd-stage-dot" aria-hidden="true" />
                      )}
                    </div>
                    <span className="sd-stage-pill-sub">{level.sub}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2x2 Tactile How It Works Grid */}
          <section className="sd-side-card" aria-labelledby="how-title">
            <div className="sd-side-head">
              <h3 id="how-title" className="sd-side-title">How It Works</h3>
              <span className="sd-side-sub">4 Easy Steps</span>
            </div>
            <div className="how-bento-grid">
              {HOW_CARDS.map((card, index) => (
                <article key={card.title} className={`how-bento-card ${card.tone}`}>
                  <div className="how-bento-top">
                    <span className="how-bento-icon" aria-hidden="true">
                      <card.Icon size={18} strokeWidth={2.3} />
                    </span>
                    <span className="how-bento-step">0{index + 1}</span>
                  </div>
                  <h4 className="how-bento-title">{card.title}</h4>
                  <p className="how-bento-body">{card.body}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      {error && <div className="sd-banner">{error}. Level 1 can still be practiced.</div>}

      {/* Compact Segmented Progress & KPIs */}
      {data && (
        <div className="fade-up fade-up-3">
          <StudentProgressPanel
            data={data}
            compactHeader
            onPlayLevel={() => setChoosing(true)}
          />
        </div>
      )}

      {choosing && (
        <div className="pick-overlay" role="dialog" aria-modal="true" aria-label="Choose difficulty">
          <div className="pick-card pq-pop-card">
            <p className="sd-greeting-label">Level 1</p>
            <h3>Pick a path</h3>
            <p>Each letter has 10 words. Choose how big they should be.</p>
            <button
              className="pick-option pick-easy"
              onClick={() => {
                setChoosing(false);
                setDifficulty('easy');
              }}
            >
              <span className="pick-face" aria-hidden="true">
                <Sprout size={22} strokeWidth={2.2} />
              </span>
              <span>
                <strong>Easy</strong>
                <span>Short words like cat, sun, and ant</span>
              </span>
            </button>
            <button
              className="pick-option pick-medium"
              onClick={() => {
                setChoosing(false);
                setDifficulty('medium');
              }}
            >
              <span className="pick-face" aria-hidden="true">
                <Star size={22} strokeWidth={2.2} />
              </span>
              <span>
                <strong>Medium</strong>
                <span>Longer words like frog, lamp, and tiger</span>
              </span>
            </button>
            <button
              className="pick-option pick-hard"
              onClick={() => {
                setChoosing(false);
                setDifficulty('hard');
              }}
            >
              <span className="pick-face" aria-hidden="true">
                <Rocket size={22} strokeWidth={2.2} />
              </span>
              <span>
                <strong>Hard</strong>
                <span>Big words like elephant and strawberry</span>
              </span>
            </button>
            <button className="pick-cancel" onClick={() => setChoosing(false)}>
              Not now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
