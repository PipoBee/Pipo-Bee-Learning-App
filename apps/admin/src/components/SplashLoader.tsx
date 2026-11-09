import React from 'react';

interface SplashLoaderProps {
  fading?: boolean;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({ fading = false }) => {
  return (
    <div
      className={`pipo-splash ${fading ? 'pipo-splash-out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Pipo Bee is loading"
    >
      <span className="pipo-splash-sparkle pipo-splash-sparkle-1">✦</span>
      <span className="pipo-splash-sparkle pipo-splash-sparkle-2">✦</span>
      <span className="pipo-splash-sparkle pipo-splash-sparkle-3">✦</span>

      <div className="pipo-splash-inner">
        <div className="pipo-splash-wordmark">
          <span className="pipo-splash-pipo">Pipo</span>
          <span className="pipo-splash-bee-word">Bee</span>
        </div>
        <p className="pipo-splash-tag">Sounds to Stories</p>

        <div className="pipo-splash-track" aria-hidden="true">
          <div className="pipo-splash-fill" />
        </div>
        <p className="pipo-splash-caption">Getting your hive ready…</p>
      </div>
    </div>
  );
};
