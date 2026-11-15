import React from 'react';
import { BrandLogo } from '../BrandLogo';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export const AuthLayout: React.FC<Props> = ({ title, subtitle, children }) => (
  <div className="auth-shell">
    <aside className="auth-panel" aria-hidden="false">
      <div className="auth-panel-inner">
        <BrandLogo size="auth" showTagline />
        <h2 className="auth-panel-title">Learn English with Pipo</h2>
        <p className="auth-panel-copy">
          Clear levels, kind feedback, and a friendly bee coach from first letter sounds to fluent reading.
        </p>
        <div className="auth-illustration" aria-hidden="true">
          <svg viewBox="0 0 280 180" fill="none">
            <ellipse cx="140" cy="150" rx="100" ry="18" fill="rgba(255,210,77,0.25)" />
            <path d="M90 110c20-40 80-40 100 0" stroke="#FFD24D" strokeWidth="8" strokeLinecap="round" />
            <circle cx="140" cy="78" r="36" fill="#FFD24D" stroke="#0B3B33" strokeWidth="3" />
            <path d="M118 78h44M118 90h44" stroke="#0B3B33" strokeWidth="4" strokeLinecap="round" />
            <circle cx="128" cy="68" r="3" fill="#0B3B33" />
            <circle cx="152" cy="68" r="3" fill="#0B3B33" />
            <path d="M110 55c-10-18 8-28 18-14M170 55c10-18-8-28-18-14" stroke="#CDEBDC" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </aside>
    <main className="auth-main">
      <div className="auth-card">
        <div className="auth-mobile-brand">
          <BrandLogo size="auth" showTagline />
        </div>
        <h1 className="auth-title">{title}</h1>
        {subtitle ? <p className="auth-subtitle">{subtitle}</p> : null}
        {children}
      </div>
    </main>
  </div>
);
