import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthAPI } from '../../services/api';
import { ProfileAPI } from '../../services/profile';
import { playLoginMusic } from '../../services/loginMusic';
import { supabase } from '../../utils/supabase';

/**
 * Module-level guard so React StrictMode (mount → unmount → remount) cannot
 * run the post-login redirect twice. Do NOT call exchangeCodeForSession here:
 * the shared client already has detectSessionInUrl + PKCE and exchanges once.
 */
let callbackRedirectStarted = false;

type Props = {
  onAuthed: () => Promise<void> | void;
};

export const AuthCallback: React.FC<Props> = ({ onAuthed }) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('Finishing Google sign-in…');

  useEffect(() => {
    let cancelled = false;
    let settled = false;

    const url = new URL(window.location.href);
    const oauthError = url.searchParams.get('error_description') || url.searchParams.get('error');
    if (oauthError) {
      setError(oauthError);
      return;
    }

    async function continueWithSession(session: Session) {
      if (cancelled || settled || callbackRedirectStarted) return;
      settled = true;
      callbackRedirectStarted = true;

      try {
        setStatus('Loading your profile…');
        // Persist app user token/profile for the rest of the SPA.
        await AuthAPI.restoreSession();
        playLoginMusic();
        await onAuthed();

        const profile = await ProfileAPI.ensureMine();
        const user = AuthAPI.getStoredUser();
        const next = ProfileAPI.nextRoute(profile, user?.role);

        // Clean OAuth params so a refresh does not re-enter the callback flow.
        window.history.replaceState({}, document.title, '/auth/callback');
        navigate(next, { replace: true });
      } catch (err: any) {
        callbackRedirectStarted = false;
        settled = false;
        if (!cancelled) {
          setError(err?.message || 'Could not finish sign-in. Please try again.');
        }
      }
    }

    async function waitForSession() {
      // detectSessionInUrl may already have exchanged the code during createClient.
      const initial = await supabase.auth.getSession();
      if (cancelled) return;
      if (initial.data.session) {
        await continueWithSession(initial.data.session);
        return;
      }

      setStatus('Connecting your Google account…');

      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        if (!session) return;
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
          void continueWithSession(session);
        }
      });

      // Safety net: poll briefly in case the auth event fired before we subscribed.
      const started = Date.now();
      const poll = window.setInterval(async () => {
        if (cancelled || settled) {
          window.clearInterval(poll);
          return;
        }
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          window.clearInterval(poll);
          await continueWithSession(data.session);
          return;
        }
        if (Date.now() - started > 10000) {
          window.clearInterval(poll);
          if (!cancelled && !settled) {
            setError(
              'Sign-in timed out. Return to sign in and try Google again. Use the same host you started from (localhost or 127.0.0.1).',
            );
          }
        }
      }, 250);

      return () => {
        listener.subscription.unsubscribe();
        window.clearInterval(poll);
      };
    }

    let cleanup: (() => void) | undefined;
    void waitForSession().then((fn) => {
      cleanup = fn;
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [navigate, onAuthed]);

  if (error) {
    return (
      <AuthLayout title="Sign-in interrupted" subtitle="Google sign-in did not finish">
        <div className="auth-banner" role="alert">
          <AlertCircle size={18} strokeWidth={2.2} aria-hidden="true" />
          <span>{error}</span>
        </div>
        <div className="auth-form">
          <button
            type="button"
            className="auth-primary-btn"
            onClick={() => {
              callbackRedirectStarted = false;
              window.location.assign('/login');
            }}
          >
            Try again
          </button>
          <Link className="auth-secondary-btn" to="/signup">
            Back to sign up
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Finishing sign-in" subtitle={status}>
      <div className="sd-skeleton" aria-hidden="true" />
      <p className="auth-subtitle">Please wait — we are confirming your Google account.</p>
    </AuthLayout>
  );
};
