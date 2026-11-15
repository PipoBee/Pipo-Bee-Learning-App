import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Pencil, X } from 'lucide-react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { CountrySelect } from '../auth/CountrySelect';
import { PhoneField } from '../auth/PhoneField';
import { InstallAppButton } from '../InstallAppPrompt';
import { useToast } from '../auth/Toast';
import { findCountry } from '../../data/countries';
import { AuthAPI } from '../../services/api';
import {
  ProfileAPI,
  ProfileRole,
  UserProfile,
  validateCity,
  validateCountry,
  validateFullName,
  validatePhone,
} from '../../services/profile';

const AGE_GROUPS = ['4-6', '7-9', '10-13', '14-17', '18+'] as const;
const GOAL_LABELS: Record<string, string> = {
  'from-scratch': 'Learn from scratch',
  'improve-reading': 'Improve reading',
  'improve-speaking': 'Improve speaking',
  'exam-prep': 'Exam prep',
};
const DAILY_GOALS = [5, 10, 15] as const;

type Props = {
  email?: string;
  stars?: number;
  streakDays?: number;
  levelPercent?: number;
  onUpdated?: (profile: UserProfile) => void;
};

function phoneNationalFromE164(phone: string | null, country: string | null): string {
  if (!phone) return '';
  try {
    const parsed = parsePhoneNumberFromString(phone, (country || undefined) as any);
    return parsed?.nationalNumber || phone.replace(/^\+\d{1,3}/, '');
  } catch {
    return phone;
  }
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="profile-detail-row">
      <dt>{label}</dt>
      <dd>{value || '—'}</dd>
    </div>
  );
}

