import React, { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import {
  initInstallPromptCapture,
  isAppInstalled,
  isIosDevice,
  markInstallPopupSeenThisSession,
  promptInstallApp,
  shouldShowInstallPopup,
  subscribeInstallPrompt,
  hasDeferredInstallPrompt,
} from '../services/installApp';

type Props = {
  /** When true (signed-in dashboard), consider showing the login popup. */
  enabled: boolean;
};

export const InstallAppPrompt: React.FC<Props> = ({ enabled }) => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [canPrompt, setCanPrompt] = useState(hasDeferredInstallPrompt());
  const ios = isIosDevice();

  useEffect(() => {
    const stop = initInstallPromptCapture();
    const unsub = subscribeInstallPrompt(() => setCanPrompt(hasDeferredInstallPrompt()));
    return () => {
      stop();
      unsub();
    };
  }, []);

  useEffect(() => {
    if (!enabled || isAppInstalled() || !shouldShowInstallPopup()) {
      setOpen(false);
      return;
    }
    // Give beforeinstallprompt a moment after login.
    const timer = window.setTimeout(() => {
      if (!isAppInstalled() && shouldShowInstallPopup()) {
        setOpen(true);
      }
    }, 900);
    return () => window.clearTimeout(timer);
  }, [enabled]);

  const close = () => {
    markInstallPopupSeenThisSession();
    setOpen(false);
  };

  const install = async () => {
    setBusy(true);
    try {
      const result = await promptInstallApp();
      if (result === 'accepted') {
        close();
        return;
      }
      if (result === 'unavailable' && !ios) {
        // Browser has no native prompt yet; keep instructions visible.
        setCanPrompt(false);
      }
      if (result === 'dismissed') {
        close();
      }
    } finally {
      setBusy(false);
    }
  };

  if (!open || isAppInstalled()) return null;

  return (
    <div className="install-overlay" role="dialog" aria-modal="true" aria-labelledby="install-title">
      <div className="install-card">
        <button type="button" className="install-close" aria-label="Close" onClick={close}>
          <X size={18} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <div className="install-icon" aria-hidden="true">
          <Download size={28} strokeWidth={2.2} />
        </div>
        <h2 id="install-title">Install Pipo Bee</h2>
        <p>
          Add Pipo Bee to your home screen for quicker access, a fuller screen, and a smoother learning session.
        </p>

        {ios ? (
          <ol className="install-steps">
            <li>
              Tap <Share size={14} strokeWidth={2.4} aria-label="Share" /> Share in Safari
            </li>
            <li>Choose <strong>Add to Home Screen</strong></li>
            <li>Tap <strong>Add</strong></li>
          </ol>
        ) : null}

        {!ios && canPrompt ? (
          <button type="button" className="auth-primary-btn" disabled={busy} onClick={() => void install()}>
            {busy ? 'Opening…' : 'Install app'}
          </button>
        ) : null}

        {!ios && !canPrompt ? (
          <p className="auth-hint">
            In Chrome or Edge, open the browser menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.
          </p>
        ) : null}

        <button type="button" className="auth-secondary-btn" onClick={close}>
          Not now
        </button>
      </div>
    </div>
  );
};

/** Compact install action for Profile / settings. */
export const InstallAppButton: React.FC = () => {
  const [canPrompt, setCanPrompt] = useState(hasDeferredInstallPrompt());
  const [busy, setBusy] = useState(false);
  const [hidden, setHidden] = useState(isAppInstalled());
  const ios = isIosDevice();

  useEffect(() => {
    const stop = initInstallPromptCapture();
    const unsub = subscribeInstallPrompt(() => {
      setCanPrompt(hasDeferredInstallPrompt());
      setHidden(isAppInstalled());
    });
    return () => {
      stop();
      unsub();
    };
  }, []);

  if (hidden) {
    return <p className="auth-hint">Pipo Bee is installed on this device.</p>;
  }

  return (
    <div className="profile-install-box">
      <div>
        <strong>Install app</strong>
        <p className="auth-hint">
          {ios
            ? 'Use Share → Add to Home Screen in Safari.'
            : 'Install Pipo Bee for a home-screen shortcut.'}
        </p>
      </div>
      {!ios ? (
        <button
          type="button"
          className="auth-secondary-btn profile-install-btn"
          disabled={busy || !canPrompt}
          onClick={() => {
            void (async () => {
              setBusy(true);
              try {
                const result = await promptInstallApp();
                if (result === 'accepted') setHidden(true);
              } finally {
                setBusy(false);
              }
            })();
          }}
        >
          <Download size={18} strokeWidth={2.2} aria-hidden="true" />
          {busy ? 'Opening…' : canPrompt ? 'Install' : 'Use browser menu'}
        </button>
      ) : null}
    </div>
  );
};
