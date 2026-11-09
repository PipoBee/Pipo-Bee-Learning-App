export type RecognizeStatus = 'ok' | 'no-speech' | 'denied' | 'unsupported' | 'error';

export interface RecognizeResult {
  status: RecognizeStatus;
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

export const FILLER_WORDS = new Set(['letter', 'capital', 'lowercase', 'word', 'the', 'and', 'then']);

export function parseSpokenToLetters(transcript: string): string {
  if (!transcript) return '';
  const tokens = transcript
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((t) => t && !FILLER_WORDS.has(t));

  let letters = '';
  for (const token of tokens) {
    if (LETTER_NAME_MAP[token]) {
      letters += LETTER_NAME_MAP[token];
    } else if (token.length === 1 && token >= 'a' && token <= 'z') {
      letters += token;
    } else {
      letters += token.replace(/[^a-z]/g, '');
    }
  }
  return letters;
}

export function isSpellingMatch(expected: string, alternatives: string[]): boolean {
  const target = normalize(expected).replace(/\s+/g, '');
  if (!target) return false;

  for (const alt of alternatives) {
    if (!alt) continue;
    const cleanAlt = alt.toLowerCase().trim();
    if (parseSpokenToLetters(cleanAlt) === target) return true;
    if (cleanAlt.replace(/[^a-z]/g, '') === target) return true;
  }
  return false;
}

export function isWordMatch(expected: string, alternatives: string[]): boolean {
  const target = normalize(expected);
  return alternatives.some((alt) => {
    const a = normalize(alt);
    if (!a) return false;
    if (a === target) return true;
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
  onProgress?: (liveText: string) => void,
): Promise<RecognizeResult> {
  return new Promise((resolve) => {
    const win = window as any;
    const Recognition = win?.SpeechRecognition || win?.webkitSpeechRecognition;
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

        if (isWordMatch(expected, alts)) {
          finish({ status: 'ok', heard: top, isCorrect: true });
        } else if (event.results[0].isFinal) {
          finish({ status: 'ok', heard: top, isCorrect: false });
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

export function recognizeSpokenSpelling(
  expected: string,
  onProgress?: (liveText: string) => void,
): Promise<RecognizeResult> {
  return new Promise((resolve) => {
    const win = window as any;
    const Recognition = win?.SpeechRecognition || win?.webkitSpeechRecognition;
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
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 2;

      rec.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            accumulatedFinalTranscript += ` ${res[0].transcript}`;
          } else {
            interim += ` ${res[0].transcript}`;
          }
        }

        latestInterim = interim;
        const currentCombined = `${accumulatedFinalTranscript} ${interim}`.trim();
        if (currentCombined) onProgress?.(currentCombined);

        const candidates = [currentCombined, accumulatedFinalTranscript.trim(), interim.trim()].filter(Boolean);
        if (isSpellingMatch(expected, candidates)) {
          finish({ status: 'ok', heard: currentCombined, isCorrect: true });
        }
      };

      rec.onerror = (e: any) => {
        const err = e?.error;
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          finish({ status: 'denied', heard: '', isCorrect: false });
        } else if (err === 'aborted') {
          /* handled on finish */
        } else if (err !== 'no-speech') {
          finish({
            status: 'error',
            heard: `${accumulatedFinalTranscript} ${latestInterim}`.trim(),
            isCorrect: false,
          });
        }
      };

      rec.onend = () => {
        const finalText = `${accumulatedFinalTranscript} ${latestInterim}`.trim();
        if (!finalText) {
          finish({ status: 'no-speech', heard: '', isCorrect: false });
        } else {
          finish({
            status: 'ok',
            heard: finalText,
            isCorrect: isSpellingMatch(expected, [finalText, accumulatedFinalTranscript.trim()]),
          });
        }
      };

      rec.start();
      timeoutId = setTimeout(() => {
        try {
          rec.stop();
        } catch {
          /* already stopped */
        }
      }, Math.max(9000, expected.length * 1600));
    } catch {
      finish({ status: 'error', heard: '', isCorrect: false });
    }
  });
}
