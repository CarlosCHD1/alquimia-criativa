-- Secure RPC to get admin stats
-- Checks if the caller is the specific admin email

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
  
  -- Revenue (sum 'paid_amount' alias or 'cost' depending on schema, usually cost or amount from transactions)
  -- In payment_system.sql: amount (int credits), cost (numeric paid), provider_tx_id...
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
      p.avatar_url
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
