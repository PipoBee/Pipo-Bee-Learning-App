delete from public.attempts;
delete from public.lesson_progress;
delete from public.activities;
delete from public.lessons;
delete from public.units;
delete from public.words;
delete from public.letters;
delete from public.levels;
delete from public.badges;
insert into public.levels (code, title, band, order_index, description) values ('L1', 'Letter Sounds', 'beginner', 1, 'A-Z phonics sounds with practice words.');
insert into public.levels (code, title, band, order_index, description) values ('L2', 'Blending', 'beginner', 2, 'Blend sounds into words, from CVC to multi-syllable.');
insert into public.levels (code, title, band, order_index, description) values ('L3', 'Sight Words and Vocabulary', 'intermediate', 3, 'Common words, matching, spelling, and word families.');
insert into public.levels (code, title, band, order_index, description) values ('L4', 'Sentences and Fluency', 'intermediate', 4, 'Read simple sentences aloud with voice scoring.');
insert into public.levels (code, title, band, order_index, description) values ('L5', 'Paragraph Reading', 'intermediate', 5, 'Short passages with literal and inferential questions.');
insert into public.levels (code, title, band, order_index, description) values ('L6', 'Writing', 'advanced', 6, 'Build sentences, spelling, short paragraphs, and grammar.');
insert into public.levels (code, title, band, order_index, description) values ('L7', 'Advanced', 'advanced', 7, 'Longer comprehension, summaries, and letter writing.');
insert into public.units (level_id, code, title, order_index, description)
select id, 'alphabet', 'Alphabet Sounds', 1, 'Learn each letter sound from A to Z.'
from public.levels where code = 'L1';
insert into public.units (level_id, code, title, order_index)
select id, 'cvc', 'CVC Words', 1 from public.levels where code = 'L2';
insert into public.units (level_id, code, title, order_index)
select id, 'blends', 'Consonant Blends', 2 from public.levels where code = 'L2';
insert into public.units (level_id, code, title, order_index)
select id, 'digraphs', 'Digraphs', 3 from public.levels where code = 'L2';
insert into public.units (level_id, code, title, order_index)
select id, 'vowel-teams', 'Vowel Teams', 4 from public.levels where code = 'L2';
insert into public.units (level_id, code, title, order_index)
select id, 'multisyllable', 'Multi-syllable', 5 from public.levels where code = 'L2';
insert into public.units (level_id, code, title, order_index)
select id, 'sight', 'Sight Words', 1 from public.levels where code = 'L3';
insert into public.units (level_id, code, title, order_index)
select id, 'sentences', 'Simple Sentences', 1 from public.levels where code = 'L4';
insert into public.units (level_id, code, title, order_index)
select id, 'passages', 'Short Passages', 1 from public.levels where code = 'L5';
insert into public.units (level_id, code, title, order_index)
select id, 'writing', 'Sentence Building', 1 from public.levels where code = 'L6';
insert into public.units (level_id, code, title, order_index)
select id, 'advanced', 'Advanced Skills', 1 from public.levels where code = 'L7';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-a', 'Letter A', 1, 'Open your mouth and say aa, like apple and ant.', 'a'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-a';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-a';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-a';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-a';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('a', 'aa', '/æ/', 'Open your mouth and say aa, like apple and ant.', 'aa', 0.9, 1);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ant', 'easy', 1 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'apple', 'easy', 2 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ax', 'easy', 3 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'add', 'easy', 4 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'act', 'easy', 5 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'am', 'easy', 6 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'at', 'easy', 7 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ash', 'easy', 8 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'and', 'easy', 9 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ask', 'easy', 10 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'animal', 'medium', 1 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'attic', 'medium', 2 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'actor', 'medium', 3 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ankle', 'medium', 4 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'apple', 'medium', 5 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'anchor', 'medium', 6 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'alphabet', 'medium', 7 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'acrobat', 'medium', 8 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'apron', 'medium', 9 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'asteroid', 'medium', 10 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'alligator', 'hard', 1 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'astronaut', 'hard', 2 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ambulance', 'hard', 3 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'antenna', 'hard', 4 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'antelope', 'hard', 5 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'apricot', 'hard', 6 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'alphabet', 'hard', 7 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'avocado', 'hard', 8 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'afternoon', 'hard', 9 from public.letters where letter = 'a';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'accordion', 'hard', 10 from public.letters where letter = 'a';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-b', 'Letter B', 2, 'Say a short b, like the start of ball. Do not say bee.', 'b'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-b';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-b';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-b';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-b';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('b', 'b', '/b/', 'Say a short b, like the start of ball. Do not say bee.', 'buh', 1.4, 2);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ball', 'easy', 1 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'bee', 'easy', 2 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'bat', 'easy', 3 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'bag', 'easy', 4 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'bed', 'easy', 5 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'bus', 'easy', 6 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'box', 'easy', 7 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'bug', 'easy', 8 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'bib', 'easy', 9 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'bun', 'easy', 10 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'baby', 'medium', 1 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'bird', 'medium', 2 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'book', 'medium', 3 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'boat', 'medium', 4 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'bear', 'medium', 5 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'bell', 'medium', 6 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'boot', 'medium', 7 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'barn', 'medium', 8 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'beach', 'medium', 9 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'bread', 'medium', 10 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'banana', 'hard', 1 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'balloon', 'hard', 2 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'basket', 'hard', 3 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'butterfly', 'hard', 4 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'bicycle', 'hard', 5 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'blanket', 'hard', 6 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'brother', 'hard', 7 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'backpack', 'hard', 8 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'birthday', 'hard', 9 from public.letters where letter = 'b';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'blueberry', 'hard', 10 from public.letters where letter = 'b';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-c', 'Letter C', 3, 'The letter c says k, like cat and cup.', 'c'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-c';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-c';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-c';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-c';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('c', 'k', '/k/', 'The letter c says k, like cat and cup.', 'kuh', 1.4, 3);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'cat', 'easy', 1 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'cup', 'easy', 2 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'can', 'easy', 3 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'cap', 'easy', 4 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'cow', 'easy', 5 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'car', 'easy', 6 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'cot', 'easy', 7 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'cub', 'easy', 8 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'cut', 'easy', 9 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'cob', 'easy', 10 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'cake', 'medium', 1 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'camp', 'medium', 2 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'card', 'medium', 3 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'corn', 'medium', 4 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'crab', 'medium', 5 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'coat', 'medium', 6 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'clap', 'medium', 7 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'clip', 'medium', 8 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'cold', 'medium', 9 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'crown', 'medium', 10 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'camel', 'hard', 1 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'candle', 'hard', 2 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'castle', 'hard', 3 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'carrot', 'hard', 4 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'cookie', 'hard', 5 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'camera', 'hard', 6 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'coconut', 'hard', 7 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'crayon', 'hard', 8 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'cricket', 'hard', 9 from public.letters where letter = 'c';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'caterpillar', 'hard', 10 from public.letters where letter = 'c';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-d', 'Letter D', 4, 'Say a short d, like dog and duck.', 'd'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-d';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-d';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-d';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-d';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('d', 'd', '/d/', 'Say a short d, like dog and duck.', 'duh', 1.4, 4);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'dog', 'easy', 1 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'duck', 'easy', 2 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'dad', 'easy', 3 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'dig', 'easy', 4 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'dot', 'easy', 5 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'den', 'easy', 6 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'day', 'easy', 7 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'dip', 'easy', 8 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'dam', 'easy', 9 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'dim', 'easy', 10 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'drum', 'medium', 1 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'door', 'medium', 2 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'desk', 'medium', 3 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'deer', 'medium', 4 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'doll', 'medium', 5 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'drop', 'medium', 6 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'dark', 'medium', 7 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'dust', 'medium', 8 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'dive', 'medium', 9 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'drip', 'medium', 10 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'dolphin', 'hard', 1 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'dragon', 'hard', 2 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'dinosaur', 'hard', 3 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'doctor', 'hard', 4 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'daisy', 'hard', 5 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'dancer', 'hard', 6 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'diamond', 'hard', 7 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'donkey', 'hard', 8 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'dinner', 'hard', 9 from public.letters where letter = 'd';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'desert', 'hard', 10 from public.letters where letter = 'd';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-e', 'Letter E', 5, 'Say eh, like egg and elephant.', 'e'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-e';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-e';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-e';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-e';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('e', 'eh', '/ɛ/', 'Say eh, like egg and elephant.', 'eh', 1, 5);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'egg', 'easy', 1 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'elf', 'easy', 2 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'elk', 'easy', 3 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'end', 'easy', 4 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'edge', 'easy', 5 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'elm', 'easy', 6 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ebb', 'easy', 7 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'echo', 'easy', 8 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'else', 'easy', 9 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'etch', 'easy', 10 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'elephant', 'medium', 1 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'elbow', 'medium', 2 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'empty', 'medium', 3 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'enter', 'medium', 4 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'engine', 'medium', 5 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'extra', 'medium', 6 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'every', 'medium', 7 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'exit', 'medium', 8 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'effort', 'medium', 9 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'envelope', 'medium', 10 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'elephant', 'hard', 1 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'elevator', 'hard', 2 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'exercise', 'hard', 3 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'envelope', 'hard', 4 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'emerald', 'hard', 5 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'escalator', 'hard', 6 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'energy', 'hard', 7 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'editor', 'hard', 8 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'evening', 'hard', 9 from public.letters where letter = 'e';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'elbow', 'hard', 10 from public.letters where letter = 'e';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-f', 'Letter F', 6, 'Blow a long fff, like fish and frog.', 'f'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-f';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-f';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-f';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-f';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('f', 'fff', '/f/', 'Blow a long fff, like fish and frog.', 'ffff', 0.85, 6);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fish', 'easy', 1 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'frog', 'easy', 2 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fan', 'easy', 3 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fox', 'easy', 4 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fin', 'easy', 5 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fog', 'easy', 6 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fun', 'easy', 7 from public.letters where letter = 'f';
