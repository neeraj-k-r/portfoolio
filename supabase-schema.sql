-- portfoolio.me — FULL schema (idempotent: safe to re-run over v1)
-- 1) profiles table
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9][a-z0-9-]{2,29}$'),
  name text not null, title text not null, tagline text default '',
  email text not null, phone text default '', location text default '',
  github text default '', linkedin text default '', template text default 'midnight',
  skills jsonb default '[]', projects jsonb default '[]',
  available boolean default true,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
-- v2: approval workflow
alter table profiles add column if not exists status text default 'pending'
  check (status in ('pending', 'approved', 'rejected'));
-- backfill anything from v1 days as approved
update profiles set status = 'approved' where status is null;

-- 2) admins table (who can approve). Owner: insert your own user_id after creating the admin user.
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);
alter table admins enable row level security;
drop policy if exists "own admin row" on admins;
create policy "own admin row" on admins for select using (auth.uid() = user_id);

create or replace function is_admin()
returns boolean language sql security definer stable as
$$ select exists (select 1 from admins where user_id = auth.uid()) $$;

-- 3) profiles policies
alter table profiles enable row level security;
drop policy if exists "public read" on profiles;
drop policy if exists "public read approved" on profiles;
create policy "public read approved" on profiles
  for select using (status = 'approved' or auth.uid() = user_id);
drop policy if exists "owner insert" on profiles;
drop policy if exists "request insert" on profiles;
create policy "request insert" on profiles
  for insert with check (auth.uid() = user_id and status = 'pending');
drop policy if exists "owner update" on profiles;
drop policy if exists "owner update pending" on profiles;
create policy "owner update pending" on profiles
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id and status = 'pending');
drop policy if exists "owner delete" on profiles;
create policy "owner delete" on profiles
  for delete using (auth.uid() = user_id and status = 'pending');
drop policy if exists "owner update approved" on profiles;
create policy "owner update approved" on profiles
  for update using (auth.uid() = user_id and status = 'approved')
  with check (auth.uid() = user_id and status = 'approved');
drop policy if exists "admin all" on profiles;
create policy "admin all" on profiles
  for all using (is_admin()) with check (is_admin());

-- 4) make yourself admin (run AFTER creating the admin user in Authentication):
-- insert into admins (user_id) select id from auth.users where email = 'portfoolio.me@gmail.com';
