-- 1. Library Prompts Table
create table if not exists public.library_prompts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text default 'Sem Título',
  concept text not null,
  style text,
  category text default 'General',
  tags text[] default '{}',
  likes_count int default 0,
  is_verified boolean default false, -- For "Best Prompts"
  is_public boolean default true,
  created_at timestamptz default now()
);

-- RLS for Prompts
alter table public.library_prompts enable row level security;

-- Everyone can read public prompts
create policy "Public prompts are viewable by everyone"
  on public.library_prompts for select
  using ( is_public = true );

-- Users can manage their own prompts
create policy "Users can manage own prompts"
  on public.library_prompts for all
  using ( auth.uid() = user_id );

-- 2. Library Collections (Groups)
create table if not exists public.library_collections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  is_public boolean default false,
  created_at timestamptz default now()
);

alter table public.library_collections enable row level security;

create policy "Users manage own collections"
  on public.library_collections for all
  using ( auth.uid() = user_id );

-- 3. Prompt Votes (Likes)
create table if not exists public.library_votes (
  user_id uuid references auth.users(id) on delete cascade not null,
  prompt_id uuid references public.library_prompts(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (user_id, prompt_id)
);

alter table public.library_votes enable row level security;

create policy "Vote access"
  on public.library_votes for all
  using ( auth.uid() = user_id );

-- 4. RPC: Toggle Vote
create or replace function toggle_vote_prompt(target_prompt_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  _user_id uuid;
  _exists boolean;
begin
  _user_id := auth.uid();
  if _user_id is null then raise exception 'Not authenticated'; end if;

  select exists(select 1 from public.library_votes where user_id = _user_id and prompt_id = target_prompt_id)
  into _exists;

  if _exists then
    delete from public.library_votes where user_id = _user_id and prompt_id = target_prompt_id;
    update public.library_prompts set likes_count = likes_count - 1 where id = target_prompt_id;
  else
    insert into public.library_votes (user_id, prompt_id) values (_user_id, target_prompt_id);
    update public.library_prompts set likes_count = likes_count + 1 where id = target_prompt_id;
  end if;
end;
$$;

-- 5. RPC: Get Verified Prompts (For Optimizer Agent)
create or replace function get_verified_prompts(
  filter_category text default null,
  limit_count int default 5
)
returns json
language plpgsql
security definer
as $$
begin
  return (
    select json_agg(p)
    from (
      select concept, style, category, likes_count
      from public.library_prompts
      where is_verified = true
      and (filter_category is null or category = filter_category)
      order by likes_count desc
      limit limit_count
    ) p
  );
end;
$$;
