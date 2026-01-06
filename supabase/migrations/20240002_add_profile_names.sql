-- Add name columns to profiles table if they don't exist
alter table public.profiles 
add column if not exists first_name text,
add column if not exists last_name text;

-- Drop existing policies to avoid conflicts before re-creating
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;

-- Ensure RLS allows users to update their own profile
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using ( auth.uid() = id )
with check ( auth.uid() = id );

-- Ensure RLS allows users to insert their own profile (if missing)
create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check ( auth.uid() = id );

-- Allow users to read their own profile
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using ( auth.uid() = id );
