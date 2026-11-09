import React, { useEffect, useState } from 'react';
import { Auth } from './pages/Auth';
import { LearnerProgress } from './pages/LearnerProgress';
import { CurriculumManager } from './pages/CurriculumManager';
import { AudioLibrary } from './pages/AudioLibrary';
import { StudentDashboard } from './pages/StudentDashboard';
import { ParentDashboard } from './pages/ParentDashboard';
import { AdminOverview } from './pages/AdminOverview';
import { Shell } from './components/Shell';
import { SplashLoader } from './components/SplashLoader';
import { AppUser, AuthAPI } from './services/api';
import { stopLoginMusic } from './services/loginMusic';
import { supabase } from './utils/supabase';

type Todo = { id: string | number; name?: string };

type AdminTab = 'overview' | 'learner' | 'curriculum' | 'audio';

export default function App() {
  const [user, setUser] = useState<AppUser | null>(() => AuthAPI.getStoredUser());
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setSplashFading(true), 1800);
    const hideTimer = window.setTimeout(() => setBooting(false), 2250);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    async function getTodos() {
      const { data: todos, error } = await supabase.from('todos').select();
      if (error) {
        console.warn('Supabase query skipped:', error.message);
        return;
      }
      if (todos) setTodos(todos);
    }

    getTodos();
  }, []);

  const handleLogout = () => {
    stopLoginMusic();
    AuthAPI.logout();
    setUser(null);
    setActiveTab('overview');
    setSelectedStudentId(null);
  };

  let screen: React.ReactNode = <Auth onAuthSuccess={setUser} />;

  if (user?.role === 'STUDENT') {
    screen = (
      <Shell user={user} subtitle="Student Dashboard" roleLabel="Student" onLogout={handleLogout}>
        <StudentDashboard />
      </Shell>
    );
  } else if (user?.role === 'PARENT') {
    screen = (
      <Shell user={user} subtitle="Parent Dashboard" roleLabel="Parent" onLogout={handleLogout}>
        <ParentDashboard />
      </Shell>
    );
  } else if (user) {
    screen = (
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
          if (id !== 'learner') {
            setSelectedStudentId(null);
          }
        }}
        onLogout={handleLogout}
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

  return (
    <>
      {screen}
      {booting && <SplashLoader fading={splashFading} />}
    </>
  );
}
