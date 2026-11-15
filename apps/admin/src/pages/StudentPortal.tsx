import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Compass,
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
import { LevelMap } from '../components/learn/LevelMap';
import { StudentNav, StudentTab } from '../components/layout/StudentNav';
import { StudentProfileDetails } from '../components/profile/StudentProfileDetails';
import { StudentProgressPanel } from '../components/StudentProgressPanel';
import { LevelDifficulty } from '../data/levelOne';
import { AuthAPI } from '../services/api';
import { CurriculumAPI, StudentLearnData } from '../services/curriculum';
import { LevelOneSound } from './LevelOneSound';

const BANDS = [
  { id: 'beginner', label: 'Beginner', sub: 'L1 & L2 • Sounds & CVC', codes: ['L1', 'L2'] },
  { id: 'intermediate', label: 'Intermediate', sub: 'L3–L5 • Blends', codes: ['L3', 'L4', 'L5'] },
  { id: 'advanced', label: 'Advanced', sub: 'L6–L7 • Stories', codes: ['L6', 'L7'] },
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
    body: 'Say a word that starts with the sound.',
    tone: 'how-bento-blossom',
    Icon: Mic,
  },
] as const;

export const StudentPortal: React.FC = () => {
  const [tab, setTab] = useState<StudentTab>('home');
  const [learn, setLearn] = useState<StudentLearnData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [choosing, setChoosing] = useState(false);
  const [difficulty, setDifficulty] = useState<LevelDifficulty | null>(null);
  const [bandTab, setBandTab] = useState(0);

  const storedUser = useMemo(() => AuthAPI.getStoredUser(), []);
  const firstName = (learn?.displayName || storedUser?.fullName || 'friend').split(' ')[0];

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CurriculumAPI.getLearnData();
      setLearn(data);
    } catch (err: any) {
      setError(err?.message || 'Could not load your progress');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (difficulty) {
    return (
      <LevelOneSound
        difficulty={difficulty}
        onExit={() => setDifficulty(null)}
        onCompleted={() => {
          void load();
        }}
      />
    );
  }

  const dashboard = learn ? CurriculumAPI.toDashboardShape(learn) : null;
  const current = learn?.currentLesson;
  const levelOneDone = (learn?.completedCount || 0) >= (learn?.totalLessons || 26);
  const heroLetter = (current?.letterKey || 'a').toUpperCase() + (current?.letterKey || 'a').toLowerCase();

  return (
    <div className="student-layout kid-theme">
      <StudentNav active={tab} onChange={setTab} />

      <div className="student-content">
        {loading && !learn ? (
          <div className="sd-page">
            <div className="sd-topbar">
              <div>
                <p className="sd-greeting-label">Student Dashboard</p>
                <h1 className="sd-greeting-title">Welcome back</h1>
              </div>
            </div>
            <div className="sd-skeleton" aria-hidden="true" />
          </div>
        ) : null}

        {!loading && tab === 'home' && (
          <div className="sd-page">
            {/* Top Welcome Bar with Quick Badges */}
            <header className="sd-topbar fade-up fade-up-1">
              <div className="sd-topbar-left">
                <span className="sd-eyebrow">
                  <Sparkles size={13} strokeWidth={2.4} aria-hidden="true" />
                  Student Adventures
                </span>
                <h1 className="sd-greeting-title">Welcome back, {firstName}!</h1>
              </div>
              <div className="sd-topbar-pills">
                <div className="sd-stat-pill sd-stat-pill-streak">
                  <Flame size={16} strokeWidth={2.4} aria-hidden="true" />
                  <strong>{learn?.streakDays ?? 0}</strong>
                  <span>day streak</span>
                </div>
                <div className="sd-stat-pill sd-stat-pill-stars">
                  <Star size={16} strokeWidth={2.4} aria-hidden="true" />
                  <strong>{learn?.totalStars ?? 0}</strong>
                  <span>stars</span>
                </div>
              </div>
            </header>

            {/* Bento Grid: Hero Mission + Learning Path & Steps */}
            <div className="sd-bento-grid fade-up fade-up-2">
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
                    <div className="sd-aa-tile">{heroLetter}</div>
                  </div>
                </div>

                <div className="sd-hero-content">
                  <h2 id="next-up-title" className="sd-hero-heading">
                    {current?.title || 'Alphabet Letter Sounds'}
                  </h2>
                  <p className="sd-hero-copy">
                    Practice all 26 letter sounds. Choose Easy, Medium, or Hard, then work through 10 words for each letter.
                    {levelOneDone ? ' Practice again any time!' : ''}
                  </p>

                  <div className="sd-hero-progress">
                    <div className="sd-hero-progress-head">
                      <span>Level 1 progress</span>
                      <strong>
                        {learn?.completedCount ?? 0} / {learn?.totalLessons ?? 26} lessons ({learn?.percent ?? 0}%)
                      </strong>
                    </div>
                    <div className="sd-hero-progress-track">
                      <div
                        className="sd-hero-progress-fill"
                        style={{ width: `${Math.max(6, learn?.percent ?? 0)}%` }}
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
                    <button
                      type="button"
                      className="sd-cta-secondary"
                      onClick={() => setTab('learn')}
                    >
                      <Compass size={16} strokeWidth={2.3} aria-hidden="true" />
                      Open Map
                    </button>
                  </div>
                </div>
              </section>

              <div className="sd-bento-side">
                {/* Learning Bands Card */}
                <section className="sd-side-card" aria-labelledby="your-level-title">
                  <div className="sd-side-head">
                    <h3 id="your-level-title" className="sd-side-title">Your Level</h3>
                    <span className="sd-side-sub">3 Bands</span>
                  </div>
                  <div className="sd-stage-pills" role="tablist" aria-label="Learning bands">
                    {BANDS.map((band, index) => {
                      const selected = bandTab === index;
                      const unlocked = band.id === 'beginner';
                      return (
                        <button
                          key={band.id}
                          type="button"
                          role="tab"
                          aria-selected={selected}
                          onClick={() => setBandTab(index)}
                          className={`sd-stage-pill${selected ? ' is-on' : ''}${unlocked ? '' : ' is-locked'}`}
                        >
                          <div className="sd-stage-pill-top">
                            <strong>{band.label}</strong>
                            {!unlocked ? (
                              <Lock size={13} strokeWidth={2.3} aria-hidden="true" />
                            ) : (
                              <span className="sd-stage-dot" aria-hidden="true" />
                            )}
                          </div>
                          <span className="sd-stage-pill-sub">{band.sub}</span>
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

            {error && <div className="sd-banner">{error}. Level 1 can still be practiced offline from Practice.</div>}

            {dashboard && (
              <div className="fade-up fade-up-3">
                <StudentProgressPanel
                  data={dashboard}
                  compactHeader
                  onPlayLevel={() => setChoosing(true)}
                />
              </div>
            )}
          </div>
        )}

        {!loading && tab === 'learn' && (
          <div className="sd-page">
            <header>
              <p className="sd-greeting-label">Learn</p>
              <h1 className="sd-greeting-title">Level map</h1>
              <p style={{ color: 'var(--muted)', marginTop: 8 }}>
                Follow the path. Next lesson unlocks at {learn?.levels.find((l) => l.code === 'L1')?.unlockScore ?? 80}% or more. Retry anytime.
              </p>
            </header>
            <div className="level-map-progress" aria-label="Level progress">
              <div className="level-map-progress-bar" style={{ width: `${learn?.percent ?? 0}%` }} />
            </div>
            <p className="level-map-progress-label">
              {learn?.completedCount ?? 0} of {learn?.totalLessons ?? 26} letter lessons complete
            </p>
            <LevelMap
              lessons={learn?.lessons || []}
              onSelectLesson={(lesson) => {
                if (lesson.status !== 'locked') setChoosing(true);
              }}
            />
            {error && <div className="sd-banner">{error}</div>}
          </div>
        )}

        {!loading && tab === 'practice' && (
          <div className="sd-page">
            <header>
              <p className="sd-greeting-label">Practice</p>
              <h1 className="sd-greeting-title">Letter sounds</h1>
              <p style={{ color: 'var(--muted)', marginTop: 8 }}>
                Jump into Level 1 practice. Full Listen / Repeat / Match / Quiz activities arrive in Phase 2.
              </p>
            </header>
            <button className="sd-cta-rich" style={{ alignSelf: 'flex-start' }} onClick={() => setChoosing(true)}>
              <span>Practice Level 1</span>
              <span className="sd-cta-arrow">
                <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
              </span>
            </button>
          </div>
        )}

        {!loading && tab === 'profile' && (
          <StudentProfileDetails
            email={storedUser?.email}
            stars={learn?.totalStars ?? 0}
            streakDays={learn?.streakDays ?? 0}
            levelPercent={learn?.percent ?? 0}
            onUpdated={(updated) => {
              setLearn((prev) =>
                prev
                  ? {
                      ...prev,
                      displayName: updated.fullName || prev.displayName,
                    }
                  : prev,
              );
            }}
          />
        )}
      </div>

      {choosing && (
        <div className="pick-overlay" role="dialog" aria-modal="true" aria-label="Choose difficulty">
          <div className="pick-card pq-pop-card">
            <p className="sd-greeting-label">Level 1</p>
            <h3>Pick a path</h3>
            <p>Each letter has 10 words. Choose how big they should be.</p>
            <button className="pick-option pick-easy" onClick={() => { setChoosing(false); setDifficulty('easy'); }}>
              <span className="pick-face" aria-hidden="true"><Sprout size={22} strokeWidth={2.2} /></span>
              <span><strong>Easy</strong><span>Short words like cat, sun, and ant</span></span>
            </button>
            <button className="pick-option pick-medium" onClick={() => { setChoosing(false); setDifficulty('medium'); }}>
              <span className="pick-face" aria-hidden="true"><Star size={22} strokeWidth={2.2} /></span>
              <span><strong>Medium</strong><span>Longer words like frog, lamp, and tiger</span></span>
            </button>
            <button className="pick-option pick-hard" onClick={() => { setChoosing(false); setDifficulty('hard'); }}>
              <span className="pick-face" aria-hidden="true"><Rocket size={22} strokeWidth={2.2} /></span>
              <span><strong>Hard</strong><span>Big words like elephant and strawberry</span></span>
            </button>
            <button className="pick-cancel" onClick={() => setChoosing(false)}>Not now</button>
          </div>
        </div>
      )}
    </div>
  );
};
