import React from 'react';
import { BookOpen, Home, Target, UserRound } from 'lucide-react';

export type StudentTab = 'home' | 'learn' | 'practice' | 'profile';

const TABS: Array<{ id: StudentTab; label: string; Icon: typeof Home }> = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'learn', label: 'Learn', Icon: BookOpen },
  { id: 'practice', label: 'Practice', Icon: Target },
  { id: 'profile', label: 'Profile', Icon: UserRound },
];

type Props = {
  active: StudentTab;
  onChange: (tab: StudentTab) => void;
};

export const StudentNav: React.FC<Props> = ({ active, onChange }) => {
  return (
    <>
      <nav className="student-sidebar" aria-label="Student sections">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={`student-nav-btn${active === id ? ' is-on' : ''}`}
            aria-current={active === id ? 'page' : undefined}
            onClick={() => onChange(id)}
          >
            <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <nav className="student-tabbar" aria-label="Student sections">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={`student-tabbar-btn${active === id ? ' is-on' : ''}`}
            aria-current={active === id ? 'page' : undefined}
            onClick={() => onChange(id)}
          >
            <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};
