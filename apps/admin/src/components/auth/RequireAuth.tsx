import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppUser } from '../../services/api';
import { UserProfile } from '../../services/profile';

type Props = {
  user: AppUser | null;
  profile: UserProfile | null;
  booting: boolean;
  children: React.ReactNode;
};

export const RequireAuth: React.FC<Props> = ({ user, profile, booting, children }) => {
  const location = useLocation();

  if (booting) {
    return (
      <div className="auth-shell">
        <main className="auth-main">
          <div className="auth-card">
            <div className="sd-skeleton" aria-hidden="true" />
            <p className="auth-subtitle">Loading your account…</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const path = location.pathname;
  const isAdminLike = user.role === 'ADMIN' || user.role === 'TEACHER';

  if (!isAdminLike) {
    if (!profile?.profileCompleted && path !== '/complete-profile') {
      return <Navigate to="/complete-profile" replace />;
    }
    // Allow returning to /complete-profile from onboarding (Back button).
    if (
      profile?.profileCompleted &&
      !profile.onboardingCompleted &&
      path !== '/onboarding' &&
      path !== '/complete-profile'
    ) {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return <>{children}</>;
};

export const PublicOnly: React.FC<{
  user: AppUser | null;
  profile: UserProfile | null;
  booting: boolean;
  children: React.ReactNode;
}> = ({ user, profile, booting, children }) => {
  if (booting) return null;
  if (user) {
    const next =
      user.role === 'ADMIN' || user.role === 'TEACHER'
        ? '/dashboard'
        : !profile?.profileCompleted
          ? '/complete-profile'
          : !profile.onboardingCompleted
            ? '/onboarding'
            : '/dashboard';
    return <Navigate to={next} replace />;
  }
  return <>{children}</>;
};
