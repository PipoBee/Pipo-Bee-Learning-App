import React, { useEffect, useRef, useState } from 'react';
import { AppUser } from '../services/api';
import { BrandLogo } from './BrandLogo';

type ShellTab = {
  id: string;
  label: string;
};

interface ShellProps {
  user: AppUser;
  subtitle: string;
  roleLabel: string;
  tabs?: ShellTab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({
  user,
  roleLabel,
  tabs,
  activeTab,
  onTabChange,
  onLogout,
  children,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const initial = (user.fullName?.trim()?.[0] || user.email?.[0] || 'P').toUpperCase();

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-left">
          <BrandLogo />
        </div>

        {tabs && tabs.length > 0 && (
          <nav className="app-header-tabs" aria-label="Admin sections">
            {tabs.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  className={active ? 'app-header-tab is-on' : 'app-header-tab'}
                  onClick={() => onTabChange?.(tab.id)}
                  aria-current={active ? 'page' : undefined}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        )}

        <div className="avatar-wrap" ref={menuRef}>
          <button
            type="button"
            className="avatar-btn"
            aria-label="Open account menu"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {initial}
          </button>
          {menuOpen && (
            <div className="avatar-menu" role="menu" aria-label="Account">
              <div className="avatar-menu-name">{user.fullName}</div>
              <div className="avatar-menu-role">{roleLabel}</div>
              <button
                type="button"
                className="avatar-menu-logout"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">{children}</main>
    </div>
  );
};
