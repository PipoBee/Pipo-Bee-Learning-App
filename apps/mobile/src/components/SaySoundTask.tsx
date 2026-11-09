import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { TaskItem } from '@phonicsquest/shared';
import { Colors } from '../theme/colors';
import { SoundEffects } from '../services/soundEffects';
import { Speech } from '../services/speech/SpeechService';

interface SaySoundTaskProps {
  item: TaskItem;
  onAnswer: (isCorrect: boolean) => void;
}

export const SaySoundTask: React.FC<SaySoundTaskProps> = ({ item, onAnswer }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [popupFeedback, setPopupFeedback] = useState<{
    status: 'correct' | 'retry';
    title: string;
    message: string;
  } | null>(null);

  const handleClosePopup = () => {
    SoundEffects.playClick();
    const passed = popupFeedback?.status === 'correct';
    setPopupFeedback(null);
    if (passed) {
      onAnswer(true);
    }
  };

  const handleSpeak = async () => {
    setIsListening(true);
    SoundEffects.playClick();

    try {
      const res = await Speech.assessSpeech({
        expectedText: item.targetGrapheme,
        targetPhoneme: item.targetPhoneme,
        audioUri: '',
        isAssessment: false,
        confidenceThreshold: 60,
      });

      setIsListening(false);

      if (res.passed) {
        setIsSuccess(true);
        SoundEffects.playSuccess();
        setPopupFeedback({
          status: 'correct',
          title: '🌟 Fantastic Sound!',
          message: `Recognized /${res.recognized}/ with ${res.confidence}% clarity!`,
        });
      } else {
        setIsSuccess(false);
        SoundEffects.playRetry();
        setPopupFeedback({
          status: 'retry',
          title: "Almost! Let's Try Again",
          message: `Nice try! That sound was close. Listen to the target and try speaking clearly!`,
        });
      }
    } catch {
      setIsListening(false);
      setIsSuccess(true);
      SoundEffects.playSuccess();
      setPopupFeedback({
        status: 'correct',
        title: '🌟 Awesome Effort!',
        message: 'Great pronunciation practice! Moving forward!',
      });
    }
  };

  const playPromptAudio = () => {
    SoundEffects.playClick();
    SoundEffects.speakPhonics(item.targetPhoneme);
  };

  return (
    <View style={styles.container}>
      <View style={styles.promptCard}>
        <Text style={styles.subtitle}>SAY THE SOUND</Text>
        <Text style={styles.title}>What sound does this letter make?</Text>

        {/* Big Grapheme Display */}
        <View style={styles.letterCircle}>
          <Text style={styles.letterText}>{item.targetGrapheme}</Text>
        </View>

        <TouchableOpacity style={styles.speakerBtn} onPress={playPromptAudio}>
          <Text style={styles.speakerText}>🔊 Hear Target: {item.targetPhoneme}</Text>
        </TouchableOpacity>
      </View>

      {/* Speak Button */}
      <TouchableOpacity
        style={[
          styles.micButton,
          isListening && styles.micButtonListening,
          isSuccess && styles.micButtonSuccess,
        ]}
        onPress={handleSpeak}
        disabled={isListening}
      >
        <Text style={styles.micIcon}>{isListening ? '🔴' : '🎙️'}</Text>
        <Text style={styles.micLabel}>
          {isListening ? 'Listening... Speak Now!' : 'Tap & Say the Sound'}
        </Text>
      </TouchableOpacity>

      {/* Popup Modal for Feedback */}
      <Modal
        visible={popupFeedback !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClosePopup}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdropPressable}
            activeOpacity={1}
            onPress={handleClosePopup}
          />

          <View
            style={[
              styles.popupCard,
              popupFeedback?.status === 'correct'
                ? styles.popupCardCorrect
                : styles.popupCardRetry,
            ]}
          >
            <TouchableOpacity style={styles.popupCloseBtn} onPress={handleClosePopup}>
              <Text style={styles.popupCloseBtnText}>✕</Text>
            </TouchableOpacity>

            <View
              style={[
                styles.popupIconCircle,
                popupFeedback?.status === 'correct'
                  ? styles.popupIconCircleCorrect
                  : styles.popupIconCircleRetry,
              ]}
            >
              <Text style={styles.popupIconText}>
                {popupFeedback?.status === 'correct' ? '🎉' : '💪'}
              </Text>
            </View>

            <Text style={styles.popupTitle}>{popupFeedback?.title}</Text>
            <Text style={styles.popupMessage}>{popupFeedback?.message}</Text>

            <TouchableOpacity
              style={[
                styles.popupActionBtn,
                popupFeedback?.status === 'correct'
                  ? styles.popupActionBtnCorrect
                  : styles.popupActionBtnRetry,
              ]}
              onPress={handleClosePopup}
            >
              <Text style={styles.popupActionBtnText}>
                {popupFeedback?.status === 'correct' ? 'Continue ➔' : "Got it! Let's Try Again 🎙️"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 14,
  },
  letterCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FEF08A',
    borderWidth: 3,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  letterText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#92400E',
  },
  speakerBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  speakerText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 9999,
  },
  modalBackdropPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  popupCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2.5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 12,
  },
  popupCardCorrect: {
    borderColor: '#4ADE80',
  },
  popupCardRetry: {
    borderColor: '#FBBF24',
  },
  popupCloseBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  popupCloseBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#64748B',
  },
  popupIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  popupIconCircleCorrect: {
    backgroundColor: '#DCFCE7',
  },
  popupIconCircleRetry: {
    backgroundColor: '#FEF3C7',
  },
  popupIconText: {
    fontSize: 34,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  popupMessage: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  popupActionBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  popupActionBtnCorrect: {
    backgroundColor: '#10B981',
  },
  popupActionBtnRetry: {
    backgroundColor: '#0284C7',
  },
  popupActionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
