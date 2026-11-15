-- Fix over-escaped E.164 phone check (was matching literal \+ instead of +)
alter table public.profiles drop constraint if exists profiles_phone_e164;
alter table public.profiles
  add constraint profiles_phone_e164
  check (phone is null or phone ~ '^\+[1-9][0-9]{7,14}$');
