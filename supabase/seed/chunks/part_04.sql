insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rob', 'easy', 6 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rub', 'easy', 7 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'run', 'easy', 8 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rug', 'easy', 9 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ram', 'easy', 10 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rabbit', 'medium', 1 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rain', 'medium', 2 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ring', 'medium', 3 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rock', 'medium', 4 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rope', 'medium', 5 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rose', 'medium', 6 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rest', 'medium', 7 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'road', 'medium', 8 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'roof', 'medium', 9 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'read', 'medium', 10 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rainbow', 'hard', 1 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'robot', 'hard', 2 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rocket', 'hard', 3 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'raccoon', 'hard', 4 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'radio', 'hard', 5 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ruler', 'hard', 6 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'river', 'hard', 7 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'raspberry', 'hard', 8 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rectangle', 'hard', 9 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rabbit', 'hard', 10 from public.letters where letter = 'r';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-s', 'Letter S', 19, 'Hiss a long sss, like sun and sock.', 's'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-s';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-s';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-s';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-s';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('s', 'sss', '/s/', 'Hiss a long sss, like sun and sock.', 'ssss', 0.85, 19);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sun', 'easy', 1 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sock', 'easy', 2 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sit', 'easy', 3 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sad', 'easy', 4 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sip', 'easy', 5 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sob', 'easy', 6 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sum', 'easy', 7 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sap', 'easy', 8 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'set', 'easy', 9 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'six', 'easy', 10 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'snake', 'medium', 1 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'star', 'medium', 2 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'stop', 'medium', 3 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'swim', 'medium', 4 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'snow', 'medium', 5 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sand', 'medium', 6 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sail', 'medium', 7 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'seed', 'medium', 8 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'soap', 'medium', 9 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'spin', 'medium', 10 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'spider', 'hard', 1 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sandwich', 'hard', 2 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sunshine', 'hard', 3 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'strawberry', 'hard', 4 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'scooter', 'hard', 5 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'starfish', 'hard', 6 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'slipper', 'hard', 7 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'soccer', 'hard', 8 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sunflower', 'hard', 9 from public.letters where letter = 's';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'surprise', 'hard', 10 from public.letters where letter = 's';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-t', 'Letter T', 20, 'Tap a short t, like tiger and top.', 't'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-t';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-t';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-t';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-t';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('t', 't', '/t/', 'Tap a short t, like tiger and top.', 'tuh', 1.4, 20);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'top', 'easy', 1 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tap', 'easy', 2 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tin', 'easy', 3 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tip', 'easy', 4 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tub', 'easy', 5 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tug', 'easy', 6 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ten', 'easy', 7 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tag', 'easy', 8 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tan', 'easy', 9 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tot', 'easy', 10 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tiger', 'medium', 1 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tent', 'medium', 2 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tree', 'medium', 3 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'train', 'medium', 4 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'truck', 'medium', 5 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'toast', 'medium', 6 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tooth', 'medium', 7 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'turtle', 'medium', 8 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'table', 'medium', 9 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'track', 'medium', 10 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tomato', 'hard', 1 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'telescope', 'hard', 2 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tornado', 'hard', 3 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'toothbrush', 'hard', 4 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'treasure', 'hard', 5 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'triangle', 'hard', 6 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'turkey', 'hard', 7 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tractor', 'hard', 8 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'tiger', 'hard', 9 from public.letters where letter = 't';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'teddy', 'hard', 10 from public.letters where letter = 't';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-u', 'Letter U', 21, 'Say a short uh, like umbrella and up. Do not say you.', 'u'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-u';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-u';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-u';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-u';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('u', 'uh', '/ʌ/', 'Say a short uh, like umbrella and up. Do not say you.', 'uh', 1.15, 21);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'up', 'easy', 1 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'us', 'easy', 2 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'umbrella', 'easy', 3 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'under', 'easy', 4 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'uncle', 'easy', 5 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'upset', 'easy', 6 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ugly', 'easy', 7 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'upper', 'easy', 8 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'utter', 'easy', 9 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ultra', 'easy', 10 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'umbrella', 'medium', 1 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'under', 'medium', 2 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'uncle', 'medium', 3 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'upset', 'medium', 4 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'umpire', 'medium', 5 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'until', 'medium', 6 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'upon', 'medium', 7 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'upper', 'medium', 8 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ugly', 'medium', 9 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ulcer', 'medium', 10 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'understand', 'hard', 1 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'underwater', 'hard', 2 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'uncomfortable', 'hard', 3 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'unhappy', 'hard', 4 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'unpack', 'hard', 5 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'unusual', 'hard', 6 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ultimate', 'hard', 7 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'umbrella', 'hard', 8 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'umpire', 'hard', 9 from public.letters where letter = 'u';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'upset', 'hard', 10 from public.letters where letter = 'u';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-v', 'Letter V', 22, 'Buzz a long vvv, like van and vase.', 'v'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-v';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-v';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-v';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-v';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('v', 'vvv', '/v/', 'Buzz a long vvv, like van and vase.', 'vvvv', 0.85, 22);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'van', 'easy', 1 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vet', 'easy', 2 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vat', 'easy', 3 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vex', 'easy', 4 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vow', 'easy', 5 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vim', 'easy', 6 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vase', 'easy', 7 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vine', 'easy', 8 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vest', 'easy', 9 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vent', 'easy', 10 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vase', 'medium', 1 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vine', 'medium', 2 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vest', 'medium', 3 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'visit', 'medium', 4 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'video', 'medium', 5 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'violin', 'medium', 6 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'valley', 'medium', 7 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'voice', 'medium', 8 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vote', 'medium', 9 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vacuum', 'medium', 10 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'volcano', 'hard', 1 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vegetable', 'hard', 2 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vacation', 'hard', 3 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vanilla', 'hard', 4 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vulture', 'hard', 5 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'valentine', 'hard', 6 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'village', 'hard', 7 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'volleyball', 'hard', 8 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'violin', 'hard', 9 from public.letters where letter = 'v';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'vacuum', 'hard', 10 from public.letters where letter = 'v';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-w', 'Letter W', 23, 'Round your lips and say w, like water and watch.', 'w'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-w';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-w';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-w';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-w';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('w', 'w', '/w/', 'Round your lips and say w, like water and watch.', 'wuh', 1.25, 23);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'web', 'easy', 1 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wet', 'easy', 2 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wig', 'easy', 3 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'win', 'easy', 4 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wag', 'easy', 5 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wax', 'easy', 6 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wed', 'easy', 7 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wit', 'easy', 8 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wow', 'easy', 9 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'woe', 'easy', 10 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'water', 'medium', 1 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'watch', 'medium', 2 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wave', 'medium', 3 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wind', 'medium', 4 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wolf', 'medium', 5 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'worm', 'medium', 6 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wood', 'medium', 7 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'well', 'medium', 8 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wing', 'medium', 9 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wish', 'medium', 10 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'watermelon', 'hard', 1 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'waterfall', 'hard', 2 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'window', 'hard', 3 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wagon', 'hard', 4 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'walrus', 'hard', 5 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wizard', 'hard', 6 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'waffle', 'hard', 7 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'wallet', 'hard', 8 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'winter', 'hard', 9 from public.letters where letter = 'w';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'whale', 'hard', 10 from public.letters where letter = 'w';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-x', 'Letter X', 24, 'The letter x says ks, usually at the end, like box and fox.', 'x'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-x';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-x';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-x';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-x';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('x', 'ks', '/ks/', 'The letter x says ks, usually at the end, like box and fox.', 'ks', 1.1, 24);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'box', 'easy', 1 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fox', 'easy', 2 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'six', 'easy', 3 from public.letters where letter = 'x';
insert into public.words (letter_id, word, difficulty, order_index)
