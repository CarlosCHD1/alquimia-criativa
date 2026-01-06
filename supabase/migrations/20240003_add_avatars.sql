-- Add avatar_url column to profiles
alter table public.profiles 
add column if not exists avatar_url text;

-- Create Storage Bucket for Avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage Policies for Avatars

-- Allow public read access
create policy "Avatar Public Read"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload their own avatar
create policy "Avatar Upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'avatars' and auth.uid() = owner );

-- Allow authenticated users to update their own avatar
create policy "Avatar Update"
on storage.objects for update
to authenticated
using ( bucket_id = 'avatars' and auth.uid() = owner );

-- Allow authenticated users to delete their own avatar
create policy "Avatar Delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'avatars' and auth.uid() = owner );
