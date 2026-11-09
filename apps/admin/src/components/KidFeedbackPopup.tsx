import React from 'react';

interface KidFeedbackPopupProps {
  kind: 'success' | 'retry';
  title: string;
  message: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  skipLabel?: string;
  onSkip?: () => void;
  hint?: string;
}

export const KidFeedbackPopup: React.FC<KidFeedbackPopupProps> = ({
  kind,
  title,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  skipLabel,
  onSkip,
  hint,
}) => {
  const success = kind === 'success';

  return (
    <div style={styles.overlay}>
      <div
        className="pq-pop-card"
        style={{
          ...styles.card,
          background: success
            ? 'linear-gradient(180deg, #ECFDF5 0%, #FFFFFF 55%)'
            : 'linear-gradient(180deg, #FFF6C8 0%, #FFFFFF 55%)',
          borderColor: success ? '#86EFAC' : '#F5C400',
        }}
      >
        <div style={styles.sparkleRow}>
          <span className="pq-twinkle">✨</span>
          <span className="pq-twinkle" style={{ animationDelay: '0.2s' }}>⭐</span>
          <span className="pq-twinkle" style={{ animationDelay: '0.4s' }}>✨</span>
        </div>
        <div className="pq-bounce" style={styles.faceCircle}>
          {success ? '🥳' : '🤗'}
        </div>
        <h3 style={{ ...styles.title, color: success ? '#15803D' : '#C2410C' }}>{title}</h3>
        <p style={styles.message}>{message}</p>
        {hint && <div style={styles.hintBox}>{hint}</div>}
        {success && (
          <div style={styles.stars}>
            <span>⭐</span><span>⭐</span><span>⭐</span>
          </div>
        )}
        <div style={styles.actions}>
          <button
            onClick={onPrimary}
            style={{
              ...styles.primary,
              backgroundColor: success ? '#16A34A' : '#F5C400',
              color: success ? '#FFFFFF' : '#1B1A4A',
            }}
          >
            {primaryLabel}
          </button>
          {secondaryLabel && onSecondary && (
            <button onClick={onSecondary} style={styles.secondary}>
              {secondaryLabel}
            </button>
          )}
          {onSkip && (
            <button onClick={onSkip} style={styles.skip}>
              {skipLabel || 'Skip this word →'}
            </button>
          )}
        </div>
        <div style={styles.mascot}>You can do it!</div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 50,
  },
  card: {
    width: 'min(440px, 100%)',
    borderRadius: 28,
    padding: '28px 24px 22px',
    textAlign: 'center',
    border: '4px solid',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.2)',
  },
  sparkleRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    fontSize: 22,
    marginBottom: 6,
  },
  faceCircle: {
    width: 96,
    height: 96,
    margin: '8px auto 12px',
    borderRadius: 48,
    backgroundColor: '#F5C400',
    border: '4px solid #F5C400',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 52,
  },
  title: {
    fontSize: 28,
    fontWeight: 900,
    marginBottom: 8,
  },
  message: {
    fontSize: 17,
    fontWeight: 600,
    color: '#334155',
    lineHeight: 1.45,
    marginBottom: 12,
  },
  hintBox: {
    backgroundColor: '#FFF6C8',
    borderRadius: 14,
    padding: '10px 12px',
    fontWeight: 800,
    color: '#1B1A4A',
    marginBottom: 12,
  },
  stars: {
    fontSize: 28,
    letterSpacing: 8,
    marginBottom: 14,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  primary: {
    fontWeight: 900,
    fontSize: 18,
    padding: '14px 18px',
    borderRadius: 16,
    boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
  },
  secondary: {
    backgroundColor: '#C8E8F8',
    color: '#1B1A4A',
    fontWeight: 800,
    fontSize: 16,
    padding: '12px 16px',
    borderRadius: 16,
  },
  skip: {
    marginTop: 10,
    width: '100%',
    backgroundColor: '#C8E8F8',
    color: '#334155',
    fontWeight: 800,
    fontSize: 16,
    padding: '12px 16px',
    borderRadius: 16,
  },
  mascot: {
    marginTop: 12,
    fontWeight: 800,
    color: '#1B1A4A',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
};
