import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { Colors } from '../theme/colors';
import { SoundEffects } from '../services/soundEffects';
import { DifficultyTier } from '../data/alphabet';
import { WEEKLY_TASKS } from '../data/weeklyTasks';

interface LevelsScreenProps {
  onSelectLevel: (levelId: string, difficulty: DifficultyTier) => void;
  onSelectWeeklyTask?: (weekNumber: number) => void;
}

interface LevelCardInfo {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  badgeColor: string;
  isAvailable: boolean;
  color: string;
  lightBg: string;
  tiersLabel: string;
}

const LEVELS: LevelCardInfo[] = [
  {
    id: 'level1',
    number: 1,
    title: 'Alphabet Sounds & Test',
    subtitle: 'Learn all 26 letter sounds and practice 10 distinct words per letter!',
    icon: '🔤',
    badge: 'Voice Only • 26 Letters',
    badgeColor: '#16A34A',
    isAvailable: true,
    color: '#0284C7',
    lightBg: '#F0F9FF',
    tiersLabel: '🟢 Easy • 🟡 Medium • 🔴 Hard',
  },
  {
    id: 'level2',
    number: 2,
    title: 'Blend Random Words',
    subtitle: 'Grapheme sound tiles light up one by one — blend sounds into full words!',
    icon: '🧩',
    badge: 'Sound Tiles • Voice Blending',
    badgeColor: '#D97706',
    isAvailable: true,
    color: '#F59E0B',
    lightBg: '#FFFBEB',
    tiersLabel: '🟢 CVC • 🟡 Blends • 🔴 Vowel Teams',
  },
  {
    id: 'level3',
    number: 3,
    title: 'Common Words & Patterns',
    subtitle: 'High-frequency sight words and rhyming word families (-at, -ig, -ake)!',
    icon: '📚',
    badge: 'Word Families • Tricky Words',
    badgeColor: '#7C3AED',
    isAvailable: true,
    color: '#8B5CF6',
    lightBg: '#F5F3FF',
    tiersLabel: '🟢 Sight Words • 🟡 Rimes • 🔴 Silent Letters',
  },
  {
    id: 'level4',
    number: 4,
    title: 'Read Sentences',
    subtitle: 'Read 3 to 4 word sentences with real-time streaming word highlights!',
    icon: '📖',
    badge: 'Sentence Fluency • Real-time',
    badgeColor: '#E11D48',
    color: '#F43F5E',
    isAvailable: true,
    lightBg: '#FFF1F2',
    tiersLabel: '🟢 3-Word CVC • 🟡 4-Word Blends • 🔴 Advanced',
  },
];

