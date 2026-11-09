/**
 * Strict word and spelling recognizer for pronunciation and oral spelling tests.
 *
 * Unlike the general speech provider (which falls back to a lenient "pass" on
 * errors), this never fakes a result: it reports exactly what happened so the
 * test can tell a wrong word from "no mic" or "nothing heard".
 */
export type RecognizeStatus = 'ok' | 'no-speech' | 'denied' | 'unsupported' | 'error';

export interface RecognizeResult {
  status: RecognizeStatus;
  /** Best transcript heard (lowercase), if any */
  heard: string;
  isCorrect: boolean;
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z\s]/g, '').trim();

export const LETTER_NAME_MAP: Record<string, string> = {
  a: 'a', ay: 'a', eh: 'a', hey: 'a',
  b: 'b', bee: 'b', be: 'b',
  c: 'c', see: 'c', cee: 'c', sea: 'c', si: 'c',
  d: 'd', dee: 'd', de: 'd',
  e: 'e', ee: 'e',
  f: 'f', ef: 'f', eff: 'f',
  g: 'g', gee: 'g', jee: 'g', ji: 'g',
  h: 'h', aitch: 'h', ha: 'h', eich: 'h', he: 'h',
  i: 'i', eye: 'i', ai: 'i', aye: 'i',
  j: 'j', jay: 'j', je: 'j',
  k: 'k', kay: 'k', ka: 'k',
  l: 'l', el: 'l', ell: 'l',
  m: 'm', em: 'm',
  n: 'n', en: 'n',
  o: 'o', oh: 'o',
  p: 'p', pee: 'p', pe: 'p',
  q: 'q', cue: 'q', kew: 'q', queue: 'q',
  r: 'r', ar: 'r', are: 'r', our: 'r',
  s: 's', ess: 's', es: 's',
  t: 't', tee: 't', tea: 't', ti: 't',
  u: 'u', you: 'u', yu: 'u', ew: 'u', yew: 'u',
  v: 'v', vee: 'v', ve: 'v',
  w: 'w', doubleu: 'w', double: 'w',
  x: 'x', ex: 'x', ecks: 'x',
  y: 'y', why: 'y', wai: 'y',
  z: 'z', zee: 'z', zed: 'z',
};

export const TWO_LETTER_WORDS: Record<string, string> = {
  if: 'if', in: 'in', it: 'it', is: 'is',
  at: 'at', as: 'as', an: 'an', am: 'am',
  on: 'on', or: 'or', ox: 'ox',
  up: 'up', us: 'us',
  to: 'to', do: 'do', go: 'go', no: 'no', so: 'so',
  my: 'my', by: 'by',
  me: 'me', we: 'we',
};

export const FILLER_WORDS = new Set(['letter', 'capital', 'lowercase', 'word', 'the', 'and', 'then']);

/**
 * Parse a spoken transcript into the sequence of spelled letters.
 * Converts letter names ("bee", "ee", "ay", "see", etc.) into their single character ('b', 'e', 'a', 'c').
 * Preserves every token so that wrong letters or extra letters are NOT dropped.
 */
export function parseSpokenToLetters(transcript: string): string {
  if (!transcript) return '';
  const clean = transcript
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ')
    .trim();

  const tokens = clean.split(/\s+/).filter((t) => t && !FILLER_WORDS.has(t));
  if (tokens.length === 0) return '';

  let letters = '';
  for (const token of tokens) {
    if (LETTER_NAME_MAP[token]) {
      letters += LETTER_NAME_MAP[token];
    } else if (token.length === 1 && token >= 'a' && token <= 'z') {
      letters += token;
    } else {
      // Retain the characters of unrecognized words so wrong spelling is properly tested
      letters += token.replace(/[^a-z]/g, '');
    }
  }

  return letters;
}

/**
 * Strict verification of spoken spelling:
 * 1. Must match target EXACTLY (character for character, length for length).
 * 2. Never uses substring matching (.includes) which falsely passes wrong words.
 * 3. Does not use speculative background alternatives that guess other words.
 */
export function isSpellingMatch(expected: string, alternatives: string[]): boolean {
  const target = normalize(expected).replace(/\s+/g, '');
  if (!target) return false;

  for (const alt of alternatives) {
    if (!alt) continue;
    const cleanAlt = alt.toLowerCase().trim();

    // 1. Check spelled letter sequence: must match target exactly!
    const parsedLetters = parseSpokenToLetters(cleanAlt);
    if (parsedLetters === target) {
      return true;
    }

    // 2. Direct stripped letters (e.g. if transcript was hyphenated or dotted "B.E.A.C.O.N")
    const stripped = cleanAlt.replace(/[^a-z]/g, '');
    if (stripped === target) {
      return true;
    }
  }

  return false;
}

export function isWordMatch(expected: string, alternatives: string[]): boolean {
  const target = normalize(expected);
  return alternatives.some((alt) => {
    const a = normalize(alt);
    if (!a) return false;
    if (a === target) return true;
    // Accept when the target is one of the spoken words ("the apple" -> apple)
    return a.split(/\s+/).includes(target);
  });
}

export function isRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as any;
  return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
}

