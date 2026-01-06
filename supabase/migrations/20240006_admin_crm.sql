-- 1. Add CRM Columns to Profiles
alter table public.profiles
add column if not exists status text default 'active' check (status in ('active', 'blocked')),
add column if not exists tags text[] default '{}';

-- 2. RPC to Update User Profile (Admin Only)
create or replace function admin_update_profile(
  target_user_id uuid,
  new_status text,
  new_tags text[]
)
returns void
language plpgsql
security definer
as $$
declare
  caller_email text;
begin
  -- Security Check
  select auth.jwt() ->> 'email' into caller_email;
  if caller_email not in ('carloshenriquedionisio@gmail.com') then
    raise exception 'Access Denied: Admin only.';
  end if;

  update public.profiles
  set status = new_status, tags = new_tags
  where id = target_user_id;
end;
$$;

-- 3. Update Fetch Stats to include Status and Tags
create or replace function get_admin_dashboard_stats()
returns json
language plpgsql
security definer
as $$
declare
  total_users int;
  total_revenue numeric;
  all_users json;
  recent_transactions json;
  caller_email text;
begin
  -- 1. Security Check
  select auth.jwt() ->> 'email' into caller_email;
  if caller_email not in ('carloshenriquedionisio@gmail.com') then
    raise exception 'Access Denied: Admin only.';
  end if;

  -- 2. Stats
  select count(*) into total_users from auth.users;
  
  select coalesce(sum(cost), 0) into total_revenue 
  from public.transactions 
  where payment_status = 'completed';

  -- 3. Users List (Join auth.users and profiles)
  select json_agg(u) into all_users
  from (
    select 
      au.id, 
      au.email, 
      au.created_at, 
      au.last_sign_in_at,
      p.first_name, 
      p.last_name, 
      p.credits,
      p.avatar_url,
      p.status,
      p.tags
    from auth.users au
    left join public.profiles p on p.id = au.id
    order by au.created_at desc
  ) u;

  -- 4. Recent Transactions
  select json_agg(t) into recent_transactions
  from (
    select * from public.transactions order by created_at desc limit 20
  ) t;

  return json_build_object(
    'total_users', total_users,
    'total_revenue', total_revenue,
    'users', coalesce(all_users, '[]'::json),
    'recent_transactions', coalesce(recent_transactions, '[]'::json)
  );
end;
$$;
