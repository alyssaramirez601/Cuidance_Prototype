-- Products people add by hand from Scan (prototype screen 08D). Each one waits for review in the
-- Admin Web before it can appear in Cuidance, so nothing here shows to other people.

create table public.product_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  -- The barcode that wasn't found, when they came from a scan
  barcode text,
  product_name text not null check (char_length(product_name) between 1 and 200),
  brand text not null check (char_length(brand) between 1 and 120),
  -- Optional, pasted or typed from the package
  ingredients_text text check (ingredients_text is null or char_length(ingredients_text) <= 5000),
  -- pending until someone reviews it in the Admin Web
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  created_at timestamptz not null default now()
);

comment on table public.product_submissions is
  'Products added by hand from Scan. Reviewed in the Admin Web before appearing in Cuidance.';

create index product_submissions_status_idx on public.product_submissions (status, created_at desc);

alter table public.product_submissions enable row level security;

-- People can add and see their own submissions. Reviewing (changing status) is for the Admin Web,
-- which uses its own access, so there is no update or delete policy for app users.
grant select, insert on public.product_submissions to authenticated;

create policy "Read own product submissions"
  on public.product_submissions for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Add own product submissions"
  on public.product_submissions for insert to authenticated
  with check ((select auth.uid()) = user_id and status = 'pending');
