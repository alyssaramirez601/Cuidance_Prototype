-- Pinterest-style boards in Saved > Boards (Alyssa, Nov 17), replacing the Routines tab. The prototype
-- already called routines "routine boards" (screens 18B and 18C); a routine is now a board someone names.

create table public.boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  created_at timestamptz not null default now()
);

comment on table public.boards is 'Pinterest-style boards in Saved > Boards. Each holds pins.';

-- A pin points at something by id: a product in data/products.ts, an article in data/education.ts,
-- or a row in saved_results
create table public.board_pins (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('product', 'article', 'result')),
  ref text not null check (char_length(ref) between 1 and 120),
  created_at timestamptz not null default now(),
  unique (board_id, kind, ref)
);

comment on table public.board_pins is 'Things pinned to a board: a product id, an article id or a saved result id.';

create index boards_user_idx on public.boards (user_id, created_at desc);
create index board_pins_board_idx on public.board_pins (board_id, created_at desc);

alter table public.boards enable row level security;
alter table public.board_pins enable row level security;

grant select, insert, update, delete on public.boards to authenticated;
grant select, insert, delete on public.board_pins to authenticated;

create policy "Read own boards" on public.boards for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Add own boards" on public.boards for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Rename own boards" on public.boards for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own boards" on public.boards for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Pins only go on your own boards
create policy "Read own pins" on public.board_pins for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Add pins to own boards" on public.board_pins for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.boards b where b.id = board_id and b.user_id = (select auth.uid()))
  );
create policy "Remove own pins" on public.board_pins for delete to authenticated
  using ((select auth.uid()) = user_id);
