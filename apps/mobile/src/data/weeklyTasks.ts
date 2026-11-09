export interface WeeklyWord {
  id: string;
  word: string;
  syllables: string[];
  phonicsTip?: string;
}

export interface WeeklyTask {
  weekNumber: number;
  title: string;
  theme: string;
  badgeColor: string;
  lightBg: string;
  words: WeeklyWord[];
}

const w = (word: string, syllables: string[], phonicsTip?: string): WeeklyWord => ({
  id: word.toLowerCase(),
  word: word.toLowerCase(),
  syllables,
  phonicsTip,
});

export const WEEKLY_TASKS: WeeklyTask[] = [
  {
    weekNumber: 1,
    title: 'Week 1',
    theme: 'Core Vocabulary & Tricky Vowels',
    badgeColor: '#2563EB',
    lightBg: '#EFF6FF',
    words: [
      w('beautiful', ['beau', 'ti', 'ful'], 'beau- = /bjuː/, suffix -ful has one l'),
      w('favourite', ['fa', 'vour', 'ite'], 'vour with -ite ending'),
      w('different', ['dif', 'fer', 'ent'], 'double f, suffix -ent'),
      w('important', ['im', 'por', 'tant'], 'im- prefix, port + -ant'),
      w('because', ['be', 'cause'], 'Big Elephants Can Always Understand Small Elephants'),
      w('enough', ['e', 'nough'], '-ough makes the /ʌf/ sound'),
      w('people', ['peo', 'ple'], 'peo- with consonant + le'),
      w('together', ['to', 'geth', 'er'], 'to + geth + er'),
      w('through', ['thr', 'ough'], 'thr blend with -ough as /uː/'),
      w('thought', ['th', 'ought'], 'th with -ought as /ɔːt/'),
    ],
  },
  {
    weekNumber: 2,
    title: 'Week 2',
    theme: 'Manner Adverbs (-ly suffix)',
    badgeColor: '#059669',
    lightBg: '#ECFDF5',
    words: [
      w('suddenly', ['sud', 'den', 'ly'], 'sud + den + ly with double d'),
      w('carefully', ['care', 'ful', 'ly'], 'care + ful + ly'),
      w('quietly', ['qui', 'et', 'ly'], 'qui + et + ly (qu always with u)'),
      w('quickly', ['quick', 'ly'], 'quick + ly (ck after short vowel)'),
      w('loudly', ['loud', 'ly'], 'ou vowel team + d + ly'),
      w('slowly', ['slow', 'ly'], 'ow makes /oʊ/ + ly'),
      w('finally', ['fi', 'nal', 'ly'], 'final + ly with double l'),
      w('usually', ['u', 'su', 'al', 'ly'], 'usual + ly with double l'),
      w('actually', ['ac', 'tu', 'al', 'ly'], 'actual + ly with double l'),
      w('perhaps', ['per', 'haps'], 'per + haps'),
    ],
  },
  {
    weekNumber: 3,
    title: 'Week 3',
    theme: 'Feelings & Emotional Reactions',
    badgeColor: '#D97706',
    lightBg: '#FFFBEB',
    words: [
      w('month', ['mon', 'th'], 'o makes short /ʌ/, th ending'),
      w('excited', ['ex', 'cit', 'ed'], 'ex- prefix with soft c (/s/)'),
      w('worried', ['wor', 'ried'], 'wor + ried (y changes to i before -ed)'),
      w('cheerful', ['cheer', 'ful'], 'ch + eer + suffix -ful'),
      w('lonely', ['lone', 'ly'], 'lone + ly (magic e preserved)'),
      w('disappointed', ['dis', 'ap', 'point', 'ed'], 'one s, double p, oi diphthong'),
      w('amazing', ['a', 'maz', 'ing'], 'a + maz + ing (drop e add -ing)'),
      w('embarrassed', ['em', 'bar', 'rassed'], 'double r and double s'),
      w('impatient', ['im', 'pa', 'tient'], 'im- prefix with -tient as /ʃənt/'),
      w('exhausted', ['ex', 'haust', 'ed'], 'silent h, au makes /ɔː/'),
    ],
  },
  {
    weekNumber: 4,
    title: 'Week 4',
    theme: 'Adventure & Narrative Descriptions',
    badgeColor: '#7C3AED',
    lightBg: '#F5F3FF',
    words: [
      w('mysterious', ['mys', 'te', 'ri', 'ous'], 'y as short i, suffix -ous'),
      w('dangerous', ['dan', 'ger', 'ous'], 'dan + ger + ous'),
      w('magical', ['mag', 'i', 'cal'], 'mag + i + cal (soft g)'),
      w('enormous', ['e', 'nor', 'mous'], 'e + nor + mous (/ɔːr/ sound)'),
      w('forest', ['for', 'est'], 'for + est'),
      w('village', ['vil', 'lage'], 'vil + lage (soft g -age)'),
      w('mountain', ['moun', 'tain'], 'ou diphthong + -tain'),
      w('journey', ['jour', 'ney'], 'our makes /ɜːr/ + ey'),
      w('adventure', ['ad', 'ven', 'ture'], 'ad + ven + ture (-ture as /tʃər/)'),
      w('stranger', ['stran', 'ger'], 'str blend + soft g'),
    ],
  },
  {
    weekNumber: 5,
    title: 'Week 5',
    theme: 'Expressive Adjectives & Reactions',
    badgeColor: '#DC2626',
    lightBg: '#FEF2F2',
    words: [
      w('frightened', ['fright', 'ened'], 'igh makes long i (/aɪ/), silent gh'),
      w('surprised', ['sur', 'prised'], 'sur- prefix with -prise'),
      w('delicious', ['de', 'li', 'cious'], '-cious makes /ʃəs/'),
      w('delighted', ['de', 'light', 'ed'], 'de + light + ed (silent gh)'),
      w('terrified', ['ter', 'ri', 'fied'], 'double r, -fied ending'),
      w('amazed', ['a', 'mazed'], 'magic e makes a long (/eɪ/)'),
      w('confused', ['con', 'fused'], 'con + fused (u-e long u)'),
      w('relieved', ['re', 'lieved'], 'i before e in -lieve'),
      w('astonished', ['as', 'ton', 'ished'], 'as + ton + ished'),
      w('cautious', ['cau', 'tious'], 'au makes /ɔː/, -tious as /ʃəs/'),
    ],
  },
  {
    weekNumber: 6,
    title: 'Week 6',
    theme: 'Atmospheric & Setting Adjectives',
    badgeColor: '#0891B2',
    lightBg: '#ECFEFF',
    words: [
      w('ancient', ['an', 'cient'], 'ci makes /ʃ/ sound'),
      w('treasure', ['trea', 'sure'], 'ea as short e, -sure as /ʒər/'),
      w('creature', ['crea', 'ture'], 'ea as long e, -ture as /tʃər/'),
      w('spectacular', ['spec', 'tac', 'u', 'lar'], 'spec + tac + u + lar'),
      w('peaceful', ['peace', 'ful'], 'peace + suffix -ful'),
      w('gigantic', ['gi', 'gan', 'tic'], 'soft g then hard g'),
      w('shadowy', ['shad', 'ow', 'y'], 'sh + ad + ow + y'),
      w('sparkling', ['spar', 'kling'], 'ar r-controlled vowel + -kling'),
      w('distant', ['dis', 'tant'], 'dis- prefix + tant'),
      w('incredible', ['in', 'cred', 'i', 'ble'], 'in + cred + i + ble'),
    ],
  },
  {
    weekNumber: 7,
    title: 'Week 7',
    theme: 'Past-Tense Action Verbs (-ed)',
    badgeColor: '#4F46E5',
    lightBg: '#EEF2FF',
    words: [
      w('whispered', ['whis', 'pered'], 'wh blend + per + ed'),
      w('discovered', ['dis', 'cov', 'ered'], 'dis- prefix + cover + ed'),
      w('disappeared', ['dis', 'ap', 'peared'], 'one s, double p, ear + ed'),
      w('remembered', ['re', 'mem', 'bered'], 're + mem + ber + ed'),
      w('followed', ['fol', 'lowed'], 'double l, ow + ed'),
      w('searched', ['sear', 'ched'], 'ear makes /ɜːr/ + ch + ed'),
      w('noticed', ['no', 'ticed'], 'soft c (/s/) + ed'),
      w('explored', ['ex', 'plored'], 'ex- prefix + plore + ed'),
      w('escaped', ['es', 'caped'], 'es + cape + d'),
      w('approached', ['ap', 'proached'], 'double p, oa vowel team + ch + ed'),
    ],
  },
  {
    weekNumber: 8,
    title: 'Week 8',
    theme: 'Narrative Transition & Complex Nouns',
    badgeColor: '#9333EA',
    lightBg: '#FAF5FF',
    words: [
      w('imagination', ['i', 'mag', 'i', 'na', 'tion'], '-tion makes /ʃən/'),
      w('excitement', ['ex', 'cite', 'ment'], 'ex + cite + suffix -ment'),
      w('fortunately', ['for', 'tu', 'nate', 'ly'], 'fortune + ate + ly'),
      w('meanwhile', ['mean', 'while'], 'mean + while (wh blend)'),
      w('although', ['al', 'though'], 'al + though (-ough as /oʊ/)'),
      w('unexpected', ['un', 'ex', 'pect', 'ed'], 'un- + ex- + pect + ed'),
      w('remarkable', ['re', 'mark', 'a', 'ble'], 'mark + suffix -able'),
      w('solution', ['so', 'lu', 'tion'], '-tion makes /ʃən/'),
      w('beginning', ['be', 'gin', 'ning'], 'double n before -ing'),
      w('conclusion', ['con', 'clu', 'sion'], '-sion makes /ʒən/'),
    ],
  },
];

export function getWeeklyTask(weekNumber: number): WeeklyTask | undefined {
  return WEEKLY_TASKS.find((t) => t.weekNumber === weekNumber);
}

export function getAllWeeklyTasks(): WeeklyTask[] {
  return WEEKLY_TASKS;
}
