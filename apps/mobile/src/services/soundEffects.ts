import { Platform } from 'react-native';

export interface PhonemeConfig {
  text: string;
  rate: number;
  pitch: number;
}

/**
 * Pure Synthetic Phonics pronunciation configuration.
 * Configured specifically for standalone letter sound pronunciation:
 * - Continuous consonants (s, n, m, f, z, r, l, v, h) sustain clean pure phonemes with NO schwa.
 * - Plosives and stops (b, c, d, g, k, p, t) use crisp, high-speed release bursts so the synthesizer
 *   never drags out an "uh" / schwa or pronounces letter names ("bee", "see", "kay", "pee").
 * - Short vowels (a, e, i, o, u) produce true phonetic values (/æ/, /e/, /ɪ/, /ɒ/, /ʌ/) without
 *   saying letter names ("eye" for 'i', "oh" for 'o', "you" for 'u').
 */
export const PURE_PHONEME_SPEECH: Record<string, PhonemeConfig> = {
  // Short vowels (true phonics short sounds, never letter names)
  a: { text: 'aah', rate: 1.05, pitch: 1.0 },   // short /æ/ as in apple
  e: { text: 'eh', rate: 1.05, pitch: 1.0 },    // short /e/ as in egg
  i: { text: 'ih', rate: 1.15, pitch: 1.02 },   // short /ɪ/ as in igloo (clean, not "eye")
  o: { text: 'aw', rate: 1.1, pitch: 1.0 },     // short /ɒ/ as in octopus / ox (not "oh", distinct from "a")
  u: { text: 'uh', rate: 1.25, pitch: 1.0 },    // short /ʌ/ as in up / umbrella (clean, not "you")

  // Continuous consonants (sustained pure fricatives, nasals, liquids - NO schwa -uh!)
  f: { text: 'ffff', rate: 1.0, pitch: 1.0 },   // pure unvoiced labiodental fricative
  h: { text: 'hhhh', rate: 1.0, pitch: 1.0 },   // pure unvoiced glottal fricative
  l: { text: 'llll', rate: 1.0, pitch: 1.0 },   // pure lateral liquid
  m: { text: 'mmmm', rate: 1.0, pitch: 1.0 },   // pure bilabial nasal hum
  n: { text: 'nnnn', rate: 1.0, pitch: 1.0 },   // pure alveolar nasal (clean, not "nuh", not "en")
  r: { text: 'rrrr', rate: 1.0, pitch: 1.0 },   // pure rhotic
  s: { text: 'ssss', rate: 1.0, pitch: 1.0 },   // pure sibilant hiss (clean, not "suh", not "ess")
  v: { text: 'vvvv', rate: 1.0, pitch: 1.0 },   // pure voiced fricative
  z: { text: 'zzzz', rate: 1.0, pitch: 1.0 },   // pure voiced sibilant buzz

  // Quick crisp plosives & stops (fast rate prevents the vowel "uh" / schwa from dragging out)
  b: { text: 'buh', rate: 1.38, pitch: 1.0 },   // crisp /b/ burst (not "bee")
  c: { text: 'kuh', rate: 1.38, pitch: 1.0 },   // crisp /k/ click for C (not "see")
  d: { text: 'duh', rate: 1.38, pitch: 1.0 },   // crisp /d/
  g: { text: 'guh', rate: 1.35, pitch: 1.0 },   // crisp /g/
  j: { text: 'juh', rate: 1.3, pitch: 1.0 },    // crisp /dʒ/
  k: { text: 'kuh', rate: 1.38, pitch: 1.0 },   // crisp /k/ click for K (not "kay")
  p: { text: 'puh', rate: 1.38, pitch: 1.0 },   // crisp unvoiced /p/ puff (not "pee")
  q: { text: 'kwuh', rate: 1.25, pitch: 1.0 },  // crisp /kw/
  t: { text: 'tuh', rate: 1.38, pitch: 1.0 },   // crisp unvoiced /t/
  w: { text: 'wuh', rate: 1.25, pitch: 1.0 },   // crisp /w/
  x: { text: 'ecks', rate: 1.15, pitch: 1.0 },  // crisp /ks/
  y: { text: 'yuh', rate: 1.25, pitch: 1.0 },   // crisp /j/

  // Common phonics digraphs & blends
  kw: { text: 'kwuh', rate: 1.25, pitch: 1.0 },
  ks: { text: 'ecks', rate: 1.15, pitch: 1.0 },
  sh: { text: 'shhh', rate: 1.0, pitch: 1.0 },
  ch: { text: 'chuh', rate: 1.3, pitch: 1.0 },
  th: { text: 'thhh', rate: 1.0, pitch: 1.0 },
  ck: { text: 'kuh', rate: 1.38, pitch: 1.0 },
  wh: { text: 'wuh', rate: 1.25, pitch: 1.0 },
  ph: { text: 'ffff', rate: 1.0, pitch: 1.0 },
  ng: { text: 'ng', rate: 1.0, pitch: 1.0 },
};

