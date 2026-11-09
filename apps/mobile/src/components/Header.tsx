import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { Colors } from '../theme/colors';
import { SoundEffects } from '../services/soundEffects';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  currentView?: 'levels' | 'alphabets' | 'weekly-task';
  onNavigateView?: (view: 'levels' | 'alphabets' | 'weekly-task') => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Pipo Bee',
  showBack,
  onBack,
  currentView = 'levels',
  onNavigateView,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 860;
  const isTablet = width >= 600;

  const {
    totalStars,
    totalCoins,
    soundEnabled,
    toggleSound,
    setSpeechLabOpen,
    isSpeechLabOpen,
    isOnlineSynced,
  } = useGameStore();

  const handleSoundToggle = () => {
    SoundEffects.playClick();
    SoundEffects.setMuted(soundEnabled);
    toggleSound();
  };

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerContainer}>
        {/* Left Side: Brand Logo, Back Navigation, and Screen Title */}
        <View style={styles.leftGroup}>
          {showBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                SoundEffects.playClick();
                onBack?.();
              }}
              accessibilityLabel="Go back"
            >
              <Text style={styles.backButtonIcon}>←</Text>
              {isTablet && <Text style={styles.backButtonText}>Back</Text>}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.brandButton}
            onPress={() => {
              SoundEffects.playClick();
              onNavigateView?.('levels');
            }}
            accessibilityLabel="Pipo Bee Home"
          >
            <View style={styles.brandTextCol}>
              <View style={styles.brandTitleRow}>
                <Text style={styles.brandName}>Pipo</Text>
                <View style={styles.beeWord}>
                  <Text style={styles.beeWordText}>Bee</Text>
                </View>
                <View style={styles.gradeBadge}>
                  <Text style={styles.gradeBadgeText}>GRADE 3</Text>
                </View>
                {isOnlineSynced && <View style={styles.syncDot} />}
              </View>
              <Text style={styles.brandSubtitle} numberOfLines={1}>
                {title}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Center Navigation Tabs (Visible on Desktop / Tablet) */}
        {isDesktop && (
          <View style={styles.centerNav}>
            <TouchableOpacity
              style={[styles.navTab, currentView === 'levels' && styles.navTabActive]}
              onPress={() => {
                SoundEffects.playClick();
                onNavigateView?.('levels');
              }}
            >
              <Text style={[styles.navTabText, currentView === 'levels' && styles.navTabTextActive]}>
                📅 Weekly Tasks (1-8)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navTab, currentView === 'alphabets' && styles.navTabActive]}
              onPress={() => {
                SoundEffects.playClick();
                onNavigateView?.('alphabets');
              }}
            >
              <Text style={[styles.navTabText, currentView === 'alphabets' && styles.navTabTextActive]}>
                🔤 Alphabet Sounds
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Right Side: Gamification Badges & Audio / Lab Controls */}
        <View style={styles.rightGroup}>
          {/* Star Counter Pill */}
          <View style={styles.statPill}>
            <Text style={styles.statPillIcon}>⭐</Text>
            <Text style={styles.statPillNumber}>{totalStars}</Text>
          </View>

          {/* Coin Counter Pill */}
          <View style={[styles.statPill, styles.coinPill]}>
            <Text style={styles.statPillIcon}>🪙</Text>
            <Text style={styles.statPillNumber}>{totalCoins}</Text>
          </View>

          {/* Audio Sound Toggle */}
          <TouchableOpacity
            style={[styles.actionBtn, !soundEnabled && styles.actionBtnMuted]}
            onPress={handleSoundToggle}
            accessibilityLabel={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            <Text style={styles.actionBtnIcon}>{soundEnabled ? '🔊' : '🔇'}</Text>
            {isTablet && (
              <Text style={styles.actionBtnText}>{soundEnabled ? 'Sound' : 'Muted'}</Text>
            )}
          </TouchableOpacity>

          {/* Speech Lab Diagnostic Button */}
          <TouchableOpacity
            style={styles.labBtn}
            onPress={() => {
              SoundEffects.playClick();
              setSpeechLabOpen(!isSpeechLabOpen);
            }}
            accessibilityLabel="Open Speech Lab diagnostics"
          >
            <Text style={styles.labBtnIcon}>🎙️</Text>
            {isTablet && <Text style={styles.labBtnText}>Mic Lab</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    zIndex: 100,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    gap: 6,
  },
  backButtonIcon: {
    fontSize: 16,
    fontWeight: '900',
    color: '#334155',
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  brandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandTextCol: {
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1B1A4A',
    letterSpacing: -0.5,
  },
  beeWord: {
    backgroundColor: '#F5C400',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 7,
  },
  beeWordText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1B1A4A',
    letterSpacing: -0.5,
  },
  gradeBadge: {
    backgroundColor: '#1B1A4A',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gradeBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  syncDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#22C55E',
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 1,
  },
  centerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  navTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  navTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  navTabText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  navTabTextActive: {
    color: '#1B1A4A',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    gap: 4,
  },
  coinPill: {
    backgroundColor: '#FEF9C3',
    borderColor: '#FEF08A',
  },
  statPillIcon: {
    fontSize: 13,
  },
  statPillNumber: {
    fontSize: 13,
    fontWeight: '900',
    color: '#92400E',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    gap: 4,
  },
  actionBtnMuted: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  actionBtnIcon: {
    fontSize: 14,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  labBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    gap: 4,
  },
  labBtnIcon: {
    fontSize: 14,
  },
  labBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6D28D9',
  },
});
