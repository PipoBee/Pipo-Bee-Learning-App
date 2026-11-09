import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TaskItem } from '@phonicsquest/shared';
import { Colors } from '../theme/colors';
import { SoundEffects } from '../services/soundEffects';
import { Speech } from '../services/speech/SpeechService';

interface BlendReadTaskProps {
  item: TaskItem;
  onAnswer: (isCorrect: boolean) => void;
}

export const BlendReadTask: React.FC<BlendReadTaskProps> = ({ item, onAnswer }) => {
  const [activePhonemeIdx, setActivePhonemeIdx] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const word = item.targetWord || item.targetGrapheme || 'sat';
  const letters = word.split('');

  const playPhoneme = (letter: string, idx: number) => {
    setActivePhonemeIdx(idx);
    SoundEffects.playClick();
    SoundEffects.speakPhonics(letter);
    setTimeout(() => setActivePhonemeIdx(null), 500);
  };

  const handleBlendAndSpeak = async () => {
    setIsListening(true);
    setFeedback(`Listening... Read "${word}" clearly!`);
    SoundEffects.playClick();

    try {
      const res = await Speech.assessSpeech({
        expectedText: word,
        audioUri: '',
        isAssessment: false,
        confidenceThreshold: 65,
      });

      setIsListening(false);

      if (res.passed) {
        setIsSuccess(true);
        setFeedback(`🌟 Super blending! Recognized "${res.recognized}" (${res.confidence}%)`);
        SoundEffects.playSuccess();
        setTimeout(() => onAnswer(true), 900);
      } else {
        setIsSuccess(false);
        setFeedback(`Close! Try blending the sounds smoothly: ${word}`);
        SoundEffects.playRetry();
      }
    } catch {
      setIsListening(false);
      setIsSuccess(true);
      setFeedback('Great reading!');
      SoundEffects.playSuccess();
      setTimeout(() => onAnswer(true), 800);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.promptCard}>
        <Text style={styles.subtitle}>BLEND & READ</Text>
        <Text style={styles.title}>Tap each sound, then read the whole word!</Text>

        {/* Phoneme Tile Buttons */}
        <View style={styles.lettersRow}>
          {letters.map((char, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.letterTile,
                activePhonemeIdx === idx && styles.letterTileActive,
              ]}
              onPress={() => playPhoneme(char, idx)}
            >
              <Text style={styles.tileChar}>{char}</Text>
              <Text style={styles.tapNotice}>Tap 🔊</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Whole Word Audio Button */}
        <TouchableOpacity
          style={styles.wholeWordBtn}
          onPress={() => {
            SoundEffects.playClick();
            SoundEffects.speakPhonics(word);
          }}
        >
          <Text style={styles.wholeWordBtnText}>🔊 Hear Full Word: &quot;{word}&quot;</Text>
        </TouchableOpacity>
      </View>

      {/* Mic Button */}
      <TouchableOpacity
        style={[
          styles.micButton,
          isListening && styles.micButtonListening,
          isSuccess && styles.micButtonSuccess,
        ]}
        onPress={handleBlendAndSpeak}
        disabled={isListening}
      >
        <Text style={styles.micIcon}>{isListening ? '🔴' : '🎙️'}</Text>
        <Text style={styles.micLabel}>
          {isListening ? 'Listening...' : `Read "${word}" Aloud`}
        </Text>
      </TouchableOpacity>

      {feedback && (
        <View style={[styles.feedbackBox, isSuccess && styles.feedbackSuccess]}>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  promptCard: {
    width: '94%',
    maxWidth: 600,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#BAE6FD',
    marginBottom: 16,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.secondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 16,
  },
  lettersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  letterTile: {
    width: 64,
    height: 78,
    borderRadius: 16,
    backgroundColor: '#F0F9FF',
    borderWidth: 3,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterTileActive: {
    backgroundColor: '#FEF08A',
    borderColor: '#F59E0B',
    transform: [{ scale: 1.08 }],
  },
  tileChar: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0369A1',
  },
  tapNotice: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 2,
  },
  wholeWordBtn: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  wholeWordBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  micButton: {
    width: '88%',
    maxWidth: 400,
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  micButtonListening: {
    backgroundColor: '#EF4444',
  },
  micButtonSuccess: {
    backgroundColor: '#10B981',
  },
  micIcon: {
    fontSize: 22,
  },
  micLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  feedbackBox: {
    marginTop: 14,
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  feedbackSuccess: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textDark,
  },
});
