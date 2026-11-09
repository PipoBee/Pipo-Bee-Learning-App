export const ALPHABET_NAMES: Record<string, string> = {
  a: 'Ay',
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
  return ALPHABET_NAMES[letter.trim().toLowerCase()] || letter.toUpperCase();
}

export function spellingGuide(word: string): string {
  return word
    .split('')
    .map((char) => `${char.toUpperCase()} (${getAlphabetName(char)})`)
    .join(' — ');
}

function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(
      (voice) =>
        voice.lang.startsWith('en') &&
        (voice.name.includes('Samantha') ||
          voice.name.includes('Google') ||
          voice.name.includes('Ava') ||
          voice.name.includes('Jenny')),
    ) || voices.find((voice) => voice.lang.startsWith('en'))
  );
}

export function stopSpeech() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export function speak(text: string, rate = 0.86) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  stopSpeech();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.05;
  utterance.lang = 'en-US';
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

export function speakWord(word: string) {
  speak(word, 0.8);
}

export function speakLetterSound(text: string, rate = 0.9) {
  speak(text, rate);
}

export function speakSoundS() {
  speakLetterSound('ssss', 0.85);
}

export function speakSpellingNames(word: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  stopSpeech();
  const voice = pickVoice();
  word.split('').forEach((char, index) => {
    const utterance = new SpeechSynthesisUtterance(getAlphabetName(char));
    utterance.rate = 0.78;
    utterance.pitch = 1.05 + (index % 3) * 0.05;
    utterance.lang = 'en-US';
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  });
}
