import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Colors } from '../theme/colors';
import { SoundEffects, getAlphabetName } from '../services/soundEffects';
import {
  ALPHABET,
  AlphabetEntry,
  AlphabetWord,
  DifficultyTier,
  getWordsForLetter,
  pickTierTestWords,
} from '../data/alphabet';
import { recognizeWord, recognizeSpokenSpelling, isRecognitionSupported } from '../services/wordRecognizer';

interface AlphabetSoundsScreenProps {
  onBack: () => void;
  initialDifficulty?: DifficultyTier;
}

export const AlphabetSoundsScreen: React.FC<AlphabetSoundsScreenProps> = ({
  onBack,
  initialDifficulty = 'easy',
}) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 700;

  // Selected letter & difficulty tier
  const [selectedEntry, setSelectedEntry] = useState<AlphabetEntry>(ALPHABET[0]);
  const [difficulty, setDifficulty] = useState<DifficultyTier>(initialDifficulty);
  const [showExamples, setShowExamples] = useState<boolean>(true);

  useEffect(() => {
    if (initialDifficulty) {
      setDifficulty(initialDifficulty);
    }
  }, [initialDifficulty]);

  // Test mode state
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [testWords, setTestWords] = useState<AlphabetWord[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState<number>(0);
  const [testStage, setTestStage] = useState<'read' | 'spell'>('read');
  const [testWordSteps, setTestWordSteps] = useState<
    Record<number, { read: boolean; spell: boolean }>
  >({});
  const [testMasteredIndices, setTestMasteredIndices] = useState<number[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [heardWord, setHeardWord] = useState<string>('');

  // Modals state
  const [showHappyModal, setShowHappyModal] = useState<boolean>(false);
  const [showCryingModal, setShowCryingModal] = useState<boolean>(false);
  const [lastScoreWord, setLastScoreWord] = useState<string>('');
  const [correctSoundPlaying, setCorrectSoundPlaying] = useState<boolean>(false);

  const activeWords = getWordsForLetter(selectedEntry, difficulty);
  const currentTestWord = testWords[currentTestIndex] || activeWords[0];
  const currentWordProgress = testWordSteps[currentTestIndex] || { read: false, spell: false };

  // Play sound when clicking alphabet
  const handleAlphabetClick = (entry: AlphabetEntry) => {
    setSelectedEntry(entry);
    SoundEffects.playClick();
    // Play the phonics sound of the letter
    SoundEffects.speakLetterSound(entry.letter, entry.sound);
  };

  // Start test on current alphabet's 10 words or 10 full random words
  const handleStartTest = (fromSelected: boolean = true) => {
    SoundEffects.playClick();
    const words = fromSelected
      ? [...getWordsForLetter(selectedEntry, difficulty)]
      : pickTierTestWords(difficulty, 10);
    setTestWords(words);
    setCurrentTestIndex(0);
    setTestStage('read');
    setTestWordSteps({});
    setTestMasteredIndices([]);
    setIsTestMode(true);
    setShowHappyModal(false);
    setShowCryingModal(false);
    setHeardWord('');
    setIsListening(false);
  };

  // Exit button dynamic label: Shows exactly where clicking will go
  const getExitButtonLabel = () => {
    if (testStage === 'spell') {
      return '← Previous Step (Read Aloud)';
    }
    if (currentTestIndex > 0) {
      return `← Previous Word (${testWords[currentTestIndex - 1]?.word || ''})`;
    }
    return '← Exit Test';
  };

  // Exit button: Goes to previous step!
  const handleExitToPreviousStep = () => {
    SoundEffects.playClick();
    setIsListening(false);
    setHeardWord('');
    setShowHappyModal(false);
    setShowCryingModal(false);

    if (testStage === 'spell') {
      // Step 2 (Voice Spelling) -> Go back to Step 1 (Read Aloud) of current word!
      setTestStage('read');
    } else if (testStage === 'read') {
      if (currentTestIndex > 0) {
        // Step 1 of word 2+ -> Go back to Step 2 (Voice Spelling) of previous word!
        setCurrentTestIndex((prev) => prev - 1);
        setTestStage('spell');
      } else {
        // Word 1, Step 1 -> Exit test mode back to A-Z explorer!
        setIsTestMode(false);
      }
    }
  };

  // Step 1: Speak word in test mode and evaluate pronunciation
  const handleStartSpeaking = async () => {
    if (isListening) return;
    SoundEffects.stopAllSpeech();
    setIsListening(true);
    setHeardWord('');
    SoundEffects.playClick();

    const target = currentTestWord.word;
    const result = await recognizeWord(target, (live) => {
      setHeardWord(live);
    });

    setIsListening(false);
    setHeardWord(result.heard);
    setLastScoreWord(target);

    if (result.isCorrect) {
      // Step 1 passed! Record progress, but do NOT award score yet until spelling is also completed!
      SoundEffects.playSuccess();
      const updated = {
        ...(testWordSteps[currentTestIndex] || { read: false, spell: false }),
        read: true,
      };
      setTestWordSteps((prev) => ({ ...prev, [currentTestIndex]: updated }));

      // Check if both steps completed
      if (updated.read && updated.spell) {
        if (!testMasteredIndices.includes(currentTestIndex)) {
          setTestMasteredIndices((prev) => [...prev, currentTestIndex]);
        }
      }

      // Smoothly advance to Step 2 (Voice Spelling Test)!
      setTestStage('spell');
    } else {
      // Wrong pronunciation -> CRYING FACE POPUP
      SoundEffects.playRetry();
      setShowCryingModal(true);
    }
  };

  // Step 2: Spell word aloud letter-by-letter via voice recognition
  const handleStartVoiceSpelling = async () => {
    if (isListening) return;
    SoundEffects.stopAllSpeech();
    setIsListening(true);
    setHeardWord('');
    SoundEffects.playClick();

    const target = currentTestWord.word;
    const result = await recognizeSpokenSpelling(target, (live) => {
      setHeardWord(live);
    });

    setIsListening(false);
    setHeardWord(result.heard);
    setLastScoreWord(target);

    if (result.isCorrect) {
      const updated = {
        ...(testWordSteps[currentTestIndex] || { read: false, spell: false }),
        spell: true,
      };
      setTestWordSteps((prev) => ({ ...prev, [currentTestIndex]: updated }));

      // ONLY award 1 score point when ALL steps (both read and spell) are completed!
      if (updated.read && updated.spell) {
        if (!testMasteredIndices.includes(currentTestIndex)) {
          setTestMasteredIndices((prev) => [...prev, currentTestIndex]);
        }
      }

      // Happy Popup on complete word mastery!
      SoundEffects.playFanfare();
      setShowHappyModal(true);
    } else {
      // Wrong spelling -> CRYING FACE POPUP
      SoundEffects.playRetry();
      setShowCryingModal(true);
    }
  };

  // Next word in test
  const handleNextWord = () => {
    setShowHappyModal(false);
    setShowCryingModal(false);
    setHeardWord('');
    setTestStage('read');
    if (currentTestIndex + 1 < testWords.length) {
      setCurrentTestIndex((prev) => prev + 1);
    } else {
      // Completed current test set
      setIsTestMode(false);
      SoundEffects.playFanfare();
    }
  };

  // Check correct sound action in Crying Modal
  const handleCheckCorrectSound = () => {
    setCorrectSoundPlaying(true);
    SoundEffects.playClick();
    if (testStage === 'read') {
      SoundEffects.speakPhonics(currentTestWord.word);
    } else {
      // Speak clear Alphabet Names (Bee, Ee, Dee)
      SoundEffects.speakSpellingNames(currentTestWord.word);
    }
    setTimeout(() => {
      setCorrectSoundPlaying(false);
    }, 1200);
  };

  // Try again action in Crying Modal
  const handleTryAgain = () => {
    setShowCryingModal(false);
    setHeardWord('');
    setTimeout(() => {
      if (testStage === 'read') {
        handleStartSpeaking();
      } else {
        handleStartVoiceSpelling();
      }
    }, 300);
  };

  return (
    <View style={styles.container}>
      {/* Top Banner Navigation */}
      <View style={styles.topNav}>
        {isTestMode ? (
          <TouchableOpacity style={styles.backBtn} onPress={handleExitToPreviousStep}>
            <Text style={styles.backBtnText}>{getExitButtonLabel()}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>LEVEL 1</Text>
          </View>
        )}
        <Text style={styles.topNavTitle}>
          {isTestMode ? '🎯 10-Word Voice Test' : '🔤 Alphabet Sounds & Test'}
        </Text>
        {isTestMode ? (
          <View style={styles.testScorePill}>
            <Text style={styles.testScoreText}>⭐ Score: {testMasteredIndices.length} / {testWords.length}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.quickTestBtn}
            onPress={() => handleStartTest(false)}
          >
            <Text style={styles.quickTestText}>⚡ Test 10 Words</Text>
          </TouchableOpacity>
        )}
      </View>

      {!isTestMode ? (
        /* EXPLORE MODE: A-Z Alphabets & 10 Examples for Easy/Medium/Advanced */
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          {/* Instructions banner */}
          <View style={styles.introCard}>
            <Text style={styles.introEmoji}>🎧</Text>
            <View style={styles.introTextWrapper}>
              <Text style={styles.introTitle}>Level 1: Tap any letter to hear its sound!</Text>
              <Text style={styles.introSubtitle}>
                Select difficulty below to practice 10 distinct words per letter, then test your voice!
              </Text>
            </View>
          </View>

          {/* 3 Difficulty Options: Easy, Medium, Advanced */}
          <View style={styles.tierSelectorCard}>
            <Text style={styles.tierSelectorLabel}>Choose Difficulty Option:</Text>
            <View style={styles.tierButtonsRow}>
              <TouchableOpacity
                style={[styles.tierButton, difficulty === 'easy' && styles.tierButtonActiveEasy]}
                onPress={() => {
                  SoundEffects.playClick();
                  setDifficulty('easy');
                }}
              >
                <Text style={[styles.tierButtonText, difficulty === 'easy' && styles.tierButtonTextActive]}>
                  🟢 Easy (3-letter CVC)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tierButton, difficulty === 'medium' && styles.tierButtonActiveMedium]}
                onPress={() => {
                  SoundEffects.playClick();
                  setDifficulty('medium');
                }}
              >
                <Text style={[styles.tierButtonText, difficulty === 'medium' && styles.tierButtonTextActive]}>
                  🟡 Medium (Blends & 4-5 Letters)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tierButton, difficulty === 'advanced' && styles.tierButtonActiveAdvanced]}
                onPress={() => {
                  SoundEffects.playClick();
                  setDifficulty('advanced');
                }}
              >
                <Text style={[styles.tierButtonText, difficulty === 'advanced' && styles.tierButtonTextActive]}>
                  🔴 Hard (Multi-Syllable)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 26 Alphabets Grid */}
          <View style={styles.alphabetGrid}>
            {ALPHABET.map((item) => {
              const isSelected = selectedEntry.letter === item.letter;
              return (
                <TouchableOpacity
                  key={item.letter}
                  style={[
                    styles.alphabetTile,
                    isSelected && styles.alphabetTileSelected,
                  ]}
                  onPress={() => handleAlphabetClick(item)}
                  accessibilityLabel={`Letter ${item.letter.toUpperCase()} sound ${item.sound}`}
                >
                  <Text style={[styles.tileLetter, isSelected && styles.tileLetterSelected]}>
                    {item.letter.toUpperCase()}{item.letter}
                  </Text>
                  <Text style={[styles.tileSound, isSelected && styles.tileSoundSelected]}>
                    {item.sound}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected Alphabet Focus Card */}
          <View style={[styles.focusCard, isWide && styles.focusCardWide]}>
            <View style={styles.focusHeader}>
              <View style={styles.bigLetterBadge}>
                <Text style={styles.bigLetterText}>
                  {selectedEntry.letter.toUpperCase()} {selectedEntry.letter}
                </Text>
              </View>
              <View style={styles.focusHeaderInfo}>
                <Text style={styles.focusTitle}>Letter {selectedEntry.letter.toUpperCase()}</Text>
                <Text style={styles.focusSound}>Phonics Sound: {selectedEntry.sound}</Text>
              </View>
              <TouchableOpacity
                style={styles.hearSoundBtn}
                onPress={() => {
                  SoundEffects.playClick();
                  SoundEffects.speakLetterSound(selectedEntry.letter, selectedEntry.sound);
                }}
              >
                <Text style={styles.hearSoundIcon}>🔊</Text>
                <Text style={styles.hearSoundText}>Hear Sound</Text>
              </TouchableOpacity>
            </View>

            {/* Examples Toggle Button */}
            <TouchableOpacity
              style={styles.examplesToggleBtn}
              onPress={() => {
                SoundEffects.playClick();
                setShowExamples(!showExamples);
              }}
            >
              <Text style={styles.examplesToggleText}>
                {showExamples ? '📖 Hide 10 Words' : `📖 Show 10 Examples of ${selectedEntry.letter.toUpperCase()}`}
              </Text>
              <Text style={styles.examplesToggleArrow}>{showExamples ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {/* 10 Words Examples for Selected Difficulty */}
            {showExamples && (
              <View style={styles.examplesContainer}>
                <View style={styles.examplesHeaderBar}>
                  <Text style={styles.examplesHeaderLabel}>
                    10 {difficulty.toUpperCase()} words starting with "{selectedEntry.letter.toUpperCase()}":
                  </Text>
                  <View style={[styles.tierTag, difficulty === 'easy' ? styles.tierTagEasy : difficulty === 'medium' ? styles.tierTagMedium : styles.tierTagAdvanced]}>
                    <Text style={styles.tierTagText}>{difficulty.toUpperCase()}</Text>
                  </View>
                </View>

                <View style={styles.wordsRow}>
                  {activeWords.map((wItem, idx) => (
                    <TouchableOpacity
                      key={wItem.word}
                      style={styles.wordCard}
                      onPress={() => {
                        SoundEffects.playClick();
                        SoundEffects.speakPhonics(wItem.word);
                      }}
                      accessibilityLabel={`Hear example word ${wItem.word}`}
                    >
                      <View style={styles.wordBadgeIndex}>
                        <Text style={styles.wordBadgeIndexText}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.wordText}>{wItem.word}</Text>
                      <Text style={styles.wordSpeaker}>🔊</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Start Test Button */}
                <TouchableOpacity
                  style={styles.startTestBtn}
                  onPress={() => handleStartTest(true)}
                >
                  <Text style={styles.startTestIcon}>🎯</Text>
                  <Text style={styles.startTestText}>
                    Start 10-Word Voice Test on Letter {selectedEntry.letter.toUpperCase()} ({difficulty.toUpperCase()})
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        /* TEST MODE: 2-Stage Voice Test (Read Aloud + Voice Spelling) */
        <View style={styles.testContainer}>
          <View style={styles.testCard}>
            <View style={styles.testHeaderRow}>
              <View style={styles.testStepBadge}>
                <Text style={styles.testStepText}>
                  WORD {currentTestIndex + 1} OF {testWords.length}
                </Text>
              </View>

              <View style={styles.testScorePill}>
                <Text style={styles.testScoreText}>
                  ⭐ Score: {testMasteredIndices.length} / {testWords.length}
                </Text>
              </View>
            </View>

            {/* Step Sequence Badges: Step 1 (Read Aloud) -> Step 2 (Voice Spelling Test) */}
            <View style={styles.stepSequenceBox}>
              <TouchableOpacity
                style={[
                  styles.stepBadgeItem,
                  testStage === 'read' && styles.stepBadgeItemActive,
                  currentWordProgress.read && styles.stepBadgeItemCompleted,
                ]}
                onPress={() => {
                  SoundEffects.playClick();
                  setTestStage('read');
                  setIsListening(false);
                }}
              >
                <Text style={styles.stepNumberCircle}>
                  {currentWordProgress.read ? '✓' : '1'}
                </Text>
                <Text
                  style={[
                    styles.stepBadgeLabel,
                    testStage === 'read' && styles.stepBadgeLabelActive,
                    currentWordProgress.read && styles.stepBadgeLabelCompleted,
                  ]}
                >
                  Read Aloud
                </Text>
              </TouchableOpacity>

              <Text style={styles.stepArrow}>➔</Text>

              <TouchableOpacity
                style={[
                  styles.stepBadgeItem,
                  testStage === 'spell' && styles.stepBadgeItemActive,
                  currentWordProgress.spell && styles.stepBadgeItemCompleted,
                ]}
                onPress={() => {
                  SoundEffects.playClick();
                  setTestStage('spell');
                  setIsListening(false);
                }}
              >
                <Text style={styles.stepNumberCircle}>
                  {currentWordProgress.spell ? '✓' : '2'}
                </Text>
                <Text
                  style={[
                    styles.stepBadgeLabel,
                    testStage === 'spell' && styles.stepBadgeLabelActive,
                    currentWordProgress.spell && styles.stepBadgeLabelCompleted,
                  ]}
                >
                  Voice Spell
                </Text>
              </TouchableOpacity>
            </View>

            {/* Motivational Mascot Listening Banner */}
            {isListening && (
              <View style={styles.friendlyListeningBanner}>
                <Text style={styles.listeningAvatar}>🦜</Text>
                <View style={styles.listeningTextCol}>
                  <Text style={styles.listeningTitle}>I'm listening to your voice! 🌟</Text>
                  <Text style={styles.listeningSub}>
                    Take your time, speak clearly into the microphone. You've got this!
                  </Text>
                </View>
              </View>
            )}

            {/* STAGE 1: READ ALOUD */}
            {testStage === 'read' && (
              <>
                <Text style={styles.testStageLabel}>STEP 1 OF 2: READ ALOUD</Text>
                <Text style={styles.testPrompt}>Speak this word clearly into the microphone:</Text>

                {/* Target Word Display (Pure text, NO images) */}
                <View style={styles.targetWordBox}>
                  <Text style={styles.targetWordText}>{currentTestWord.word.toUpperCase()}</Text>
                </View>

                {/* Microphone Button */}
                <TouchableOpacity
                  style={[
                    styles.micBtn,
                    isListening && styles.micBtnListening,
                  ]}
                  onPress={handleStartSpeaking}
                  disabled={isListening}
                >
                  <Text style={styles.micIcon}>{isListening ? '🔴' : '🎙️'}</Text>
                  <Text style={styles.micLabel}>
                    {isListening ? 'Listening... Speak Now!' : 'Tap & Read Aloud into Mic'}
                  </Text>
                </TouchableOpacity>

                {/* Audio reference aid */}
                <TouchableOpacity
                  style={styles.helpHearBtn}
                  onPress={() => {
                    SoundEffects.playClick();
                    SoundEffects.speakPhonics(currentTestWord.word);
                  }}
                >
                  <Text style={styles.helpHearText}>🔊 Need a hint? Hear word</Text>
                </TouchableOpacity>
              </>
            )}

            {/* STAGE 2: VOICE SPELLING TEST */}
            {testStage === 'spell' && (
              <>
                <Text style={styles.testStageLabel}>STEP 2 OF 2: VOICE SPELLING TEST</Text>
                <Text style={styles.testPrompt}>
                  Spell "{currentTestWord.word}" by saying the Alphabet Names into the microphone!
                </Text>

                {/* Spoken spelling guide showing alphabet names */}
                <View style={styles.spellingLetterSlotsRow}>
                  {currentTestWord.word.split('').map((char, idx) => (
                    <View key={idx} style={styles.spellingLetterSlot}>
                      <Text style={styles.spellingLetterSlotText}>{char.toUpperCase()}</Text>
                      <Text style={styles.spellingLetterNameText}>{getAlphabetName(char)}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.spellingVoiceHint}>
                  💡 Say Alphabet Names: "{currentTestWord.word.split('').map((c) => `${c.toUpperCase()} (${getAlphabetName(c)})`).join(' - ')}"
                </Text>

                {/* Audio reference aid for alphabet names */}
                <TouchableOpacity
                  style={styles.helpHearBtn}
                  onPress={() => {
                    SoundEffects.playClick();
                    SoundEffects.speakSpellingNames(currentTestWord.word);
                  }}
                >
                  <Text style={styles.helpHearText}>🔊 Hear Alphabet Names ({currentTestWord.word.split('').map(c => getAlphabetName(c)).join(' - ')})</Text>
                </TouchableOpacity>

                {/* Microphone Button */}
                <TouchableOpacity
                  style={[
                    styles.micBtn,
                    isListening && styles.micBtnListening,
                  ]}
                  onPress={handleStartVoiceSpelling}
                  disabled={isListening}
                >
                  <Text style={styles.micIcon}>{isListening ? '🔴' : '🎙️'}</Text>
                  <Text style={styles.micLabel}>
                    {isListening ? 'Listening... Speak Names!' : 'Tap & Say Alphabet Names'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Bottom Previous Step Exit Button */}
            <TouchableOpacity style={styles.bottomExitBtn} onPress={handleExitToPreviousStep}>
              <Text style={styles.bottomExitBtnText}>{getExitButtonLabel()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 1. HAPPY POPUP (All steps completed for this word!) */}
      <Modal
        visible={showHappyModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.happyCard}>
            <View style={styles.happyFaceCircle}>
              <Text style={styles.happyFaceEmoji}>🏆</Text>
            </View>
            <Text style={styles.happyTitle}>All Steps Completed! 🎉</Text>
            <Text style={styles.happySubtitle}>
              You read and orally spelled "{lastScoreWord}"! +1 Score Point!
            </Text>

            <View style={styles.scorePillModal}>
              <Text style={styles.scorePillModalText}>
                ⭐ Total Score: {testMasteredIndices.length} / {testWords.length}
              </Text>
            </View>

            <View style={styles.starsRewardRow}>
              <Text style={styles.starLarge}>⭐</Text>
              <Text style={styles.starLarge}>⭐</Text>
              <Text style={styles.starLarge}>⭐</Text>
            </View>

            <TouchableOpacity style={styles.nextWordBtn} onPress={handleNextWord}>
              <Text style={styles.nextWordText}>Next Word ➡️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 2. CRYING FACE POPUP (On wrong voice input with 2 explicit options) */}
      <Modal
        visible={showCryingModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cryingCard}>
            <View style={styles.cryingFaceCircle}>
              <Text style={styles.cryingFaceEmoji}>😢</Text>
            </View>
            <Text style={styles.cryingTitle}>Oops! Let's Try Again 😢</Text>
            <Text style={styles.cryingSubtitle}>
              {heardWord
                ? `We heard "${heardWord}". Let's get the ${testStage === 'read' ? 'pronunciation' : 'oral spelling'} right!`
                : `We couldn't hear clearly. Speak right into the microphone!`}
            </Text>

            {/* Target reminder */}
            <View style={styles.cryingTargetRow}>
              <Text style={styles.cryingTargetLabel}>
                {testStage === 'read' ? 'Target Word:' : 'Say Alphabet Names:'}
              </Text>
              <Text style={styles.cryingTargetWord}>
                {testStage === 'read'
                  ? currentTestWord.word.toUpperCase()
                  : currentTestWord.word.split('').map(c => `${c.toUpperCase()} (${getAlphabetName(c)})`).join(' - ')}
              </Text>
            </View>

            {/* The TWO required options */}
            <View style={styles.cryingActionsContainer}>
              {/* Option 1: Try Again */}
              <TouchableOpacity
                style={styles.tryAgainBtn}
                onPress={handleTryAgain}
              >
                <Text style={styles.tryAgainIcon}>🔄</Text>
                <Text style={styles.tryAgainText}>Try Again</Text>
              </TouchableOpacity>

              {/* Option 2: Check Correct Sound / Alphabet Names */}
              <TouchableOpacity
                style={[
                  styles.checkSoundBtn,
                  correctSoundPlaying && styles.checkSoundBtnActive,
                ]}
                onPress={handleCheckCorrectSound}
              >
                <Text style={styles.checkSoundIcon}>🔊</Text>
                <Text style={styles.checkSoundText}>
                  {correctSoundPlaying
                    ? 'Playing...'
                    : testStage === 'read'
                    ? 'Check Correct Sound'
                    : 'Hear Alphabet Names'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Optional skip option */}
            <TouchableOpacity style={styles.skipBtn} onPress={handleNextWord}>
              <Text style={styles.skipBtnText}>Skip this word ➡️</Text>
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
    backgroundColor: '#F0F9FF',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#BAE6FD',
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#0284C7',
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  topNavTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textDark,
  },
  quickTestBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEF08A',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FACC15',
  },
  quickTestText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#854D0E',
  },
  tierSelectorCard: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tierSelectorLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tierButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tierButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  tierButtonActiveEasy: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  tierButtonActiveMedium: {
    backgroundColor: '#FEF9C3',
    borderColor: '#EAB308',
  },
  tierButtonActiveAdvanced: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  tierButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    textAlign: 'center',
  },
  tierButtonTextActive: {
    color: '#0F172A',
    fontWeight: '900',
  },
  examplesHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tierTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tierTagEasy: {
    backgroundColor: '#DCFCE7',
  },
  tierTagMedium: {
    backgroundColor: '#FEF9C3',
  },
  tierTagAdvanced: {
    backgroundColor: '#FEE2E2',
  },
  tierTagText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F172A',
  },
  wordBadgeIndex: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#BBF7D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  wordBadgeIndexText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#166534',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
    paddingBottom: 40,
  },
  introCard: {
    width: '100%',
    maxWidth: 720,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  introEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  introTextWrapper: {
    flex: 1,
  },
  introTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.primary,
    marginBottom: 2,
  },
  introSubtitle: {
    fontSize: 12,
    color: Colors.textMedium,
    fontWeight: '600',
    lineHeight: 16,
  },
  alphabetGrid: {
    width: '100%',
    maxWidth: 720,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  alphabetTile: {
    width: 60,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  alphabetTileSelected: {
    backgroundColor: '#0284C7',
    borderColor: '#0369A1',
    transform: [{ scale: 1.05 }],
  },
  tileLetter: {
    fontSize: 19,
    fontWeight: '900',
    color: Colors.textDark,
  },
  tileLetterSelected: {
    color: '#FFFFFF',
  },
  tileSound: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 2,
  },
  tileSoundSelected: {
    color: '#BAE6FD',
  },
  focusCard: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 2.5,
    borderColor: '#BAE6FD',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  focusCardWide: {
    padding: 24,
  },
  focusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bigLetterBadge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  bigLetterText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  focusHeaderInfo: {
    flex: 1,
  },
  focusTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textDark,
  },
  focusSound: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 2,
  },
  hearSoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#C4B5FD',
  },
  hearSoundIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  hearSoundText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6D28D9',
  },
  examplesToggleBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  examplesToggleText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textDark,
  },
  examplesToggleArrow: {
    fontSize: 14,
    color: Colors.textMedium,
  },
  examplesContainer: {
    marginTop: 14,
  },
  examplesHeaderLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textMedium,
    marginBottom: 10,
  },
  wordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  wordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#BBF7D0',
    minWidth: 125,
    justifyContent: 'space-between',
    gap: 12,
  },
  wordText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#166534',
    textTransform: 'lowercase',
    letterSpacing: 0.8,
  },
  wordSpeaker: {
    fontSize: 15,
    opacity: 0.75,
  },
  startTestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D97706',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  startTestIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  startTestText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  /* TEST MODE STYLES */
  testContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  testCard: {
    width: '100%',
    maxWidth: 580,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#BAE6FD',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  testStepBadge: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 12,
  },
  testStepText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#854D0E',
  },
  testPrompt: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textMedium,
    textAlign: 'center',
    marginBottom: 20,
  },
  targetWordBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    paddingVertical: 32,
    paddingHorizontal: 40,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#BAE6FD',
    marginBottom: 24,
  },
  targetWordText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#0369A1',
    letterSpacing: 3,
  },
  micBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 20,
    shadowColor: '#0369A1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 16,
  },
  micBtnListening: {
    backgroundColor: '#DC2626',
    borderColor: '#991B1B',
  },
  micIcon: {
    fontSize: 26,
    marginRight: 10,
  },
  micLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  helpHearBtn: {
    paddingVertical: 6,
  },
  helpHearText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },

  /* MODALS STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  happyCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 24,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#22C55E',
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  happyFaceCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  happyFaceEmoji: {
    fontSize: 48,
  },
  happyTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#15803D',
    marginBottom: 6,
  },
  happySubtitle: {
    fontSize: 15,
    color: Colors.textMedium,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  starsRewardRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  starLarge: {
    fontSize: 32,
  },
  nextWordBtn: {
    width: '100%',
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  nextWordText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  /* CRYING MODAL STYLES */
  cryingCard: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 24,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#F87171',
    shadowColor: '#B91C1C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  cryingFaceCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cryingFaceEmoji: {
    fontSize: 48,
  },
  cryingTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#B91C1C',
    marginBottom: 6,
  },
  cryingSubtitle: {
    fontSize: 14,
    color: Colors.textMedium,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 14,
  },
  cryingTargetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 18,
  },
  cryingTargetLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMedium,
    marginRight: 8,
  },
  cryingTargetWord: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.textDark,
  },
  cryingActionsContainer: {
    width: '100%',
    gap: 10,
    marginBottom: 12,
  },
  tryAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 16,
  },
  tryAgainIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  tryAgainText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  checkSoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDE9FE',
    borderWidth: 2,
    borderColor: '#C4B5FD',
    paddingVertical: 14,
    borderRadius: 16,
  },
  checkSoundBtnActive: {
    backgroundColor: '#DDD6FE',
  },
  checkSoundIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  checkSoundText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#6D28D9',
  },
  skipBtn: {
    marginTop: 4,
    paddingVertical: 6,
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMedium,
  },
  testHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  testScorePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  testScoreText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B45309',
  },
  stepSequenceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    gap: 10,
    width: '100%',
  },
  stepBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  stepBadgeItemActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  stepBadgeItemCompleted: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
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
  friendlyListeningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#F87171',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    gap: 10,
    width: '100%',
  },
  listeningAvatar: {
    fontSize: 28,
  },
  listeningTextCol: {
    flex: 1,
  },
  listeningTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#DC2626',
    marginBottom: 2,
  },
  listeningSub: {
    fontSize: 11,
    color: '#991B1B',
    lineHeight: 15,
  },
  testStageLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.5,
    marginBottom: 8,
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
  spellingVoiceHint: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  bottomExitBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginTop: 14,
  },
  bottomExitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  scorePillModal: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    marginBottom: 14,
  },
  scorePillModalText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#B45309',
  },
});
