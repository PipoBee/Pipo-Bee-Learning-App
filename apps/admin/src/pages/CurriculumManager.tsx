import React, { useEffect, useState } from 'react';
import { AdminAPI } from '../services/api';

export const CurriculumManager: React.FC = () => {
  const [bundle, setBundle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWorldId, setSelectedWorldId] = useState<string>('world-1');
  const [expandedLevelId, setExpandedLevelId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        setLoading(true);
        const data = await AdminAPI.getCurriculumBundle();
        setBundle(data);
        if (data.worlds && data.worlds.length > 0) {
          setSelectedWorldId(data.worlds[0].id);
        }
      } catch (err) {
        console.error('Failed to load bundle', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBundle();
  }, []);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading Curriculum...</div>;
  }

  const activeWorld = bundle?.worlds?.find((w: any) => w.id === selectedWorldId);

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Phonics Curriculum Architecture</h2>
          <p style={styles.subtitle}>
            15 Levels • 5 Worlds • Decodable Synthetic Phonics Progression
          </p>
        </div>
        <div style={styles.statsBadge}>
          {bundle?.levelsCount || 15} Levels Active
        </div>
      </div>

      {/* Worlds Horizontal Tabs */}
      <div style={styles.worldTabs}>
        {bundle?.worlds?.map((w: any) => {
          const isActive = w.id === selectedWorldId;
          return (
            <button
              key={w.id}
              onClick={() => setSelectedWorldId(w.id)}
              style={{
                ...styles.worldTab,
                borderColor: isActive ? w.accentColor : '#E2E8F0',
                backgroundColor: isActive ? '#FFFFFF' : '#C8E8F8',
                color: isActive ? '#1B1A4A' : '#64748B',
                boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <span style={styles.worldCode}>{w.code}</span>
              <span style={styles.worldTabTitle}>{w.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active World Overview Card */}
      {activeWorld && (
        <div style={{ ...styles.activeWorldCard, borderColor: activeWorld.accentColor }}>
          <div style={styles.worldCardHeader}>
            <div>
              <span style={{ ...styles.worldPill, backgroundColor: activeWorld.themeColor }}>
                {activeWorld.code}
              </span>
              <h3 style={styles.worldName}>{activeWorld.title}</h3>
              <p style={styles.worldDescription}>{activeWorld.description}</p>
            </div>
            <div style={styles.levelCountPill}>
              {activeWorld.levels?.length || 3} Levels in Stage
            </div>
          </div>

          {/* Levels List */}
          <div style={styles.levelsList}>
            {activeWorld.levels?.map((lvl: any) => {
              const isExpanded = expandedLevelId === lvl.id;

              return (
                <div key={lvl.id} style={styles.levelCard}>
                  <div
                    style={styles.levelHeader}
                    onClick={() => setExpandedLevelId(isExpanded ? null : lvl.id)}
                  >
                    <div style={styles.levelSoundBadge}>{lvl.soundLabel}</div>
                    <div style={styles.levelDetails}>
                      <div style={styles.levelTitleRow}>
                        <h4 style={styles.levelTitle}>{lvl.title}</h4>
                        {lvl.isTestLevel && <span style={styles.testBadge}>🏆 Milestone Test</span>}
                      </div>
                      <p style={styles.levelSubtitle}>{lvl.subtitle}</p>
                    </div>

                    <div style={styles.levelMeta}>
                      <span style={styles.taskCount}>
                        {lvl.tasks?.length || 2} Tasks
                      </span>
                      <span style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Expanded Task & Words Details */}
                  {isExpanded && (
                    <div style={styles.taskAccordion}>
                      <div style={styles.tasksContainer}>
                        {lvl.tasks?.map((task: any, tIdx: number) => (
                          <div key={task.id || tIdx} style={styles.taskRow}>
                            <div style={styles.taskTypeBadge}>{task.taskType}</div>
                            <div style={styles.taskInfo}>
                              <strong>{task.title}</strong>
                              <span style={styles.taskInstructions}>{task.instructionText}</span>
                            </div>
                            <div style={styles.taskItemsCount}>
                              {task.items?.length || 1} Item(s)
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '22px',
    fontWeight: 900,
    color: '#1B1A4A',
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748B',
    marginTop: '2px',
  },
  statsBadge: {
    backgroundColor: '#FFF6C8',
    color: '#1B1A4A',
    fontWeight: 800,
    fontSize: '13px',
    padding: '8px 16px',
    borderRadius: '14px',
  },
  worldTabs: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  worldTab: {
    padding: '12px 18px',
    borderRadius: '14px',
    border: '2px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    whiteSpace: 'nowrap',
    fontWeight: 700,
    fontSize: '14px',
  },
  worldCode: {
    backgroundColor: '#C8E8F8',
    color: '#1B1A4A',
    fontWeight: 800,
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  worldTabTitle: {
    fontWeight: 700,
  },
  activeWorldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    border: '2px solid #E2E8F0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  },
  worldCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    borderBottom: '1px solid #C8E8F8',
    paddingBottom: '16px',
  },
  worldPill: {
    display: 'inline-block',
    color: '#FFFFFF',
    fontWeight: 800,
    fontSize: '11px',
    padding: '3px 10px',
    borderRadius: '8px',
    marginBottom: '8px',
  },
  worldName: {
    fontSize: '20px',
    fontWeight: 900,
    color: '#1B1A4A',
  },
  worldDescription: {
    fontSize: '13px',
    color: '#64748B',
    marginTop: '4px',
  },
  levelCountPill: {
    backgroundColor: '#FFF6C8',
    color: '#475569',
    fontWeight: 700,
    fontSize: '13px',
    padding: '6px 14px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
  },
  levelsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  levelCard: {
    backgroundColor: '#FFF6C8',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
  },
  levelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    cursor: 'pointer',
  },
  levelSoundBadge: {
    width: '46px',
    height: '46px',
    borderRadius: '23px',
    backgroundColor: '#F5C400',
    border: '2px solid #F5C400',
    color: '#1B1A4A',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '20px',
    fontWeight: 900,
  },
  levelDetails: {
    flex: 1,
  },
  levelTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  levelTitle: {
    fontSize: '16px',
    fontWeight: 800,
    color: '#1B1A4A',
  },
  testBadge: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
    fontWeight: 800,
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '8px',
  },
  levelSubtitle: {
    fontSize: '12px',
    color: '#64748B',
    marginTop: '2px',
  },
  levelMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  taskCount: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#1B1A4A',
    backgroundColor: '#C8E8F8',
    padding: '4px 10px',
    borderRadius: '8px',
  },
  expandIcon: {
    fontSize: '12px',
    color: '#94A3B8',
  },
  taskAccordion: {
    padding: '0 20px 16px 20px',
    backgroundColor: '#FFF6C8',
    borderTop: '1px dashed #E2E8F0',
  },
  tasksContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '12px',
  },
  taskRow: {
    backgroundColor: '#FFFFFF',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  taskTypeBadge: {
    backgroundColor: '#EDE9FE',
    color: '#6D28D9',
    fontWeight: 800,
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '6px',
    letterSpacing: '0.5px',
  },
  taskInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  taskInstructions: {
    fontSize: '12px',
    color: '#64748B',
  },
  taskItemsCount: {
    fontSize: '12px',
    color: '#94A3B8',
    fontWeight: 600,
  },
};
