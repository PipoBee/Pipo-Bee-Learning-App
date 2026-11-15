import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useToast } from '../../components/auth/Toast';
import { AuthAPI } from '../../services/api';

export const CheckEmail: React.FC = () => {
  const toast = useToast();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email || '';
  const [loading, setLoading] = useState(false);

  const resend = async () => {
    if (!email) {
      toast.push('error', 'Missing email address. Go back and sign up again.');
      return;
    }
    setLoading(true);
    try {
      await AuthAPI.resendConfirmation(email);
      toast.push('success', 'Confirmation email resent.');
    } catch (err: any) {
      toast.push('error', err.message || 'Could not resend email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Check your inbox" subtitle="Confirm your email to finish signing up">
      <div className="auth-success-box">
        <Mail size={28} strokeWidth={2.2} aria-hidden="true" />
        <p>
          We sent a confirmation link{email ? ` to ${email}` : ''}. Open it on this device, then continue.
        </p>
        <button type="button" className="auth-primary-btn" onClick={resend} disabled={loading}>
          {loading ? 'Sending…' : 'Resend email'}
        </button>
        <Link className="auth-inline-link" to="/login">Back to sign in</Link>
      </div>
    </AuthLayout>
  );
};