export const LevelsScreen: React.FC<LevelsScreenProps> = ({
  onSelectLevel,
  onSelectWeeklyTask,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isTablet = width >= 600 && width < 900;

  // Selected level for the difficulty modal
  const [modalLevel, setModalLevel] = useState<LevelCardInfo | null>(null);

  const handleCardClick = (level: LevelCardInfo) => {
    SoundEffects.playClick();
    setModalLevel(level);
  };

  const handleChooseDifficulty = (tier: DifficultyTier) => {
    SoundEffects.playClick();
    if (!modalLevel) return;
    const levelId = modalLevel.id;
    setModalLevel(null);
    onSelectLevel(levelId, tier);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Friendly Mascot Banner */}
        <View style={styles.mascotBanner}>
          <View style={styles.mascotAvatar}>
            <Text style={styles.mascotAvatarEmoji}>🦜</Text>
          </View>
          <View style={styles.mascotSpeechBubble}>
            <Text style={styles.mascotTitle}>Welcome to Phonics Game! 👋</Text>
            <Text style={styles.mascotSubtitle}>
              Tap a level to select your difficulty (Easy, Medium, Advanced) and start reading aloud!
            </Text>
          </View>
        </View>

        {/* WEEKLY TASKS 1 TILL 8 SECTION (Grade 3 Spelling & Phonics) */}
        <View style={styles.weeklySectionContainer}>
          <View style={styles.weeklySectionHeader}>
            <View style={styles.weeklyBadgePill}>
              <Text style={styles.weeklyBadgePillText}>GRADE 3 • 10 WORDS PER WEEK</Text>
            </View>
            <Text style={styles.weeklySectionTitle}>📅 Weekly Tasks (Weeks 1 – 8)</Text>
            <Text style={styles.weeklySectionSubtitle}>
              Blend, read and learn all 10 words with voice recognition!
            </Text>
          </View>

          {/* 8 Weeks Grid */}
          <View style={[styles.weeklyGrid, isDesktop && styles.weeklyGridDesktop, isTablet && styles.weeklyGridTablet]}>
            {WEEKLY_TASKS.map((wTask) => (
              <TouchableOpacity
                key={wTask.weekNumber}
                style={[
                  styles.weekCard,
                  { backgroundColor: wTask.lightBg, borderColor: wTask.badgeColor },
                ]}
                onPress={() => {
                  SoundEffects.playClick();
                  if (onSelectWeeklyTask) {
                    onSelectWeeklyTask(wTask.weekNumber);
                  }
                }}
                activeOpacity={0.88}
                accessibilityLabel={`Open Week ${wTask.weekNumber}: ${wTask.theme}`}
              >
                <View style={styles.weekCardTop}>
                  <View style={[styles.weekNumberBadge, { backgroundColor: wTask.badgeColor }]}>
                    <Text style={styles.weekNumberBadgeText}>WEEK {wTask.weekNumber}</Text>
                  </View>
                  <View style={styles.weekWordCountBadge}>
                    <Text style={styles.weekWordCountText}>10 Words</Text>
                  </View>
                </View>

                <Text style={styles.weekCardTheme}>{wTask.theme}</Text>

                {/* Sample words preview */}
                <View style={styles.weekSampleRow}>
                  {wTask.words.slice(0, 3).map((wItem) => (
                    <View key={wItem.word} style={styles.sampleWordPill}>
                      <Text style={styles.sampleWordPillText}>{wItem.word}</Text>
                    </View>
                  ))}
                  <Text style={styles.sampleWordMore}>+7 more</Text>
                </View>

                {/* Action button */}
                <View style={[styles.weekActionButton, { backgroundColor: wTask.badgeColor }]}>
                  <Text style={styles.weekActionButtonText}>Blend & Read ➔</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📚 Choose Your Level</Text>
          <Text style={styles.sectionHint}>4 Sequential Phonics Milestones</Text>
        </View>

        {/* Levels Grid */}
        <View style={[styles.levelsGrid, isDesktop && styles.levelsGridDesktop, isTablet && styles.levelsGridTablet]}>
          {LEVELS.map((lvl) => (
            <TouchableOpacity
              key={lvl.id}
              style={[
                styles.levelCard,
                { backgroundColor: lvl.lightBg, borderColor: lvl.color },
                isDesktop && styles.levelCardDesktop,
              ]}
              onPress={() => handleCardClick(lvl)}
              activeOpacity={0.88}
              accessibilityLabel={`Open Level ${lvl.number}: ${lvl.title}`}
            >
              {/* Top row: Number pill + Badge */}
              <View style={styles.cardHeader}>
                <View style={[styles.levelNumberBadge, { backgroundColor: lvl.color }]}>
                  <Text style={styles.levelNumberText}>LEVEL {lvl.number}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: lvl.badgeColor + '20' }]}>
                  <Text style={[styles.statusBadgeText, { color: lvl.badgeColor }]}>{lvl.badge}</Text>
                </View>
              </View>

              {/* Icon & Title */}
              <View style={styles.cardBody}>
                <View style={[styles.iconCircle, { backgroundColor: lvl.color + '20' }]}>
                  <Text style={styles.iconEmoji}>{lvl.icon}</Text>
                </View>
                <View style={styles.cardTitleBlock}>
                  <Text style={styles.cardTitle}>{lvl.title}</Text>
                  <Text style={styles.cardSubtitle}>{lvl.subtitle}</Text>
                </View>
              </View>

              {/* Tiers indicator & Action Button */}
              <View style={styles.cardFooter}>
                <Text style={styles.tiersIndicatorText}>{lvl.tiersLabel}</Text>
                <View style={[styles.playButton, { backgroundColor: lvl.color }]}>
                  <Text style={styles.playButtonText}>Select Difficulty ➔</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* DIFFICULTY SELECTION MODAL (Sequence Step 2) */}
      <Modal
        visible={modalLevel !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalLevel(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTop}>
                <View style={[styles.modalLevelBadge, { backgroundColor: modalLevel?.color || '#0284C7' }]}>
                  <Text style={styles.modalLevelBadgeText}>
                    LEVEL {modalLevel?.number}: {modalLevel?.title.toUpperCase()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setModalLevel(null)}
                  accessibilityLabel="Close difficulty selector"
                >
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalTitle}>Choose Your Difficulty</Text>
              <Text style={styles.modalSubtitle}>
                Select how challenging you want your 10 words to be:
              </Text>
            </View>

            {/* 3 Difficulty Options (Sequence Step 2 Buttons) */}
            <View style={styles.optionsList}>
              {/* 1. EASY OPTION */}
              <TouchableOpacity
                style={[styles.optionCard, styles.optionCardEasy]}
                onPress={() => handleChooseDifficulty('easy')}
                activeOpacity={0.85}
              >
                <View style={styles.optionEmojiCircle}>
                  <Text style={styles.optionEmoji}>🟢</Text>
                </View>
                <View style={styles.optionContent}>
                  <View style={styles.optionTitleRow}>
                    <Text style={[styles.optionTitle, { color: '#15803D' }]}>Easy Mode</Text>
                    <Text style={styles.optionStarHint}>⭐⭐⭐ 1–3 Stars</Text>
                  </View>
                  <Text style={styles.optionDesc}>
                    3-letter CVC & simple short-vowel words (e.g. cat, sun, bed, bat)
                  </Text>
                  <Text style={styles.optionCountTag}>10 simple words per letter</Text>
                </View>
                <Text style={styles.optionArrow}>➔</Text>
              </TouchableOpacity>

              {/* 2. MEDIUM OPTION */}
              <TouchableOpacity
                style={[styles.optionCard, styles.optionCardMedium]}
                onPress={() => handleChooseDifficulty('medium')}
                activeOpacity={0.85}
              >
                <View style={styles.optionEmojiCircle}>
                  <Text style={styles.optionEmoji}>🟡</Text>
                </View>
                <View style={styles.optionContent}>
                  <View style={styles.optionTitleRow}>
                    <Text style={[styles.optionTitle, { color: '#A16207' }]}>Medium Mode</Text>
                    <Text style={styles.optionStarHint}>⭐⭐⭐ 1–3 Stars</Text>
                  </View>
                  <Text style={styles.optionDesc}>
                    4–5 letter words with blends & digraphs (e.g. frog, ship, lamp, star)
                  </Text>
                  <Text style={styles.optionCountTag}>10 medium words per letter</Text>
                </View>
                <Text style={styles.optionArrow}>➔</Text>
              </TouchableOpacity>

              {/* 3. ADVANCED OPTION */}
              <TouchableOpacity
                style={[styles.optionCard, styles.optionCardAdvanced]}
                onPress={() => handleChooseDifficulty('advanced')}
                activeOpacity={0.85}
              >
                <View style={styles.optionEmojiCircle}>
                  <Text style={styles.optionEmoji}>🔴</Text>
                </View>
                <View style={styles.optionContent}>
                  <View style={styles.optionTitleRow}>
                    <Text style={[styles.optionTitle, { color: '#B91C1C' }]}>Hard Mode</Text>
                    <Text style={styles.optionStarHint}>⭐⭐⭐ 1–3 Stars</Text>
                  </View>
                  <Text style={styles.optionDesc}>
                    Multi-syllable & rich vocabulary (e.g. rabbit, rainbow, banana)
                  </Text>
                  <Text style={styles.optionCountTag}>10 hard words per letter</Text>
                </View>
                <Text style={styles.optionArrow}>➔</Text>
              </TouchableOpacity>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalLevel(null)}>
              <Text style={styles.cancelBtnText}>Back to Levels</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 18,
    alignItems: 'center',
    paddingBottom: 48,
  },
  mascotBanner: {
    width: '100%',
    maxWidth: 1320,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#BAE6FD',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  mascotAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  mascotAvatarEmoji: {
    fontSize: 34,
  },
  mascotSpeechBubble: {
    flex: 1,
  },
  mascotTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0369A1',
    marginBottom: 3,
  },
  mascotSubtitle: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    lineHeight: 18,
  },
  sectionHeader: {
    width: '100%',
    maxWidth: 1320,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textDark,
  },
  sectionHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  levelsGrid: {
    width: '100%',
    maxWidth: 1320,
    gap: 16,
  },
  levelsGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  levelsGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  levelCard: {
    width: '100%',
    borderRadius: 22,
    padding: 18,
    borderWidth: 2.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  levelCardDesktop: {
    width: '48.5%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelNumberBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  levelNumberText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconEmoji: {
    fontSize: 30,
  },
  cardTitleBlock: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    lineHeight: 18,
  },
  cardFooter: {
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tiersIndicatorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    flex: 1,
  },
  playButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  playButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 22,
    borderWidth: 2,
    borderColor: '#BAE6FD',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalLevelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  modalLevelBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#64748B',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  optionsList: {
    gap: 12,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 14,
    borderWidth: 2,
  },
  optionCardEasy: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  optionCardMedium: {
    backgroundColor: '#FEFCE8',
    borderColor: '#FDE047',
  },
  optionCardAdvanced: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  optionEmojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionContent: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  optionStarHint: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EAB308',
  },
  optionDesc: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 4,
  },
  optionCountTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  optionArrow: {
    fontSize: 18,
    fontWeight: '900',
    color: '#94A3B8',
    marginLeft: 8,
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748B',
  },
  // Weekly Tasks Styles
  weeklySectionContainer: {
    marginBottom: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  weeklySectionHeader: {
    marginBottom: 16,
  },
  weeklyBadgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginBottom: 6,
  },
  weeklyBadgePillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  weeklySectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  weeklySectionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  weeklyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  weeklyGridDesktop: {
    gap: 14,
  },
  weeklyGridTablet: {
    gap: 12,
  },
  weekCard: {
    width: '100%',
    minWidth: 240,
    maxWidth: '100%',
    borderRadius: 18,
    borderWidth: 2,
    padding: 16,
    flex: 1,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  weekCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weekNumberBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  weekNumberBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  weekWordCountBadge: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  weekWordCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  weekCardTheme: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
  },
  weekSampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  sampleWordPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  sampleWordPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  sampleWordMore: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  weekActionButton: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekActionButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
