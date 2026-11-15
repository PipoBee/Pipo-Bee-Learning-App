-- Compact seed for Pipo Bee curriculum
delete from public.attempts;
delete from public.lesson_progress;
delete from public.activities;
delete from public.lessons;
delete from public.units;
delete from public.words;
delete from public.letters;
delete from public.levels;
delete from public.badges;

insert into public.levels (code, title, band, order_index, description) values
('L1', 'Letter Sounds', 'beginner', 1, 'A-Z phonics sounds with practice words.'),
('L2', 'Blending', 'beginner', 2, 'Blend sounds into words, from CVC to multi-syllable.'),
('L3', 'Sight Words and Vocabulary', 'intermediate', 3, 'Common words, matching, spelling, and word families.'),
('L4', 'Sentences and Fluency', 'intermediate', 4, 'Read simple sentences aloud with voice scoring.'),
('L5', 'Paragraph Reading', 'intermediate', 5, 'Short passages with literal and inferential questions.'),
('L6', 'Writing', 'advanced', 6, 'Build sentences, spelling, short paragraphs, and grammar.'),
('L7', 'Advanced', 'advanced', 7, 'Longer comprehension, summaries, and letter writing.');

insert into public.units (level_id, code, title, order_index, description)
select id, 'alphabet', 'Alphabet Sounds', 1, 'Learn each letter sound from A to Z.' from public.levels where code = 'L1';

insert into public.units (level_id, code, title, order_index)
select l.id, v.code, v.title, v.ord from public.levels l
join (values
  ('L2','cvc','CVC Words',1),
  ('L2','blends','Consonant Blends',2),
  ('L2','digraphs','Digraphs',3),
  ('L2','vowel-teams','Vowel Teams',4),
  ('L2','multisyllable','Multi-syllable',5),
  ('L3','sight','Sight Words',1),
  ('L4','sentences','Simple Sentences',1),
  ('L5','passages','Short Passages',1),
  ('L6','writing','Sentence Building',1),
  ('L7','advanced','Advanced Skills',1)
) as v(level_code, code, title, ord) on l.code = v.level_code;

insert into public.badges (code, title, description, icon_key) values
('first-star', 'First Star', 'Earn your first star.', 'star'),
('letter-a', 'Letter A', 'Complete the Letter A lesson.', 'star'),
('streak-3', '3-Day Streak', 'Practice three days in a row.', 'flame');


insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index) values
('a', 'aa', '/æ/', 'Open your mouth and say aa, like apple and ant.', 'aa', 0.9, 1),
('b', 'b', '/b/', 'Say a short b, like the start of ball. Do not say bee.', 'buh', 1.4, 2),
('c', 'k', '/k/', 'The letter c says k, like cat and cup.', 'kuh', 1.4, 3),
('d', 'd', '/d/', 'Say a short d, like dog and duck.', 'duh', 1.4, 4),
('e', 'eh', '/ɛ/', 'Say eh, like egg and elephant.', 'eh', 1, 5),
('f', 'fff', '/f/', 'Blow a long fff, like fish and frog.', 'ffff', 0.85, 6),
('g', 'g', '/g/', 'Say a short hard g, like goat and goose.', 'guh', 1.35, 7),
('h', 'h', '/h/', 'Breathe out a soft h, like hat and hen.', 'hhhh', 0.9, 8),
('i', 'ih', '/ɪ/', 'Say a short ih, like igloo and insect. Do not say eye.', 'ih', 1.1, 9),
('j', 'j', '/dʒ/', 'Say j, like jam and jug.', 'juh', 1.3, 10),
('k', 'k', '/k/', 'Say a short k, like kite and key.', 'kuh', 1.4, 11),
('l', 'lll', '/l/', 'Hold a long lll, like lion and lamp.', 'llll', 0.85, 12),
('m', 'mmm', '/m/', 'Hum a long mmm, like moon and mouse.', 'mmmm', 0.85, 13),
('n', 'nnn', '/n/', 'Hum a long nnn, like nest and nut.', 'nnnn', 0.85, 14),
('o', 'o', '/ɒ/', 'Open your mouth and say a short o, like octopus and orange. Do not say oh.', 'aw', 1.05, 15),
('p', 'p', '/p/', 'Pop a little puff of air: p, like pig and pen.', 'puh', 1.4, 16),
('q', 'kw', '/kw/', 'The letter q says kw, like queen and quilt.', 'kwuh', 1.2, 17),
('r', 'rrr', '/r/', 'Growl a long rrr, like rabbit and red.', 'rrrr', 0.85, 18),
('s', 'sss', '/s/', 'Hiss a long sss, like sun and sock.', 'ssss', 0.85, 19),
('t', 't', '/t/', 'Tap a short t, like tiger and top.', 'tuh', 1.4, 20),
('u', 'uh', '/ʌ/', 'Say a short uh, like umbrella and up. Do not say you.', 'uh', 1.15, 21),
('v', 'vvv', '/v/', 'Buzz a long vvv, like van and vase.', 'vvvv', 0.85, 22),
('w', 'w', '/w/', 'Round your lips and say w, like water and watch.', 'wuh', 1.25, 23),
('x', 'ks', '/ks/', 'The letter x says ks, usually at the end, like box and fox.', 'ks', 1.1, 24),
('y', 'y', '/j/', 'Say y, like yo-yo and yes.', 'yuh', 1.25, 25),
('z', 'zzz', '/z/', 'Buzz a long zzz, like zebra and zip.', 'zzzz', 0.85, 26);


insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, v.code, v.title, v.ord, v.description, v.letter_key
from public.units u
join public.levels l on l.id = u.level_id
join (values
('letter-a', 'Letter A', 1, 'Open your mouth and say aa, like apple and ant.', 'a'),
('letter-b', 'Letter B', 2, 'Say a short b, like the start of ball. Do not say bee.', 'b'),
('letter-c', 'Letter C', 3, 'The letter c says k, like cat and cup.', 'c'),
('letter-d', 'Letter D', 4, 'Say a short d, like dog and duck.', 'd'),
('letter-e', 'Letter E', 5, 'Say eh, like egg and elephant.', 'e'),
('letter-f', 'Letter F', 6, 'Blow a long fff, like fish and frog.', 'f'),
('letter-g', 'Letter G', 7, 'Say a short hard g, like goat and goose.', 'g'),
('letter-h', 'Letter H', 8, 'Breathe out a soft h, like hat and hen.', 'h'),
('letter-i', 'Letter I', 9, 'Say a short ih, like igloo and insect. Do not say eye.', 'i'),
('letter-j', 'Letter J', 10, 'Say j, like jam and jug.', 'j'),
('letter-k', 'Letter K', 11, 'Say a short k, like kite and key.', 'k'),
('letter-l', 'Letter L', 12, 'Hold a long lll, like lion and lamp.', 'l'),
('letter-m', 'Letter M', 13, 'Hum a long mmm, like moon and mouse.', 'm'),
('letter-n', 'Letter N', 14, 'Hum a long nnn, like nest and nut.', 'n'),
('letter-o', 'Letter O', 15, 'Open your mouth and say a short o, like octopus and orange. Do not say oh.', 'o'),
('letter-p', 'Letter P', 16, 'Pop a little puff of air: p, like pig and pen.', 'p'),
('letter-q', 'Letter Q', 17, 'The letter q says kw, like queen and quilt.', 'q'),
('letter-r', 'Letter R', 18, 'Growl a long rrr, like rabbit and red.', 'r'),
('letter-s', 'Letter S', 19, 'Hiss a long sss, like sun and sock.', 's'),
('letter-t', 'Letter T', 20, 'Tap a short t, like tiger and top.', 't'),
('letter-u', 'Letter U', 21, 'Say a short uh, like umbrella and up. Do not say you.', 'u'),
('letter-v', 'Letter V', 22, 'Buzz a long vvv, like van and vase.', 'v'),
('letter-w', 'Letter W', 23, 'Round your lips and say w, like water and watch.', 'w'),
('letter-x', 'Letter X', 24, 'The letter x says ks, usually at the end, like box and fox.', 'x'),
('letter-y', 'Letter Y', 25, 'Say y, like yo-yo and yes.', 'y'),
('letter-z', 'Letter Z', 26, 'Buzz a long zzz, like zebra and zip.', 'z')
) as v(code, title, ord, description, letter_key) on true
where l.code = 'L1' and u.code = 'alphabet';



insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, a.activity_type, a.title, a.ord, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
cross join (values
  ('listen', 'Listen to the sound', 1),
  ('repeat', 'Say a word that starts with it', 2),
  ('match', 'Match the letter and sound', 3),
  ('quiz', 'Quick check', 4)
) as a(activity_type, title, ord)
where l.code = 'L1';
