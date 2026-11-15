import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useToast } from '../../components/auth/Toast';
import { AuthAPI } from '../../services/api';
import { ProfileAPI, UserProfile } from '../../services/profile';

const AGE_GROUPS = ['4-6', '7-9', '10-13', '14-17', '18+'] as const;
const GOALS = [
  { id: 'from-scratch', label: 'Learn from scratch' },
  { id: 'improve-reading', label: 'Improve reading' },
  { id: 'improve-speaking', label: 'Improve speaking' },
  { id: 'exam-prep', label: 'Exam prep' },
] as const;

type Props = {
  onAuthed: () => Promise<void> | void;
};

export const Onboarding: React.FC<Props> = ({ onAuthed }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const onAuthedRef = useRef(onAuthed);
  onAuthedRef.current = onAuthed;
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ageGroup, setAgeGroup] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [startChoice, setStartChoice] = useState<string | null>(null);
  const [parentEmail, setParentEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        await onAuthedRef.current();
        const mine = await ProfileAPI.ensureMine();
        if (cancelled) return;
        if (!mine.profileCompleted) {
          navigate('/complete-profile', { replace: true });
          return;
        }
        if (mine.onboardingCompleted) {
          navigate('/dashboard', { replace: true });
          return;
        }
        setProfile(mine);
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Could not load onboarding');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const needsParentNote =
    profile?.role === 'student' && ['4-6', '7-9', '10-13'].includes(ageGroup);

  const finish = async (choice: string | null) => {
    if (!ageGroup) {
      setError('Choose an age group to continue.');
      setStep(1);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await ProfileAPI.saveOnboarding({
        ageGroup,
        learningGoals: goals,
        startChoice: choice,
        parentEmail: needsParentNote ? parentEmail : undefined,
        role: profile?.role || 'student',
      });
      toast.push('success', 'You are ready to learn');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Could not save onboarding');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AuthLayout title="Welcome" subtitle="Setting things up…">
        <div className="sd-skeleton" aria-hidden="true" />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Quick setup" subtitle="Three short steps, then you can start">
      <div className="onboard-progress" aria-label={`Step ${step} of 3`}>
        {[1, 2, 3].map((n) => (
          <span key={n} className={`onboard-dot${step >= n ? ' is-on' : ''}`} />
        ))}
      </div>

      {error ? (
        <div className="auth-banner" role="alert">
          <AlertCircle size={18} strokeWidth={2.2} aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      {step === 1 && (
        <div className="onboard-step">
          <button
            type="button"
            className="onboard-back"
            onClick={() => navigate('/complete-profile')}
          >
            <ArrowLeft size={18} strokeWidth={2.2} aria-hidden="true" /> Back
          </button>
          <h2 className="onboard-heading">Age group</h2>
          <p className="auth-subtitle">Required so we can keep lessons friendly.</p>
          <div className="onboard-cards">
            {AGE_GROUPS.map((group) => (
              <button
                key={group}
                type="button"
                className={`onboard-card${ageGroup === group ? ' is-on' : ''}`}
                onClick={() => setAgeGroup(group)}
              >
                {group}
              </button>
            ))}
          </div>
          {needsParentNote ? (
            <div className="auth-field" style={{ marginTop: 16 }}>
              <label className="auth-label" htmlFor="parent-email">Parent email (optional)</label>
              <input
                id="parent-email"
                className="auth-input"
                type="email"
                autoComplete="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="parent@example.com"
              />
              <p className="auth-hint">
                A parent or guardian email helps keep learning safe. You can keep going either way.
              </p>
            </div>
          ) : null}
          <button
            type="button"
            className="auth-primary-btn"
            disabled={!ageGroup}
            onClick={() => setStep(2)}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="onboard-step">
          <button type="button" className="onboard-back" onClick={() => setStep(1)}>
            <ArrowLeft size={18} strokeWidth={2.2} aria-hidden="true" /> Back
          </button>
          <h2 className="onboard-heading">Learning goal</h2>
          <p className="auth-subtitle">Optional. Pick any that fit.</p>
          <div className="onboard-cards">
            {GOALS.map((goal) => {
              const on = goals.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  type="button"
                  className={`onboard-card${on ? ' is-on' : ''}`}
                  onClick={() =>
                    setGoals((prev) =>
                      on ? prev.filter((g) => g !== goal.id) : [...prev, goal.id],
                    )
                  }
                >
                  {goal.label}
                </button>
              );
            })}
          </div>
          <div className="onboard-actions">
            <button type="button" className="auth-secondary-btn" onClick={() => setStep(3)}>
              Skip
            </button>
            <button type="button" className="auth-primary-btn" onClick={() => setStep(3)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="onboard-step">
          <button type="button" className="onboard-back" onClick={() => setStep(2)}>
            <ArrowLeft size={18} strokeWidth={2.2} aria-hidden="true" /> Back
          </button>
          <h2 className="onboard-heading">Starting point</h2>
          <p className="auth-subtitle">Optional. You can change this later.</p>
          <div className="onboard-cards">
            <button
              type="button"
              className={`onboard-card${startChoice === 'level-1' ? ' is-on' : ''}`}
              onClick={() => setStartChoice('level-1')}
            >
              I&apos;m new, start at Level 1
            </button>
            <button
              type="button"
              className={`onboard-card${startChoice === 'placement' ? ' is-on' : ''}`}
              onClick={() => setStartChoice('placement')}
            >
              Take a quick placement quiz
            </button>
          </div>
          <div className="onboard-actions">
            <button
              type="button"
              className="auth-secondary-btn"
              disabled={saving}
              onClick={() => finish(null)}
            >
              Skip
            </button>
            <button
              type="button"
              className="auth-primary-btn"
              disabled={saving}
              onClick={() => finish(startChoice || 'level-1')}
            >
              {saving ? 'Saving…' : 'Go to dashboard'}
            </button>
          </div>
          <p className="auth-hint">
            Placement quiz arrives in a later phase. For now, both choices open Level 1.
          </p>
        </div>
      )}
    </AuthLayout>
  );
};
