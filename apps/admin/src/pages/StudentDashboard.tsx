import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Lock, Mic, Pencil, Rocket, SlidersHorizontal, Sprout, Star, Volume2 } from 'lucide-react';
import { StudentProgressPanel } from '../components/StudentProgressPanel';
import { LevelDifficulty } from '../data/levelOne';
import { AuthAPI, StudentAPI } from '../services/api';
import { LevelOneSound } from './LevelOneSound';

const LEVELS = [
  { id: 'beginner', label: 'Beginner', locked: false },
  { id: 'intermediate', label: 'Intermediate', locked: true },
  { id: 'advanced', label: 'Advanced', locked: true },
] as const;

const HOW_CARDS = [
  {
    title: 'Hear it',
    body: 'Each letter has its own sound, such as aa, sss, and uh.',
    tone: 'how-card-honey',
    Icon: Volume2,
  },
  {
    title: 'Choose',
    body: 'Easy, Medium, or Hard picks the 10 practice words.',
    tone: 'how-card-mint',
    Icon: SlidersHorizontal,
  },
  {
    title: 'Practice',
    body: 'Ten words for every letter, matched to that sound.',
    tone: 'how-card-sky',
    Icon: Pencil,
  },
  {
    title: 'Voice test',
    body: 'Read aloud, then spell with alphabet names.',
    tone: 'how-card-blossom',
    Icon: Mic,
  },
] as const;

export const StudentDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [choosing, setChoosing] = useState(false);
  const [difficulty, setDifficulty] = useState<LevelDifficulty | null>(null);
  const [levelTab, setLevelTab] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

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
      <div className="sd-page">
        <div>
          <p className="sd-greeting-label">Student dashboard</p>
          <h1 className="sd-greeting-title">Welcome back</h1>
        </div>
        <div className="sd-skeleton" aria-hidden="true" />
        <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Loading your progress...</p>
      </div>
    );
  }

  const levelOneDone = data?.completion?.levels?.some(
    (level: any) => level.soundLabel === 's' || level.title?.includes('/s/') || level.title?.toLowerCase().includes('alphabet'),
  );
  const readyLevel = data?.pending?.ready?.[0];

  const focusTab = (index: number) => {
    setLevelTab(index);
    tabRefs.current[index]?.focus();
  };

  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusTab((index + 1) % LEVELS.length);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusTab((index - 1 + LEVELS.length) % LEVELS.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusTab(LEVELS.length - 1);
    }
  };

  return (
    <div className="sd-page">
      <header className="fade-up fade-up-1">
        <p className="sd-greeting-label">Student dashboard</p>
        <h1 className="sd-greeting-title">Welcome back, {firstName}</h1>
      </header>

      <section className="sd-hero fade-up fade-up-2" aria-labelledby="next-up-title">
        <div className="sd-hero-glow" aria-hidden="true" />
        <div className="sd-aa" aria-hidden="true">Aa</div>
        <div className="sd-hero-meta">
          <span className="sd-next-label">Next up</span>
          <span className="sd-level-chip">Level 1</span>
        </div>
        <div className="sd-hero-body">
          <h2 id="next-up-title" className="sd-hero-title">Letter sounds</h2>
          <p className="sd-hero-text">
            Practice all 26 letter sounds. Choose Easy, Medium, or Hard, then work through 10 words for each letter.
            {levelOneDone
              ? ' You can practice these sounds again any time.'
              : ' This is your first unlocked lesson.'}
          </p>
          {readyLevel && !levelOneDone && (
            <p className="sd-hero-text">
              Up next after this: {readyLevel.title === 'Sound /s/' ? 'Sound /a/' : readyLevel.title}
            </p>
          )}
          <div className="sd-info-row">
            <span className="sd-info-chip">26 letters</span>
            <span className="sd-info-chip">10 words each</span>
          </div>
          <button className="sd-cta" onClick={() => setChoosing(true)}>
            {levelOneDone ? 'Practice Level 1' : 'Start Level 1'}
            <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="fade-up fade-up-3" aria-labelledby="your-level-title">
        <h3 id="your-level-title" className="sd-section-title">Your level</h3>
        <div className="level-tabs" role="tablist" aria-label="Learning levels">
          {LEVELS.map((level, index) => {
            const selected = levelTab === index;
            return (
              <button
                key={level.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={`level-tab-${level.id}`}
                role="tab"
                type="button"
                className={`level-tab${selected ? ' is-on' : ''}${level.locked ? ' is-locked' : ''}`}
                aria-selected={selected}
                aria-controls={`level-panel-${level.id}`}
                tabIndex={selected ? 0 : -1}
                aria-label={level.locked ? `${level.label}, locked` : level.label}
                onClick={() => setLevelTab(index)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                {level.label}
                {level.locked && <Lock size={14} strokeWidth={2.2} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
        {LEVELS.map((level, index) => (
          <div
            key={level.id}
            id={`level-panel-${level.id}`}
            role="tabpanel"
            aria-labelledby={`level-tab-${level.id}`}
            hidden={levelTab !== index}
            className="level-tabpanel"
          >
            {level.locked ? (
              <p style={{ color: 'var(--muted)' }}>This level unlocks after you finish Beginner.</p>
            ) : (
              <p style={{ color: 'var(--muted)' }}>
                Beginner starts with alphabet sounds and short practice words.
              </p>
            )}
          </div>
        ))}
      </section>

      <section className="fade-up fade-up-4" aria-labelledby="how-title">
        <h3 id="how-title" className="sd-section-title">How it works</h3>
        <div className="how-grid">
          {HOW_CARDS.map((card, index) => (
            <article key={card.title} className={`how-card ${card.tone}`}>
              <div className="how-top">
                <span className="how-icon" aria-hidden="true">
                  <card.Icon size={22} strokeWidth={2.2} />
                </span>
                <span className="how-badge">{index + 1}</span>
              </div>
              <h4 className="how-title">{card.title}</h4>
              <p className="how-body">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      {error && <div className="sd-banner">{error}. Level 1 can still be practiced.</div>}

      {data && (
        <StudentProgressPanel
          data={data}
          heading={`${data.displayName}'s dashboard`}
          onPlayLevel={() => setChoosing(true)}
        />
      )}

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
