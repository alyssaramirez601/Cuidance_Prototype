-- Google sign-in: use the name Google sends for the new profile.
--
-- Email sign-ups send their name as user metadata called display_name. Google
-- sends it as full_name (and name). This keeps display_name first, then falls
-- back to the Google ones. It replaces the function from the first migration.
-- The on_auth_user_created trigger already points at this function by name, so
-- it does not need to be recreated.
--
-- Run this once in the Supabase SQL Editor.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'name'), '')
    )
  );
  return new;
end;
$$;
