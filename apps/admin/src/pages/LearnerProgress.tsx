import React, { useEffect, useState } from 'react';
import { StudentProgressPanel } from '../components/StudentProgressPanel';
import { AdminAPI } from '../services/api';

interface Props {
  studentId?: string | null;
  onBack?: () => void;
}

export const LearnerProgress: React.FC<Props> = ({ studentId, onBack }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = studentId
        ? await AdminAPI.getStudentDashboard(studentId)
        : await AdminAPI.getLearnerAnalytics();
      setData(res);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load learner progress');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [studentId]);

  if (loading) {
    return <div style={styles.loading}>Loading student analytics...</div>;
  }

  if (error || !data) {
    return <div style={styles.error}>Error: {error || 'No data available'}</div>;
  }

  return (
    <div style={styles.stack}>
      <div style={styles.toolbar}>
        {onBack && (
          <button onClick={onBack} style={styles.backBtn}>
            ← All learners
          </button>
        )}
        <button style={styles.refreshBtn} onClick={fetchAnalytics}>
          🔄 Refresh
        </button>
      </div>
      <StudentProgressPanel data={data} heading={`${data.displayName} • learner progress`} />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  backBtn: {
    backgroundColor: '#C8E8F8',
    color: '#334155',
    fontWeight: 700,
    padding: '8px 14px',
    borderRadius: '10px',
  },
  refreshBtn: {
    backgroundColor: '#C8E8F8',
    padding: '10px 16px',
    borderRadius: '12px',
    fontWeight: 700,
    color: '#475569',
    border: '1px solid #CBD5E1',
    marginLeft: 'auto',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#64748B',
  },
  error: {
    padding: '20px',
    color: '#B91C1C',
    backgroundColor: '#FEE2E2',
    borderRadius: '12px',
  },
};
