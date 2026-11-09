import React, { useEffect, useState } from 'react';
import { AVATAR_EMOJI } from '../components/StudentProgressPanel';
import { AdminAPI } from '../services/api';

interface Props {
  onOpenStudent: (id: string) => void;
}

export const AdminOverview: React.FC<Props> = ({ onOpenStudent }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([AdminAPI.listUsers(), AdminAPI.listStudents()])
      .then(([nextUsers, nextStudents]) => {
        setUsers(nextUsers);
        setStudents(nextStudents);
      })
      .catch((err) => setError(err.response?.data?.message || 'Could not load admin overview'));
  }, []);

  const roleCount = (role: string) => users.filter((user) => user.role === role).length;

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (users.length === 0 && students.length === 0) {
    return <div style={styles.muted}>Loading system overview...</div>;
  }

  return (
    <div style={styles.stack}>
      <div>
        <h2 style={styles.title}>Admin overview</h2>
        <p style={styles.subtitle}>Full access to every account, learner, curriculum, and audio asset.</p>
      </div>

      <div style={styles.kpiGrid}>
        <Kpi label="Users" value={users.length} icon="👥" />
        <Kpi label="Students" value={roleCount('STUDENT')} icon="🎒" />
        <Kpi label="Parents" value={roleCount('PARENT')} icon="👨‍👩‍👧" />
        <Kpi label="Learner profiles" value={students.length} icon="🧒" />
      </div>

      <section style={styles.card}>
        <h3 style={styles.sectionTitle}>All accounts</h3>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Children / profile</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={styles.tr}>
                  <td style={styles.tdBold}>{user.fullName}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span style={styles.roleChip}>{user.role}</span>
                  </td>
                  <td style={styles.td}>
                    {user.children?.length
                      ? user.children.map((child: any) => child.displayName).join(', ')
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={styles.card}>
        <h3 style={styles.sectionTitle}>All learner dashboards</h3>
        <div style={styles.studentGrid}>
          {students.map((student) => (
            <button key={student.id} onClick={() => onOpenStudent(student.id)} style={styles.studentCard}>
              <div style={styles.avatar}>{AVATAR_EMOJI[student.avatarId] || '🧒'}</div>
              <div style={{ textAlign: 'left' }}>
                <strong>{student.displayName}</strong>
                <p style={styles.meta}>
                  {student.owner?.role === 'PARENT' ? `Child of ${student.owner.fullName}` : student.owner?.email}
                </p>
                <p style={styles.meta}>
                  ✅ {student.completedLevels}/{student.totalLevels} complete • ⏳ {student.pendingLevels} pending
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

const Kpi: React.FC<{ icon: string; value: number; label: string }> = ({ icon, value, label }) => (
  <div style={styles.kpi}>
    <span style={{ fontSize: 28 }}>{icon}</span>
    <div>
      <div style={styles.kpiValue}>{value}</div>
      <div style={styles.kpiLabel}>{label}</div>
    </div>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
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
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  kpi: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '18px',
    padding: '18px',
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: '26px',
    fontWeight: 900,
    color: '#1B1A4A',
  },
  kpiLabel: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#64748B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid #E2E8F0',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 800,
    marginBottom: '16px',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '10px 12px',
    fontSize: '12px',
    fontWeight: 800,
    color: '#64748B',
    textTransform: 'uppercase',
    borderBottom: '2px solid #C8E8F8',
  },
  tr: {
    borderBottom: '1px solid #C8E8F8',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
  },
  tdBold: {
    padding: '12px',
    fontSize: '14px',
    fontWeight: 700,
  },
  roleChip: {
    backgroundColor: '#C8E8F8',
    color: '#1B1A4A',
    fontWeight: 800,
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  studentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '12px',
  },
  studentCard: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    padding: '14px',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    backgroundColor: '#FFF6C8',
    textAlign: 'left',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    backgroundColor: '#F5C400',
    border: '2px solid #F5C400',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  meta: {
    fontSize: '12px',
    color: '#64748B',
    marginTop: '2px',
  },
  error: {
    padding: '16px',
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    borderRadius: '12px',
    fontWeight: 700,
  },
  muted: {
    padding: '40px',
    textAlign: 'center',
    color: '#64748B',
  },
};
