select id, 'lit', 'easy', 7 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lot', 'easy', 8 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lab', 'easy', 9 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lag', 'easy', 10 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lion', 'medium', 1 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lamp', 'medium', 2 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'leaf', 'medium', 3 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lock', 'medium', 4 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lake', 'medium', 5 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lamb', 'medium', 6 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'look', 'medium', 7 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'love', 'medium', 8 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'luck', 'medium', 9 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lump', 'medium', 10 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lemon', 'hard', 1 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ladder', 'hard', 2 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ladybug', 'hard', 3 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lizard', 'hard', 4 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'letter', 'hard', 5 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'library', 'hard', 6 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lightning', 'hard', 7 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'leopard', 'hard', 8 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lighthouse', 'hard', 9 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lobster', 'hard', 10 from public.letters where letter = 'l';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-m', 'Letter M', 13, 'Hum a long mmm, like moon and mouse.', 'm'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-m';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-m';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-m';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-m';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('m', 'mmm', '/m/', 'Hum a long mmm, like moon and mouse.', 'mmmm', 0.85, 13);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'map', 'easy', 1 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mat', 'easy', 2 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mug', 'easy', 3 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mud', 'easy', 4 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mom', 'easy', 5 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'man', 'easy', 6 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mad', 'easy', 7 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mop', 'easy', 8 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mix', 'easy', 9 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mob', 'easy', 10 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'moon', 'medium', 1 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mouse', 'medium', 2 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'milk', 'medium', 3 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mask', 'medium', 4 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mail', 'medium', 5 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'melt', 'medium', 6 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mint', 'medium', 7 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'moth', 'medium', 8 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'moss', 'medium', 9 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mule', 'medium', 10 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'monkey', 'hard', 1 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'muffin', 'hard', 2 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'magnet', 'hard', 3 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mushroom', 'hard', 4 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mitten', 'hard', 5 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'marble', 'hard', 6 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mountain', 'hard', 7 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'mermaid', 'hard', 8 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'morning', 'hard', 9 from public.letters where letter = 'm';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'motorcycle', 'hard', 10 from public.letters where letter = 'm';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-n', 'Letter N', 14, 'Hum a long nnn, like nest and nut.', 'n'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-n';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-n';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-n';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-n';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('n', 'nnn', '/n/', 'Hum a long nnn, like nest and nut.', 'nnnn', 0.85, 14);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'nut', 'easy', 1 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'net', 'easy', 2 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'nap', 'easy', 3 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'nod', 'easy', 4 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'nip', 'easy', 5 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'nag', 'easy', 6 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'nun', 'easy', 7 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'nit', 'easy', 8 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'nib', 'easy', 9 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'nab', 'easy', 10 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'nest', 'medium', 1 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'nose', 'medium', 2 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'nail', 'medium', 3 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'neck', 'medium', 4 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'nine', 'medium', 5 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'noon', 'medium', 6 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'note', 'medium', 7 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'neat', 'medium', 8 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'navy', 'medium', 9 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'newt', 'medium', 10 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'necklace', 'hard', 1 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'napkin', 'hard', 2 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'number', 'hard', 3 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'needle', 'hard', 4 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'noodle', 'hard', 5 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'night', 'hard', 6 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'nurse', 'hard', 7 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'notebook', 'hard', 8 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'narwhal', 'hard', 9 from public.letters where letter = 'n';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'neighbor', 'hard', 10 from public.letters where letter = 'n';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-o', 'Letter O', 15, 'Open your mouth and say a short o, like octopus and orange. Do not say oh.', 'o'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-o';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-o';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-o';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-o';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('o', 'o', '/ɒ/', 'Open your mouth and say a short o, like octopus and orange. Do not say oh.', 'aw', 1.05, 15);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ox', 'easy', 1 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'odd', 'easy', 2 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'off', 'easy', 3 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'on', 'easy', 4 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'opt', 'easy', 5 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'otter', 'easy', 6 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'olive', 'easy', 7 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'opera', 'easy', 8 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'object', 'easy', 9 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'octagon', 'easy', 10 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'octopus', 'medium', 1 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'orange', 'medium', 2 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ostrich', 'medium', 3 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'office', 'medium', 4 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'otter', 'medium', 5 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'olive', 'medium', 6 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'october', 'medium', 7 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'opera', 'medium', 8 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'object', 'medium', 9 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'offer', 'medium', 10 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'octopus', 'hard', 1 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'obstacle', 'hard', 2 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'october', 'hard', 3 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'opposite', 'hard', 4 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'orchestra', 'hard', 5 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ornament', 'hard', 6 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ostrich', 'hard', 7 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'octagon', 'hard', 8 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'occupation', 'hard', 9 from public.letters where letter = 'o';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'optical', 'hard', 10 from public.letters where letter = 'o';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-p', 'Letter P', 16, 'Pop a little puff of air: p, like pig and pen.', 'p'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-p';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-p';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-p';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-p';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('p', 'p', '/p/', 'Pop a little puff of air: p, like pig and pen.', 'puh', 1.4, 16);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pig', 'easy', 1 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pen', 'easy', 2 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pan', 'easy', 3 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pet', 'easy', 4 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pot', 'easy', 5 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pup', 'easy', 6 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pad', 'easy', 7 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pin', 'easy', 8 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pop', 'easy', 9 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pat', 'easy', 10 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'park', 'medium', 1 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pink', 'medium', 2 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pond', 'medium', 3 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pump', 'medium', 4 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'plug', 'medium', 5 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'plan', 'medium', 6 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'plum', 'medium', 7 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pony', 'medium', 8 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pear', 'medium', 9 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pram', 'medium', 10 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'penguin', 'hard', 1 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pumpkin', 'hard', 2 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'parrot', 'hard', 3 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pencil', 'hard', 4 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pizza', 'hard', 5 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pirate', 'hard', 6 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'popcorn', 'hard', 7 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'peacock', 'hard', 8 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pancake', 'hard', 9 from public.letters where letter = 'p';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'pineapple', 'hard', 10 from public.letters where letter = 'p';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-q', 'Letter Q', 17, 'The letter q says kw, like queen and quilt.', 'q'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-q';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-q';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-q';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-q';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('q', 'kw', '/kw/', 'The letter q says kw, like queen and quilt.', 'kwuh', 1.2, 17);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quiz', 'easy', 1 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quit', 'easy', 2 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quip', 'easy', 3 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quad', 'easy', 4 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quack', 'easy', 5 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quill', 'easy', 6 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quest', 'easy', 7 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quote', 'easy', 8 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quick', 'easy', 9 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'queen', 'easy', 10 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'queen', 'medium', 1 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quilt', 'medium', 2 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quack', 'medium', 3 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quick', 'medium', 4 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quiet', 'medium', 5 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quill', 'medium', 6 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quest', 'medium', 7 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quartz', 'medium', 8 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quiver', 'medium', 9 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quote', 'medium', 10 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'question', 'hard', 1 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quarter', 'hard', 2 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quietly', 'hard', 3 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'quality', 'hard', 4 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'equator', 'hard', 5 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'squirrel', 'hard', 6 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'aquarium', 'hard', 7 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'request', 'hard', 8 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'sequence', 'hard', 9 from public.letters where letter = 'q';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'earthquake', 'hard', 10 from public.letters where letter = 'q';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-r', 'Letter R', 18, 'Growl a long rrr, like rabbit and red.', 'r'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-r';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-r';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-r';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-r';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('r', 'rrr', '/r/', 'Growl a long rrr, like rabbit and red.', 'rrrr', 0.85, 18);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'red', 'easy', 1 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rat', 'easy', 2 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rag', 'easy', 3 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rib', 'easy', 4 from public.letters where letter = 'r';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'rip', 'easy', 5 from public.letters where letter = 'r';
