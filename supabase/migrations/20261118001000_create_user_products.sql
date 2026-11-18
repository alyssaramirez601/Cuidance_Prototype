-- Products someone saved or owns (Saved > Products and Saved > Owned, prototype screens 16 and 17).
-- One row per person and product. product_id matches data/products.ts for now; it can point at a
-- products table once the Admin Web manages products.

create table public.user_products (
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id text not null check (char_length(product_id) between 1 and 120),
  saved boolean not null default false,
  owned boolean not null default false,
  -- "How is it working for you?" on an owned product
  reflection text check (reflection is null or reflection in ('loved', 'not_for_me', 'testing')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

comment on table public.user_products is
  'Products a person saved or owns, with their owned-product reflection. Feeds Saved > Products and Owned.';

create trigger user_products_set_updated_at
  before update on public.user_products
  for each row execute function public.set_updated_at();

alter table public.user_products enable row level security;

grant select, insert, update, delete on public.user_products to authenticated;

create policy "Read own products"
  on public.user_products for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Add own products"
  on public.user_products for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Update own products"
  on public.user_products for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Delete own products"
  on public.user_products for delete to authenticated
  using ((select auth.uid()) = user_id);
