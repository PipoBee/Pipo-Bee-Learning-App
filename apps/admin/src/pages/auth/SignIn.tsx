import React, { useId, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { GoogleButton } from '../../components/auth/GoogleButton';
import { useToast } from '../../components/auth/Toast';
import { AuthAPI } from '../../services/api';
import { ProfileAPI, validateEmail } from '../../services/profile';
import { playLoginMusic } from '../../services/loginMusic';

type Props = {
  onAuthed: () => Promise<void> | void;
};

export const SignIn: React.FC<Props> = ({ onAuthed }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const emailErrorId = useId();
  const passwordErrorId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next = {
      email: validateEmail(email) || undefined,
      password: password ? undefined : 'Password is required.',
    };
    setErrors(next);
    if (next.email || next.password) return;

    setLoading(true);
    try {
      await AuthAPI.login(email, password);
      playLoginMusic();
      await onAuthed();
      const profile = await ProfileAPI.ensureMine();
      const user = AuthAPI.getStoredUser();
      navigate(ProfileAPI.nextRoute(profile, user?.role), { replace: true });
    } catch (err: any) {
      setErrors({ form: err.message || 'Email or password is incorrect' });
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setGoogleLoading(true);
    setErrors({});
    try {
      await AuthAPI.signInWithGoogle();
      // Browser redirects to Google; keep loading state until navigation.
    } catch (err: any) {
      toast.push('error', err.message || 'Could not start Google sign-in');
      setErrors({ form: err.message || 'Could not start Google sign-in' });
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Welcome back to Pipo Bee">
      {errors.form ? (
        <div className="auth-banner" role="alert">
          <AlertCircle size={18} strokeWidth={2.2} aria-hidden="true" />
          <span>{errors.form}</span>
        </div>
      ) : null}

      <GoogleButton
        onClick={google}
        loading={googleLoading}
        label="Sign in with Google"
      />

      <div className="auth-divider" role="separator"><span>or</span></div>

      <form className="auth-form" onSubmit={submit} noValidate>
        <div className="auth-field">
          <label className="auth-label" htmlFor="signin-email">Email</label>
          <input
            id="signin-email"
            className={`auth-input${errors.email ? ' has-error' : ''}`}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? emailErrorId : undefined}
          />
          {errors.email ? <p id={emailErrorId} className="auth-error" role="alert">{errors.email}</p> : null}
        </div>

        <div className="auth-field">
          <div className="auth-label-row">
            <label className="auth-label" htmlFor="signin-password">Password</label>
            <Link className="auth-inline-link" to="/forgot-password">Forgot password?</Link>
          </div>
          <div className="auth-password-wrap">
            <input
              id="signin-password"
              className={`auth-input auth-password-input${errors.password ? ' has-error' : ''}`}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? passwordErrorId : undefined}
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
          {errors.password ? <p id={passwordErrorId} className="auth-error" role="alert">{errors.password}</p> : null}
        </div>

        <button type="submit" className="auth-primary-btn" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in with email'}
        </button>
      </form>

      <p className="auth-footer-link">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </AuthLayout>
  );
};
