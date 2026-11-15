import React, { useEffect, useId, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { CountrySelect } from '../../components/auth/CountrySelect';
import { GoogleButton } from '../../components/auth/GoogleButton';
import { PhoneField } from '../../components/auth/PhoneField';
import { useToast } from '../../components/auth/Toast';
import { AuthAPI } from '../../services/api';
import {
  ProfileAPI,
  ProfileRole,
  passwordStrength,
  toE164,
  validateCity,
  validateCountry,
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
} from '../../services/profile';
import { playLoginMusic } from '../../services/loginMusic';

type Props = {
  onAuthed: () => Promise<void> | void;
};

export const SignUp: React.FC<Props> = ({ onAuthed }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<ProfileRole>('student');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const ids = {
    name: useId(),
    email: useId(),
    city: useId(),
    password: useId(),
    terms: useId(),
  };

  useEffect(() => {
    // Keep phone dial prefix aligned with country when country changes.
  }, [country]);

  const errors = useMemo(() => ({
    fullName: validateFullName(fullName),
    email: validateEmail(email),
    country: validateCountry(country),
    city: validateCity(city),
    phone: validatePhone(phone, country || 'US'),
    password: validatePassword(password),
    terms: acceptedTerms ? null : 'Please agree to the Terms and Privacy Policy.',
  }), [fullName, email, country, city, phone, password, acceptedTerms]);

  const strength = passwordStrength(password);
  const canSubmit = Object.values(errors).every((v) => !v);

  const mark = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      country: true,
      city: true,
      phone: true,
      password: true,
      terms: true,
    });
    if (!canSubmit) return;

    setLoading(true);
    setFormError(null);
    try {
      const e164 = toE164(phone, country);
      if (!e164) throw new Error('Enter a valid phone number for the selected country.');

      const result = await AuthAPI.register({
        fullName,
        email,
        password,
        role,
        phone: e164,
        country,
        city: city.trim(),
      });

      if (result.needsEmailConfirmation) {
        navigate('/check-email', { state: { email: result.email } });
        return;
      }

      playLoginMusic();
      await onAuthed();
      const profile = await ProfileAPI.ensureMine();
      const signedIn = AuthAPI.getStoredUser();
      navigate(ProfileAPI.nextRoute(profile, signedIn?.role), { replace: true });
    } catch (err: any) {
      setFormError(err.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setGoogleLoading(true);
    setFormError(null);
    try {
      await AuthAPI.signInWithGoogle();
      // Browser redirects to Google; keep loading state until navigation.
    } catch (err: any) {
      toast.push('error', err.message || 'Could not start Google sign-in');
      setFormError(err.message || 'Could not start Google sign-in');
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Start learning with Pipo Bee">
      {formError ? (
        <div className="auth-banner" role="alert">
          <AlertCircle size={18} strokeWidth={2.2} aria-hidden="true" />
          <span>{formError}</span>
        </div>
      ) : null}

      <GoogleButton
        onClick={google}
        loading={googleLoading}
        label="Sign up with Google"
      />

      <div className="auth-divider" role="separator"><span>or continue with email</span></div>

      <form className="auth-form" onSubmit={submit} noValidate>
        <div className="auth-field">
          <label className="auth-label" htmlFor={ids.name}>Full name *</label>
          <input
            id={ids.name}
            className={`auth-input${touched.fullName && errors.fullName ? ' has-error' : ''}`}
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={() => mark('fullName')}
            aria-invalid={Boolean(touched.fullName && errors.fullName)}
            aria-describedby={touched.fullName && errors.fullName ? `${ids.name}-err` : undefined}
          />
          {touched.fullName && errors.fullName ? (
            <p id={`${ids.name}-err`} className="auth-error" role="alert">{errors.fullName}</p>
          ) : null}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor={ids.email}>Email *</label>
          <input
            id={ids.email}
            className={`auth-input${touched.email && errors.email ? ' has-error' : ''}`}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => mark('email')}
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={touched.email && errors.email ? `${ids.email}-err` : undefined}
          />
          {touched.email && errors.email ? (
            <p id={`${ids.email}-err`} className="auth-error" role="alert">{errors.email}</p>
          ) : null}
        </div>

        <div className="auth-row-2">
          <CountrySelect
            value={country}
            onChange={(code) => {
              setCountry(code);
              mark('country');
            }}
            error={touched.country ? errors.country : null}
          />
          <div className="auth-field">
            <label className="auth-label" htmlFor={ids.city}>City *</label>
            <input
              id={ids.city}
              className={`auth-input${touched.city && errors.city ? ' has-error' : ''}`}
              type="text"
              autoComplete="address-level2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onBlur={() => mark('city')}
              aria-invalid={Boolean(touched.city && errors.city)}
              aria-describedby={touched.city && errors.city ? `${ids.city}-err` : undefined}
            />
            {touched.city && errors.city ? (
              <p id={`${ids.city}-err`} className="auth-error" role="alert">{errors.city}</p>
            ) : null}
          </div>
        </div>

        <PhoneField
          countryCode={country || 'US'}
          value={phone}
          onChange={setPhone}
          onDialCountryChange={(code) => {
            if (!country) setCountry(code);
          }}
          error={touched.phone ? errors.phone : null}
        />

        <div className="auth-field">
          <label className="auth-label" htmlFor={ids.password}>Password *</label>
          <div className="auth-password-wrap">
            <input
              id={ids.password}
              className={`auth-input auth-password-input${touched.password && errors.password ? ' has-error' : ''}`}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => mark('password')}
              aria-invalid={Boolean(touched.password && errors.password)}
              aria-describedby={`${ids.password}-hint${touched.password && errors.password ? ` ${ids.password}-err` : ''}`}
            />
            <button
              type="button"
              className="auth-eye"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p id={`${ids.password}-hint`} className="auth-hint">
            Strength: {strength === 'strong' ? 'Strong' : strength === 'okay' ? 'Okay' : 'Weak'} · at least 8 characters
          </p>
          {touched.password && errors.password ? (
            <p id={`${ids.password}-err`} className="auth-error" role="alert">{errors.password}</p>
          ) : null}
        </div>

        <div className="auth-field">
          <p className="auth-label" id="signup-role-label">Role *</p>
          <div className="auth-segment" role="radiogroup" aria-labelledby="signup-role-label">
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

        <div className="auth-field auth-check">
          <input
            id={ids.terms}
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => {
              setAcceptedTerms(e.target.checked);
              mark('terms');
            }}
            aria-invalid={Boolean(touched.terms && errors.terms)}
            aria-describedby={touched.terms && errors.terms ? `${ids.terms}-err` : undefined}
          />
          <label htmlFor={ids.terms}>
            I agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>
          </label>
          {touched.terms && errors.terms ? (
            <p id={`${ids.terms}-err`} className="auth-error" role="alert">{errors.terms}</p>
          ) : null}
        </div>

        <button type="submit" className="auth-primary-btn" disabled={loading || !canSubmit}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="auth-footer-link">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
};