export const StudentProfileDetails: React.FC<Props> = ({
  email,
  stars = 0,
  streakDays = 0,
  levelPercent = 0,
  onUpdated,
}) => {
  const toast = useToast();
  const stored = useMemo(() => AuthAPI.getStoredUser(), []);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<ProfileRole>('student');
  const [ageGroup, setAgeGroup] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [dailyGoal, setDailyGoal] = useState<number | null>(null);
  const [parentEmail, setParentEmail] = useState('');
  const [goals, setGoals] = useState<string[]>([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const mine = await ProfileAPI.ensureMine();
      setProfile(mine);
      hydrateForm(mine);
    } catch (err: any) {
      setError(err.message || 'Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  const hydrateForm = (mine: UserProfile) => {
    setFullName(mine.fullName || '');
    setCountry(mine.country || '');
    setCity(mine.city || '');
    setPhone(phoneNationalFromE164(mine.phone, mine.country));
    setRole(mine.role);
    setAgeGroup(mine.ageGroup || '');
    setNativeLanguage(mine.nativeLanguage || '');
    setDailyGoal(mine.dailyGoalMinutes);
    setParentEmail(mine.parentEmail || '');
    setGoals(mine.learningGoals || []);
  };

  useEffect(() => {
    void load();
  }, []);

  const startEdit = () => {
    if (profile) hydrateForm(profile);
    setEditing(true);
    setError(null);
  };

  const cancelEdit = () => {
    if (profile) hydrateForm(profile);
    setEditing(false);
    setError(null);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors = [
      validateFullName(fullName),
      validateCountry(country),
      validateCity(city),
      validatePhone(phone, country),
    ].filter(Boolean);
    if (errors.length) {
      setError(errors[0] as string);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await ProfileAPI.updatePersonalDetails({
        fullName,
        country,
        city,
        phoneNational: phone,
        role,
        ageGroup: ageGroup || null,
        nativeLanguage: nativeLanguage || null,
        dailyGoalMinutes: dailyGoal,
        parentEmail: parentEmail || null,
        learningGoals: goals,
      });
      setProfile(updated);
      setEditing(false);
      onUpdated?.(updated);
      toast.push('success', 'Profile updated');
    } catch (err: any) {
      setError(err.message || 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="sd-page">
        <div className="sd-skeleton" aria-hidden="true" />
        <p className="auth-subtitle">Loading your profile…</p>
      </div>
    );
  }

  const countryName = profile?.country ? findCountry(profile.country)?.name || profile.country : '—';
  const goalText =
    profile?.learningGoals?.length
      ? profile.learningGoals.map((g) => GOAL_LABELS[g] || g).join(', ')
      : '—';

  return (
    <div className="sd-page profile-page">
      <header className="profile-page-header">
        <div>
          <p className="sd-greeting-label">Profile</p>
          <h1 className="sd-greeting-title">{profile?.fullName || stored?.fullName || 'Learner'}</h1>
          <p className="auth-hint">{email || stored?.email}</p>
        </div>
        {!editing ? (
          <button type="button" className="profile-edit-btn" onClick={startEdit}>
            <Pencil size={16} strokeWidth={2.2} aria-hidden="true" />
            Edit details
          </button>
        ) : (
          <button type="button" className="profile-edit-btn is-muted" onClick={cancelEdit}>
            <X size={16} strokeWidth={2.2} aria-hidden="true" />
            Cancel
          </button>
        )}
      </header>

      <div className="profile-stats">
        <div className="profile-stat">
          <strong>{stars}</strong>
          <span>Stars</span>
        </div>
        <div className="profile-stat">
          <strong>{streakDays}</strong>
          <span>Day streak</span>
        </div>
        <div className="profile-stat">
          <strong>{levelPercent}%</strong>
          <span>Level 1</span>
        </div>
      </div>

      {error ? (
        <div className="auth-banner" role="alert">
          <AlertCircle size={18} strokeWidth={2.2} aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      {!editing ? (
        <section className="profile-details-card" aria-labelledby="personal-details-title">
          <h2 id="personal-details-title">Personal details</h2>
          <dl className="profile-details-list">
            <DetailRow label="Full name" value={profile?.fullName} />
            <DetailRow label="Email" value={email || stored?.email} />
            <DetailRow label="Role" value={profile?.role === 'parent' ? 'Parent' : 'Student'} />
            <DetailRow label="Phone" value={profile?.phone} />
            <DetailRow label="Country" value={countryName} />
            <DetailRow label="City" value={profile?.city} />
            <DetailRow label="Age group" value={profile?.ageGroup} />
            <DetailRow label="Learning goals" value={goalText} />
            <DetailRow
              label="Starting point"
              value={
                profile?.startChoice === 'placement'
                  ? 'Placement quiz'
                  : profile?.startChoice === 'level-1'
                    ? 'Level 1'
                    : profile?.startChoice
              }
            />
            <DetailRow label="Native language" value={profile?.nativeLanguage} />
            <DetailRow
              label="Daily goal"
              value={profile?.dailyGoalMinutes ? `${profile.dailyGoalMinutes} minutes` : null}
            />
            <DetailRow label="Timezone" value={profile?.timezone} />
            <DetailRow label="Parent email" value={profile?.parentEmail} />
            <DetailRow label="Parent consent" value={profile?.parentConsentStatus} />
          </dl>
        </section>
      ) : (
        <form className="profile-details-card auth-form" onSubmit={save} noValidate>
          <h2>Edit personal details</h2>

          <div className="auth-field">
            <label className="auth-label" htmlFor="profile-name">Full name *</label>
            <input
              id="profile-name"
              className="auth-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="auth-row-2">
            <CountrySelect value={country} onChange={setCountry} />
            <div className="auth-field">
              <label className="auth-label" htmlFor="profile-city">City *</label>
              <input
                id="profile-city"
                className="auth-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoComplete="address-level2"
              />
            </div>
          </div>

          <PhoneField
            countryCode={country || 'US'}
            value={phone}
            onChange={setPhone}
            onDialCountryChange={(code) => {
              if (!country) setCountry(code);
            }}
          />

          <div className="auth-field">
            <p className="auth-label" id="profile-role-label">Role *</p>
            <div className="auth-segment" role="radiogroup" aria-labelledby="profile-role-label">
              <button
                type="button"
                role="radio"
                aria-checked={role === 'student'}
                className={role === 'student' ? 'is-on' : ''}
                onClick={() => setRole('student')}
              >
                Student
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={role === 'parent'}
                className={role === 'parent' ? 'is-on' : ''}
                onClick={() => setRole('parent')}
              >
                Parent
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="profile-age">Age group</label>
            <select
              id="profile-age"
              className="auth-input"
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
            >
              <option value="">Not set</option>
              {AGE_GROUPS.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="profile-lang">Native language</label>
            <input
              id="profile-lang"
              className="auth-input"
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="auth-field">
            <p className="auth-label">Daily goal</p>
            <div className="auth-segment profile-goal-segment">
              {DAILY_GOALS.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  className={dailyGoal === minutes ? 'is-on' : ''}
                  onClick={() => setDailyGoal(minutes)}
                >
                  {minutes} min
                </button>
              ))}
            </div>
          </div>

          <div className="auth-field">
            <p className="auth-label">Learning goals</p>
            <div className="profile-goal-chips">
              {Object.entries(GOAL_LABELS).map(([id, label]) => {
                const on = goals.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    className={`profile-goal-chip${on ? ' is-on' : ''}`}
                    onClick={() =>
                      setGoals((prev) => (on ? prev.filter((g) => g !== id) : [...prev, id]))
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {role === 'student' && ['4-6', '7-9', '10-13'].includes(ageGroup) ? (
            <div className="auth-field">
              <label className="auth-label" htmlFor="profile-parent-email">Parent email</label>
              <input
                id="profile-parent-email"
                className="auth-input"
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                autoComplete="email"
              />
              <p className="auth-hint">Optional for younger learners. Consent handling still needs legal review.</p>
            </div>
          ) : null}

          <button type="submit" className="auth-primary-btn" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      )}

      <section className="profile-details-card" aria-labelledby="install-section-title">
        <h2 id="install-section-title">App</h2>
        <InstallAppButton />
      </section>
    </div>
  );
};
