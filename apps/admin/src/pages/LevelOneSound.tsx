import React, { useEffect, useMemo, useState } from 'react';
import { KidFeedbackPopup } from '../components/KidFeedbackPopup';
import {
  displayWord,
  LEVEL_ONE_LETTERS,
  LevelDifficulty,
  LetterSound,
  wordsFor,
} from '../data/levelOne';
import { StudentAPI } from '../services/api';
import { getAlphabetName, speakLetterSound, speakSpellingNames, speakWord, spellingGuide, stopSpeech } from '../services/voiceCoach';
import {
  isRecognitionSupported,
  recognizeSpokenSpelling,
  recognizeWord,
} from '../services/wordRecognizer';

type Feedback = {
  kind: 'success' | 'retry';
  title: string;
  message: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  skipLabel?: string;
  onSkip?: () => void;
  hint?: string;
} | null;

type Mode = 'learn' | 'test' | 'letterDone';
type TestStage = 'read' | 'spell';

interface Props {
  difficulty: LevelDifficulty;
  onExit: () => void;
  onCompleted: (dashboard: any) => void;
}

const DIFFICULTY_LABEL: Record<LevelDifficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export const LevelOneSound: React.FC<Props> = ({ difficulty, onExit, onCompleted }) => {
  const [level, setLevel] = useState<any>(null);
  const [letterIndex, setLetterIndex] = useState(0);
  const [mode, setMode] = useState<Mode>('learn');
  const [wordIndex, setWordIndex] = useState(0);
  const [testStage, setTestStage] = useState<TestStage>('read');
  const [wordSteps, setWordSteps] = useState<Record<number, { read: boolean; spell: boolean }>>({});
  const [mastered, setMastered] = useState<number[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [heardWord, setHeardWord] = useState('');
  const [stageTries, setStageTries] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [saving, setSaving] = useState(false);
  const [savedOnce, setSavedOnce] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceOk] = useState(() => isRecognitionSupported());

  useEffect(() => {
    StudentAPI.getFirstLevel()
      .then((data) => setLevel(data.level))
      .catch(() => {
        setLevel({
          id: 'level-1-alphabet',
          title: 'Alphabet sounds',
          worldTitle: 'Level 1',
        });
      });
  }, []);

  const letter: LetterSound = LEVEL_ONE_LETTERS[letterIndex];
  const practiceWords = useMemo(() => wordsFor(letter, difficulty), [letter, difficulty]);
  const currentWord = practiceWords[wordIndex];
  const voiceScore = mastered.length;

  const resetTest = () => {
    stopSpeech();
    setMode('learn');
    setWordIndex(0);
    setTestStage('read');
    setWordSteps({});
    setMastered([]);
    setHeardWord('');
    setStageTries(0);
    setFeedback(null);
    setError(null);
  };

  const chooseLetter = (index: number) => {
    setLetterIndex(index);
    resetTest();
  };

  const hearSound = () => {
    speakLetterSound(letter.speakText, letter.speakRate);
  };

  const markWordDone = (index: number, patch: Partial<{ read: boolean; spell: boolean }>) => {
    const updated = { ...(wordSteps[index] || { read: false, spell: false }), ...patch };
    setWordSteps((prev) => ({ ...prev, [index]: updated }));
    if (updated.read && updated.spell && !mastered.includes(index)) {
      setMastered((prev) => [...prev, index]);
    }
  };

  const finishLetter = async () => {
    setFeedback(null);
    setHeardWord('');
    setMode('letterDone');
    if (!level?.id || savedOnce || level.id === 'level-1-alphabet') return;
    setSaving(true);
    try {
      const dashboard = await StudentAPI.completeLevel(level.id, {
        score: Math.round((voiceScore / practiceWords.length) * 100),
        correctCount: voiceScore,
        totalCount: practiceWords.length,
      });
      setSavedOnce(true);
      onCompleted(dashboard);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Stars could not be saved. You can keep practicing.');
    } finally {
      setSaving(false);
    }
  };

  const skipOrNextWord = () => {
    setFeedback(null);
    setHeardWord('');
    setStageTries(0);
    setTestStage('read');
    if (wordIndex + 1 < practiceWords.length) {
      setWordIndex((index) => index + 1);
      return;
    }
    finishLetter();
  };

  const startReadAloud = async () => {
    if (isListening || !currentWord) return;
    stopSpeech();
    setIsListening(true);
    setHeardWord('');
    setFeedback(null);
    const result = await recognizeWord(currentWord.word, (live) => setHeardWord(live));
    setIsListening(false);
    setHeardWord(result.heard);

    if (result.isCorrect) {
      markWordDone(wordIndex, { read: true });
      setStageTries(0);
      speakLetterSound(`Great reading! Now spell ${displayWord(currentWord.word)} with alphabet names.`, 0.9);
      setFeedback({
        kind: 'success',
        title: 'Super reading!',
        message: `You said “${displayWord(currentWord.word)}” clearly. Now spell it with alphabet names.`,
        primaryLabel: 'Spell it next ⭐',
        onPrimary: () => {
          setFeedback(null);
          setTestStage('spell');
        },
      });
      return;
    }
    handleVoiceMiss(result.status, result.heard);
  };

  const startSpelling = async () => {
    if (isListening || !currentWord) return;
    stopSpeech();
    setIsListening(true);
    setHeardWord('');
    setFeedback(null);
    const result = await recognizeSpokenSpelling(currentWord.word, (live) => setHeardWord(live));
    setIsListening(false);
    setHeardWord(result.heard);

    if (result.isCorrect) {
      markWordDone(wordIndex, { spell: true });
      speakLetterSound('All steps completed! Super star!', 0.95);
      setFeedback({
        kind: 'success',
        title: 'All steps done!',
        message: `You read and spelled “${displayWord(currentWord.word)}”.`,
        hint: `⭐ Voice score: ${mastered.includes(wordIndex) ? mastered.length : mastered.length + 1} / ${practiceWords.length}`,
        primaryLabel: wordIndex + 1 < practiceWords.length ? 'Next word ➡️' : 'Finish these words 🏆',
        onPrimary: skipOrNextWord,
      });
      return;
    }
    handleVoiceMiss(result.status, result.heard);
  };

  const handleVoiceMiss = (status: string, heard = '') => {
    const tries = stageTries + 1;
    setStageTries(tries);
    if (status === 'denied') {
      setError('Please allow the microphone. I need to hear your voice.');
    }
    setFeedback({
      kind: 'retry',
      title: 'Try again!',
      message: heard
        ? `I heard “${heard}”. Let’s get the ${testStage === 'read' ? 'word' : 'alphabet names'} together.`
        : 'I could not hear clearly. Speak a little louder into the microphone.',
      hint: testStage === 'read' ? displayWord(currentWord.word).toUpperCase() : spellingGuide(currentWord.word),
      primaryLabel: '🔄 Try again',
      onPrimary: () => {
        setFeedback(null);
        setHeardWord('');
      },
      secondaryLabel: testStage === 'read' ? '🔊 Check correct sound' : '🔊 Hear alphabet names',
      onSecondary: () => {
        if (testStage === 'read') speakWord(displayWord(currentWord.word));
        else speakSpellingNames(currentWord.word);
      },
      skipLabel: wordIndex + 1 < practiceWords.length ? 'Skip this word →' : 'Skip and finish →',
      onSkip: skipOrNextWord,
    });
  };

  const previousVoiceStep = () => {
    setFeedback(null);
    setHeardWord('');
    if (testStage === 'spell') {
      setTestStage('read');
      return;
    }
    if (wordIndex > 0) {
      setWordIndex((index) => index - 1);
      setTestStage('spell');
      return;
    }
    resetTest();
  };

  const tileColors = ['#FFD24D', '#7DD3FC', '#FDA4AF', '#6EE7B7'];

  return (
    <div className="l1-stage">
      <div className="l1-bar">
        <button
          className="l1-back"
          onClick={() => {
            if (mode === 'test') previousVoiceStep();
            else onExit();
          }}
        >
          {mode === 'test'
            ? testStage === 'spell'
              ? '← Read it again'
              : wordIndex > 0
                ? `← ${displayWord(practiceWords[wordIndex - 1].word)}`
                : '← Letters'
            : '← Back'}
        </button>
        <div>
          <div className="l1-kicker">Level 1 • {DIFFICULTY_LABEL[difficulty]}</div>
          <h2 className="l1-title">Alphabet sounds</h2>
        </div>
        <span className="l1-score">⭐ {voiceScore}/{practiceWords.length}</span>
      </div>

      {error && <div className="l1-note">{error}</div>}
      {!voiceOk && mode === 'test' && (
        <div className="l1-note">Voice listening works best in Chrome. You can still hear the model and keep going.</div>
      )}

      {mode === 'learn' && (
        <section className="l1-board">
          <p className="l1-kicker">Tap a letter, hear the sound, then play with 10 words</p>
          <div className="l1-alpha">
            {LEVEL_ONE_LETTERS.map((item, index) => (
              <button
                key={item.letter}
                className={index === letterIndex ? 'l1-tile is-on' : 'l1-tile'}
                style={{ ['--tile' as string]: tileColors[index % tileColors.length] }}
                onClick={() => chooseLetter(index)}
              >
                <strong>{item.letter.toUpperCase()}</strong>
                <span>{item.spoken}</span>
              </button>
            ))}
          </div>

          <div className="l1-hero">
            <div className="l1-badge pq-bounce">{letter.letter.toUpperCase()}</div>
            <div>
              <p className="l1-says">{letter.letter.toUpperCase()} {letter.letter} says</p>
              <h3 className="l1-sound">“{letter.spoken}”</h3>
              <span className="l1-ipa">{letter.ipa}</span>
              <p className="l1-coach">{letter.coach}</p>
              <button className="l1-hear" onClick={hearSound}>🔊 Hear “{letter.spoken}”</button>
            </div>
          </div>

          <div className="l1-words-head">
            <span>
              {letter.letter === 'x'
                ? `10 ${DIFFICULTY_LABEL[difficulty].toLowerCase()} words with ks`
                : `10 ${DIFFICULTY_LABEL[difficulty].toLowerCase()} words`}
            </span>
            <span className="l1-kicker">Tap to hear</span>
          </div>
          <div className="l1-words">
            {practiceWords.map((item, index) => (
              <button key={item.word} className="l1-word" onClick={() => speakWord(displayWord(item.word))}>
                <em>{item.emoji}</em>
                <b>{displayWord(item.word)}</b>
                <span className="l1-kicker">{index + 1}</span>
              </button>
            ))}
          </div>
          <button
            className="l1-go"
            onClick={() => {
              stopSpeech();
              setMode('test');
              setWordIndex(0);
              setTestStage('read');
              setWordSteps({});
              setMastered([]);
              setFeedback(null);
            }}
          >
            Start the voice test
          </button>
        </section>
      )}

      {mode === 'test' && currentWord && (
        <section className="l1-test">
          <p className="l1-kicker">
            {letter.letter.toUpperCase()} says “{letter.spoken}” {letter.ipa} • word {wordIndex + 1} of {practiceWords.length}
          </p>
          <div className="l1-dots">
            {practiceWords.map((item, index) => (
              <span
                key={item.word}
                className={index === wordIndex ? 'l1-dot is-now' : mastered.includes(index) ? 'l1-dot is-done' : 'l1-dot'}
              />
            ))}
          </div>
          <div className="l1-steps">
            <span className="l1-step" style={{ background: testStage === 'read' ? '#0B3B33' : '#6EE7B7', color: testStage === 'read' ? '#fff' : '#0B3B33' }}>
              1. Read {wordSteps[wordIndex]?.read ? '✓' : ''}
            </span>
            <span className="l1-step" style={{ background: testStage === 'spell' ? '#0B3B33' : '#7DD3FC', color: testStage === 'spell' ? '#fff' : '#0B3B33' }}>
              2. Spell {wordSteps[wordIndex]?.spell ? '✓' : ''}
            </span>
          </div>
          {isListening && <ListeningBanner live={heardWord} />}
          <div className="l1-emoji">{currentWord.emoji}</div>
          <div className="l1-target">{displayWord(currentWord.word)}</div>
          {testStage === 'read' && (
            <>
              <p className="l1-coach" style={{ margin: '8px auto' }}>Read it out loud. Listen for “{letter.spoken}”.</p>
              <button
                className={isListening ? 'l1-mic pq-mic-listening' : 'l1-mic'}
                style={{ background: isListening ? '#BE123C' : '#0B3B33' }}
                onClick={startReadAloud}
                disabled={isListening}
              >
                <span style={{ fontSize: 36 }}>{isListening ? '🔴' : '🎙️'}</span>
                {isListening ? 'Listening...' : 'Tap and read'}
              </button>
              <button className="l1-hint-btn" onClick={() => speakWord(displayWord(currentWord.word))}>🔊 Hear the word</button>
            </>
          )}
          {testStage === 'spell' && (
            <>
              <p className="l1-coach" style={{ margin: '8px auto' }}>Now say the alphabet names.</p>
              <div className="l1-slots">
                {currentWord.word.split('').map((char, index) => (
                  <div key={`${char}-${index}`} className="l1-slot">
                    <strong>{char.toUpperCase()}</strong>
                    <span>{getAlphabetName(char)}</span>
                  </div>
                ))}
              </div>
              <p className="l1-kicker">Say: {spellingGuide(currentWord.word)}</p>
              <button className="l1-hint-btn" onClick={() => speakSpellingNames(currentWord.word)}>🔊 Hear the names</button>
              <button
                className={isListening ? 'l1-mic pq-mic-listening' : 'l1-mic'}
                style={{ background: isListening ? '#BE123C' : '#0B3B33' }}
                onClick={startSpelling}
                disabled={isListening}
              >
                <span style={{ fontSize: 36 }}>{isListening ? '🔴' : '🎙️'}</span>
                {isListening ? 'Listening...' : 'Tap and spell'}
              </button>
            </>
          )}
          <button className="l1-skip" onClick={skipOrNextWord} disabled={isListening}>
            {wordIndex + 1 < practiceWords.length ? 'Skip this word' : 'Skip and finish'}
          </button>
          {heardWord && !isListening && <p className="l1-kicker" style={{ marginTop: 12 }}>I heard: “{heardWord}”</p>}
        </section>
      )}

      {mode === 'letterDone' && (
        <section className="l1-finish">
          <div className="l1-badge pq-bounce" style={{ margin: '0 auto 12px' }}>⭐</div>
          <h3 className="l1-sound">Letter {letter.letter.toUpperCase()} is done!</h3>
          <p className="l1-coach" style={{ margin: '0 auto' }}>
            You practiced “{letter.spoken}” {letter.ipa} with 10 {DIFFICULTY_LABEL[difficulty].toLowerCase()} words.
            Score {voiceScore} of {practiceWords.length}.
            {saving ? ' Saving your stars...' : ''}
          </p>
          <div className="l1-actions">
            <button className="l1-again" onClick={resetTest}>Practice again</button>
            <button className="l1-next" onClick={() => chooseLetter((letterIndex + 1) % LEVEL_ONE_LETTERS.length)}>
              Next letter
            </button>
            <button className="l1-hint-btn" onClick={onExit}>Back to dashboard</button>
          </div>
        </section>
      )}

      {feedback && (
        <KidFeedbackPopup
          kind={feedback.kind}
          title={feedback.title}
          message={feedback.message}
          primaryLabel={feedback.primaryLabel}
          onPrimary={feedback.onPrimary}
          secondaryLabel={feedback.secondaryLabel}
          onSecondary={feedback.onSecondary}
          skipLabel={feedback.skipLabel}
          onSkip={feedback.onSkip}
          hint={feedback.hint}
        />
      )}
    </div>
  );
};

const ListeningBanner: React.FC<{ live: string }> = ({ live }) => (
  <div className="l1-listen">
    <span style={{ fontSize: 28 }}>🦜</span>
    <div>
      <strong>I’m listening</strong>
      <p className="l1-kicker">{live ? `Hearing: “${live}”` : 'Speak clearly. You’ve got this.'}</p>
    </div>
  </div>
);
