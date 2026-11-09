import { World } from '../types/curriculum';
import { Task, TaskItem } from '../types/activities';

/**
 * Progressive word lists per level (keyed by level soundLabel).
 * Blend words only use letters/digraphs already taught up to that level,
 * and grow from 2-letter words to blends (e.g. "stop", "drum") and digraphs.
 */
const LEVEL_WORDS: Record<string, { say: string[]; blend: string[] }> = {
  s: { say: ['sun', 'sock'], blend: [] },
  a: { say: ['ant', 'apple'], blend: [] },
  t: { say: ['top', 'tent'], blend: ['at', 'as', 'sat'] },
  p: { say: ['pig', 'pan'], blend: ['tap', 'sap', 'pat', 'past'] },
  i: { say: ['igloo', 'ink'], blend: ['sit', 'tip', 'pit', 'spit'] },
  n: { say: ['nest', 'nut'], blend: ['pin', 'tan', 'nap', 'snap'] },
  m: { say: ['moon', 'mug'], blend: ['man', 'mat', 'map', 'stamp'] },
  d: { say: ['duck', 'dog'], blend: ['dad', 'dip', 'mad', 'sand'] },
  g: { say: ['goat', 'otter'], blend: ['dog', 'got', 'pig', 'stop'] },
  c: { say: ['cat', 'kite'], blend: ['cat', 'cot', 'kit', 'cap'] },
  e: { say: ['egg', 'elf'], blend: ['pen', 'net', 'get', 'step'] },
  u: { say: ['up', 'rabbit'], blend: ['run', 'rug', 'drum', 'trap'] },
  sh: { say: ['ship', 'shell'], blend: ['ship', 'shop', 'shut', 'shed'] },
  ch: { say: ['chip', 'cheese'], blend: ['chip', 'chin', 'chat', 'chop'] },
  th: { say: ['thumb', 'three'], blend: ['thin', 'that', 'with', 'math'] },
};

// Levels that close a world get a proper level test (words from everything taught so far).
const TEST_LEVELS = new Set(['t', 'n', 'g', 'u', 'th']);
const ORDERED_LABELS = Object.keys(LEVEL_WORDS);

function buildSaySound(levelId: string, label: string, say: string[]): Task {
  const targets = [label, ...say];
  const items: TaskItem[] = targets.map((t, i) => ({
    id: `item-${levelId}-say-${i + 1}`,
    orderIndex: i + 1,
    targetGrapheme: label,
    targetPhoneme: `/${label}/`,
    targetWord: i === 0 ? undefined : t,
    promptText:
      i === 0
        ? `Say the sound /${label}/ out loud!`
        : `Say the word "${t}" — listen for /${label}/!`,
  }));
  return {
    id: `task-${levelId}-say`,
    levelId,
    taskType: 'SAY_SOUND',
    orderIndex: 3,
    title: `Say the Sound: /${label}/`,
    instructionText: 'Tap the microphone and say it clearly!',
    items,
  };
}

function buildBlendRead(levelId: string, label: string, words: string[]): Task {
  return {
    id: `task-${levelId}-blend`,
    levelId,
    taskType: 'BLEND_READ',
    orderIndex: 4,
    title: 'Blend & Read',
    instructionText: 'Tap each sound, then read the whole word!',
    items: words.map((w, i) => ({
      id: `item-${levelId}-blend-${i + 1}`,
      orderIndex: i + 1,
      targetGrapheme: label,
      targetPhoneme: `/${label}/`,
      targetWord: w,
      promptText: `Blend the sounds to read "${w}"!`,
    })),
  };
}

function buildSpellWord(levelId: string, label: string, words: string[]): Task {
  return {
    id: `task-${levelId}-spell`,
    levelId,
    taskType: 'SPELL_WORD',
    orderIndex: 5,
    title: 'Spell the Word',
    instructionText: 'Listen to the word, then build it with the sound tiles!',
    items: words.map((w, i) => ({
      id: `item-${levelId}-spell-${i + 1}`,
      orderIndex: i + 1,
      targetGrapheme: label,
      targetPhoneme: `/${label}/`,
      targetWord: w,
      promptText: 'Spell the word you hear!',
    })),
  };
}

/** Words taught up to and including this level, 3+ letters, no repeats. */
function wordsTaughtThrough(label: string): string[] {
  const upTo = ORDERED_LABELS.slice(0, ORDERED_LABELS.indexOf(label) + 1);
  const all = Array.from(new Set(upTo.flatMap((l) => LEVEL_WORDS[l].blend)));
  const longer = all.filter((w) => w.length >= 3);
  return longer.length >= 3 ? longer : all;
}

function buildLevelTest(levelId: string, label: string): Task {
  const pool = wordsTaughtThrough(label);
  const count = Math.min(5, pool.length);
  // Evenly spaced picks so the test covers early AND recent sounds.
  const picks = Array.from(
    new Set(
      Array.from({ length: count }, (_, i) =>
        pool[Math.floor((i * (pool.length - 1)) / Math.max(1, count - 1))],
      ),
    ),
  );
  return {
    id: `task-${levelId}-test`,
    levelId,
    taskType: 'LEVEL_TEST',
    orderIndex: 6,
    title: 'Level Test',
    instructionText: 'Show what you know! Spell each word you hear.',
    items: picks.map((w, i) => ({
      id: `item-${levelId}-test-${i + 1}`,
      orderIndex: i + 1,
      targetGrapheme: label,
      targetPhoneme: `/${label}/`,
      targetWord: w,
      promptText: 'Spell the word you hear!',
    })),
  };
}

/** Adds Say the Sound, Blend & Read, Spell the Word and Level Test tasks to every level that lacks them. */
export function withGeneratedTasks(base: World[]): World[] {
  return base.map((world) => ({
    ...world,
    levels: world.levels.map((level) => {
      const words = LEVEL_WORDS[level.soundLabel];
      if (!words) return level;
      const types = new Set(level.tasks.map((t) => t.taskType));
      const tasks = [...level.tasks];
      if (!types.has('SAY_SOUND')) {
        tasks.push(buildSaySound(level.id, level.soundLabel, words.say));
      }
      if (!types.has('BLEND_READ') && words.blend.length > 0) {
        tasks.push(buildBlendRead(level.id, level.soundLabel, words.blend));
      }
      const spellWords = words.blend.filter((w) => w.length >= 3);
      if (!types.has('SPELL_WORD') && spellWords.length > 0) {
        tasks.push(buildSpellWord(level.id, level.soundLabel, spellWords));
      }
      if (!types.has('LEVEL_TEST') && TEST_LEVELS.has(level.soundLabel)) {
        tasks.push(buildLevelTest(level.id, level.soundLabel));
      }
      return { ...level, tasks };
    }),
  }));
}
