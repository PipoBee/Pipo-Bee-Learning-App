import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';

export const TermsPage: React.FC = () => (
  <AuthLayout title="Terms of use" subtitle="Placeholder page">
    <div className="auth-legal">
      <p>
        These are placeholder Terms for Pipo Bee. Replace this page with your final legal copy before launch.
      </p>
      <Link className="auth-inline-link" to="/signup">Back to sign up</Link>
    </div>
  </AuthLayout>
);

export const PrivacyPage: React.FC = () => (
  <AuthLayout title="Privacy Policy" subtitle="Placeholder page">
    <div className="auth-legal">
      <p>
        This is a placeholder Privacy Policy for Pipo Bee. Contact details and phone numbers are private to each
        account owner and are never shown on public leaderboards.
      </p>
      <Link className="auth-inline-link" to="/signup">Back to sign up</Link>
    </div>
  </AuthLayout>
);
