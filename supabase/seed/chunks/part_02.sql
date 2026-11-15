insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fit', 'easy', 8 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fig', 'easy', 9 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fat', 'easy', 10 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'flag', 'medium', 1 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fire', 'medium', 2 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'farm', 'medium', 3 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fork', 'medium', 4 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'foot', 'medium', 5 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fast', 'medium', 6 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'five', 'medium', 7 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'flip', 'medium', 8 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'frost', 'medium', 9 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fruit', 'medium', 10 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'feather', 'hard', 1 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'flower', 'hard', 2 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'flamingo', 'hard', 3 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'forest', 'hard', 4 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'farmer', 'hard', 5 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'finger', 'hard', 6 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'football', 'hard', 7 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'family', 'hard', 8 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'firework', 'hard', 9 from public.letters where letter = 'f';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'fireplace', 'hard', 10 from public.letters where letter = 'f';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-g', 'Letter G', 7, 'Say a short hard g, like goat and goose.', 'g'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-g';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-g';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-g';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-g';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('g', 'g', '/g/', 'Say a short hard g, like goat and goose.', 'guh', 1.35, 7);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'goat', 'easy', 1 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'goose', 'easy', 2 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'gum', 'easy', 3 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'gap', 'easy', 4 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'gas', 'easy', 5 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'got', 'easy', 6 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'gig', 'easy', 7 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'gab', 'easy', 8 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'gut', 'easy', 9 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'gal', 'easy', 10 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'game', 'medium', 1 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'gate', 'medium', 2 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'gift', 'medium', 3 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'girl', 'medium', 4 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'gold', 'medium', 5 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'golf', 'medium', 6 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'grab', 'medium', 7 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'glad', 'medium', 8 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'glow', 'medium', 9 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'grass', 'medium', 10 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'garden', 'hard', 1 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'guitar', 'hard', 2 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'gorilla', 'hard', 3 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'grapes', 'hard', 4 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'garlic', 'hard', 5 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'glasses', 'hard', 6 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'gloves', 'hard', 7 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'gecko', 'hard', 8 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'goblin', 'hard', 9 from public.letters where letter = 'g';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'grasshopper', 'hard', 10 from public.letters where letter = 'g';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-h', 'Letter H', 8, 'Breathe out a soft h, like hat and hen.', 'h'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-h';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-h';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-h';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-h';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('h', 'h', '/h/', 'Breathe out a soft h, like hat and hen.', 'hhhh', 0.9, 8);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hat', 'easy', 1 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hen', 'easy', 2 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ham', 'easy', 3 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hop', 'easy', 4 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hug', 'easy', 5 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hut', 'easy', 6 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hot', 'easy', 7 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hay', 'easy', 8 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hip', 'easy', 9 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'him', 'easy', 10 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hand', 'medium', 1 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hill', 'medium', 2 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'home', 'medium', 3 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'horn', 'medium', 4 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hair', 'medium', 5 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hawk', 'medium', 6 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hook', 'medium', 7 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'help', 'medium', 8 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hard', 'medium', 9 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hive', 'medium', 10 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'helicopter', 'hard', 1 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'helmet', 'hard', 2 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hippo', 'hard', 3 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hamster', 'hard', 4 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'honey', 'hard', 5 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hammer', 'hard', 6 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'happy', 'hard', 7 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'holiday', 'hard', 8 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'hanger', 'hard', 9 from public.letters where letter = 'h';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'harvest', 'hard', 10 from public.letters where letter = 'h';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-i', 'Letter I', 9, 'Say a short ih, like igloo and insect. Do not say eye.', 'i'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-i';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-i';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-i';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-i';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('i', 'ih', '/ɪ/', 'Say a short ih, like igloo and insect. Do not say eye.', 'ih', 1.1, 9);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'igloo', 'easy', 1 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'in', 'easy', 2 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'it', 'easy', 3 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ink', 'easy', 4 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ill', 'easy', 5 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'imp', 'easy', 6 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'inn', 'easy', 7 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'if', 'easy', 8 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'is', 'easy', 9 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'itch', 'easy', 10 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'insect', 'medium', 1 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'inch', 'medium', 2 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'infant', 'medium', 3 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'invite', 'medium', 4 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'invent', 'medium', 5 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'inside', 'medium', 6 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'index', 'medium', 7 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'inbox', 'medium', 8 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'inlet', 'medium', 9 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'igloo', 'medium', 10 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'instrument', 'hard', 1 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'invisible', 'hard', 2 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'important', 'hard', 3 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'invitation', 'hard', 4 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'invention', 'hard', 5 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'inchworm', 'hard', 6 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'inspector', 'hard', 7 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'internet', 'hard', 8 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'interesting', 'hard', 9 from public.letters where letter = 'i';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'iguana', 'hard', 10 from public.letters where letter = 'i';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-j', 'Letter J', 10, 'Say j, like jam and jug.', 'j'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-j';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-j';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-j';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-j';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('j', 'j', '/dʒ/', 'Say j, like jam and jug.', 'juh', 1.3, 10);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jam', 'easy', 1 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jug', 'easy', 2 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jet', 'easy', 3 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jar', 'easy', 4 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jog', 'easy', 5 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'job', 'easy', 6 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'joy', 'easy', 7 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jaw', 'easy', 8 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jig', 'easy', 9 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jab', 'easy', 10 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jump', 'medium', 1 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jeep', 'medium', 2 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'joke', 'medium', 3 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'join', 'medium', 4 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'junk', 'medium', 5 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jazz', 'medium', 6 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'juice', 'medium', 7 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jelly', 'medium', 8 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jeans', 'medium', 9 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jewel', 'medium', 10 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jacket', 'hard', 1 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jungle', 'hard', 2 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jellyfish', 'hard', 3 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jaguar', 'hard', 4 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jigsaw', 'hard', 5 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'journey', 'hard', 6 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jester', 'hard', 7 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'journal', 'hard', 8 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jumper', 'hard', 9 from public.letters where letter = 'j';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'jackpot', 'hard', 10 from public.letters where letter = 'j';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-k', 'Letter K', 11, 'Say a short k, like kite and key.', 'k'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-k';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-k';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-k';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-k';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('k', 'k', '/k/', 'Say a short k, like kite and key.', 'kuh', 1.4, 11);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kite', 'easy', 1 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'key', 'easy', 2 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kid', 'easy', 3 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kit', 'easy', 4 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'keg', 'easy', 5 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kin', 'easy', 6 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kiss', 'easy', 7 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kick', 'easy', 8 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'king', 'easy', 9 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'keep', 'easy', 10 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kettle', 'medium', 1 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'koala', 'medium', 2 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kitten', 'medium', 3 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kayak', 'medium', 4 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'ketchup', 'medium', 5 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kingdom', 'medium', 6 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kitchen', 'medium', 7 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kiwi', 'medium', 8 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kale', 'medium', 9 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kilt', 'medium', 10 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kangaroo', 'hard', 1 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'keyboard', 'hard', 2 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kindergarten', 'hard', 3 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kickball', 'hard', 4 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'keyhole', 'hard', 5 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kumquat', 'hard', 6 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'knitting', 'hard', 7 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kingfisher', 'hard', 8 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'karaoke', 'hard', 9 from public.letters where letter = 'k';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'kayak', 'hard', 10 from public.letters where letter = 'k';
insert into public.lessons (unit_id, code, title, order_index, description, letter_key)
select u.id, 'letter-l', 'Letter L', 12, 'Hold a long lll, like lion and lamp.', 'l'
from public.units u join public.levels l on l.id = u.level_id
where l.code = 'L1' and u.code = 'alphabet';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'listen', 'Listen to the sound', 1, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-l';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'repeat', 'Say a word that starts with it', 2, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-l';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'match', 'Match the letter and sound', 3, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-l';
insert into public.activities (lesson_id, activity_type, title, order_index, config)
select les.id, 'quiz', 'Quick check', 4, '{}'::jsonb
from public.lessons les
join public.units u on u.id = les.unit_id
join public.levels l on l.id = u.level_id
where l.code = 'L1' and les.code = 'letter-l';
insert into public.letters (letter, spoken, ipa, coach, speak_text, speak_rate, order_index)
values ('l', 'lll', '/l/', 'Hold a long lll, like lion and lamp.', 'llll', 0.85, 12);
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'log', 'easy', 1 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lip', 'easy', 2 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'leg', 'easy', 3 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lid', 'easy', 4 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'lap', 'easy', 5 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
select id, 'let', 'easy', 6 from public.letters where letter = 'l';
insert into public.words (letter_id, word, difficulty, order_index)