/**
 * Clear alphabet letter names used exclusively for Oral Spelling Tests.
 * In a spelling test, students say alphabet names ("Ay", "Bee", "See", "Dee", "Ee"...)
 * instead of phonics sounds ("buh", "kuh", "duh", "eh"), eliminating any learner confusion.
 */
export const ALPHABET_NAMES: Record<string, string> = {
  a: 'A',
  b: 'Bee',
  c: 'See',
  d: 'Dee',
  e: 'Ee',
  f: 'Eff',
  g: 'Gee',
  h: 'Aitch',
  i: 'Eye',
  j: 'Jay',
  k: 'Kay',
  l: 'Ell',
  m: 'Em',
  n: 'En',
  o: 'Oh',
  p: 'Pee',
  q: 'Cue',
  r: 'Ar',
  s: 'Ess',
  t: 'Tee',
  u: 'You',
  v: 'Vee',
  w: 'Double-U',
  x: 'Ex',
  y: 'Why',
  z: 'Zee',
};

export function getAlphabetName(letter: string): string {
  const char = letter.trim().toLowerCase();
  return ALPHABET_NAMES[char] || char.toUpperCase();
}

/** Melodic frequencies for children's sing-along spelling song (bright pentatonic/diatonic scale) */
export const MELODIC_SCALE = [
  523.25, // C5
  587.33, // D5
  659.25, // E5
  698.46, // F5
  783.99, // G5
  880.00, // A5
  987.77, // B5
  1046.50, // C6
  1174.66, // D6
  1318.51, // E6
];

/** Returns phoneme configuration for a phoneme/letter, or null if the text is a normal word. */
export function toPhonemeConfig(text: string): PhonemeConfig | null {
  const trimmed = text.trim().toLowerCase();
  const isSlashed = /^\/.+\/$/.test(trimmed);
  const bare = trimmed.replace(/^\/+|\/+$/g, '').trim();
  if ((isSlashed || bare.length <= 3) && PURE_PHONEME_SPEECH[bare]) {
    return PURE_PHONEME_SPEECH[bare];
  }
  return null;
}

