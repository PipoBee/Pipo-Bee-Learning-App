import React, { useCallback, useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/auth/Toast';
import { PublicOnly, RequireAuth } from './components/auth/RequireAuth';
import { Shell } from './components/Shell';
import { SplashLoader } from './components/SplashLoader';
import { AdminOverview } from './pages/AdminOverview';
import { AudioLibrary } from './pages/AudioLibrary';
import { CurriculumManager } from './pages/CurriculumManager';
import { LearnerProgress } from './pages/LearnerProgress';
import { ParentDashboard } from './pages/ParentDashboard';
import { StudentPortal } from './pages/StudentPortal';
import { AuthCallback } from './pages/auth/AuthCallback';
import { CheckEmail } from './pages/auth/CheckEmail';
import { CompleteProfile } from './pages/auth/CompleteProfile';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Onboarding } from './pages/auth/Onboarding';
import { PrivacyPage, TermsPage } from './pages/auth/LegalPages';
import { ResetPassword } from './pages/auth/ResetPassword';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';
import { AppUser, AuthAPI } from './services/api';
import { InstallAppPrompt } from './components/InstallAppPrompt';
import { ProfileAPI, UserProfile } from './services/profile';
import { resetInstallPopupForNextLogin } from './services/installApp';
import { stopLoginMusic } from './services/loginMusic';

type AdminTab = 'overview' | 'learner' | 'curriculum' | 'audio';

function DashboardScreen({
  user,
  onLogout,
}: {
  user: AppUser;
  onLogout: () => void;
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  if (user.role === 'STUDENT') {
    return (
      <Shell user={user} subtitle="Student Dashboard" roleLabel="Student" onLogout={onLogout} fullWidth>
        <StudentPortal />
      </Shell>
    );
  }

  if (user.role === 'PARENT') {
    return (
      <Shell user={user} subtitle="Parent Dashboard" roleLabel="Parent" onLogout={onLogout}>
        <ParentDashboard />
      </Shell>
    );
  }

  return (
    <Shell
      user={user}
      subtitle="Admin • Full Access"
      roleLabel="Super Admin"
      tabs={[
        { id: 'overview', label: 'Overview' },
        { id: 'learner', label: 'Learner Progress' },
        { id: 'curriculum', label: 'Curriculum' },
        { id: 'audio', label: 'Audio Library' },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => {
        setActiveTab(id as AdminTab);
        if (id !== 'learner') setSelectedStudentId(null);
      }}
      onLogout={onLogout}
    >
      {activeTab === 'overview' && (
        <AdminOverview
          onOpenStudent={(id) => {
            setSelectedStudentId(id);
            setActiveTab('learner');
          }}
        />
      )}
      {activeTab === 'learner' && (
        <LearnerProgress
          studentId={selectedStudentId}
          onBack={
            selectedStudentId
              ? () => {
                  setSelectedStudentId(null);
                  setActiveTab('overview');
                }
              : undefined
          }
        />
      )}
      {activeTab === 'curriculum' && <CurriculumManager />}
      {activeTab === 'audio' && <AudioLibrary />}
    </Shell>
  );
}

export default function App() {
  const [user, setUser] = useState<AppUser | null>(() => AuthAPI.getStoredUser());
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [booting, setBooting] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setSplashFading(true), 1800);
    const hideTimer = window.setTimeout(() => setBooting(false), 2250);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  const refreshAuth = useCallback(async (): Promise<void> => {
    const restored = await AuthAPI.restoreSession();
    if (!restored) {
      setUser(null);
      setProfile(null);
      return;
    }
    setUser(restored);
    if (restored.role === 'ADMIN' || restored.role === 'TEACHER') {
      setProfile(null);
      return;
    }
    try {
      const mine = await ProfileAPI.ensureMine();
      setProfile(mine);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      try {
        await refreshAuth();
      } catch {
        if (!cancelled && AuthAPI.getStoredUser()) {
          await AuthAPI.logout();
          setUser(null);
          setProfile(null);
        }
      }
    }
    void boot();
    return () => {
      cancelled = true;
    };
  }, [refreshAuth]);

  const handleLogout = async () => {
    stopLoginMusic();
    resetInstallPopupForNextLogin();
    await AuthAPI.logout();
    setUser(null);
    setProfile(null);
  };

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />

          <Route
            path="/login"
            element={(
              <PublicOnly user={user} profile={profile} booting={booting}>
                <SignIn onAuthed={refreshAuth} />
              </PublicOnly>
            )}
          />
          <Route
            path="/signup"
            element={(
              <PublicOnly user={user} profile={profile} booting={booting}>
                <SignUp onAuthed={refreshAuth} />
              </PublicOnly>
            )}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/auth/callback" element={<AuthCallback onAuthed={refreshAuth} />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          <Route
            path="/complete-profile"
            element={(
              <RequireAuth user={user} profile={profile} booting={booting}>
                <CompleteProfile onAuthed={refreshAuth} />
              </RequireAuth>
            )}
          />
          <Route
            path="/onboarding"
            element={(
              <RequireAuth user={user} profile={profile} booting={booting}>
                <Onboarding onAuthed={refreshAuth} />
              </RequireAuth>
            )}
          />
          <Route
            path="/dashboard"
            element={(
              <RequireAuth user={user} profile={profile} booting={booting}>
                {user ? <DashboardScreen user={user} onLogout={() => void handleLogout()} /> : null}
              </RequireAuth>
            )}
          />

          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        </Routes>
        <InstallAppPromptGate userSignedIn={Boolean(user) && !booting} />
      </BrowserRouter>
      {booting && <SplashLoader fading={splashFading} />}
      <Analytics />
    </ToastProvider>
  );
}

function InstallAppPromptGate({ userSignedIn }: { userSignedIn: boolean }) {
  const location = useLocation();
  const onDashboard = location.pathname === '/dashboard';
  return <InstallAppPrompt enabled={userSignedIn && onDashboard} />;
}
