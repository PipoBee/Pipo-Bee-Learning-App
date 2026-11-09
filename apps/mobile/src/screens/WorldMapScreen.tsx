import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { Colors } from '../theme/colors';
import { SoundEffects } from '../services/soundEffects';
import { Mascot } from '../components/Mascot';

export const WorldMapScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const { worlds, progress, setActiveLevelId, resetProgress, setAlphabetSoundsOpen } = useGameStore();
  const currentWorld = worlds[0]; // World 1: Island of First Sounds

  const isWide = width >= 680;

  const handleSelectLevel = (levelId: string, isUnlocked: boolean) => {
    if (!isUnlocked) {
      SoundEffects.playRetry();
      return;
    }
    SoundEffects.playClick();
    setActiveLevelId(levelId);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* World Banner */}
      <View style={styles.bannerWrapper}>
        <View style={[styles.worldCard, isWide && styles.worldCardWide]}>
          <View style={styles.worldBadge}>
            <Text style={styles.worldBadgeText}>STAGE 1</Text>
          </View>
          <Text style={styles.worldTitle}>🏝️ {currentWorld.title}</Text>
          <Text style={styles.worldDesc}>{currentWorld.description}</Text>
        </View>
      </View>

      {/* Alphabets Sounds Feature Card */}
      <View style={styles.bannerWrapper}>
        <TouchableOpacity
          style={[styles.alphabetFeatureCard, isWide && styles.alphabetFeatureCardWide]}
          onPress={() => {
            SoundEffects.playClick();
            setAlphabetSoundsOpen(true);
          }}
          accessibilityLabel="Open Alphabets Sounds and Pronunciation Test"
        >
          <View style={styles.featureBadge}>
            <Text style={styles.featureBadgeText}>NEW PRACTICE 🌟</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureIcon}>🔤</Text>
            <View style={styles.featureRight}>
              <Text style={styles.featureTitle}>Alphabets Sounds & Test</Text>
              <Text style={styles.featureDesc}>
                Hear phonics sounds for A–Z, explore medium words, and test your pronunciation!
              </Text>
            </View>
            <View style={styles.featureArrow}>
              <Text style={styles.featureArrowText}>Open ➡️</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Mascot Guide */}
      <Mascot
        mood="happy"
        message="Tap a level to explore! Trace letters and listen to their sounds!"
      />

      {/* Level Path Nodes */}
      <View style={[styles.pathContainer, isWide && styles.pathContainerWide]}>
        {currentWorld.levels.map((lvl, index) => {
          const prog = progress[lvl.id] || {
            isUnlocked: index === 0,
            isCompleted: false,
            starsEarned: 0,
          };

          const isUnlocked = prog.isUnlocked;
          const stars = prog.starsEarned;

          return (
            <View
              key={lvl.id}
              style={[
                styles.nodeWrapper,
                isWide && styles.nodeWrapperWide,
              ]}
            >
              {/* Connector line between nodes for mobile vertical path */}
              {!isWide && index < currentWorld.levels.length - 1 && (
                <View style={[styles.connectorLine, isUnlocked && styles.connectorActive]} />
              )}

              <TouchableOpacity
                activeOpacity={isUnlocked ? 0.8 : 1}
                style={[
                  styles.levelNode,
                  isUnlocked ? styles.nodeUnlocked : styles.nodeLocked,
                  isWide && styles.levelNodeWide,
                ]}
                onPress={() => handleSelectLevel(lvl.id, isUnlocked)}
                accessibilityLabel={`${lvl.title}: ${isUnlocked ? 'Unlocked' : 'Locked'}`}
              >
                {/* Node Sound Badge */}
                <View
                  style={[
                    styles.soundBadge,
                    isUnlocked ? styles.soundBadgeUnlocked : styles.soundBadgeLocked,
                  ]}
                >
                  <Text style={[styles.soundText, !isUnlocked && styles.soundTextLocked]}>
                    {isUnlocked ? lvl.soundLabel : '🔒'}
                  </Text>
                </View>

                {/* Level Details */}
                <View style={styles.nodeInfo}>
                  <Text style={styles.levelTitleText}>{lvl.title}</Text>
                  <Text style={styles.levelSubtitleText}>{lvl.subtitle}</Text>

                  {/* Stars / Lock Status */}
                  <View style={styles.starRow}>
                    {isUnlocked ? (
                      <>
                        <Text style={[styles.starIcon, stars < 1 && styles.starEmpty]}>⭐</Text>
                        <Text style={[styles.starIcon, stars < 2 && styles.starEmpty]}>⭐</Text>
                        <Text style={[styles.starIcon, stars < 3 && styles.starEmpty]}>⭐</Text>
                      </>
                    ) : (
                      <Text style={styles.reqText}>Needs {lvl.requiredStars} ⭐</Text>
                    )}
                  </View>
                </View>

                {/* Play Button Indicator */}
                {isUnlocked && (
                  <View style={styles.playArrow}>
                    <Text style={styles.playArrowText}>▶️</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Dev Reset / Test Controls */}
      <View style={styles.footerBox}>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => {
            SoundEffects.playClick();
            resetProgress();
          }}
        >
          <Text style={styles.resetBtnText}>🔄 Reset Quest Progress</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  content: {
    paddingBottom: 36,
    alignItems: 'center',
  },
  bannerWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  worldCard: {
    width: '94%',
    maxWidth: 640,
    marginVertical: 12,
    backgroundColor: '#0284C7',
    borderRadius: 20,
    padding: 18,
    borderWidth: 2.5,
    borderColor: '#38BDF8',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  worldCardWide: {
    maxWidth: 880,
    padding: 22,
    marginVertical: 16,
  },
  worldBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 6,
  },
  worldBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  worldTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  worldDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E0F2FE',
    lineHeight: 18,
  },
  alphabetFeatureCard: {
    width: '94%',
    maxWidth: 640,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2.5,
    borderColor: '#FDE047',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  alphabetFeatureCardWide: {
    maxWidth: 880,
    padding: 18,
  },
  featureBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF08A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 8,
  },
  featureBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#854D0E',
    letterSpacing: 0.5,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    fontSize: 34,
  },
  featureRight: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.textDark,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: Colors.textMedium,
    fontWeight: '600',
    lineHeight: 16,
  },
  featureArrow: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  featureArrowText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  pathContainer: {
    width: '94%',
    maxWidth: 640,
    marginTop: 6,
  },
  pathContainerWide: {
    maxWidth: 880,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  nodeWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  nodeWrapperWide: {
    flex: 1,
    minWidth: 260,
    maxWidth: 280,
    marginBottom: 0,
  },
  connectorLine: {
    position: 'absolute',
    left: 42,
    top: 66,
    width: 6,
    height: 34,
    backgroundColor: '#CBD5E1',
    zIndex: 1,
    borderRadius: 3,
  },
  connectorActive: {
    backgroundColor: '#38BDF8',
  },
  levelNode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 2.5,
    gap: 14,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  levelNodeWide: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 10,
  },
  nodeUnlocked: {
    borderColor: '#BAE6FD',
  },
  nodeLocked: {
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    opacity: 0.85,
  },
  soundBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
  },
  soundBadgeUnlocked: {
    backgroundColor: '#FEF08A',
    borderColor: '#F59E0B',
  },
  soundBadgeLocked: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
  },
  soundText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#B45309',
  },
  soundTextLocked: {
    fontSize: 20,
    color: '#94A3B8',
  },
  nodeInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  levelTitleText: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.textDark,
  },
  levelSubtitleText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMedium,
    marginBottom: 4,
  },
  starRow: {
    flexDirection: 'row',
    gap: 3,
  },
  starIcon: {
    fontSize: 16,
  },
  starEmpty: {
    opacity: 0.25,
  },
  reqText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  playArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playArrowText: {
    fontSize: 14,
  },
  footerBox: {
    alignItems: 'center',
    marginTop: 20,
  },
  resetBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
});
