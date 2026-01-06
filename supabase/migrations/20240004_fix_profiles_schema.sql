-- Add updated_at column to profiles table
alter table public.profiles 
add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- Optional: Create a trigger to automatically update updated_at (Good practice but not strictly required for the immediate fix)
-- For now, just adding the column is enough to fix the error as the frontend sends the date.
