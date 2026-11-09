import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { TaskItem, ListenPickOption } from '@phonicsquest/shared';
import { Colors } from '../theme/colors';
import { SoundEffects } from '../services/soundEffects';

interface ListenPickTaskProps {
  item: TaskItem;
  onAnswer: (isCorrect: boolean) => void;
}

export const ListenPickTask: React.FC<ListenPickTaskProps> = ({ item, onAnswer }) => {
  const { width } = useWindowDimensions();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  const isWide = width >= 560;
  const optionsCount = item.options?.length || 0;

  const handleSelectOption = (opt: ListenPickOption) => {
    setSelectedId(opt.id);

    if (opt.isCorrect) {
      SoundEffects.playSuccess();
      setHasError(false);
      setTimeout(() => {
        onAnswer(true);
      }, 700);
    } else {
      SoundEffects.playRetry();
      setHasError(true);
      setTimeout(() => {
        setSelectedId(null);
        setHasError(false);
      }, 1000);
    }
  };

  const playPromptAudio = () => {
    SoundEffects.playClick();
    if (item.targetPhoneme) {
      SoundEffects.speakPhonics(item.targetPhoneme);
    }
  };

  return (
    <View style={styles.container}>
      {/* Audio Prompt Card */}
      <View style={[styles.promptCard, isWide && styles.promptCardWide]}>
        <Text style={styles.promptSubtitle}>LISTEN CLOSELY</Text>
        <Text style={styles.promptTitle}>{item.promptText}</Text>

        <TouchableOpacity
          style={styles.speakerButton}
          onPress={playPromptAudio}
          accessibilityLabel="Play sound prompt"
        >
          <Text style={styles.speakerIcon}>🔊</Text>
          <Text style={styles.speakerLabel}>Hear Sound {item.targetPhoneme}</Text>
        </TouchableOpacity>
      </View>

      {/* Options Grid */}
      <View
        style={[
          styles.optionsGrid,
          isWide && optionsCount <= 3 && styles.optionsGridRow,
        ]}
      >
        {item.options?.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isSuccess = isSelected && opt.isCorrect;
          const isFail = isSelected && !opt.isCorrect && hasError;

          return (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={0.7}
              style={[
                styles.optionCard,
                isWide && optionsCount <= 3 && styles.optionCardRow,
                isSuccess && styles.optionSuccess,
                isFail && styles.optionFail,
              ]}
              onPress={() => handleSelectOption(opt)}
            >
              <Text style={[styles.optionLabel, isSuccess && styles.optionLabelSuccess]}>
                {opt.label}
              </Text>
              {isSuccess && <Text style={styles.checkMark}>✅</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
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
    maxWidth: 640,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#BAE6FD',
    marginBottom: 14,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  promptCardWide: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  promptSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.secondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  speakerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#FDE68A',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    gap: 8,
  },
  speakerIcon: {
    fontSize: 20,
  },
  speakerLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#92400E',
  },
  optionsGrid: {
    width: '94%',
    maxWidth: 680,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  optionsGridRow: {
    flexWrap: 'nowrap',
  },
  optionCard: {
    width: '46%',
    minHeight: 90,
    maxHeight: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
    paddingVertical: 12,
  },
  optionCardRow: {
    flex: 1,
    width: undefined,
    maxWidth: 220,
    height: 105,
  },
  optionSuccess: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  optionFail: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  optionLabel: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primary,
  },
  optionLabelSuccess: {
    color: '#15803D',
  },
  checkMark: {
    position: 'absolute',
    top: 8,
    right: 10,
    fontSize: 16,
  },
});
