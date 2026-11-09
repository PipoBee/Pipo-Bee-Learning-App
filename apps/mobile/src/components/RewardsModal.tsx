import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal } from 'react-native';
import { Colors } from '../theme/colors';
import { SoundEffects } from '../services/soundEffects';

interface RewardsModalProps {
  visible: boolean;
  stars: number; // 1, 2, or 3
  levelTitle: string;
  coinsEarned: number;
  onNextLevel: () => void;
  onReplay: () => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({
  visible,
  stars,
  levelTitle,
  coinsEarned,
  onNextLevel,
  onReplay,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const star1Anim = useRef(new Animated.Value(0)).current;
  const star2Anim = useRef(new Animated.Value(0)).current;
  const star3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      SoundEffects.playFanfare();

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start();

      // Staggered star pop-ins
      Animated.sequence([
        Animated.delay(200),
        Animated.spring(star1Anim, { toValue: 1, friction: 4, useNativeDriver: true }),
        Animated.spring(star2Anim, { toValue: stars >= 2 ? 1 : 0.3, friction: 4, useNativeDriver: true }),
        Animated.spring(star3Anim, { toValue: stars >= 3 ? 1 : 0.3, friction: 4, useNativeDriver: true }),
      ]).start();
    } else {
      scaleAnim.setValue(0.6);
      star1Anim.setValue(0);
      star2Anim.setValue(0);
      star3Anim.setValue(0);
    }
  }, [visible, stars]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
          {/* Confetti Ribbon Banner */}
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>QUEST COMPLETED!</Text>
          </View>

          <Text style={styles.levelName}>{levelTitle}</Text>

          {/* Stars Display */}
          <View style={styles.starsRow}>
            <Animated.Text
              style={[
                styles.star,
                { transform: [{ scale: star1Anim }] },
              ]}
            >
              ⭐
            </Animated.Text>
            <Animated.Text
              style={[
                styles.star,
                styles.centerStar,
                { transform: [{ scale: star2Anim }] },
                stars < 2 && styles.emptyStar,
              ]}
            >
              {stars >= 2 ? '⭐' : '☆'}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.star,
                { transform: [{ scale: star3Anim }] },
                stars < 3 && styles.emptyStar,
              ]}
            >
              {stars >= 3 ? '⭐' : '☆'}
            </Animated.Text>
          </View>

          {/* Reward Badges */}
          <View style={styles.rewardsRow}>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardIcon}>🪙</Text>
              <Text style={styles.rewardText}>+{coinsEarned} Coins</Text>
            </View>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardIcon}>🏆</Text>
              <Text style={styles.rewardText}>Sound Mastered</Text>
            </View>
          </View>

          {/* Mascot Speech */}
          <View style={styles.mascotBox}>
            <Text style={styles.mascotEmoji}>🦜🎉</Text>
            <Text style={styles.mascotSpeech}>
              &quot;Super phonics explorer! Your sound skills are shining!&quot;
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.replayBtn} onPress={onReplay}>
              <Text style={styles.replayBtnText}>🔄 Replay</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextBtn} onPress={onNextLevel}>
              <Text style={styles.nextBtnText}>Continue 🚀</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '90%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#38BDF8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  ribbon: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FBBF24',
  },
  ribbonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1.5,
  },
  levelName: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.textDark,
    marginBottom: 16,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 12,
  },
  star: {
    fontSize: 52,
  },
  centerStar: {
    fontSize: 68,
    marginBottom: 14,
  },
  emptyStar: {
    opacity: 0.35,
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 12,
  },
  rewardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FDE047',
    gap: 8,
  },
  rewardIcon: {
    fontSize: 20,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#854D0E',
  },
  mascotBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 14,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#BAE6FD',
    marginVertical: 16,
    gap: 12,
  },
  mascotEmoji: {
    fontSize: 32,
  },
  mascotSpeech: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: 18,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 8,
    width: '100%',
  },
  replayBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  replayBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textDark,
  },
  nextBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#059669',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