class SoundEffectsService {
  private isMuted: boolean = false;
  private audioCtx: AudioContext | null = null;
  private spellingTimeouts: any[] = [];

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  private ensureAudioContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Play high-energy success chime (C5 - E5 - G5 - C6)
  public playSuccess() {
    if (this.isMuted) return;
    this.ensureAudioContext();

    if (this.audioCtx) {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.audioCtx!.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.001, this.audioCtx!.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.25, this.audioCtx!.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx!.currentTime + idx * 0.08 + 0.28);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(this.audioCtx!.currentTime + idx * 0.08);
        osc.stop(this.audioCtx!.currentTime + idx * 0.08 + 0.3);
      });
    }
  }

  // Play gentle retry boing / friendly tone
  public playRetry() {
    if (this.isMuted) return;
    this.ensureAudioContext();

    if (this.audioCtx) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.audioCtx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    }
  }

  // Play tactile UI button click
  public playClick() {
    if (this.isMuted) return;
    this.ensureAudioContext();

    if (this.audioCtx) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.06);
    }
  }

  // Play level completion fanfare
  public playFanfare() {
    if (this.isMuted) return;
    this.ensureAudioContext();

    if (this.audioCtx) {
      const chords = [
        { f: 523.25, time: 0.0 },   // C5
        { f: 659.25, time: 0.1 },   // E5
        { f: 783.99, time: 0.2 },   // G5
        { f: 1046.5, time: 0.35 },  // C6 (held)
      ];

      chords.forEach(({ f, time }) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, this.audioCtx!.currentTime + time);

        gain.gain.setValueAtTime(0.001, this.audioCtx!.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.3, this.audioCtx!.currentTime + time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx!.currentTime + time + 0.6);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(this.audioCtx!.currentTime + time);
        osc.stop(this.audioCtx!.currentTime + time + 0.65);
      });
    }
  }

  // Play a sparkling melodic xylophone / bell chime note
  public playChimeNote(freq: number, duration: number = 0.35) {
    if (this.isMuted) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const t = this.audioCtx.currentTime;

    // Primary bell / xylophone tone
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(0.22, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.05);

    // High sparkling bell overtone
    const oscHarmonic = this.audioCtx.createOscillator();
    const gainHarmonic = this.audioCtx.createGain();
    oscHarmonic.type = 'sine';
    oscHarmonic.frequency.setValueAtTime(freq * 2.0, t);

    gainHarmonic.gain.setValueAtTime(0.001, t);
    gainHarmonic.gain.exponentialRampToValueAtTime(0.08, t + 0.01);
    gainHarmonic.gain.exponentialRampToValueAtTime(0.001, t + duration * 0.5);

    oscHarmonic.connect(gainHarmonic);
    gainHarmonic.connect(this.audioCtx.destination);
    oscHarmonic.start(t);
    oscHarmonic.stop(t + duration * 0.5 + 0.05);
  }

  // Speak pure isolated letter phonics sound (crisp, no letter names, no example words)
  public speakLetterSound(letter: string, soundHint?: string) {
    if (this.isMuted) return;

    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const key = letter.trim().toLowerCase().replace(/^\/+|\/+$/g, '');
      const config = PURE_PHONEME_SPEECH[key] || (soundHint ? toPhonemeConfig(soundHint) : null);

      const utterance = new SpeechSynthesisUtterance(config ? config.text : key);
      utterance.rate = config ? config.rate : 1.0;
      utterance.pitch = config ? config.pitch : 1.0;
      utterance.lang = 'en-US';

      // Pick a natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Samantha') ||
            v.name.includes('Google') ||
            v.name.includes('Natural') ||
            v.name.includes('Ava') ||
            v.name.includes('Jenny'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferred) {
        utterance.voice = preferred;
      }

      window.speechSynthesis.speak(utterance);
    }
  }

  // Speak whole words or phrases (e.g. "bat", "cat", "apple", "igloo") with warm, natural rate
  public speakPhonics(text: string, rate: number = 0.85) {
    if (this.isMuted) return;

    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const config = toPhonemeConfig(text);
      const cleanText = config ? config.text : text.replace(/^\/+|\/+$/g, '').trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = config ? config.rate : rate;
      utterance.pitch = config ? config.pitch : 1.08;
      utterance.lang = 'en-US';

      // Pick a natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Samantha') ||
            v.name.includes('Google') ||
            v.name.includes('Natural') ||
            v.name.includes('Ava') ||
            v.name.includes('Jenny'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferred) {
        utterance.voice = preferred;
      }

      window.speechSynthesis.speak(utterance);
    }
  }

  // Speak phrases or instructions directly
  public speakDirect(text: string, rate: number = 0.85) {
    this.speakPhonics(text, rate);
  }

  // Speak clear alphabet letter name (e.g. 'A' -> "Ay", 'B' -> "Bee", 'C' -> "See") for spelling tests
  public speakAlphabetName(letter: string) {
    if (this.isMuted) return;

    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const char = letter.trim().toLowerCase();
      const name = ALPHABET_NAMES[char] || char.toUpperCase();

      const utterance = new SpeechSynthesisUtterance(name);
      utterance.rate = 0.85;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Samantha') ||
            v.name.includes('Google') ||
            v.name.includes('Natural') ||
            v.name.includes('Ava') ||
            v.name.includes('Jenny'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferred) {
        utterance.voice = preferred;
      }

      window.speechSynthesis.speak(utterance);
    }
  }

  // Stop any active speech synthesis and cancel pending spelling timeouts
  public stopAllSpeech() {
    this.spellingTimeouts.forEach((t) => clearTimeout(t));
    this.spellingTimeouts = [];
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Play captivating musical sing-along chant for spelling a word
  public playMusicalSpellingSong(
    word: string,
    onActiveLetter?: (index: number | null) => void,
    onComplete?: () => void
  ) {
    if (this.isMuted) {
      onComplete?.();
      return;
    }

    this.stopAllSpeech();

    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const letters = word.toLowerCase().replace(/[^a-z]/g, '').split('');
      if (letters.length === 0) {
        onComplete?.();
        return;
      }

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Samantha') ||
              v.name.includes('Google') ||
              v.name.includes('Natural') ||
              v.name.includes('Ava') ||
              v.name.includes('Jenny') ||
              v.name.includes('Victoria'))
        ) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        null;

      // 1. Play cheerful 3-note melodic arpeggio intro (C5 - E5 - G5)
      this.playChimeNote(523.25, 0.4); // C5
      const introNote2 = setTimeout(() => this.playChimeNote(659.25, 0.4), 180); // E5
      const introNote3 = setTimeout(() => this.playChimeNote(783.99, 0.5), 360); // G5
      this.spellingTimeouts.push(introNote2, introNote3);

      // 2. Upbeat sing-song vocal intro at a calm, friendly speed
      const introUtt = new SpeechSynthesisUtterance(`Let's spell ${word}! Sing along!`);
      introUtt.rate = 0.82;
      introUtt.pitch = 1.2;
      introUtt.lang = 'en-US';
      if (preferredVoice) introUtt.voice = preferredVoice;
      window.speechSynthesis.speak(introUtt);

      // 3. Rhythmic letter chant with synchronous melodic chime bells at a gentle, slow pace
      const startLetterDelay = 2000;
      const letterInterval = 1150; // Relaxed 1.15s per letter for easy student absorption

      letters.forEach((char, index) => {
        const timeoutId = setTimeout(() => {
          const noteFreq = MELODIC_SCALE[index % MELODIC_SCALE.length];
          this.playChimeNote(noteFreq, 0.6);
          onActiveLetter?.(index);

          const name = ALPHABET_NAMES[char] || char.toUpperCase();
          const utterance = new SpeechSynthesisUtterance(name);
          // Sing-song musical pitch variation
          utterance.pitch = 1.05 + (index % 4) * 0.06;
          utterance.rate = 0.74; // Clear, relaxed enunciation of each alphabet name
          utterance.lang = 'en-US';
          if (preferredVoice) utterance.voice = preferredVoice;

          window.speechSynthesis.speak(utterance);
        }, startLetterDelay + index * letterInterval);

        this.spellingTimeouts.push(timeoutId);
      });

      // 4. Reset active letter highlighting
      const finishLettersTime = startLetterDelay + letters.length * letterInterval;
      const resetLetterTimeout = setTimeout(() => {
        onActiveLetter?.(null);
      }, finishLettersTime);
      this.spellingTimeouts.push(resetLetterTimeout);

      // 5. Grand musical celebration fanfare chord and encouraging prompt
      const fanfareTimeout = setTimeout(() => {
        this.playSuccess();
        const outroUtt = new SpeechSynthesisUtterance(`${word}! Beautiful! Now your turn to sing into the mic!`);
        outroUtt.rate = 0.82;
        outroUtt.pitch = 1.2;
        outroUtt.lang = 'en-US';
        if (preferredVoice) outroUtt.voice = preferredVoice;
        window.speechSynthesis.speak(outroUtt);
      }, finishLettersTime + 300);
      this.spellingTimeouts.push(fanfareTimeout);

      // 6. Complete callback
      const completeTimeout = setTimeout(() => {
        onComplete?.();
      }, finishLettersTime + 3200);
      this.spellingTimeouts.push(completeTimeout);
    } else {
      onComplete?.();
    }
  }

  // Speak sequence of alphabet names for oral spelling test (calls playMusicalSpellingSong)
  public speakSpellingNames(
    word: string,
    onActiveLetter?: (index: number | null) => void,
    onComplete?: () => void
  ) {
    this.playMusicalSpellingSong(word, onActiveLetter, onComplete);
  }
}

export const SoundEffects = new SoundEffectsService();
