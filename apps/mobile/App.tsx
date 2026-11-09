import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Platform, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header } from './src/components/Header';
import { LevelsScreen } from './src/screens/LevelsScreen';
import { AlphabetSoundsScreen } from './src/screens/AlphabetSoundsScreen';
import { WeeklyTaskScreen } from './src/screens/WeeklyTaskScreen';
import { DifficultyTier } from './src/data/alphabet';

type ScreenView = 'levels' | 'alphabets' | 'weekly-task';

export default function App() {
  const { width } = useWindowDimensions();
  const [currentView, setCurrentView] = useState<ScreenView>('levels');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyTier>('easy');
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(1);

  const getHeaderTitle = () => {
    if (currentView === 'alphabets') {
      return `Alphabet Sounds & Oral Test (${selectedDifficulty.toUpperCase()})`;
    }
    if (currentView === 'weekly-task') {
      return `Week ${selectedWeekNumber}: Spelling & Phonics`;
    }
    return 'Grade 3 Weekly Tasks & Phonics';
  };

  const handleHeaderBack = () => {
    setCurrentView('levels');
  };

  const handleSelectLevel = (levelId: string, difficulty: DifficultyTier) => {
    setSelectedDifficulty(difficulty);
    setCurrentLevelNumber(1);
    setCurrentView('alphabets');
  };

  const handleSelectWeeklyTask = (weekNum: number) => {
    setSelectedWeekNumber(weekNum);
    setCurrentView('weekly-task');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.appContainer}>
        {/* Full Page Width Header */}
        <Header
          title={getHeaderTitle()}
          showBack={currentView !== 'levels'}
          onBack={handleHeaderBack}
          currentView={currentView}
          onNavigateView={(view) => setCurrentView(view)}
        />

        {/* Full Page Width Content */}
        <View style={styles.mainContent}>
          {currentView === 'levels' && (
            <LevelsScreen
              onSelectLevel={handleSelectLevel}
              onSelectWeeklyTask={handleSelectWeeklyTask}
            />
          )}

          {currentView === 'alphabets' && (
            <AlphabetSoundsScreen
              initialDifficulty={selectedDifficulty}
              onBack={() => setCurrentView('levels')}
            />
          )}

          {currentView === 'weekly-task' && (
            <WeeklyTaskScreen
              weekNumber={selectedWeekNumber}
              onBack={() => setCurrentView('levels')}
              onSelectWeek={(weekNum) => setSelectedWeekNumber(weekNum)}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    width: '100%',
    height: '100%',
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    width: '100%',
    height: '100%',
  },
  mainContent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
