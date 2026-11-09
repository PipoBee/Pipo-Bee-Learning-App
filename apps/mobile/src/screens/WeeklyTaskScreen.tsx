import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { Colors } from '../theme/colors';
import { SoundEffects, getAlphabetName } from '../services/soundEffects';
import { WeeklyTask, WeeklyWord, getWeeklyTask, WEEKLY_TASKS } from '../data/weeklyTasks';
import { recognizeWord, recognizeSpokenSpelling } from '../services/wordRecognizer';

type StepType = 'read' | 'blend' | 'spell' | 'oralTest';

interface WeeklyTaskScreenProps {
  weekNumber: number;
  onBack: () => void;
  onSelectWeek: (weekNumber: number) => void;
}

export const WeeklyTaskScreen: React.FC<WeeklyTaskScreenProps> = ({
  weekNumber,
  onBack,
  onSelectWeek,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const task = getWeeklyTask(weekNumber) || WEEKLY_TASKS[0];
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);

  // Active step for current word: Step 1 (Read) -> Step 2 (Blend) -> Step 3 (Voice Spell) -> Step 4 (Oral Test)
  const [currentStep, setCurrentStep] = useState<StepType>('read');

  // Track completed steps for each word index: { [wordIdx]: { read: boolean, blend: boolean, spell: boolean, oralTest: boolean } }
  const [completedWordSteps, setCompletedWordSteps] = useState<
    Record<number, { read: boolean; blend: boolean; spell: boolean; oralTest: boolean }>
  >({});

  // Set of fully mastered words (all 4 steps completed) -> each adds 1 to score!
  const [masteredWordIndices, setMasteredWordIndices] = useState<number[]>([]);

  // Voice speech state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [activeSpellingLetterIdx, setActiveSpellingLetterIdx] = useState<number | null>(null);
  const [voiceHeard, setVoiceHeard] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'correct' | 'retry';
    title: string;
    cheer: string;
    heard?: string;
  }>({
    status: 'idle',
    title: '',
    cheer: '',
  });

  // 10-Word Weekly Test Mode state
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [testStage, setTestStage] = useState<'read' | 'spell'>('read');
  const [testWordSteps, setTestWordSteps] = useState<
    Record<number, { read: boolean; spell: boolean }>
  >({});
  const [testMasteredIndices, setTestMasteredIndices] = useState<number[]>([]);
  const [isTestComplete, setIsTestComplete] = useState<boolean>(false);

  const currentWord: WeeklyWord = task.words[currentWordIndex] || task.words[0];
  const wordProgress = completedWordSteps[currentWordIndex] || {
    read: false,
    blend: false,
    spell: false,
    oralTest: false,
  };
  const isWordFullyMastered = masteredWordIndices.includes(currentWordIndex);
  const testScore = testMasteredIndices.length;

  // Encouragement messages for warmth & child motivation
  const SUCCESS_CHEERS = [
    '🌟 Brilliant job! You spoke with wonderful clarity!',
    '🎉 Superstar reader! You are getting stronger every day!',
    '🚀 Outstanding! Your phonics superpowers are shining!',
    '👏 Fantastic! Keep this amazing rhythm going!',
    '⭐ Pure excellence! You mastered that like a champion!',
  ];

  const RETRY_CHEERS = [
    "💪 Almost there! Take a deep breath, you can do it!",
    "🎧 Listen to the model sound and give it another confident try!",
    "🎈 Mistakes help our brain learn and grow! Try speaking clearly!",
    "✨ You're doing great! Let's say it one more time together!",
    "🌟 Don't give up! Speak right into the microphone, I believe in you!",
  ];

  const getRandomCheer = (list: string[]) => list[Math.floor(Math.random() * list.length)];

  const testAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset speech feedback when switching words or steps
  const clearSpeechState = () => {
    if (testAdvanceTimerRef.current) {
      clearTimeout(testAdvanceTimerRef.current);
      testAdvanceTimerRef.current = null;
    }
    SoundEffects.stopAllSpeech();
    setIsListening(false);
    setIsPlayingMusic(false);
    setActiveSpellingLetterIdx(null);
    setVoiceHeard('');
    setFeedback({ status: 'idle', title: '', cheer: '' });
  };

  // Popup helper: Close feedback modal only
  const handleCloseFeedbackOnly = () => {
    SoundEffects.playClick();
    if (testAdvanceTimerRef.current) {
      clearTimeout(testAdvanceTimerRef.current);
      testAdvanceTimerRef.current = null;
    }
    setFeedback({ status: 'idle', title: '', cheer: '' });
  };

  // Popup helper: Appropriate icon based on feedback status and message
  const getFeedbackIcon = () => {
    if (feedback.status === 'correct') {
      if (feedback.title.includes('🏆')) return '🏆';
      if (feedback.title.includes('🌟')) return '🌟';
      return '🎉';
    }
    if (feedback.title.includes('🔒') || feedback.title.toLowerCase().includes('mic')) return '🔒';
    if (feedback.title.includes('🤫') || feedback.title.toLowerCase().includes('no voice')) return '👂';
    return '💪';
  };

  // Popup helper: Action button label based on current mode & step
  const getFeedbackActionText = () => {
    if (feedback.status === 'retry') {
      return "Got it! Let's Try Again 🎙️";
    }
    if (isTestMode) {
      if (testStage === 'spell') {
        return currentWordIndex + 1 < task.words.length ? 'Next Word ➔' : 'Finish Test 🏆';
      }
      return 'Continue to Spelling Test ➔';
    }
    if (currentStep === 'read') {
      return 'Continue to Step 2 (Blend) ➔';
    }
    if (currentStep === 'spell') {
      return 'Start Spelling Test in Oral ➔';
    }
    if (currentStep === 'oralTest') {
      return currentWordIndex + 1 < task.words.length ? 'Next Word ➔' : 'Complete Week Task 🏆';
    }
    return 'Awesome! Continue ➔';
  };

  // Popup helper: Primary action button pressed
  const handleFeedbackAction = () => {
    SoundEffects.playClick();
    const prevStatus = feedback.status;
    if (testAdvanceTimerRef.current) {
      clearTimeout(testAdvanceTimerRef.current);
      testAdvanceTimerRef.current = null;
    }
    setFeedback({ status: 'idle', title: '', cheer: '' });

    if (prevStatus === 'correct') {
      if (isTestMode) {
        if (testStage === 'spell') {
          handleTestNextQuestion();
        }
      } else if (currentStep === 'read') {
        setCurrentStep('blend');
      } else if (currentStep === 'spell') {
        handleGoToOralSpellingTest();
      } else if (currentStep === 'oralTest') {
        handleAdvanceToNextWord();
      }
    }
  };

  // Play enchanting musical spelling song with melodic bell notes and glowing letter tiles
  const handlePlayMusicalSpelling = () => {
    if (isListening) return;
    setIsPlayingMusic(true);
    SoundEffects.playClick();
    SoundEffects.playMusicalSpellingSong(
      currentWord.word,
      (idx) => setActiveSpellingLetterIdx(idx),
      () => {
        setIsPlayingMusic(false);
        setActiveSpellingLetterIdx(null);
      }
    );
  };

  // Exit button dynamic label: Shows exactly where clicking will go
  const getExitButtonLabel = () => {
    if (isTestMode) {
      if (testStage === 'spell') {
        return '← Previous Step (Read Aloud)';
      }
      if (currentWordIndex > 0) {
        return `← Previous Word (${task.words[currentWordIndex - 1].word})`;
      }
      return '← Exit Test';
    }
    if (currentStep === 'oralTest') {
      return '← Previous Step (Voice Spell)';
    }
    if (currentStep === 'spell') {
      return '← Previous Step (Blend)';
    }
    if (currentStep === 'blend') {
      return '← Previous Step (Read)';
    }
    if (currentWordIndex > 0) {
      return `← Previous Word (${task.words[currentWordIndex - 1].word})`;
    }
    return '← Exit to Levels';
  };

  // Exit button: Goes to previous step!
  const handleExitToPreviousStep = () => {
    SoundEffects.playClick();
    clearSpeechState();

    if (isTestMode) {
      if (testStage === 'spell') {
        // Step 2 (Spelling) -> Go back to Step 1 (Read Aloud) of current word!
        setTestStage('read');
      } else if (testStage === 'read') {
        if (currentWordIndex > 0) {
          // Step 1 of word 2+ -> Go back to Step 2 (Spelling) of previous word!
          setCurrentWordIndex((prev) => prev - 1);
          setTestStage('spell');
        } else {
          // Word 1, Step 1 -> Exit test mode back to Study mode!
          setIsTestMode(false);
          setIsTestComplete(false);
        }
      }
      return;
    }

    if (currentStep === 'oralTest') {
      // Step 4 (Oral Test) -> Go back to Step 3 (Voice Spell)
      setCurrentStep('spell');
    } else if (currentStep === 'spell') {
      // Step 3 (Spell) -> Go back to Step 2 (Blend)
      setCurrentStep('blend');
    } else if (currentStep === 'blend') {
      // Step 2 (Blend) -> Go back to Step 1 (Read)
      setCurrentStep('read');
    } else if (currentStep === 'read') {
      if (currentWordIndex > 0) {
        // Step 1 of word 2+ -> Go back to Step 4 (Oral Test) of previous word!
        const prevIdx = currentWordIndex - 1;
        setCurrentWordIndex(prevIdx);
        setCurrentStep('oralTest');
      } else {
        // Word 1, Step 1 -> Exit back to front page (LevelsScreen)!
        onBack();
      }
    }
  };

  // Switch to specific word from the 10-word carousel
  const handleSelectWord = (idx: number) => {
    SoundEffects.playClick();
    setCurrentWordIndex(idx);
    setCurrentStep('read');
    clearSpeechState();
  };

  // Step 1: Read Aloud Voice Recognition Check
  const handleVoiceReadCheck = async () => {
    if (isListening) return;
    SoundEffects.stopAllSpeech();
    SoundEffects.playClick();
    setVoiceHeard('');
    setFeedback({ status: 'idle', title: '', cheer: '' });
    setIsListening(true);

    const result = await recognizeWord(currentWord.word, (live) => {
      setVoiceHeard(live);
    });
    setIsListening(false);
    setVoiceHeard(result.heard);

    if (result.isCorrect) {
      SoundEffects.playSuccess();
      const updatedSteps = { ...wordProgress, read: true };
      setCompletedWordSteps((prev) => ({ ...prev, [currentWordIndex]: updatedSteps }));
      setFeedback({
        status: 'correct',
        title: '🎉 Read Aloud Verified!',
        cheer: getRandomCheer(SUCCESS_CHEERS),
        heard: result.heard || currentWord.word,
      });

      // Check if all steps completed
      checkAndAwardWordMastery(currentWordIndex, updatedSteps);
    } else if (result.status === 'denied') {
      SoundEffects.playRetry();
      setFeedback({
        status: 'retry',
        title: '🔒 Microphone Blocked',
        cheer: 'Please allow microphone access in your browser address bar (click the lock or camera icon) so we can hear your reading!',
        heard: '',
      });
    } else if (result.status === 'no-speech') {
      SoundEffects.playRetry();
      setFeedback({
        status: 'retry',
        title: '🤫 No Voice Heard',
        cheer: `Speak closely into the microphone and read "${currentWord.word}" aloud!`,
        heard: '',
      });
    } else {
      SoundEffects.playRetry();
      setFeedback({
        status: 'retry',
        title: '⚠️ Almost! Let\'s Try Again',
        cheer: getRandomCheer(RETRY_CHEERS),
        heard: result.heard,
      });
    }
  };

  // Step 2: Complete Blending
  const handleBlendComplete = () => {
    SoundEffects.playClick();
    SoundEffects.playSuccess();
    const updatedSteps = { ...wordProgress, blend: true };
    setCompletedWordSteps((prev) => ({ ...prev, [currentWordIndex]: updatedSteps }));
    checkAndAwardWordMastery(currentWordIndex, updatedSteps);
    // Advance to Step 3 (Voice Spelling)
    setCurrentStep('spell');
    clearSpeechState();

    // Sing musical spelling chant to kindle excitement and student engagement
    setTimeout(() => {
      setIsPlayingMusic(true);
      SoundEffects.playMusicalSpellingSong(
        currentWord.word,
        (idx) => setActiveSpellingLetterIdx(idx),
        () => {
          setIsPlayingMusic(false);
          setActiveSpellingLetterIdx(null);
        }
      );
    }, 600);
  };

  // Step 3: Voice Spelling Test Recognition Check
  const handleVoiceSpellingCheck = async () => {
    if (isListening) return;
    SoundEffects.stopAllSpeech();
    setIsPlayingMusic(false);
    setActiveSpellingLetterIdx(null);
    SoundEffects.playClick();
    setVoiceHeard('');
    setFeedback({ status: 'idle', title: '', cheer: '' });
    setIsListening(true);

    const result = await recognizeSpokenSpelling(currentWord.word, (live) => {
      setVoiceHeard(live);
    });
    setIsListening(false);
    setVoiceHeard(result.heard);

    if (result.isCorrect) {
      SoundEffects.playSuccess();
      const updatedSteps = { ...wordProgress, spell: true };
      setCompletedWordSteps((prev) => ({ ...prev, [currentWordIndex]: updatedSteps }));
      setFeedback({
        status: 'correct',
        title: '🌟 Correct Voice Spelling!',
        cheer: getRandomCheer(SUCCESS_CHEERS),
        heard: result.heard || currentWord.word.split('').map((c) => getAlphabetName(c)).join(' - '),
      });

      // Check if all steps completed
      checkAndAwardWordMastery(currentWordIndex, updatedSteps);
    } else if (result.status === 'denied') {
      SoundEffects.playRetry();
      setFeedback({
        status: 'retry',
        title: '🔒 Microphone Blocked',
        cheer: 'Please allow microphone access in your browser address bar (click the lock or camera icon) so we can hear your spelling!',
        heard: '',
      });
    } else if (result.status === 'no-speech') {
      SoundEffects.playRetry();
      setFeedback({
        status: 'retry',
        title: '🤫 No Voice Heard',
        cheer: `Speak clearly into your mic! Say: ${currentWord.word.split('').map((c) => `${c.toUpperCase()} (${getAlphabetName(c)})`).join(' - ')}`,
        heard: '',
      });
    } else {
      SoundEffects.playRetry();
      setFeedback({
        status: 'retry',
        title: '⚠️ Spelling Try Again',
        cheer: `Say the alphabet names into the mic: ${currentWord.word.split('').map((c) => `${c.toUpperCase()} (${getAlphabetName(c)})`).join(' - ')}`,
        heard: result.heard,
      });
    }
  };

  // Award +1 score only when ALL 4 steps (read, blend, spell, oralTest) are completed!
  const checkAndAwardWordMastery = (
    wordIdx: number,
    steps: { read: boolean; blend: boolean; spell: boolean; oralTest: boolean }
  ) => {
    if (steps.read && steps.blend && steps.spell && steps.oralTest) {
      if (!masteredWordIndices.includes(wordIdx)) {
        setMasteredWordIndices((prev) => [...prev, wordIdx]);
        SoundEffects.playFanfare();
      }
    }
  };

  // Step 4: Advance to oral spelling test from Step 3
  const handleGoToOralSpellingTest = () => {
    SoundEffects.playClick();
    clearSpeechState();
    setCurrentStep('oralTest');
    setTimeout(() => {
      SoundEffects.speakDirect(
        `Spelling test in oral! Spell ${currentWord.word} from memory by saying the alphabet names.`,
        0.85
      );
    }, 250);
  };

  // Step 4: Oral Spelling Test Voice Recognition Check
  const handleOralSpellingTestCheck = async () => {
    if (isListening) return;
    SoundEffects.stopAllSpeech();
    setIsPlayingMusic(false);
    setActiveSpellingLetterIdx(null);
    SoundEffects.playClick();
    setVoiceHeard('');
    setFeedback({ status: 'idle', title: '', cheer: '' });
    setIsListening(true);

    const result = await recognizeSpokenSpelling(currentWord.word, (live) => {
      setVoiceHeard(live);
    });
    setIsListening(false);
    setVoiceHeard(result.heard);

    if (result.isCorrect) {
      SoundEffects.playSuccess();
      const updatedSteps = { ...wordProgress, oralTest: true };
      setCompletedWordSteps((prev) => ({ ...prev, [currentWordIndex]: updatedSteps }));
      setFeedback({
        status: 'correct',
        title: '🌟 Oral Spelling Test Passed!',
        cheer: `Outstanding! You spelled "${currentWord.word}" from memory by saying the alphabet names!`,
        heard: result.heard || currentWord.word.split('').map((c) => getAlphabetName(c)).join(' - '),
      });

      // Check if all 4 steps completed -> awards +1 score point!
      checkAndAwardWordMastery(currentWordIndex, updatedSteps);
    } else if (result.status === 'denied') {
      SoundEffects.playRetry();
      setFeedback({
        status: 'retry',
        title: '🔒 Microphone Blocked',
        cheer: 'Please allow microphone access in your browser address bar to take the oral spelling test!',
        heard: '',
      });
    } else if (result.status === 'no-speech') {
      SoundEffects.playRetry();
      setFeedback({
        status: 'retry',
        title: '🤫 No Voice Heard',
        cheer: 'Tap "Hear Word" to listen again, then say each Alphabet Name into the mic from memory!',
        heard: '',
      });
    } else {
      SoundEffects.playRetry();
      setFeedback({
        status: 'retry',
        title: '⚠️ Almost! Let\'s Try Again',
        cheer: 'Listen to the word again with "Hear Word" and speak each Alphabet Name from memory!',
        heard: result.heard,
      });
    }
  };

  // Advance to next word
  const handleAdvanceToNextWord = () => {
    SoundEffects.playClick();
    clearSpeechState();
    if (currentWordIndex + 1 < task.words.length) {
      setCurrentWordIndex((prev) => prev + 1);
      setCurrentStep('read');
    } else {
      // Completed all 10 words -> Start final test
      setIsTestMode(true);
      setCurrentWordIndex(0);
      setTestStage('read');
      setTestWordSteps({});
      setTestMasteredIndices([]);
      setIsTestComplete(false);
    }
  };

  // Start the 10-Word Assessment Test
  const handleStartWeeklyTest = () => {
    SoundEffects.playClick();
    setIsTestMode(true);
    setCurrentWordIndex(0);
    setTestStage('read');
    setTestWordSteps({});
    setTestMasteredIndices([]);
    setIsTestComplete(false);
    clearSpeechState();
  };

  // In Test Mode: Voice Reading Check (Step 1 of Test)
  const handleTestVoiceRead = async () => {
    if (isListening) return;
    SoundEffects.stopAllSpeech();
    SoundEffects.playClick();
    setVoiceHeard('');
    setFeedback({ status: 'idle', title: '', cheer: '' });
    setIsListening(true);

    const result = await recognizeWord(currentWord.word, (live) => {
      setVoiceHeard(live);
    });
    setIsListening(false);
    setVoiceHeard(result.heard);

    if (result.isCorrect) {
      SoundEffects.playSuccess();
      const updated = {
        ...(testWordSteps[currentWordIndex] || { read: false, spell: false }),
        read: true,
      };
      setTestWordSteps((prev) => ({ ...prev, [currentWordIndex]: updated }));

      // Check if both steps completed (if spell was already done)
      if (updated.read && updated.spell) {
        if (!testMasteredIndices.includes(currentWordIndex)) {
          setTestMasteredIndices((prev) => [...prev, currentWordIndex]);
        }
      }

      setFeedback({
        status: 'correct',
        title: '🌟 Reading Passed! (Step 1 of 2 Complete)',
        cheer: 'Awesome! Now spell this word aloud into the microphone!',
        heard: result.heard || currentWord.word,
      });
      // Move to stage 2: voice spelling test for this word
      setTestStage('spell');
    } else if (result.status === 'denied') {
      SoundEffects.playRetry();
      setFeedback({
        status: 'retry',
        title: '🔒 Microphone Blocked',
        cheer: 'Please allow microphone access in your browser address bar to test reading!',
        heard: '',
      });
    } else if (result.status === 'no-speech') {
      SoundEffects.playRetry();
      setFeedback({
        status: 'retry',
        title: '🤫 No Voice Heard',
        cheer: `Speak closely into the microphone and read "${currentWord.word}" aloud!`,
        heard: '',
      });
    } else {
      SoundEffects.playRetry();
      setFeedback({
        status: 'retry',
        title: '⚠️ Give It Another Go!',
        cheer: getRandomCheer(RETRY_CHEERS),
        heard: result.heard,
      });
    }
  };

  // In Test Mode: Voice Spelling Check (Step 2 of Test)
  const handleTestVoiceSpell = async () => {
    if (isListening) return;
    SoundEffects.stopAllSpeech();
    SoundEffects.playClick();
    setVoiceHeard('');
    setFeedback({ status: 'idle', title: '', cheer: '' });
    setIsListening(true);

    const result = await recognizeSpokenSpelling(currentWord.word, (live) => {
      setVoiceHeard(live);
    });
    setIsListening(false);
    setVoiceHeard(result.heard);

    if (result.isCorrect) {
      SoundEffects.playSuccess();
      const updated = {
        ...(testWordSteps[currentWordIndex] || { read: false, spell: false }),
        spell: true,
      };
      setTestWordSteps((prev) => ({ ...prev, [currentWordIndex]: updated }));

      // ONLY award 1 score point when ALL steps (both read and spell) are completed!
      if (updated.read && updated.spell) {
        if (!testMasteredIndices.includes(currentWordIndex)) {
          setTestMasteredIndices((prev) => [...prev, currentWordIndex]);
          SoundEffects.playFanfare();
        }
      }

      setFeedback({
        status: 'correct',
        title: '🏆 All Steps Completed! +1 Score Point!',
        cheer: getRandomCheer(SUCCESS_CHEERS),
        heard: result.heard || currentWord.word.split('').map((c) => getAlphabetName(c)).join(' - '),
      });

      // Allow child to see popup celebration, or tap 'Next Word' immediately
      if (testAdvanceTimerRef.current) clearTimeout(testAdvanceTimerRef.current);
      testAdvanceTimerRef.current = setTimeout(() => {
        handleTestNextQuestion();
      }, 3500);
    } else if (result.status === 'denied') {
      SoundEffects.playRetry();
      setFeedback({
        status: 'retry',
        title: '🔒 Microphone Blocked',
        cheer: 'Please allow microphone access in your browser address bar to test spelling!',
        heard: '',
      });
    } else if (result.status === 'no-speech') {
      SoundEffects.playRetry();
      setFeedback({
        status: 'retry',
        title: '🤫 No Voice Heard',
        cheer: 'Tap "Hear Word" to listen, then say each Alphabet Name into the mic from memory!',
        heard: '',
      });
    } else {
      SoundEffects.playRetry();
      setFeedback({
        status: 'retry',
        title: '⚠️ Spelling Try Again',
        cheer: 'Listen to the word again with "Hear Word" and speak each Alphabet Name from memory!',
        heard: result.heard,
      });
    }
  };

  // Move to next question in Test
  const handleTestNextQuestion = () => {
    if (testAdvanceTimerRef.current) {
      clearTimeout(testAdvanceTimerRef.current);
      testAdvanceTimerRef.current = null;
    }
    clearSpeechState();
    setTestStage('read');

    if (currentWordIndex + 1 < task.words.length) {
      setCurrentWordIndex((prev) => prev + 1);
    } else {
      setIsTestComplete(true);
      SoundEffects.playFanfare();
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header Bar with Week Switcher & Exit to Previous Step Button */}
      <View style={styles.topControlBar}>
        {/* Previous Step Exit Button */}
        <TouchableOpacity
          style={styles.exitPreviousBtn}
          onPress={handleExitToPreviousStep}
          accessibilityLabel="Exit to previous step"
        >
          <Text style={styles.exitPreviousIcon}>←</Text>
          <Text style={styles.exitPreviousText}>{getExitButtonLabel()}</Text>
        </TouchableOpacity>

        {/* Horizontal Week Switcher */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekPillsScroll}>
          {WEEKLY_TASKS.map((t) => {
            const isSelected = t.weekNumber === task.weekNumber;
            return (
              <TouchableOpacity
                key={t.weekNumber}
                style={[
                  styles.weekPill,
                  isSelected && { backgroundColor: t.badgeColor, borderColor: t.badgeColor },
                ]}
                onPress={() => {
                  SoundEffects.playClick();
                  onSelectWeek(t.weekNumber);
                  setCurrentWordIndex(0);
                  setCurrentStep('read');
                  setIsTestMode(false);
                  setIsTestComplete(false);
                  clearSpeechState();
                }}
              >
                <Text style={[styles.weekPillText, isSelected && styles.weekPillTextSelected]}>
                  Week {t.weekNumber}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ==================== 1. NORMAL WORD STUDY MODE ==================== */}
        {!isTestMode && (
          <>
            {/* Header Card */}
            <View style={[styles.headerCard, { backgroundColor: task.lightBg, borderColor: task.badgeColor }]}>
              <View style={styles.headerTopRow}>
                <View style={[styles.weekBadge, { backgroundColor: task.badgeColor }]}>
                  <Text style={styles.weekBadgeText}>GRADE 3 • WEEK {task.weekNumber}</Text>
                </View>
                {/* Score Counter: All steps must be completed to award 1 score point */}
                <View style={styles.scorePill}>
                  <Text style={styles.scorePillIcon}>⭐</Text>
                  <Text style={styles.scorePillText}>
                    Mastered Score: {masteredWordIndices.length} / {task.words.length}
                  </Text>
                </View>
              </View>

              <Text style={styles.headerTheme}>{task.theme}</Text>
              <Text style={styles.headerSubtitle}>
                Complete all 4 steps (Read, Blend, Voice Spell, Oral Test) to earn 1 score point per word!
              </Text>

              {/* 4 Step Sequence Indicator for Current Word */}
              <View style={styles.stepSequenceBox}>
                {/* Step 1: Read */}
                <TouchableOpacity
                  style={[
                    styles.stepBadgeItem,
                    currentStep === 'read' && styles.stepBadgeItemActive,
                    wordProgress.read && styles.stepBadgeItemCompleted,
                  ]}
                  onPress={() => {
                    SoundEffects.playClick();
                    setCurrentStep('read');
                    clearSpeechState();
                  }}
                >
                  <Text style={styles.stepNumberCircle}>
                    {wordProgress.read ? '✓' : '1'}
                  </Text>
                  <Text
                    style={[
                      styles.stepBadgeLabel,
                      currentStep === 'read' && styles.stepBadgeLabelActive,
                      wordProgress.read && styles.stepBadgeLabelCompleted,
                    ]}
                  >
                    Read Aloud
                  </Text>
                </TouchableOpacity>

                <Text style={styles.stepArrow}>➔</Text>

                {/* Step 2: Blend */}
                <TouchableOpacity
                  style={[
                    styles.stepBadgeItem,
                    currentStep === 'blend' && styles.stepBadgeItemActive,
                    wordProgress.blend && styles.stepBadgeItemCompleted,
                  ]}
                  onPress={() => {
                    SoundEffects.playClick();
                    setCurrentStep('blend');
                    clearSpeechState();
                  }}
                >
                  <Text style={styles.stepNumberCircle}>
                    {wordProgress.blend ? '✓' : '2'}
                  </Text>
                  <Text
                    style={[
                      styles.stepBadgeLabel,
                      currentStep === 'blend' && styles.stepBadgeLabelActive,
                      wordProgress.blend && styles.stepBadgeLabelCompleted,
                    ]}
                  >
                    Blend Chunks
                  </Text>
                </TouchableOpacity>

                <Text style={styles.stepArrow}>➔</Text>

                {/* Step 3: Voice Spell */}
                <TouchableOpacity
                  style={[
                    styles.stepBadgeItem,
                    currentStep === 'spell' && styles.stepBadgeItemActive,
                    wordProgress.spell && styles.stepBadgeItemCompleted,
                  ]}
                  onPress={() => {
                    SoundEffects.playClick();
                    setCurrentStep('spell');
                    clearSpeechState();
                  }}
                >
                  <Text style={styles.stepNumberCircle}>
                    {wordProgress.spell ? '✓' : '3'}
                  </Text>
                  <Text
                    style={[
                      styles.stepBadgeLabel,
                      currentStep === 'spell' && styles.stepBadgeLabelActive,
                      wordProgress.spell && styles.stepBadgeLabelCompleted,
                    ]}
                  >
                    Voice Spell
                  </Text>
                </TouchableOpacity>

                <Text style={styles.stepArrow}>➔</Text>

                {/* Step 4: Oral Spelling Test */}
                <TouchableOpacity
                  style={[
                    styles.stepBadgeItem,
                    currentStep === 'oralTest' && styles.stepBadgeItemActive,
                    wordProgress.oralTest && styles.stepBadgeItemCompleted,
                  ]}
                  onPress={() => {
                    SoundEffects.playClick();
                    setCurrentStep('oralTest');
                    clearSpeechState();
                  }}
                >
                  <Text style={styles.stepNumberCircle}>
                    {wordProgress.oralTest ? '✓' : '4'}
                  </Text>
                  <Text
                    style={[
                      styles.stepBadgeLabel,
                      currentStep === 'oralTest' && styles.stepBadgeLabelActive,
                      wordProgress.oralTest && styles.stepBadgeLabelCompleted,
                    ]}
                  >
                    Oral Test
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 10 Words Horizontal Select Bar */}
            <View style={styles.wordCarouselRow}>
              <Text style={styles.carouselTitle}>10 Words in Week {task.weekNumber}:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselList}>
                {task.words.map((wItem, idx) => {
                  const isSelected = idx === currentWordIndex;
                  const isMastered = masteredWordIndices.includes(idx);
                  return (
                    <TouchableOpacity
                      key={wItem.word}
                      style={[
                        styles.wordPillBtn,
                        isSelected && styles.wordPillBtnSelected,
                        isMastered && styles.wordPillBtnMastered,
                      ]}
                      onPress={() => handleSelectWord(idx)}
                    >
                      <Text style={[styles.wordPillIndex, isSelected && styles.wordPillIndexSelected]}>
                        {isMastered ? '⭐' : `${idx + 1}`}
                      </Text>
                      <Text style={[styles.wordPillWord, isSelected && styles.wordPillWordSelected]}>
                        {currentStep === 'oralTest' && !wordProgress.oralTest && isSelected
                          ? 'Secret Word ❓'
                          : wItem.word}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Live Listening Friendly Encouragement Banner */}
            {isListening && (
              <View style={styles.friendlyListeningBanner}>
                <Text style={styles.listeningAvatar}>🦜</Text>
                <View style={styles.listeningTextCol}>
                  <Text style={styles.listeningTitle}>I'm listening to your voice! 🌟</Text>
                  <Text style={styles.listeningSub}>Take your time, speak clearly into the microphone. You've got this!</Text>
                </View>
              </View>
            )}

            {/* Word Mastery Celebration Banner when all 4 steps completed */}
            {isWordFullyMastered && (
              <View style={styles.masteredBanner}>
                <Text style={styles.masteredIcon}>🏆</Text>
                <View style={styles.masteredTextCol}>
                  <Text style={styles.masteredTitle}>Word Completed! +1 Score Point</Text>
                  <Text style={styles.masteredDesc}>
                    You completed Read Aloud, Blending, Voice Spelling, and Oral Spelling Test for "{currentWord.word}"!
                  </Text>
                </View>
              </View>
            )}

            {/* ================= STEP 1: READ ALOUD ================= */}
            {currentStep === 'read' && (
              <View style={styles.stepCardContainer}>
                <View style={styles.stepCardHeader}>
                  <View style={styles.stepTag}>
                    <Text style={styles.stepTagText}>STEP 1 OF 4</Text>
                  </View>
                  <Text style={styles.stepCardTitle}>Read Aloud with Voice Recognition</Text>
                </View>

                {/* Target Word in Pure Text (NO picture hints!) */}
                <View style={styles.targetWordBox}>
                  <Text style={styles.targetWordText}>{currentWord.word}</Text>
                  {currentWord.phonicsTip && (
                    <Text style={styles.targetPhonicsTip}>💡 Rule: {currentWord.phonicsTip}</Text>
                  )}
                </View>

                {/* Inline active listening indicator for Step 1 */}
                {isListening && (
                  <View style={styles.inlineListeningBox}>
                    <View style={styles.inlineListeningHeader}>
                      <Text style={styles.inlineListeningDot}>🔴</Text>
                      <Text style={styles.inlineListeningTitle}>Listening... Read "{currentWord.word}" aloud!</Text>
                    </View>
                    <View style={styles.inlineHeardRow}>
                      <Text style={styles.inlineHeardLabel}>Hearing:</Text>
                      <Text style={styles.inlineHeardText}>
                        {voiceHeard ? `"${voiceHeard}"` : 'Speak into microphone...'}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Interactive Action Buttons */}
                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={styles.btnSecondary}
                    onPress={() => {
                      SoundEffects.playClick();
                      SoundEffects.speakPhonics(currentWord.word);
                    }}
                  >
                    <Text style={styles.btnIcon}>🔊</Text>
                    <Text style={styles.btnSecondaryText}>Hear Model Word</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btnPrimary, isListening && styles.btnPrimaryListening]}
                    onPress={handleVoiceReadCheck}
                    disabled={isListening}
                  >
                    <Text style={styles.btnIcon}>{isListening ? '🔴' : '🎙️'}</Text>
                    <Text style={styles.btnPrimaryText}>
                      {isListening ? 'Listening... Read Aloud!' : 'Read Aloud into Mic'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Next Step Button (Advance to Blend) */}
                <TouchableOpacity
                  style={[styles.nextStepBtn, wordProgress.read && styles.nextStepBtnHighlighted]}
                  onPress={() => {
                    SoundEffects.playClick();
                    setCurrentStep('blend');
                    clearSpeechState();
                  }}
                >
                  <Text style={styles.nextStepBtnText}>Next Step: 2. Blend Chunks ➔</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ================= STEP 2: BLEND CHUNKS ================= */}
            {currentStep === 'blend' && (
              <View style={styles.stepCardContainer}>
                <View style={styles.stepCardHeader}>
                  <View style={styles.stepTag}>
                    <Text style={styles.stepTagText}>STEP 2 OF 4</Text>
                  </View>
                  <Text style={styles.stepCardTitle}>Blend Syllable Chunks</Text>
                </View>

                <Text style={styles.stepCardInstruction}>
                  Tap each syllable chunk to hear its sound, then blend them together!
                </Text>

                {/* Syllable Chunk Cards */}
                <View style={styles.blendChunksRow}>
                  {currentWord.syllables.map((chunk, idx) => (
                    <React.Fragment key={idx}>
                      <TouchableOpacity
                        style={styles.chunkTile}
                        onPress={() => {
                          SoundEffects.playClick();
                          SoundEffects.speakPhonics(chunk);
                        }}
                      >
                        <Text style={styles.chunkTileText}>{chunk}</Text>
                        <Text style={styles.chunkTileSub}>🔊 Tap</Text>
                      </TouchableOpacity>
                      {idx < currentWord.syllables.length - 1 && (
                        <Text style={styles.chunkPlusSign}>+</Text>
                      )}
                    </React.Fragment>
                  ))}
                </View>

                {/* Blended Whole Word Box */}
                <View style={styles.blendedBox}>
                  <Text style={styles.blendedBoxLabel}>BLENDED WORD:</Text>
                  <Text style={styles.blendedBoxWord}>{currentWord.word}</Text>
                </View>

                {/* Complete Blending Action */}
                <TouchableOpacity style={styles.btnPrimary} onPress={handleBlendComplete}>
                  <Text style={styles.btnIcon}>✓</Text>
                  <Text style={styles.btnPrimaryText}>I Blended the Word! (Go to Voice Spell ➔)</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ================= STEP 3: VOICE SPELL & LEARN ================= */}
            {currentStep === 'spell' && (
              <View style={styles.stepCardContainer}>
                <View style={styles.stepCardHeader}>
                  <View style={styles.stepTag}>
                    <Text style={styles.stepTagText}>STEP 3 OF 4</Text>
                  </View>
                  <Text style={styles.stepCardTitle}>Voice Spell (Hear & Practice)</Text>
                </View>

                <Text style={styles.stepCardInstruction}>
                  Listen to the musical spelling, learn the Alphabet Names, and practice saying them!
                </Text>

                {/* Spoken spelling guide showing alphabet names with musical bounce */}
                <View style={styles.spellingLetterSlotsRow}>
                  {currentWord.word.split('').map((char, idx) => {
                    const isLetterActive = activeSpellingLetterIdx === idx;
                    return (
                      <View
                        key={idx}
                        style={[
                          styles.spellingLetterSlot,
                          isLetterActive && styles.spellingLetterSlotActive,
                        ]}
                      >
                        {isLetterActive && <Text style={styles.spellingNoteBadge}>🎵</Text>}
                        <Text
                          style={[
                            styles.spellingLetterSlotText,
                            isLetterActive && styles.spellingLetterSlotTextActive,
                          ]}
                        >
                          {char.toUpperCase()}
                        </Text>
                        <Text
                          style={[
                            styles.spellingLetterNameText,
                            isLetterActive && styles.spellingLetterNameTextActive,
                          ]}
                        >
                          {getAlphabetName(char)}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                <Text style={styles.spellingVoiceHint}>
                  💡 Sing or Say: "{currentWord.word.split('').map((c) => `${c.toUpperCase()} (${getAlphabetName(c)})`).join(' - ')}"
                </Text>

                {/* Inline active listening indicator for Step 3 */}
                {isListening && (
                  <View style={styles.inlineListeningBox}>
                    <View style={styles.inlineListeningHeader}>
                      <Text style={styles.inlineListeningDot}>🔴</Text>
                      <Text style={styles.inlineListeningTitle}>Listening... Speak Alphabet Names!</Text>
                    </View>
                    <Text style={styles.inlineListeningGuide}>
                      Say: {currentWord.word.split('').map((c) => `${c.toUpperCase()} (${getAlphabetName(c)})`).join(' • ')}
                    </Text>
                    <View style={styles.inlineHeardRow}>
                      <Text style={styles.inlineHeardLabel}>Hearing:</Text>
                      <Text style={styles.inlineHeardText}>
                        {voiceHeard ? `"${voiceHeard}"` : 'Waiting for letter names...'}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Action Buttons: Hear musical spelling song & Speak letters */}
                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={[styles.btnSecondary, isPlayingMusic && styles.btnSecondaryMusicActive]}
                    onPress={handlePlayMusicalSpelling}
                  >
                    <Text style={styles.btnIcon}>{isPlayingMusic ? '🎵' : '🎶'}</Text>
                    <Text style={styles.btnSecondaryText}>
                      {isPlayingMusic ? 'Singing Song...' : 'Hear Musical Spelling'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btnPrimary, isListening && styles.btnPrimaryListening]}
                    onPress={handleVoiceSpellingCheck}
                    disabled={isListening}
                  >
                    <Text style={styles.btnIcon}>{isListening ? '🔴' : '🎙️'}</Text>
                    <Text style={styles.btnPrimaryText}>
                      {isListening ? 'Listening... Speak Names!' : 'Say Alphabet Names'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Advance to Step 4: Start Spelling Test in Oral */}
                <TouchableOpacity
                  style={[
                    styles.advanceNextWordBtn,
                    styles.advanceToOralTestBtn,
                    wordProgress.spell && styles.advanceToOralTestBtnCompleted,
                  ]}
                  onPress={handleGoToOralSpellingTest}
                >
                  <Text style={styles.advanceToOralTestBtnText}>
                    Start Spelling Test in Oral ➔
                  </Text>
                  <Text style={styles.advanceToOralTestSubText}>
                    Step 4 of 4: Test your spelling from memory without letters!
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ================= STEP 4: SPELLING TEST IN ORAL ================= */}
            {currentStep === 'oralTest' && (
              <View style={styles.stepCardContainer}>
                <View style={styles.stepCardHeader}>
                  <View style={[styles.stepTag, styles.oralTestStepTag]}>
                    <Text style={[styles.stepTagText, styles.oralTestStepTagText]}>STEP 4 OF 4</Text>
                  </View>
                  <Text style={styles.stepCardTitle}>Spelling Test in Oral</Text>
                </View>

                <Text style={styles.stepCardInstruction}>
                  Test your spelling from memory! Say the Alphabet Names into the microphone without looking at the letters.
                </Text>

                {/* Mystery Letter Slots: Hidden until orally spelled from memory! */}
                {!wordProgress.oralTest ? (
                  <View style={styles.mysteryCardBox}>
                    <View style={styles.mysteryLetterSlotsRow}>
                      {currentWord.word.split('').map((_, idx) => (
                        <View key={idx} style={styles.mysteryLetterSlot}>
                          <Text style={styles.mysteryLetterSlotQuestion}>?</Text>
                          <Text style={styles.mysteryLetterSlotIndex}>{idx + 1}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.mysteryCardHint}>
                      🔒 {currentWord.word.length} secret letters. Listen to the word and spell it aloud from memory!
                    </Text>
                  </View>
                ) : (
                  <View style={styles.mysteryCardBoxPassed}>
                    <View style={styles.mysteryLetterSlotsRow}>
                      {currentWord.word.split('').map((char, idx) => (
                        <View key={idx} style={[styles.mysteryLetterSlot, styles.mysteryLetterSlotPassed]}>
                          <Text style={styles.mysteryPassedCheck}>✓</Text>
                          <Text style={styles.mysteryLetterSlotPassedText}>{char.toUpperCase()}</Text>
                          <Text style={styles.mysteryLetterSlotPassedSub}>{getAlphabetName(char)}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.mysteryCardPassedLabel}>
                      🎉 Word Mastered! You spelled "{currentWord.word.toUpperCase()}" aloud in oral!
                    </Text>
                  </View>
                )}

                {/* Inline active listening indicator for Step 4 */}
                {isListening && (
                  <View style={styles.inlineListeningBox}>
                    <View style={styles.inlineListeningHeader}>
                      <Text style={styles.inlineListeningDot}>🔴</Text>
                      <Text style={styles.inlineListeningTitle}>Listening... Speak Alphabet Names in Oral!</Text>
                    </View>
                    <Text style={styles.inlineListeningGuide}>
                      Spell the secret word from memory by saying the Alphabet Names!
                    </Text>
                    <View style={styles.inlineHeardRow}>
                      <Text style={styles.inlineHeardLabel}>Hearing:</Text>
                      <Text style={styles.inlineHeardText}>
                        {voiceHeard ? `"${voiceHeard}"` : 'Waiting for your voice...'}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Interactive Action Buttons */}
                <View style={styles.actionButtonsRow}>
                  {/* Hear Word Button */}
                  <TouchableOpacity
                    style={styles.btnSecondary}
                    onPress={() => {
                      SoundEffects.playClick();
                      SoundEffects.speakDirect(currentWord.word, 0.82);
                    }}
                  >
                    <Text style={styles.btnIcon}>🔊</Text>
                    <Text style={styles.btnSecondaryText}>Hear Word</Text>
                  </TouchableOpacity>

                  {/* Start Spelling Test in Oral Button */}
                  <TouchableOpacity
                    style={[
                      styles.btnPrimary,
                      styles.btnStartOralTest,
                      isListening && styles.btnPrimaryListening,
                    ]}
                    onPress={handleOralSpellingTestCheck}
                    disabled={isListening}
                  >
                    <Text style={styles.btnIcon}>{isListening ? '🔴' : '🎙️'}</Text>
                    <Text style={styles.btnPrimaryText}>
                      {isListening ? 'Listening... Spell Aloud!' : 'Start Spelling Test in Oral'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Advance to next word button */}
                <TouchableOpacity
                  style={[
                    styles.advanceNextWordBtn,
                    wordProgress.oralTest && styles.advanceNextWordBtnMastered,
                  ]}
                  onPress={handleAdvanceToNextWord}
                >
                  <Text style={styles.advanceNextWordBtnText}>
                    {currentWordIndex + 1 === task.words.length
                      ? 'Finish & Start 10-Word Assessment Test ➔'
                      : 'Next Word ➔'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Bottom Actions Bar */}
            <View style={styles.bottomBarRow}>
              {/* Exit button returns to previous step */}
              <TouchableOpacity style={styles.bottomExitBtn} onPress={handleExitToPreviousStep}>
                <Text style={styles.bottomExitBtnText}>{getExitButtonLabel()}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.startFullTestBtn} onPress={handleStartWeeklyTest}>
                <Text style={styles.startFullTestBtnText}>🎯 Start 10-Word Weekly Test</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ==================== 2. 10-WORD ASSESSMENT TEST MODE ==================== */}
        {isTestMode && !isTestComplete && (
          <View style={styles.testContainer}>
            {/* Top Bar inside Test */}
            <View style={styles.testHeaderBar}>
              <TouchableOpacity style={styles.testExitBtn} onPress={handleExitToPreviousStep}>
                <Text style={styles.testExitBtnText}>{getExitButtonLabel()}</Text>
              </TouchableOpacity>
              <View style={styles.testProgressBadge}>
                <Text style={styles.testProgressText}>
                  QUESTION {currentWordIndex + 1} OF {task.words.length}
                </Text>
              </View>
              <View style={styles.testScorePill}>
                <Text style={styles.testScoreText}>Score: {testScore} / {task.words.length}</Text>
              </View>
            </View>

            {/* Motivational Mascot Voice Listener Banner */}
            {isListening && (
              <View style={styles.friendlyListeningBanner}>
                <Text style={styles.listeningAvatar}>🦜</Text>
                <View style={styles.listeningTextCol}>
                  <Text style={styles.listeningTitle}>I'm listening! Speak clearly! 🌟</Text>
                  <Text style={styles.listeningSub}>Take your time, you're doing fantastic!</Text>
                </View>
              </View>
            )}

            {/* Stage 1: Read Aloud in Test */}
            {testStage === 'read' && (
              <View style={styles.testCard}>
                <Text style={styles.testStageLabel}>STAGE 1: READ THE WORD ALOUD</Text>
                <Text style={styles.testWordDisplay}>{currentWord.word.toUpperCase()}</Text>

                {/* Inline active listening indicator */}
                {isListening && (
                  <View style={styles.inlineListeningBox}>
                    <View style={styles.inlineListeningHeader}>
                      <Text style={styles.inlineListeningDot}>🔴</Text>
                      <Text style={styles.inlineListeningTitle}>Listening... Read "{currentWord.word}" aloud!</Text>
                    </View>
                    <View style={styles.inlineHeardRow}>
                      <Text style={styles.inlineHeardLabel}>Hearing:</Text>
                      <Text style={styles.inlineHeardText}>
                        {voiceHeard ? `"${voiceHeard}"` : 'Speak into microphone...'}
                      </Text>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.btnPrimary, styles.testMicBtn, isListening && styles.btnPrimaryListening]}
                  onPress={handleTestVoiceRead}
                  disabled={isListening}
                >
                  <Text style={styles.testMicIcon}>{isListening ? '🔴' : '🎙️'}</Text>
                  <Text style={styles.btnPrimaryText}>
                    {isListening ? 'Listening... Read Aloud!' : 'Tap & Read Aloud into Mic'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Stage 2: Oral Spelling Test from Memory */}
            {testStage === 'spell' && (
              <View style={styles.testCard}>
                <Text style={styles.testStageLabel}>STAGE 2: ORAL SPELLING TEST (FROM MEMORY)</Text>
                <Text style={styles.testSpellPrompt}>
                  Listen to the word and spell it orally from memory by saying the Alphabet Names into the microphone!
                </Text>

                {/* Mystery Letter Slots: Hidden during test so letters are not revealed */}
                <View style={styles.mysteryCardBox}>
                  <View style={styles.mysteryLetterSlotsRow}>
                    {currentWord.word.split('').map((_, i) => (
                      <View key={i} style={styles.mysteryLetterSlot}>
                        <Text style={styles.mysteryLetterSlotQuestion}>?</Text>
                        <Text style={styles.mysteryLetterSlotIndex}>{i + 1}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.mysteryCardHint}>
                    🔒 Secret word ({currentWord.word.length} letters). Tap "Hear Word" to listen and spell from memory!
                  </Text>
                </View>

                {/* Inline active listening indicator for Stage 2 */}
                {isListening && (
                  <View style={styles.inlineListeningBox}>
                    <View style={styles.inlineListeningHeader}>
                      <Text style={styles.inlineListeningDot}>🔴</Text>
                      <Text style={styles.inlineListeningTitle}>Microphone Active — Speak Alphabet Names!</Text>
                    </View>
                    <Text style={styles.inlineListeningGuide}>
                      Say each letter's Alphabet Name from memory into the microphone!
                    </Text>
                    <View style={styles.inlineHeardRow}>
                      <Text style={styles.inlineHeardLabel}>Hearing:</Text>
                      <Text style={styles.inlineHeardText}>
                        {voiceHeard ? `"${voiceHeard}"` : 'Waiting for letter names...'}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.actionButtonsRow}>
                  {/* Hear Word Audio Button */}
                  <TouchableOpacity
                    style={styles.btnSecondary}
                    onPress={() => {
                      SoundEffects.playClick();
                      SoundEffects.speakPhonics(currentWord.word);
                    }}
                  >
                    <Text style={styles.btnIcon}>🔊</Text>
                    <Text style={styles.btnSecondaryText}>Hear Word</Text>
                  </TouchableOpacity>

                  {/* Start Oral Spelling Test Mic Button */}
                  <TouchableOpacity
                    style={[styles.btnPrimary, styles.testMicBtn, isListening && styles.btnPrimaryListening]}
                    onPress={handleTestVoiceSpell}
                    disabled={isListening}
                  >
                    <Text style={styles.testMicIcon}>{isListening ? '🔴' : '🎙️'}</Text>
                    <Text style={styles.btnPrimaryText}>
                      {isListening ? 'Listening... Speak Names!' : 'Start Spelling Test in Oral'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

          </View>
        )}

        {/* ==================== 3. TEST COMPLETION CELEBRATION ==================== */}
        {isTestMode && isTestComplete && (
          <View style={styles.celebrationCard}>
            <Text style={styles.celebrationTrophy}>🏆</Text>
            <Text style={styles.celebrationTitle}>Week {task.weekNumber} Test Completed!</Text>
            <Text style={styles.celebrationScore}>
              Your Final Score: {testScore} / {task.words.length}
            </Text>

            <View style={styles.starsRow}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.starIcon}>⭐</Text>
            </View>

            <Text style={styles.celebrationEncouragement}>
              {testScore >= 8
                ? 'Sensational reading and oral spelling mastery! You completed all steps with excellence!'
                : 'Great effort! Practice the steps again to score 10/10 on Week ' + task.weekNumber + '!'}
            </Text>

            <View style={styles.celebrationActionsRow}>
              <TouchableOpacity
                style={styles.retryTestBtn}
                onPress={() => {
                  SoundEffects.playClick();
                  setCurrentWordIndex(0);
                  setTestStage('read');
                  setTestWordSteps({});
                  setTestMasteredIndices([]);
                  setIsTestComplete(false);
                }}
              >
                <Text style={styles.retryTestBtnText}>🔄 Retry Test</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.exitToStudyBtn}
                onPress={() => {
                  SoundEffects.playClick();
                  setIsTestMode(false);
                  setIsTestComplete(false);
                }}
              >
                <Text style={styles.exitToStudyBtnText}>Study Words ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ==================== VOICE FEEDBACK POPUP MODAL ==================== */}
      <Modal
        visible={feedback.status !== 'idle'}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseFeedbackOnly}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdropPressable}
            activeOpacity={1}
            onPress={handleCloseFeedbackOnly}
          />

          <View
            style={[
              styles.feedbackPopupCard,
              feedback.status === 'correct'
                ? styles.feedbackPopupCardCorrect
                : styles.feedbackPopupCardRetry,
            ]}
          >
            {/* Close 'X' Button */}
            <TouchableOpacity
              style={styles.feedbackPopupCloseBtn}
              onPress={handleCloseFeedbackOnly}
              accessibilityLabel="Close feedback popup"
            >
              <Text style={styles.feedbackPopupCloseBtnText}>✕</Text>
            </TouchableOpacity>

            {/* Mascot Icon Header */}
            <View
              style={[
                styles.feedbackPopupIconCircle,
                feedback.status === 'correct'
                  ? styles.feedbackPopupIconCircleCorrect
                  : styles.feedbackPopupIconCircleRetry,
              ]}
            >
              <Text style={styles.feedbackPopupIconText}>{getFeedbackIcon()}</Text>
            </View>

            {/* Popup Title */}
            <Text style={styles.feedbackPopupTitle}>{feedback.title}</Text>

            {/* Popup Encouragement / Instruction */}
            <Text style={styles.feedbackPopupCheer}>{feedback.cheer}</Text>

            {/* What Was Heard (if speech recognized) */}
            {feedback.heard ? (
              <View style={styles.feedbackPopupHeardRow}>
                <Text style={styles.feedbackPopupHeardLabel}>🎙️ Heard:</Text>
                <Text style={styles.feedbackPopupHeardValue}>"{feedback.heard}"</Text>
              </View>
            ) : null}

            {/* Interactive Action Button */}
            <TouchableOpacity
              style={[
                styles.feedbackPopupActionBtn,
                feedback.status === 'correct'
                  ? styles.feedbackPopupActionBtnCorrect
                  : styles.feedbackPopupActionBtnRetry,
              ]}
              onPress={handleFeedbackAction}
            >
              <Text style={styles.feedbackPopupActionBtnText}>{getFeedbackActionText()}</Text>
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
  topControlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
    width: '100%',
  },
  exitPreviousBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    gap: 6,
  },
  exitPreviousIcon: {
    fontSize: 16,
    fontWeight: '900',
    color: '#334155',
  },
  exitPreviousText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  weekPillsScroll: {
    gap: 8,
  },
  weekPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  weekPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  weekPillTextSelected: {
    color: '#FFFFFF',
  },
  scrollContent: {
    width: '100%',
    maxWidth: 1320,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 60,
  },
  headerCard: {
    borderRadius: 22,
    borderWidth: 2,
    padding: 18,
    marginBottom: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weekBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  weekBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  scorePillIcon: {
    fontSize: 13,
  },
  scorePillText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B45309',
  },
  headerTheme: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 14,
  },
  stepSequenceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexWrap: 'wrap',
    gap: 4,
  },
  stepBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    gap: 5,
  },
  stepBadgeItemActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  stepBadgeItemCompleted: {
    backgroundColor: '#F0FDF4',
  },
  stepNumberCircle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#2563EB',
  },
  stepBadgeLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  stepBadgeLabelActive: {
    color: '#1D4ED8',
  },
  stepBadgeLabelCompleted: {
    color: '#15803D',
  },
  stepArrow: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '900',
  },
  wordCarouselRow: {
    marginBottom: 16,
  },
  carouselTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 8,
  },
  carouselList: {
    gap: 8,
  },
  wordPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  wordPillBtnSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  wordPillBtnMastered: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  wordPillIndex: {
    fontSize: 11,
    fontWeight: '900',
    color: '#94A3B8',
  },
  wordPillIndexSelected: {
    color: '#2563EB',
  },
  wordPillWord: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },
  wordPillWordSelected: {
    color: '#1E40AF',
  },
  friendlyListeningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#F87171',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  listeningAvatar: {
    fontSize: 32,
  },
  listeningTextCol: {
    flex: 1,
  },
  listeningTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#DC2626',
    marginBottom: 2,
  },
  listeningSub: {
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 17,
  },
  masteredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#86EFAC',
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  masteredIcon: {
    fontSize: 32,
  },
  masteredTextCol: {
    flex: 1,
  },
  masteredTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#15803D',
    marginBottom: 2,
  },
  masteredDesc: {
    fontSize: 12,
    color: '#166534',
  },
  stepCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  stepCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  stepTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stepTagText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#2563EB',
  },
  stepCardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  stepCardInstruction: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  targetWordBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    paddingVertical: 28,
    marginBottom: 18,
  },
  targetWordText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 2,
  },
  targetPhonicsTip: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  btnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    gap: 8,
  },
  btnSecondaryText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },
  btnPrimary: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  btnPrimaryListening: {
    backgroundColor: '#DC2626',
  },
  btnPrimaryText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  btnIcon: {
    fontSize: 18,
  },
  nextStepBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  nextStepBtnHighlighted: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  nextStepBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#334155',
  },
  blendChunksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 16,
  },
  chunkTile: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#93C5FD',
    alignItems: 'center',
  },
  chunkTileText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1D4ED8',
  },
  chunkTileSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3B82F6',
    marginTop: 4,
  },
  chunkPlusSign: {
    fontSize: 20,
    fontWeight: '900',
    color: '#94A3B8',
  },
  blendedBox: {
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#BBF7D0',
    marginBottom: 16,
  },
  blendedBoxLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 1,
    marginBottom: 4,
  },
  blendedBoxWord: {
    fontSize: 32,
    fontWeight: '900',
    color: '#166534',
    letterSpacing: 2,
  },
  spellingLetterSlotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 14,
  },
  spellingLetterSlot: {
    width: 44,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
  },
  spellingLetterSlotText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  spellingLetterNameText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
    marginTop: 1,
  },
  spellingLetterSlotActive: {
    backgroundColor: '#FEF08A',
    borderColor: '#EAB308',
    borderWidth: 2.5,
    transform: [{ scale: 1.15 }],
  },
  spellingLetterSlotTextActive: {
    color: '#854D0E',
  },
  spellingLetterNameTextActive: {
    color: '#A16207',
    fontWeight: '900',
  },
  spellingNoteBadge: {
    position: 'absolute',
    top: -9,
    right: -4,
    fontSize: 13,
  },
  btnSecondaryMusicActive: {
    backgroundColor: '#FEF9C3',
    borderColor: '#FACC15',
    borderWidth: 2,
  },
  testSpellLetterBoxActive: {
    backgroundColor: '#FEF08A',
    borderColor: '#EAB308',
    borderWidth: 2.5,
    transform: [{ scale: 1.15 }],
  },
  spellingVoiceHint: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  inlineListeningBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#F87171',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
    gap: 6,
  },
  inlineListeningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inlineListeningDot: {
    fontSize: 14,
  },
  inlineListeningTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#991B1B',
  },
  inlineListeningGuide: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B91C1C',
    textAlign: 'center',
  },
  inlineHeardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 2,
    maxWidth: '100%',
  },
  inlineHeardLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7F1D1D',
  },
  inlineHeardText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0284C7',
  },
  inlineFeedbackCard: {
    marginTop: 12,
    marginBottom: 4,
  },
  advanceNextWordBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginTop: 8,
  },
  advanceNextWordBtnMastered: {
    backgroundColor: '#059669',
    borderColor: '#047857',
  },
  advanceNextWordBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#334155',
  },
  advanceToOralTestBtn: {
    backgroundColor: '#7C3AED',
    borderColor: '#6D28D9',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  advanceToOralTestBtnCompleted: {
    backgroundColor: '#059669',
    borderColor: '#047857',
  },
  advanceToOralTestBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  advanceToOralTestSubText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E9D5FF',
    marginTop: 3,
  },
  oralTestStepTag: {
    backgroundColor: '#F3E8FF',
  },
  oralTestStepTagText: {
    color: '#7C3AED',
  },
  mysteryCardBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  mysteryCardBoxPassed: {
    backgroundColor: '#F0FDF4',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#86EFAC',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  mysteryLetterSlotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  mysteryLetterSlot: {
    width: 48,
    height: 62,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    position: 'relative',
  },
  mysteryLetterSlotQuestion: {
    fontSize: 24,
    fontWeight: '900',
    color: '#64748B',
  },
  mysteryLetterSlotIndex: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    marginTop: 2,
  },
  mysteryLetterSlotPassed: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
    borderStyle: 'solid',
    transform: [{ scale: 1.05 }],
  },
  mysteryLetterSlotPassedText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#065F46',
  },
  mysteryLetterSlotPassedSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    marginTop: 1,
  },
  mysteryPassedCheck: {
    position: 'absolute',
    top: -8,
    right: -6,
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    backgroundColor: '#10B981',
    borderRadius: 10,
    width: 18,
    height: 18,
    textAlign: 'center',
    lineHeight: 18,
    overflow: 'hidden',
  },
  mysteryCardHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
  mysteryCardPassedLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15803D',
    textAlign: 'center',
  },
  btnStartOralTest: {
    backgroundColor: '#7C3AED',
  },
  // Popup Modal Styles
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
  feedbackPopupCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2.5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 12,
  },
  feedbackPopupCardCorrect: {
    borderColor: '#4ADE80',
  },
  feedbackPopupCardRetry: {
    borderColor: '#FBBF24',
  },
  feedbackPopupCloseBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  feedbackPopupCloseBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#64748B',
  },
  feedbackPopupIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  feedbackPopupIconCircleCorrect: {
    backgroundColor: '#DCFCE7',
  },
  feedbackPopupIconCircleRetry: {
    backgroundColor: '#FEF3C7',
  },
  feedbackPopupIconText: {
    fontSize: 36,
  },
  feedbackPopupTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  feedbackPopupCheer: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  feedbackPopupHeardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 20,
    width: '100%',
    gap: 6,
  },
  feedbackPopupHeardLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  feedbackPopupHeardValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  feedbackPopupActionBtn: {
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
  feedbackPopupActionBtnCorrect: {
    backgroundColor: '#10B981',
  },
  feedbackPopupActionBtnRetry: {
    backgroundColor: '#7C3AED',
  },
  feedbackPopupActionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  bottomBarRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  bottomExitBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  bottomExitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#475569',
  },
  startFullTestBtn: {
    flex: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D97706',
    paddingVertical: 14,
    borderRadius: 14,
  },
  startFullTestBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  testContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  testHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  testExitBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  testExitBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  testProgressBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  testProgressText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#2563EB',
  },
  testScorePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  testScoreText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B45309',
  },
  testCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  testStageLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  testWordDisplay: {
    fontSize: 42,
    fontWeight: '900',
    color: '#0369A1',
    letterSpacing: 3,
    marginBottom: 24,
  },
  testSpellPrompt: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334155',
    textAlign: 'center',
    marginBottom: 16,
  },
  testSpellLettersRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 24,
  },
  testSpellLetterBox: {
    width: 44,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F0F9FF',
    borderWidth: 2,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
  },
  testSpellLetterBoxText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0369A1',
  },
  testSpellLetterBoxSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    marginTop: 1,
  },
  helpHearBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    marginBottom: 16,
  },
  helpHearText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D4ED8',
    textAlign: 'center',
  },
  testMicBtn: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
  },
  testMicIcon: {
    fontSize: 20,
  },
  celebrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  celebrationTrophy: {
    fontSize: 54,
    marginBottom: 10,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  celebrationScore: {
    fontSize: 18,
    fontWeight: '800',
    color: '#16A34A',
    marginBottom: 14,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  starIcon: {
    fontSize: 32,
  },
  celebrationEncouragement: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  celebrationActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  retryTestBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  retryTestBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },
  exitToStudyBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  exitToStudyBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
