import React from 'react';

interface BrandLogoProps {
  size?: 'header' | 'auth';
  showTagline?: boolean;
}

const BeeMark: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg
    className="brand-mark"
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M18 2.5 28.5 8.5v11L18 33.5 7.5 19.5v-11L18 2.5Z"
      fill="var(--honey)"
      stroke="var(--forest)"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M12.5 16.5h11M12.5 20.5h11"
      stroke="var(--forest)"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="15.2" cy="12.2" r="1.3" fill="var(--forest)" />
    <circle cx="20.8" cy="12.2" r="1.3" fill="var(--forest)" />
  </svg>
);

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'header', showTagline = false }) => {
  const auth = size === 'auth';

  return (
    <div
      className="brand-logo"
      style={{
        flexDirection: auth ? 'column' : 'row',
        alignItems: auth ? 'center' : 'center',
        width: auth ? '100%' : undefined,
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        <BeeMark size={auth ? 48 : 36} />
        <span className="brand-word" style={{ fontSize: auth ? 34 : 20 }}>
          <span>Pipo</span>
          <span className="brand-bee">Bee</span>
        </span>
      </div>
      {showTagline && (
        <div
          style={{
            marginTop: auth ? 10 : 0,
            color: 'var(--forest)',
            font: 'var(--text-label)',
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
          }}
        >
          Sounds to Stories
        </div>
      )}
    </div>
  );
};
