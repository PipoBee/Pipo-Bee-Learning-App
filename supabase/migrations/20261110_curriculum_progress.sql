-- Pipo Bee curriculum + progress (non-destructive; keeps public.users as profile)

-- Extend profile with soft progress fields
alter table public.users
  add column if not exists total_stars integer not null default 0,
  add column if not exists placement_level_code text,
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.levels (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  band text not null check (band in ('beginner', 'intermediate', 'advanced')),
  order_index integer not null,
  description text not null default '',
  unlock_score integer not null default 80,
  created_at timestamptz not null default now()
);

create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  level_id uuid not null references public.levels(id) on delete cascade,
  code text not null,
  title text not null,
  order_index integer not null,
  description text not null default '',
  unique (level_id, code)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  code text not null,
  title text not null,
  order_index integer not null,
  description text not null default '',
  letter_key text,
  unique (unit_id, code)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  activity_type text not null check (
    activity_type in ('listen', 'repeat', 'match', 'build', 'spell', 'read_aloud', 'quiz', 'write')
  ),
  title text not null,
  order_index integer not null,
  config jsonb not null default '{}'::jsonb,
  unique (lesson_id, order_index)
);

create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  letter text not null unique,
  spoken text not null,
  ipa text not null,
  coach text not null default '',
  speak_text text not null,
  speak_rate numeric not null default 1.0,
  audio_path text,
  order_index integer not null
);

create table if not exists public.words (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references public.letters(id) on delete cascade,
  word text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  image_path text,
  audio_path text,
  order_index integer not null,
  unique (letter_id, difficulty, word)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status text not null default 'locked' check (status in ('locked', 'ready', 'in_progress', 'completed')),
  best_score integer not null default 0,
  stars_earned integer not null default 0,
  attempts_count integer not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  score integer not null default 0,
  transcript text,
  is_correct boolean,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  created_at timestamptz not null default now()
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null default '',
  icon_key text not null default 'star'
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

create table if not exists public.streaks (
  user_id uuid primary key references public.users(id) on delete cascade,
  current_days integer not null default 0,
  longest_days integer not null default 0,
  last_active_date date,
  updated_at timestamptz not null default now()
);

create index if not exists idx_units_level on public.units(level_id, order_index);
create index if not exists idx_lessons_unit on public.lessons(unit_id, order_index);
create index if not exists idx_activities_lesson on public.activities(lesson_id, order_index);
create index if not exists idx_words_letter on public.words(letter_id, difficulty, order_index);
create index if not exists idx_progress_user on public.lesson_progress(user_id);
create index if not exists idx_attempts_user on public.attempts(user_id, created_at desc);

-- RLS
alter table public.levels enable row level security;
alter table public.units enable row level security;
alter table public.lessons enable row level security;
alter table public.activities enable row level security;
alter table public.letters enable row level security;
alter table public.words enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.attempts enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.streaks enable row level security;

-- Content: authenticated read
create policy levels_read on public.levels for select to authenticated using (true);
create policy units_read on public.units for select to authenticated using (true);
create policy lessons_read on public.lessons for select to authenticated using (true);
create policy activities_read on public.activities for select to authenticated using (true);
create policy letters_read on public.letters for select to authenticated using (true);
create policy words_read on public.words for select to authenticated using (true);
create policy badges_read on public.badges for select to authenticated using (true);

-- Own progress / attempts / streaks / badges
create policy progress_select on public.lesson_progress for select to authenticated using (auth.uid() = user_id);
create policy progress_insert on public.lesson_progress for insert to authenticated with check (auth.uid() = user_id);
create policy progress_update on public.lesson_progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy attempts_select on public.attempts for select to authenticated using (auth.uid() = user_id);
create policy attempts_insert on public.attempts for insert to authenticated with check (auth.uid() = user_id);

create policy streaks_select on public.streaks for select to authenticated using (auth.uid() = user_id);
create policy streaks_insert on public.streaks for insert to authenticated with check (auth.uid() = user_id);
create policy streaks_update on public.streaks for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy user_badges_select on public.user_badges for select to authenticated using (auth.uid() = user_id);
create policy user_badges_insert on public.user_badges for insert to authenticated with check (auth.uid() = user_id);

-- Also allow anon read of published content for signed-out preview? No — authenticated only.
