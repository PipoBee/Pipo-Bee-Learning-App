import React, { useEffect, useState } from 'react';
import { AVATAR_EMOJI, StudentProgressPanel } from '../components/StudentProgressPanel';
import { ChildProfile, ParentAPI } from '../services/api';

const AVATAR_OPTIONS = [
  { id: 'parrot_01', label: 'Parrot' },
  { id: 'owl_01', label: 'Owl' },
  { id: 'fox_01', label: 'Fox' },
  { id: 'bear_01', label: 'Bear' },
  { id: 'bunny_01', label: 'Bunny' },
];

export const ParentDashboard: React.FC = () => {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [remainingSlots, setRemainingSlots] = useState(3);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState(6);
  const [avatarId, setAvatarId] = useState('parrot_01');
  const [saving, setSaving] = useState(false);

  const loadChildren = async () => {
    const data = await ParentAPI.listChildren();
    setChildren(data.children);
    setRemainingSlots(data.remainingSlots);
    return data.children;
  };

  useEffect(() => {
    loadChildren()
      .catch((err) => setError(err.response?.data?.message || 'Could not load children'))
      .finally(() => setLoading(false));
  }, []);

  const openChild = async (id: string) => {
    setSelectedId(id);
    setDashboard(null);
    try {
      const data = await ParentAPI.getChildDashboard(id);
      setDashboard(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not open this child dashboard');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const child = await ParentAPI.createChild({ displayName, age, avatarId });
      const next = await loadChildren();
      setShowForm(false);
      setDisplayName('');
      setAge(6);
      setAvatarId('parrot_01');
      if (next.find((item) => item.id === child.id)) {
        await openChild(child.id);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not create child dashboard');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (child: ChildProfile) => {
    if (!confirm(`Remove ${child.displayName}'s dashboard? This frees one of your 3 slots.`)) {
      return;
    }
    await ParentAPI.deleteChild(child.id);
    setSelectedId(null);
    setDashboard(null);
    await loadChildren();
  };

  if (loading) {
    return <div style={styles.muted}>Loading family dashboards...</div>;
  }

  if (selectedId) {
    return (
      <div style={styles.stack}>
        <div style={styles.toolbar}>
          <button
            onClick={() => {
              setSelectedId(null);
              setDashboard(null);
            }}
            style={styles.backBtn}
          >
            ← All children
          </button>
        </div>
        {dashboard ? (
          <StudentProgressPanel data={dashboard} heading={`${dashboard.displayName}'s progress`} />
        ) : (
          <div style={styles.muted}>Opening child dashboard...</div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.stack}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Family dashboards</h2>
          <p style={styles.subtitle}>Create up to 3 children and check each child’s progress.</p>
        </div>
        <span style={styles.slotPill}>{children.length}/3 children</span>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        {children.map((child) => (
          <div key={child.id} style={styles.childCard}>
            <div style={styles.childTop}>
              <div style={styles.avatar}>{AVATAR_EMOJI[child.avatarId] || '🧒'}</div>
              <div>
                <h3 style={styles.childName}>{child.displayName}</h3>
                <p style={styles.childMeta}>Age {child.age} • ⭐ {child.totalStars} • 🔥 {child.streakDays} days</p>
              </div>
            </div>
            <div style={styles.childActions}>
              <button onClick={() => openChild(child.id)} style={styles.primaryBtn}>
                View progress
              </button>
              <button onClick={() => handleDelete(child)} style={styles.dangerBtn}>
                Remove
              </button>
            </div>
          </div>
        ))}

        {remainingSlots > 0 && !showForm && (
          <button onClick={() => setShowForm(true)} style={styles.addCard}>
            <span style={{ fontSize: 32 }}>➕</span>
            <strong>Add child dashboard</strong>
            <span style={styles.childMeta}>{remainingSlots} slot{remainingSlots === 1 ? '' : 's'} left</span>
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={styles.formCard}>
          <h3 style={styles.formTitle}>New child dashboard</h3>
          <div style={styles.formGrid}>
            <label style={styles.field}>
              <span style={styles.label}>Child name</span>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                minLength={2}
                placeholder="Mia"
                style={styles.input}
              />
            </label>
            <label style={styles.field}>
              <span style={styles.label}>Age</span>
              <input
                type="number"
                min={3}
                max={14}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Avatar</span>
            <div style={styles.avatarRow}>
              {AVATAR_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setAvatarId(option.id)}
                  style={{
                    ...styles.avatarPick,
                    borderColor: avatarId === option.id ? '#1B1A4A' : '#E2E8F0',
                    backgroundColor: avatarId === option.id ? '#FFF6C8' : '#FFFFFF',
                  }}
                >
                  <span style={{ fontSize: 22 }}>{AVATAR_EMOJI[option.id]}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div style={styles.formActions}>
            <button type="submit" disabled={saving} style={styles.primaryBtn}>
              {saving ? 'Creating...' : 'Create dashboard'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={styles.ghostBtn}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {children.length === 0 && !showForm && (
        <div style={styles.empty}>No child dashboards yet. Add the first learner to start tracking progress.</div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    fontSize: '22px',
    fontWeight: 900,
    color: '#1B1A4A',
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748B',
    marginTop: '4px',
  },
  slotPill: {
    backgroundColor: '#FFF6C8',
    color: '#1B1A4A',
    fontWeight: 800,
    fontSize: '13px',
    padding: '8px 16px',
    borderRadius: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  childCard: {
    backgroundColor: '#FFFFFF',
    border: '2px solid #C8E8F8',
    borderRadius: '20px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  childTop: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  avatar: {
    width: '52px',
    height: '52px',
    borderRadius: '26px',
    backgroundColor: '#F5C400',
    border: '2px solid #F5C400',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26px',
  },
  childName: {
    fontSize: '18px',
    fontWeight: 800,
    color: '#1B1A4A',
  },
  childMeta: {
    fontSize: '12px',
    color: '#64748B',
    fontWeight: 600,
  },
  childActions: {
    display: 'flex',
    gap: '8px',
  },
  addCard: {
    minHeight: '160px',
    border: '2px dashed #C8E8F8',
    borderRadius: '20px',
    backgroundColor: '#FFF6C8',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: '#1B1A4A',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '20px',
    padding: '24px',
  },
  formTitle: {
    fontSize: '16px',
    fontWeight: 800,
    marginBottom: '16px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '12px',
    marginBottom: '14px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#475569',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
  },
  avatarRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  avatarPick: {
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    padding: '8px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: 700,
    fontSize: '13px',
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px',
  },
  primaryBtn: {
    backgroundColor: '#1B1A4A',
    color: '#FFFFFF',
    fontWeight: 800,
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '13px',
  },
  ghostBtn: {
    backgroundColor: '#C8E8F8',
    color: '#475569',
    fontWeight: 700,
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '13px',
  },
  dangerBtn: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    fontWeight: 700,
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '13px',
  },
  backBtn: {
    backgroundColor: '#C8E8F8',
    color: '#334155',
    fontWeight: 700,
    padding: '8px 14px',
    borderRadius: '10px',
  },
  toolbar: {
    display: 'flex',
  },
  error: {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    padding: '12px 16px',
    borderRadius: '12px',
    fontWeight: 700,
  },
  muted: {
    padding: '40px',
    textAlign: 'center',
    color: '#64748B',
  },
  empty: {
    padding: '24px',
    textAlign: 'center',
    color: '#94A3B8',
  },
};
