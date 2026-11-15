import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { AuthAPI, AppUser } from '../services/api';
import { playLoginMusic } from '../services/loginMusic';
import { Brand } from '../theme';

interface AuthProps {
  onAuthSuccess: (user: AppUser) => void;
}

type Mode = 'signin' | 'signup';
type SignupRole = 'STUDENT' | 'PARENT';

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<Mode>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<SignupRole>('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    if (next === 'signup') {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const data = await AuthAPI.register({ fullName, email, password, role });
        if (!('user' in data) || !data.user) {
          setError('Account created. Check your email to confirm, then sign in.');
          return;
        }
        playLoginMusic();
        onAuthSuccess(data.user);
        return;
      }

      const data = await AuthAPI.login(email, password);
      playLoginMusic();
      onAuthSuccess(data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || (mode === 'signup' ? 'Could not create account' : 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <BrandLogo size="auth" showTagline />
          <h1 style={styles.title}>Sign in or create an account</h1>
          <p style={styles.subtitle}>Admin, student, and parent dashboards in one place</p>
        </div>

        <div style={styles.modeSwitch}>
          <button
            type="button"
            onClick={() => switchMode('signin')}
            style={{
              ...styles.modeBtn,
              backgroundColor: mode === 'signin' ? Brand.ink : 'transparent',
              color: mode === 'signin' ? Brand.white : Brand.muted,
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            style={{
              ...styles.modeBtn,
              backgroundColor: mode === 'signup' ? Brand.ink : 'transparent',
              color: mode === 'signup' ? Brand.white : Brand.muted,
            }}
          >
            Sign Up
          </button>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'signup' && (
            <>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  minLength={2}
                  style={styles.input}
                  placeholder="Jamie Rivera"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>I am a</label>
                <div style={styles.roleRow}>
                  <button
                    type="button"
                    onClick={() => setRole('STUDENT')}
                    style={{
                      ...styles.roleCard,
                      borderColor: role === 'STUDENT' ? Brand.ink : Brand.sky,
                      backgroundColor: role === 'STUDENT' ? Brand.sky : Brand.white,
                    }}
                  >
                    <span style={styles.roleEmoji}>🎒</span>
                    <strong>Student</strong>
                    <span style={styles.roleHint}>Progress, completion, pending work</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('PARENT')}
                    style={{
                      ...styles.roleCard,
                      borderColor: role === 'PARENT' ? Brand.ink : Brand.sky,
                      backgroundColor: role === 'PARENT' ? Brand.sky : Brand.white,
                    }}
                  >
                    <span style={styles.roleEmoji}>👨‍👩‍👧</span>
                    <strong>Parent</strong>
                    <span style={styles.roleHint}>Create up to 3 child dashboards</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrap}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{ ...styles.input, ...styles.passwordInput }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((open) => !open)}
                style={styles.eyeBtn}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div style={styles.field}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.passwordWrap}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ ...styles.input, ...styles.passwordInput }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((open) => !open)}
                  style={styles.eyeBtn}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? mode === 'signup'
                ? 'Creating account...'
                : 'Signing in...'
              : mode === 'signup'
                ? 'Create Account →'
                : 'Sign In to Portal →'}
          </button>
        </form>

        {mode === 'signin' && (
          <p style={styles.adminNote}>
            New here? Switch to Sign Up and choose Student or Parent.
          </p>
        )}

        {mode === 'signup' && (
          <p style={styles.adminNote}>
            Admin accounts are invited, not self-serve. Use the seeded admin login for full access.
          </p>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Brand.cream,
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '520px',
    backgroundColor: Brand.white,
    borderRadius: '24px',
    padding: '40px 32px',
    boxShadow: '0 20px 40px rgba(11, 59, 51, 0.08)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '22px',
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: Brand.ink,
    marginTop: '18px',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '14px',
    color: Brand.muted,
  },
  modeSwitch: {
    display: 'flex',
    gap: '8px',
    backgroundColor: Brand.mint,
    borderRadius: 999,
    padding: '4px',
    marginBottom: '20px',
  },
  modeBtn: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: 999,
    fontWeight: 700,
    fontSize: '14px',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '18px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 700,
    color: Brand.ink,
  },
  input: {
    padding: '12px 14px',
    borderRadius: '12px',
    border: `2px solid ${Brand.sky}`,
    fontSize: '15px',
    outline: 'none',
    width: '100%',
  },
  passwordWrap: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: '46px',
  },
  eyeBtn: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    color: Brand.ink,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    borderRadius: '8px',
  },
  roleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  roleCard: {
    border: `2px solid ${Brand.sky}`,
    borderRadius: '14px',
    padding: '12px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    textAlign: 'left',
  },
  roleEmoji: {
    fontSize: '22px',
  },
  roleHint: {
    fontSize: '11px',
    color: Brand.muted,
    fontWeight: 600,
    lineHeight: 1.3,
  },
  submitBtn: {
    marginTop: '6px',
    padding: '14px',
    borderRadius: 999,
    backgroundColor: Brand.forest,
    color: Brand.white,
    fontSize: '16px',
    fontWeight: 700,
  },
  demoBox: {
    marginTop: '24px',
    padding: '12px',
    backgroundColor: Brand.cream,
    borderRadius: '10px',
    border: `1px dashed ${Brand.skyDeep}`,
    textAlign: 'center',
  },
  demoLabel: {
    fontSize: '12px',
    fontWeight: 700,
    color: Brand.muted,
  },
  demoText: {
    fontSize: '12px',
    fontWeight: 600,
    color: Brand.ink,
    marginTop: '4px',
  },
  adminNote: {
    marginTop: '18px',
    fontSize: '12px',
    color: Brand.muted,
    textAlign: 'center',
    lineHeight: 1.4,
  },
};
