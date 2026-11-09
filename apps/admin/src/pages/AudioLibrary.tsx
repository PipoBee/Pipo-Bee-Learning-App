import React, { useEffect, useState } from 'react';
import { AdminAPI } from '../services/api';

export const AudioLibrary: React.FC = () => {
  const [audioList, setAudioList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<'PHONEME' | 'WORD' | 'INSTRUCTION' | 'SFX'>('PHONEME');
  const [transcript, setTranscript] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const fetchAudioList = async () => {
    try {
      setLoading(true);
      const list = await AdminAPI.getAudioList();
      setAudioList(list);
    } catch (err) {
      console.error('Failed to load audio list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudioList();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please choose an audio file (WAV or MP3)');
      return;
    }

    try {
      setUploading(true);
      setMessage(null);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      if (transcript) {
        formData.append('transcript', transcript);
      }

      await AdminAPI.uploadAudio(formData);
      setMessage(`✅ Uploaded "${file.name}" to local disk storage!`);
      setFile(null);
      setTranscript('');
      await fetchAudioList();
    } catch (err: any) {
      setMessage(`❌ Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, fileName: string) => {
    if (!confirm(`Delete audio file "${fileName}"?`)) return;

    try {
      await AdminAPI.deleteAudio(id);
      await fetchAudioList();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Audio Asset & Pronunciation Library</h2>
        <p style={styles.subtitle}>
          Upload and manage local sound files stored in /uploads for offline curriculum packs.
        </p>
      </div>

      {message && <div style={styles.messageBox}>{message}</div>}

      {/* Upload Box */}
      <div style={styles.uploadCard}>
        <h3 style={styles.uploadTitle}>🎙️ Upload or Replace Audio Asset</h3>
        <form onSubmit={handleUpload} style={styles.uploadForm}>
          <div style={styles.formRow}>
            <div style={styles.field}>
              <label style={styles.label}>Audio File (WAV, MP3, M4A)</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={styles.fileInput}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Asset Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                style={styles.select}
              >
                <option value="PHONEME">Phoneme Sound (/s/, /æ/, etc.)</option>
                <option value="WORD">Decodable Word (sat, pig, etc.)</option>
                <option value="INSTRUCTION">Voice Prompt / Instruction</option>
                <option value="SFX">Sound Effect / Chime</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Transcript / Target Phoneme</label>
              <input
                type="text"
                placeholder="e.g. /s/ or sun"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                style={styles.textInput}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            style={{
              ...styles.uploadBtn,
              opacity: uploading || !file ? 0.6 : 1,
            }}
          >
            {uploading ? 'Saving to Local Storage...' : 'Save Audio Asset ⬆️'}
          </button>
        </form>
      </div>

      {/* Asset Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeaderRow}>
          <h3 style={styles.tableTitle}>Stored Curriculum Audio Clips</h3>
          <span style={styles.badge}>{audioList.length} Files</span>
        </div>

        {loading ? (
          <div style={{ padding: 20 }}>Loading audio assets...</div>
        ) : audioList.length === 0 ? (
          <div style={styles.emptyState}>No audio files uploaded yet.</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>File Name</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Transcript</th>
                  <th style={styles.th}>Audio Player Preview</th>
                  <th style={styles.th}>Size</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {audioList.map((asset) => (
                  <tr key={asset.id} style={styles.tr}>
                    <td style={styles.tdBold}>{asset.fileName}</td>
                    <td style={styles.td}>
                      <span style={styles.categoryBadge}>{asset.category}</span>
                    </td>
                    <td style={styles.td}>{asset.transcript || '—'}</td>
                    <td style={styles.td}>
                      <audio controls src={asset.publicUrl} style={styles.audioPlayer}>
                        Your browser does not support the audio element.
                      </audio>
                    </td>
                    <td style={styles.tdMuted}>
                      {asset.sizeBytes ? `${Math.round(asset.sizeBytes / 1024)} KB` : '—'}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleDelete(asset.id, asset.fileName)}
                        style={styles.deleteBtn}
                        title="Delete audio"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontSize: '22px',
    fontWeight: 900,
    color: '#1B1A4A',
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748B',
  },
  messageBox: {
    backgroundColor: '#F0FDF4',
    border: '1px solid #BBF7D0',
    color: '#166534',
    padding: '12px 18px',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '14px',
  },
  uploadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    border: '2px solid #C8E8F8',
    boxShadow: '0 4px 12px rgba(27, 26, 74, 0.04)',
  },
  uploadTitle: {
    fontSize: '16px',
    fontWeight: 800,
    color: '#1B1A4A',
    marginBottom: '16px',
  },
  uploadForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
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
  fileInput: {
    padding: '8px',
    borderRadius: '10px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFF6C8',
    fontSize: '13px',
  },
  select: {
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 600,
  },
  textInput: {
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    fontSize: '14px',
  },
  uploadBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#1B1A4A',
    color: '#FFFFFF',
    fontWeight: 800,
    fontSize: '14px',
    padding: '12px 24px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(27, 26, 74, 0.2)',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid #E2E8F0',
  },
  tableHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: 800,
    color: '#1B1A4A',
  },
  badge: {
    backgroundColor: '#C8E8F8',
    color: '#1B1A4A',
    fontWeight: 800,
    fontSize: '12px',
    padding: '4px 12px',
    borderRadius: '10px',
  },
  emptyState: {
    padding: '30px',
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: '14px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  thRow: {
    borderBottom: '2px solid #C8E8F8',
  },
  th: {
    padding: '12px 14px',
    fontSize: '12px',
    fontWeight: 800,
    color: '#64748B',
    textTransform: 'uppercase',
  },
  tr: {
    borderBottom: '1px solid #C8E8F8',
  },
  td: {
    padding: '12px 14px',
    fontSize: '14px',
  },
  tdBold: {
    padding: '12px 14px',
    fontSize: '14px',
    fontWeight: 700,
    color: '#1B1A4A',
  },
  tdMuted: {
    padding: '12px 14px',
    fontSize: '12px',
    color: '#94A3B8',
  },
  categoryBadge: {
    backgroundColor: '#FFF6C8',
    color: '#1B1A4A',
    fontWeight: 800,
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  audioPlayer: {
    height: '36px',
    maxWidth: '240px',
  },
  deleteBtn: {
    padding: '6px 10px',
    borderRadius: '8px',
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    fontSize: '14px',
  },
};
