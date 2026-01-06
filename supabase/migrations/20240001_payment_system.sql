-- Create transactions table handles idempotency
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  amount int not null,
  cost numeric,
  currency text default 'BRL',
  provider_tx_id text,
  payment_status text default 'pending',
  provider text default 'kiwify',
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;

-- RPC to securely add credits via Email (for Webhook)
create or replace function add_credits_by_email(
  user_email text, 
  credit_amount int,
  tx_id text default null,
  paid_amount numeric default 0
)
returns json
language plpgsql
security definer
as $$
declare
  target_user_id uuid;
  new_balance int;
begin
  -- 1. Find User
  select id into target_user_id from auth.users where email = user_email;
  
  if target_user_id is null then
    return json_build_object('success', false, 'error', 'User not found');
  end if;

  -- 2. Check if Transaction already exists (Idempotency)
  if tx_id is not null and exists (select 1 from public.transactions where provider_tx_id = tx_id) then
     return json_build_object('success', true, 'message', 'Transaction already processed');
  end if;

  -- 3. Log Transaction
  insert into public.transactions (user_id, amount, cost, provider_tx_id, payment_status, provider)
  values (target_user_id, credit_amount, paid_amount, tx_id, 'completed', 'kiwify');

  -- 4. Update Profile
  update public.profiles
  set credits = credits + credit_amount
  where id = target_user_id
  returning credits into new_balance;

  return json_build_object('success', true, 'new_balance', new_balance);
end;
$$;
