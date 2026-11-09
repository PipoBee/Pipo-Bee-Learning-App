import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { Colors } from '../theme/colors';
import { Mascot, MascotMood } from '../components/Mascot';
import { ListenPickTask } from '../components/ListenPickTask';
import { TracingCanvas } from '../components/TracingCanvas';
import { SaySoundTask } from '../components/SaySoundTask';
import { BlendReadTask } from '../components/BlendReadTask';
import { SpellWordTask } from '../components/SpellWordTask';
import { RewardsModal } from '../components/RewardsModal';

export const ActivityScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const { getActiveLevel, completeLevel, setActiveLevelId, worlds } = useGameStore();
  const level = getActiveLevel();

  const isWide = width >= 600;

  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [itemsCompleted, setItemsCompleted] = useState<number>(0);
  const [rewardsVisible, setRewardsVisible] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [earnedCoins, setEarnedCoins] = useState<number>(0);
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [mascotMessage, setMascotMessage] = useState<string>(
    level ? `Let's master the ${level.title} sound together!` : 'Ready!'
  );

  if (!level) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No level selected.</Text>
      </View>
    );
  }

  const currentTask = level.tasks[currentTaskIndex];
  const currentItem = currentTask?.items[currentItemIndex];

  // Compute total steps in this level
  const totalSteps = level.tasks.reduce((acc, t) => acc + (t.items?.length || 1), 0);
  const progressRatio = Math.min(1, itemsCompleted / Math.max(1, totalSteps));

  const handleNextStep = (stepScore: number) => {
    const nextCompleted = itemsCompleted + 1;
    const nextTotalScore = totalScore + stepScore;

    setTotalScore(nextTotalScore);
    setItemsCompleted(nextCompleted);

    // Check if more items in current task
    if (currentTask?.items && currentItemIndex + 1 < currentTask.items.length) {
      setCurrentItemIndex((prev) => prev + 1);
      setMascotMood('happy');
      setMascotMessage('Awesome! Here is the next sound challenge!');
    } else if (currentTaskIndex + 1 < level.tasks.length) {
      // Move to next task in this level
      setCurrentTaskIndex((prev) => prev + 1);
      setCurrentItemIndex(0);
      setMascotMood('celebrating');
      setMascotMessage('Great job! Moving to the next learning activity!');
    } else {
      // Completed entire level!
      const avgScore = Math.round(nextTotalScore / Math.max(1, totalSteps));
      let stars = 1;
      if (avgScore >= 85) stars = 3;
      else if (avgScore >= 70) stars = 2;

      const { newCoins } = completeLevel(level.id, stars, avgScore);
      setEarnedStars(stars);
      setEarnedCoins(newCoins);
      setRewardsVisible(true);
      setMascotMood('celebrating');
      setMascotMessage('🎉 You completed the quest! You earned new stars!');
    }
  };

  const handleNextLevel = () => {
    setRewardsVisible(false);
    // Find next level in overall curriculum
    let allLevels: any[] = [];
    worlds.forEach((w) => allLevels.push(...w.levels));
    const currentIndex = allLevels.findIndex((l) => l.id === level.id);

    if (currentIndex >= 0 && currentIndex + 1 < allLevels.length) {
      const nextLvl = allLevels[currentIndex + 1];
      setActiveLevelId(nextLvl.id);
      setCurrentTaskIndex(0);
      setCurrentItemIndex(0);
      setTotalScore(0);
      setItemsCompleted(0);
      setMascotMood('happy');
      setMascotMessage(`Welcome to ${nextLvl.title}! Let's go!`);
    } else {
      setActiveLevelId(null);
    }
  };

  const handleReplay = () => {
    setRewardsVisible(false);
    setCurrentTaskIndex(0);
    setCurrentItemIndex(0);
    setTotalScore(0);
    setItemsCompleted(0);
    setMascotMood('idle');
    setMascotMessage(`Let's try ${level.title} again and aim for 3 stars!`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Level Header Info */}
      <View style={styles.headerWrapper}>
        <View style={[styles.headerCard, isWide && styles.headerCardWide]}>
          <View style={styles.headerTopRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>LEVEL {level.orderIndex}</Text>
            </View>
            <Text style={styles.progressText}>
              Step {itemsCompleted + 1} of {totalSteps}
            </Text>
          </View>

          <Text style={styles.levelTitle}>{level.title} — {currentTask?.title}</Text>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressRatio * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Mascot Companion */}
      <Mascot mood={mascotMood} message={mascotMessage} />

      {/* Dynamic Task Content based on TaskType */}
      <View style={styles.taskContainer}>
        {currentTask?.taskType === 'LISTEN_PICK' && currentItem && (
          <ListenPickTask
            item={currentItem}
            onAnswer={(_correct) => handleNextStep(100)}
          />
        )}

        {currentTask?.taskType === 'TRACE_LETTER' && currentItem?.tracingData && (
          <TracingCanvas
            data={currentItem.tracingData}
            onComplete={(acc) => handleNextStep(acc)}
          />
        )}

        {currentTask?.taskType === 'SAY_SOUND' && currentItem && (
          <SaySoundTask
            item={currentItem}
            onAnswer={(_correct) => handleNextStep(95)}
          />
        )}

        {currentTask?.taskType === 'BLEND_READ' && currentItem && (
          <BlendReadTask
            item={currentItem}
            onAnswer={(_correct) => handleNextStep(95)}
          />
        )}

        {(currentTask?.taskType === 'SPELL_WORD' || currentTask?.taskType === 'LEVEL_TEST') &&
          currentItem && (
            <SpellWordTask
              key={currentItem.id}
              item={currentItem}
              isTest={currentTask.taskType === 'LEVEL_TEST'}
              onAnswer={(score) => handleNextStep(score)}
            />
          )}
      </View>

      {/* Rewards Celebration Modal */}
      <RewardsModal
        visible={rewardsVisible}
        stars={earnedStars}
        levelTitle={level.title}
        coinsEarned={earnedCoins}
        onNextLevel={handleNextLevel}
        onReplay={handleReplay}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  content: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMedium,
  },
  headerWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  headerCard: {
    width: '94%',
    maxWidth: 640,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2.5,
    borderColor: '#BAE6FD',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerCardWide: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelBadge: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FDE047',
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#854D0E',
    letterSpacing: 0.5,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textDark,
    marginBottom: 8,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#E0F2FE',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 5,
  },
  taskContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