export function recognizeWord(
  expected: string,
  onProgress?: (liveText: string) => void
): Promise<RecognizeResult> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve({ status: 'unsupported', heard: '', isCorrect: false });
      return;
    }
    const win = window as any;
    const Recognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!Recognition) {
      resolve({ status: 'unsupported', heard: '', isCorrect: false });
      return;
    }

    let settled = false;
    let rec: any;
    let timeoutId: any = null;

    const finish = (r: RecognizeResult) => {
      if (settled) return;
      settled = true;
      if (timeoutId) clearTimeout(timeoutId);
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
      resolve(r);
    };

    try {
      rec = new Recognition();
      rec.lang = 'en-US';
      rec.continuous = false;
      rec.interimResults = true;
      rec.maxAlternatives = 5;

      rec.onresult = (event: any) => {
        const alts: string[] = [];
        const res = event.results[0];
        for (let i = 0; i < res.length; i++) alts.push(res[i].transcript);
        const top = normalize(alts[0] || '');
        if (top) onProgress?.(top);

        const isMatch = isWordMatch(expected, alts);
        if (isMatch) {
          finish({
            status: 'ok',
            heard: top,
            isCorrect: true,
          });
        } else if (event.results[0].isFinal) {
          finish({
            status: 'ok',
            heard: top,
            isCorrect: false,
          });
        }
      };

      rec.onerror = (e: any) => {
        const err = e?.error;
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          finish({ status: 'denied', heard: '', isCorrect: false });
        } else if (err === 'no-speech' || err === 'aborted') {
          finish({ status: 'no-speech', heard: '', isCorrect: false });
        } else {
          finish({ status: 'error', heard: '', isCorrect: false });
        }
      };

      // Ended without a result or error = nothing was heard
      rec.onend = () => finish({ status: 'no-speech', heard: '', isCorrect: false });

      rec.start();
      timeoutId = setTimeout(() => {
        try {
          rec.stop();
        } catch {
          /* already stopped */
        }
      }, 7000);
    } catch {
      finish({ status: 'error', heard: '', isCorrect: false });
    }
  });
}

/**
 * Recognize oral spelling from the child's microphone.
 * Listens continuously for letter names or spoken spelling (e.g. "b e a u t i f u l" or "bee ee ay you...").
 * Streams live transcripts via onProgress, and finishes as soon as a correct spelling match is detected.
 */
export function recognizeSpokenSpelling(
  expected: string,
  onProgress?: (liveText: string) => void
): Promise<RecognizeResult> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve({ status: 'unsupported', heard: '', isCorrect: false });
      return;
    }
    const win = window as any;
    const Recognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!Recognition) {
      resolve({ status: 'unsupported', heard: '', isCorrect: false });
      return;
    }

    let settled = false;
    let rec: any;
    let timeoutId: any = null;
    let accumulatedFinalTranscript = '';
    let latestInterim = '';

    const finish = (r: RecognizeResult) => {
      if (settled) return;
      settled = true;
      if (timeoutId) clearTimeout(timeoutId);
      try {
        rec.stop();
      } catch {
        /* already closed */
      }
      resolve(r);
    };

    try {
      rec = new Recognition();
      rec.lang = 'en-US';
      rec.continuous = true; // Stay active across pauses between letters
      rec.interimResults = true; // Stream live transcript
      rec.maxAlternatives = 2;

      rec.onresult = (event: any) => {
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            accumulatedFinalTranscript += ' ' + res[0].transcript;
          } else {
            interim += ' ' + res[0].transcript;
          }
        }

        latestInterim = interim;
        const currentCombined = (accumulatedFinalTranscript + ' ' + interim).trim();
        if (currentCombined) {
          onProgress?.(currentCombined);
        }

        // Test the current utterance for exact match
        const candidates = [
          currentCombined,
          accumulatedFinalTranscript.trim(),
          interim.trim(),
        ].filter(Boolean);

        if (isSpellingMatch(expected, candidates)) {
          finish({
            status: 'ok',
            heard: currentCombined,
            isCorrect: true,
          });
        }
      };

      rec.onerror = (e: any) => {
        const err = e?.error;
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          finish({ status: 'denied', heard: '', isCorrect: false });
        } else if (err === 'no-speech') {
          // In continuous mode, continue listening until timeout or onend
        } else if (err === 'aborted') {
          // Handled on finish
        } else {
          const finalHeard = (accumulatedFinalTranscript + ' ' + latestInterim).trim();
          finish({ status: 'error', heard: finalHeard, isCorrect: false });
        }
      };

      rec.onend = () => {
        const finalText = (accumulatedFinalTranscript + ' ' + latestInterim).trim();
        if (!finalText) {
          finish({ status: 'no-speech', heard: '', isCorrect: false });
        } else {
          const isCorrect = isSpellingMatch(expected, [finalText, accumulatedFinalTranscript.trim()]);
          finish({
            status: 'ok',
            heard: finalText,
            isCorrect,
          });
        }
      };

      rec.start();

      // For long words like "beautiful" (9 letters), allow generous time to speak letter names
      const durationMs = Math.max(9000, expected.length * 1600);
      timeoutId = setTimeout(() => {
        try {
          rec.stop();
        } catch {
          /* already stopped */
        }
      }, durationMs);
    } catch {
      finish({ status: 'error', heard: '', isCorrect: false });
    }
  });
}
