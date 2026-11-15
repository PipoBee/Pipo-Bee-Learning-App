import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useToast } from '../../components/auth/Toast';
import { AuthAPI } from '../../services/api';
import { validateEmail } from '../../services/profile';

export const ForgotPassword: React.FC = () => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const emailError = validateEmail(email);
    setError(emailError);
    if (emailError) return;
    setLoading(true);
    try {
      await AuthAPI.requestPasswordReset(email);
      setSent(true);
      toast.push('success', 'Reset link sent. Check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot password" subtitle="We’ll email you a reset link">
      {sent ? (
        <div className="auth-success-box">
          <p>If an account exists for that email, a reset link is on the way.</p>
          <Link className="auth-primary-btn" to="/login">Back to sign in</Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={submit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="forgot-email">Email</label>
            <input
              id="forgot-email"
              className={`auth-input${error ? ' has-error' : ''}`}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(error)}
            />
            {error ? <p className="auth-error" role="alert">{error}</p> : null}
          </div>
          <button type="submit" className="auth-primary-btn" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
      <p className="auth-footer-link"><Link to="/login">Back to sign in</Link></p>
    </AuthLayout>
  );
};
