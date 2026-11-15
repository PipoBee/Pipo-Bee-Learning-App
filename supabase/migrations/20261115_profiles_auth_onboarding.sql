-- Profiles for auth / onboarding (non-destructive; keeps public.users for curriculum FKs)

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'parent')),
  phone text,
  country text,
  city text,
  age_group text,
  learning_goals text[] not null default '{}',
  start_choice text,
  native_language text,
  timezone text,
  daily_goal_minutes integer,
  parent_email text,
  parent_consent_status text,
  profile_completed boolean not null default false,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_phone_e164 check (phone is null or phone ~ '^\+[1-9][0-9]{7,14}$'),
  constraint profiles_country_iso check (country is null or country ~ '^[A-Z]{2}$'),
  constraint profiles_full_name_len check (char_length(full_name) <= 60),
  constraint profiles_city_len check (city is null or (char_length(city) between 2 and 60))
);

create index if not exists idx_profiles_role on public.profiles(role);

alter table public.profiles enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role in ('student', 'parent')
  );

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert to authenticated
  with check (
    auth.uid() = id
    and role in ('student', 'parent')
  );

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_profiles_updated_at();

-- Keep users + create profiles from auth metadata (email or Google)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_full_name text;
  v_role_raw text;
  v_role_users text;
  v_role_profiles text;
  v_phone text;
  v_country text;
  v_city text;
  v_avatar text;
  v_completed boolean;
begin
  v_full_name := coalesce(
    nullif(trim(meta->>'full_name'), ''),
    nullif(trim(meta->>'name'), ''),
    split_part(coalesce(new.email, 'learner'), '@', 1)
  );
  if char_length(v_full_name) > 60 then
    v_full_name := left(v_full_name, 60);
  end if;

  v_role_raw := lower(coalesce(nullif(trim(meta->>'role'), ''), 'student'));
  if v_role_raw in ('parent') then
    v_role_users := 'PARENT';
    v_role_profiles := 'parent';
  else
    v_role_users := 'STUDENT';
    v_role_profiles := 'student';
  end if;

  v_phone := nullif(trim(meta->>'phone'), '');
  v_country := upper(nullif(trim(meta->>'country'), ''));
  v_city := nullif(trim(meta->>'city'), '');
  v_avatar := coalesce(nullif(trim(meta->>'avatar_url'), ''), nullif(trim(meta->>'picture'), ''));
  v_completed := (v_phone is not null and v_country is not null and v_city is not null);

  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    v_full_name,
    v_role_users
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(public.users.full_name, ''), excluded.full_name),
        updated_at = now();

  insert into public.profiles (
    id, full_name, avatar_url, role, phone, country, city, profile_completed
  )
  values (
    new.id,
    v_full_name,
    v_avatar,
    v_role_profiles,
    v_phone,
    v_country,
    v_city,
    v_completed
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Backfill profiles for existing auth users / public.users rows
insert into public.profiles (id, full_name, role, profile_completed, onboarding_completed)
select
  u.id,
  coalesce(nullif(u.full_name, ''), split_part(u.email, '@', 1)),
  case when lower(u.role) = 'parent' then 'parent' else 'student' end,
  false,
  false
from public.users u
where lower(u.role) in ('student', 'parent')
on conflict (id) do nothing;
