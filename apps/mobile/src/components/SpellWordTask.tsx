import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TaskItem } from '@phonicsquest/shared';
import { Colors } from '../theme/colors';
import { SoundEffects } from '../services/soundEffects';

interface SpellWordTaskProps {
  item: TaskItem;
  /** Level-test mode: stricter scoring, no sound hints on tiles. */
  isTest?: boolean;
  /** Called with a 0-100 score once the word is spelled correctly. */
  onAnswer: (score: number) => void;
}

// Split a word into sound units, keeping digraphs (sh, ch, th) together.
export function splitGraphemes(word: string): string[] {
  const w = word.toLowerCase();
  const out: string[] = [];
  for (let i = 0; i < w.length; i++) {
    const pair = w.slice(i, i + 2);
    if (pair === 'sh' || pair === 'ch' || pair === 'th') {
      out.push(pair);
      i++;
    } else {
      out.push(w[i]);
    }
  }
  return out;
}

function shuffleUntilDifferent<T>(arr: T[]): T[] {
  if (arr.length < 2) return arr;
  const original = arr.join('|');
  let result = arr;
  for (let tries = 0; tries < 10 && result.join('|') === original; tries++) {
    result = [...arr].sort(() => Math.random() - 0.5);
  }
  return result;
}

export const SpellWordTask: React.FC<SpellWordTaskProps> = ({ item, isTest = false, onAnswer }) => {
  const word = (item.targetWord || item.targetGrapheme || 'sat').toLowerCase();
  const target = useMemo(() => splitGraphemes(word), [word]);
  const tiles = useMemo(() => shuffleUntilDifferent(target), [target]);

  const [used, setUsed] = useState<number[]>([]); // indices into tiles, in placed order
  const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>('idle');
  const mistakes = useRef(0);

  const placed = used.map((i) => tiles[i]);

  const hearWord = () => {
    SoundEffects.playClick();
    SoundEffects.speakPhonics(word);
  };

  const checkWord = (nextUsed: number[]) => {
    const attempt = nextUsed.map((i) => tiles[i]);
    if (attempt.join('') === target.join('')) {
      setStatus('right');
      SoundEffects.playSuccess();
      const penalty = isTest ? 40 : 20;
      const score = Math.max(isTest ? 40 : 50, 100 - mistakes.current * penalty);
      setTimeout(() => onAnswer(score), 900);
    } else {
      mistakes.current += 1;
      setStatus('wrong');
      SoundEffects.playRetry();
      setTimeout(() => {
        setUsed([]);
        setStatus('idle');
      }, 900);
    }
  };

  const tapTile = (idx: number) => {
    if (status !== 'idle' || used.includes(idx)) return;
    SoundEffects.playClick();
    if (!isTest) SoundEffects.speakPhonics(tiles[idx]);
    const next = [...used, idx];
    setUsed(next);
    if (next.length === tiles.length) checkWord(next);
  };

  const undo = () => {
    if (status !== 'idle' || used.length === 0) return;
    SoundEffects.playClick();
    setUsed(used.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.promptCard, isTest && styles.promptCardTest]}>
        <Text style={styles.subtitle}>{isTest ? 'LEVEL TEST' : 'SPELL THE WORD'}</Text>
        <Text style={styles.title}>Listen, then build the word with the sounds!</Text>

        <TouchableOpacity style={styles.hearBtn} onPress={hearWord} accessibilityLabel="Hear the word">
          <Text style={styles.hearIcon}>🔊</Text>
          <Text style={styles.hearText}>Hear the word</Text>
        </TouchableOpacity>

        {/* Answer slots */}
        <View style={styles.slotsRow}>
          {target.map((_, i) => (
            <View
              key={`slot-${i}`}
              style={[
                styles.slot,
                placed[i] !== undefined && styles.slotFilled,
                status === 'right' && styles.slotRight,
                status === 'wrong' && styles.slotWrong,
              ]}
            >
              <Text style={styles.slotText}>{placed[i] ?? ''}</Text>
            </View>
          ))}
        </View>

        {status === 'right' && <Text style={styles.feedbackGood}>🌟 You spelled "{word}"!</Text>}
        {status === 'wrong' && <Text style={styles.feedbackBad}>Not quite — listen and try again.</Text>}
      </View>

      {/* Letter tiles */}
      <View style={styles.tilesRow}>
        {tiles.map((t, idx) => {
          const isUsed = used.includes(idx);
          return (
            <TouchableOpacity
              key={`tile-${idx}`}
              style={[styles.tile, isUsed && styles.tileUsed]}
              onPress={() => tapTile(idx)}
              disabled={isUsed}
              accessibilityLabel={`Letter ${t}`}
            >
              <Text style={styles.tileText}>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.undoBtn} onPress={undo}>
        <Text style={styles.undoText}>↩️ Undo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '94%', maxWidth: 640, alignItems: 'center' },
  promptCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#DDD6FE',
  },
  promptCardTest: { borderColor: '#FCD34D', backgroundColor: '#FFFBEB' },
  subtitle: { fontSize: 12, fontWeight: '900', color: '#7C3AED', letterSpacing: 1, marginBottom: 6 },
  title: { fontSize: 18, fontWeight: '800', color: Colors.textDark, textAlign: 'center', marginBottom: 14 },
  hearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 18,
  },
  hearIcon: { fontSize: 22, marginRight: 8 },
  hearText: { fontSize: 15, fontWeight: '800', color: '#6D28D9' },
  slotsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  slot: {
    minWidth: 56,
    height: 64,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#C4B5FD',
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotFilled: { borderStyle: 'solid', backgroundColor: '#FFFFFF' },
  slotRight: { borderColor: '#10B981', backgroundColor: '#D1FAE5' },
  slotWrong: { borderColor: '#F87171', backgroundColor: '#FEE2E2' },
  slotText: { fontSize: 32, fontWeight: '900', color: Colors.textDark },
  feedbackGood: { marginTop: 14, fontSize: 16, fontWeight: '800', color: '#059669' },
  feedbackBad: { marginTop: 14, fontSize: 15, fontWeight: '700', color: '#DC2626' },
  tilesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 18 },
  tile: {
    minWidth: 64,
    height: 70,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  tileUsed: { opacity: 0.25 },
  tileText: { fontSize: 34, fontWeight: '900', color: '#FFFFFF' },
  undoBtn: { marginTop: 16, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F1F5F9' },
  undoText: { fontSize: 14, fontWeight: '800', color: Colors.textMedium },
});
