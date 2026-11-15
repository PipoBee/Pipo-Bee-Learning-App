import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useToast } from '../../components/auth/Toast';
import { AuthAPI } from '../../services/api';
import { validatePassword } from '../../services/profile';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await AuthAPI.updatePassword(password);
      toast.push('success', 'Password updated. You can sign in now.');
      navigate('/login', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Could not update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Choose a new password" subtitle="Use at least 8 characters">
      <form className="auth-form" onSubmit={submit} noValidate>
        <div className="auth-field">
          <label className="auth-label" htmlFor="reset-password">New password</label>
          <div className="auth-password-wrap">
            <input
              id="reset-password"
              className={`auth-input auth-password-input${error ? ' has-error' : ''}`}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </div>
        <div className="auth-field">
          <label className="auth-label" htmlFor="reset-confirm">Confirm password</label>
          <input
            id="reset-confirm"
            className="auth-input"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {error ? <p className="auth-error" role="alert">{error}</p> : null}
        </div>
        <button type="submit" className="auth-primary-btn" disabled={loading}>
          {loading ? 'Saving…' : 'Update password'}
        </button>
      </form>
      <p className="auth-footer-link"><Link to="/login">Back to sign in</Link></p>
    </AuthLayout>
  );
};
