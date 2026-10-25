-- Cuidance v1 database: profiles, quiz_answers, saved_results.
--
-- Supabase owns sign-in. Email and password live in auth.users and are never
-- copied here. Every table below is locked down with row-level security so a
-- person can only read and write their own rows.
--
-- Run this once in the Supabase SQL Editor. It runs as one all-or-nothing
-- transaction: if any line fails, nothing is created.

begin;

-- ---------------------------------------------------------------------------
-- Helper: keep updated_at honest without the app having to remember
-- ---------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 1. profiles: one row per person
-- ---------------------------------------------------------------------------

create table public.profiles (
  -- Same id as the person's Supabase sign-in. Deleting the account deletes this row.
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  -- Empty until the quiz is finished. Decides "Pick up where you left off" on Home.
  quiz_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'One row per person. Email and password stay in auth.users.';

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 2. quiz_answers: one row per person per question (their current answers)
-- ---------------------------------------------------------------------------

create table public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  -- Matches the question ids in the app's local quiz data, for example q3_confidence.
  question_id text not null,
  -- What they picked: a list of option ids, or a number for the 1 to 5 question.
  answer jsonb,
  -- "Skip this question" is different from "not answered yet". Skipped stays unknown.
  skipped boolean not null default false,
  -- Only filled when someone types their own words, for example "Something else".
  other_text text,
  updated_at timestamptz not null default now(),
  -- Each person has at most one current answer per question.
  unique (user_id, question_id),
  -- A skipped question has no answer.
  check (skipped = false or answer is null)
);

comment on table public.quiz_answers is
  'A person''s current quiz answers. Start over deletes their rows.';

create trigger quiz_answers_set_updated_at
  before update on public.quiz_answers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. saved_results: one row each time someone taps "Save result"
-- ---------------------------------------------------------------------------

create table public.saved_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  result_name text not null,
  result_subtitle text,
  -- Copy of their answers at the moment they saved, so history stays true
  -- after they retake the quiz. The result is rebuilt from this in the app.
  answers_snapshot jsonb not null,
  -- Which version of the guidance library built the result.
  content_version text not null,
  saved_at timestamptz not null default now()
);

comment on table public.saved_results is
  'Feeds Saved > Guidance and Guidance history. No full result text is stored.';

-- Guidance history reads a person's results newest first.
create index saved_results_user_saved_at_idx
  on public.saved_results (user_id, saved_at desc);

-- ---------------------------------------------------------------------------
-- Row-level security: each person sees and changes only their own rows
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.saved_results enable row level security;

-- Signed-in people only. Signed-out visitors (anon) get no access to any table.
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.quiz_answers to authenticated;
grant select, insert, delete on public.saved_results to authenticated;

-- profiles: read and edit your own row. The row itself is created by the
-- sign-up trigger below, and removed when the account is deleted.
create policy "Read own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Update own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- quiz_answers: full control of your own answers (answer, edit, start over).
create policy "Read own quiz answers"
  on public.quiz_answers for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Add own quiz answers"
  on public.quiz_answers for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Update own quiz answers"
  on public.quiz_answers for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Delete own quiz answers"
  on public.quiz_answers for delete to authenticated
  using ((select auth.uid()) = user_id);

-- saved_results: read, save and remove your own. Saved results are not edited.
create policy "Read own saved results"
  on public.saved_results for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Add own saved results"
  on public.saved_results for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Delete own saved results"
  on public.saved_results for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Sign-up trigger: create the profile row automatically
-- ---------------------------------------------------------------------------

-- security definer lets this run with the database owner's rights, because the
-- person is not signed in yet at the moment their account is created.
-- The name comes from the sign-up form, sent as user metadata called display_name.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Catch-up: give a profile row to anyone who signed up before this ran
-- (for example test accounts from Week 8). Safe to run once more.
-- ---------------------------------------------------------------------------

insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

commit;
