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
alter table profiles add column if not exists avatar_url text default '';
alter table profiles add column if not exists instagram text default '';
-- v2: status column (kept for admin moderation: approved / rejected).
-- New sites publish instantly, so the default is now 'approved'.
alter table profiles add column if not exists status text default 'approved'
  check (status in ('pending', 'approved', 'rejected'));
alter table profiles alter column status set default 'approved';
-- backfill anything from approval days as approved
update profiles set status = 'approved' where status is null or status = 'pending';

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
$$ select (auth.jwt() ->> 'email') = 'portfoolio.me@gmail.com'
   or exists (select 1 from admins where user_id = auth.uid()) $$;

-- 3) profiles policies — OPEN publishing: new sites go live instantly.
-- Admin console remains for moderation (reject/delete spam).
alter table profiles enable row level security;
drop policy if exists "public read" on profiles;
drop policy if exists "public read approved" on profiles;
create policy "public read" on profiles
  for select using (true);
drop policy if exists "owner insert" on profiles;
drop policy if exists "request insert" on profiles;
create policy "owner insert" on profiles
  for insert with check (auth.uid() = user_id);
drop policy if exists "owner update" on profiles;
drop policy if exists "owner update pending" on profiles;
drop policy if exists "owner update approved" on profiles;
create policy "owner update" on profiles
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
drop policy if exists "owner delete" on profiles;
create policy "owner delete" on profiles
  for delete using (auth.uid() = user_id);
drop policy if exists "admin all" on profiles;
create policy "admin all" on profiles
  for all using (is_admin()) with check (is_admin());

-- 4) custom uploaded sites (prebuilt portfolio hosting — idempotent)
-- site_type: 'builder' (default templates) | 'upload' (user's own HTML/ZIP)
-- site_path: storage prefix marker, e.g. 'sites/<username>/index.html'
alter table profiles add column if not exists site_type text default 'builder'
  check (site_type in ('builder', 'upload'));
alter table profiles add column if not exists site_path text default '';
alter table profiles add column if not exists site_updated_at timestamptz;

-- public storage bucket for uploaded static sites (1GB free on Supabase)
insert into storage.buckets (id, name, public)
values ('portfolio-sites', 'portfolio-sites', true)
on conflict (id) do update set public = true;

-- storage policies: public read, owners manage their own prefix
drop policy if exists "public read sites" on storage.objects;
create policy "public read sites" on storage.objects
  for select using (bucket_id = 'portfolio-sites');

drop policy if exists "owner upload sites" on storage.objects;
create policy "owner upload sites" on storage.objects
  for insert with check (bucket_id = 'portfolio-sites' and auth.uid() is not null);

drop policy if exists "owner update sites" on storage.objects;
create policy "owner update sites" on storage.objects
  for update using (bucket_id = 'portfolio-sites' and (auth.uid() = owner or is_admin()))
  with check (bucket_id = 'portfolio-sites');

drop policy if exists "owner delete sites" on storage.objects;
create policy "owner delete sites" on storage.objects
  for delete using (bucket_id = 'portfolio-sites' and (auth.uid() = owner or is_admin()));

-- 5) resume section (auto-built from profile info, ATS + styled themes)
-- experience[]: {role, company, start, end, current, desc}
-- education[]:  {school, degree, field, start, end}
-- resume{}:     {summary, theme: ats|modern|midnight|terminal}
-- certifications[]: {name, issuer, year, url}
alter table profiles add column if not exists experience jsonb default '[]';
alter table profiles add column if not exists education jsonb default '[]';
alter table profiles add column if not exists resume jsonb default '{}';
alter table profiles add column if not exists certifications jsonb default '[]';

-- 6) social visibility toggles (users choose what shows on their portfolio)
-- show_instagram defaults true so existing profiles keep current behavior.
alter table profiles add column if not exists show_instagram boolean default true;

-- 7) portfolio track (tech vs visual). Default 'tech' keeps every existing profile unchanged.
alter table profiles add column if not exists track text default 'tech'
  check (track in ('tech', 'visual'));
-- works[]: visual-track gallery pieces {id, title, category, desc, imageUrl, createdAt}
alter table profiles add column if not exists works jsonb default '[]';

-- 8) make yourself admin (run AFTER creating the admin user in Authentication):
-- insert into admins (user_id) select id from auth.users where email = 'portfoolio.me@gmail.com';

-- 9) auto-create starter profile on signup (ensures every new user is entered into public.profiles immediately)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  base_u text;
  final_u text;
  c int := 0;
begin
  base_u := lower(regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9-]', '', 'g'));
  if length(base_u) < 3 then
    base_u := 'user-' || substr(new.id::text, 1, 6);
  end if;
  base_u := substr(base_u, 1, 24);

  final_u := base_u;
  while exists (select 1 from public.profiles where username = final_u) loop
    c := c + 1;
    final_u := substr(base_u, 1, 20) || '-' || c;
  end loop;

  insert into public.profiles (user_id, username, name, title, email, status)
  values (
    new.id,
    final_u,
    initcap(regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9]', ' ', 'g')),
    'Creator & Developer',
    new.email,
    'approved'
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
