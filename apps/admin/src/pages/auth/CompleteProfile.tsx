import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { CountrySelect } from '../../components/auth/CountrySelect';
import { PhoneField } from '../../components/auth/PhoneField';
import { useToast } from '../../components/auth/Toast';
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

type Props = {
  onAuthed: () => Promise<void> | void;
};

export const CompleteProfile: React.FC<Props> = ({ onAuthed }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const onAuthedRef = useRef(onAuthed);
  onAuthedRef.current = onAuthed;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<ProfileRole>('student');
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
        // Only skip this screen when setup is fully done. Users may return here
        // from onboarding via Back even if profile_completed is already true.
        if (mine.profileCompleted && mine.onboardingCompleted) {
          navigate('/dashboard', { replace: true });
          return;
        }
        setProfile(mine);
        setFullName(mine.fullName || '');
        setCountry(mine.country || '');
        setCity(mine.city || '');
        setRole(mine.role);
        if (mine.phone) {
          const parsed = parsePhoneNumberFromString(mine.phone, (mine.country || undefined) as any);
          setPhone(parsed?.nationalNumber || '');
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Could not load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const submit = async (event: React.FormEvent) => {
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
      const updated = await ProfileAPI.completeProfile({
        fullName,
        country,
        city,
        phoneNational: phone,
        role,
      });
      await onAuthed();
      toast.push('success', 'Profile saved');
      navigate(ProfileAPI.nextRoute(updated, AuthAPI.getStoredUser()?.role), { replace: true });
    } catch (err: any) {
      setError(err.message || 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AuthLayout title="Complete your profile" subtitle="Loading…">
        <div className="sd-skeleton" aria-hidden="true" />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Complete your profile"
      subtitle="We need a few details before you start learning"
    >
      {error ? (
        <div className="auth-banner" role="alert">
          <AlertCircle size={18} strokeWidth={2.2} aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      <form className="auth-form" onSubmit={submit} noValidate>
        <div className="auth-field">
          <label className="auth-label" htmlFor="complete-name">Full name *</label>
          <input
            id="complete-name"
            className="auth-input"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {profile?.fullName ? <p className="auth-hint">Pre-filled from Google or your account. You can edit it.</p> : null}
        </div>

        <div className="auth-row-2">
          <CountrySelect value={country} onChange={setCountry} />
          <div className="auth-field">
            <label className="auth-label" htmlFor="complete-city">City *</label>
            <input
              id="complete-city"
              className="auth-input"
              type="text"
              autoComplete="address-level2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
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

        <fieldset className="auth-field">
          <legend className="auth-label">Role *</legend>
          <div className="auth-segment" role="radiogroup" aria-label="Account role">
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
        </fieldset>

        <button type="submit" className="auth-primary-btn" disabled={saving}>
          {saving ? 'Saving…' : 'Continue'}
        </button>
      </form>
    </AuthLayout>
  );
};
