select id, 'ax', 'easy', 4 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mix', 'easy', 5 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ox', 'easy', 6 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wax', 'easy', 7 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tax', 'easy', 8 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fix', 'easy', 9 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vex', 'easy', 10 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'extra', 'medium', 1 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'taxi', 'medium', 2 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sixty', 'medium', 3 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'boxes', 'medium', 4 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'foxes', 'medium', 5 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mixing', 'medium', 6 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fixing', 'medium', 7 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'boxing', 'medium', 8 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sixteen', 'medium', 9 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'next', 'medium', 10 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mailbox', 'hard', 1 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'toolbox', 'hard', 2 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'saxophone', 'hard', 3 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'explosion', 'hard', 4 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'excuse', 'hard', 5 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'foxglove', 'hard', 6 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sixteen', 'hard', 7 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'oxcart', 'hard', 8 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'boxing', 'hard', 9 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'extra', 'hard', 10 from public.letters where letter = 'x';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-y', 'Letter Y', 25, 'Say y, like yo-yo and yes.', 'y'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-y';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-y';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-y';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-y';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('y', 'y', '/j/', 'Say y, like yo-yo and yes.', 'yuh', 1.25, 25);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yes', 'easy', 1 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yak', 'easy', 2 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yam', 'easy', 3 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yap', 'easy', 4 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yum', 'easy', 5 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yet', 'easy', 6 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yell', 'easy', 7 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yoyo', 'easy', 8 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yard', 'easy', 9 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yarn', 'easy', 10 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yoyo', 'medium', 1 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yell', 'medium', 2 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yarn', 'medium', 3 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yard', 'medium', 4 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yolk', 'medium', 5 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yoga', 'medium', 6 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yacht', 'medium', 7 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'year', 'medium', 8 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yawn', 'medium', 9 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'young', 'medium', 10 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yellow', 'hard', 1 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yogurt', 'hard', 2 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yesterday', 'hard', 3 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yardstick', 'hard', 4 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yearbook', 'hard', 5 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'youngster', 'hard', 6 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yodel', 'hard', 7 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yellowjacket', 'hard', 8 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yoyo', 'hard', 9 from public.letters where letter = 'y';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'yawn', 'hard', 10 from public.letters where letter = 'y';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-z', 'Letter Z', 26, 'Buzz a long zzz, like zebra and zip.', 'z'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-z';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-z';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-z';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-z';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('z', 'zzz', '/z/', 'Buzz a long zzz, like zebra and zip.', 'zzzz', 0.85, 26);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zip', 'easy', 1 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zap', 'easy', 2 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zig', 'easy', 3 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zag', 'easy', 4 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zoo', 'easy', 5 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zit', 'easy', 6 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zed', 'easy', 7 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zinc', 'easy', 8 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zone', 'easy', 9 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zoom', 'easy', 10 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zebra', 'medium', 1 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zero', 'medium', 2 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zest', 'medium', 3 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zing', 'medium', 4 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zany', 'medium', 5 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zoom', 'medium', 6 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zone', 'medium', 7 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zippy', 'medium', 8 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zesty', 'medium', 9 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zip', 'medium', 10 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zebra', 'hard', 1 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zipper', 'hard', 2 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zigzag', 'hard', 3 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zucchini', 'hard', 4 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zookeeper', 'hard', 5 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zeppelin', 'hard', 6 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zodiac', 'hard', 7 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ziggurat', 'hard', 8 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zero', 'hard', 9 from public.letters where letter = 'z';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'zoom', 'hard', 10 from public.letters where letter = 'z';
insert into public.badges (code, title, description, icon_key) values
('first-star', 'First Star', 'Earn your first star.', 'star'),
('letter-a', 'Letter A', 'Complete the Letter A lesson.', 'star'),
('streak-3', '3-Day Streak', 'Practice three days in a row.', 'flame');
