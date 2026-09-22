-- portfoolio.me — run once in Supabase → SQL Editor
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
alter table profiles enable row level security;
drop policy if exists "public read" on profiles;
create policy "public read" on profiles for select using (true);
drop policy if exists "owner insert" on profiles;
create policy "owner insert" on profiles for insert with check (auth.uid() = user_id);
drop policy if exists "owner update" on profiles;
create policy "owner update" on profiles for update using (auth.uid() = user_id);
drop policy if exists "owner delete" on profiles;
create policy "owner delete" on profiles for delete using (auth.uid() = user_id);
-- Auth → enable Email provider + "Confirm email" OFF if you want pure OTP login.
