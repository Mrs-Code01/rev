-- Rev & Research — Phase 1 schema (spec §9)
-- Run this in the Supabase SQL editor for a fresh project, then fill in
-- .env.local per README.md to switch the app off the in-memory demo store.

create extension if not exists "pgcrypto";

create table units (
  id text primary key,
  name text not null
);

insert into units (id, name) values
  ('life-in-paradise', 'Life in Paradise'),
  ('island-time', 'Island Time'),
  ('coastal-keys', 'Coastal Keys'),
  ('summit-stays', 'Summit Stays'),
  ('blue-harbor', 'Blue Harbor'),
  ('desert-bloom', 'Desert Bloom'),
  ('pine-and-peak', 'Pine & Peak'),
  ('lakeside-collective', 'Lakeside Collective'),
  ('sunset-shores', 'Sunset Shores'),
  ('urban-nest', 'Urban Nest'),
  ('mountain-modern', 'Mountain Modern'),
  ('vista-verde', 'Vista Verde'),
  ('harborline', 'Harborline')
on conflict (id) do nothing;

create table profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  unit_id text not null references units (id),
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table editions (
  id uuid primary key default gen_random_uuid(),
  unit_id text not null references units (id),
  week_number int not null,
  published_at timestamptz not null,
  unique (unit_id, week_number)
);

create table sections (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references editions (id) on delete cascade,
  key text not null check (key in ('pulse', 'signed_calls', 'mug_shots', 'fresh_ink', 'margin_read')),
  day smallint not null check (day in (1, 2, 3)),
  title text not null,
  body_json jsonb not null default '{}'::jsonb,
  unlock_at timestamptz not null
);

create table flagged_homes (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references editions (id) on delete cascade,
  address text not null,
  bedrooms smallint not null,
  problem text not null,
  verdict text not null check (verdict in ('winner', 'drop', 'watch'))
);

create table signed_calls (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references editions (id) on delete cascade,
  home text not null,
  action text not null,
  est_value text,
  checked_default boolean not null default false
);

create table reader_prefs (
  user_id uuid not null references auth.users (id) on delete cascade,
  edition_id uuid not null references editions (id) on delete cascade,
  pace text not null check (pace in ('daily', 'weekly')),
  primary key (user_id, edition_id)
);

create table reader_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  section_id uuid not null references sections (id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (user_id, section_id)
);

create table slack_sends (
  id uuid primary key default gen_random_uuid(),
  unit_id text not null references units (id),
  edition_id uuid not null references editions (id) on delete cascade,
  channel text not null default '#rev-changes-lip',
  payload_json jsonb not null,
  sent_at timestamptz not null default now()
);

-- Row Level Security: an RM only ever sees their own unit's data.
alter table profiles enable row level security;
alter table editions enable row level security;
alter table sections enable row level security;
alter table flagged_homes enable row level security;
alter table signed_calls enable row level security;
alter table reader_prefs enable row level security;
alter table reader_progress enable row level security;
alter table slack_sends enable row level security;

create policy "read own profile" on profiles for select using (auth.uid() = user_id);
create policy "update own profile" on profiles for update using (auth.uid() = user_id);
create policy "insert own profile" on profiles for insert with check (auth.uid() = user_id);

create policy "read own unit editions" on editions for select using (
  unit_id in (select unit_id from profiles where user_id = auth.uid())
);

create policy "read own unit sections" on sections for select using (
  edition_id in (
    select id from editions where unit_id in (
      select unit_id from profiles where user_id = auth.uid()
    )
  )
);

create policy "read own unit flagged homes" on flagged_homes for select using (
  edition_id in (
    select id from editions where unit_id in (
      select unit_id from profiles where user_id = auth.uid()
    )
  )
);

create policy "read own unit signed calls" on signed_calls for select using (
  edition_id in (
    select id from editions where unit_id in (
      select unit_id from profiles where user_id = auth.uid()
    )
  )
);

create policy "manage own reader prefs" on reader_prefs for all using (auth.uid() = user_id);
create policy "manage own reader progress" on reader_progress for all using (auth.uid() = user_id);

create policy "read own unit slack sends" on slack_sends for select using (
  unit_id in (select unit_id from profiles where user_id = auth.uid())
);
create policy "insert own unit slack sends" on slack_sends for insert with check (
  unit_id in (select unit_id from profiles where user_id = auth.uid())
);

-- Seed: one live edition for Life in Paradise using the sample content from
-- BUILD_PROMPT.md §8. Adjust week_number/published_at to the current week.
with new_edition as (
  insert into editions (unit_id, week_number, published_at)
  values ('life-in-paradise', 28, date_trunc('week', now()))
  returning id
)
insert into sections (edition_id, key, day, title, unlock_at)
select id, key, day, title, (date_trunc('week', now()) + (day - 1) * interval '1 day' + interval '7.5 hours')
from new_edition, (values
  ('pulse', 1, 'The Pulse'),
  ('mug_shots', 1, 'Mug Shots'),
  ('signed_calls', 1, 'Signed Calls'),
  ('fresh_ink', 2, 'Fresh Ink'),
  ('margin_read', 3, 'The Margin Read')
) as s(key, day, title);

with target_edition as (
  select id from editions where unit_id = 'life-in-paradise' order by published_at desc limit 1
)
insert into flagged_homes (edition_id, address, bedrooms, problem, verdict)
select id, address, bedrooms, problem, verdict from target_edition, (values
  ('Palm Villa', 3, 'Midweek soft, 6 open Tue–Wed', 'drop'),
  ('Coral Casita', 2, 'Priced 11% under comp set', 'watch'),
  ('Dune House', 4, 'Weekend sold out, could push rate', 'winner'),
  ('Bay Bungalow', 1, 'September window still closed', 'watch')
) as h(address, bedrooms, problem, verdict);

with target_edition as (
  select id from editions where unit_id = 'life-in-paradise' order by published_at desc limit 1
)
insert into signed_calls (edition_id, home, action, est_value, checked_default)
select id, home, action, est_value, checked_default from target_edition, (values
  ('Palm Villa · 3BR', 'Drop Tue–Wed floor 6% → ~$18K', '$18K', true),
  ('Coral Casita · 2BR', 'Match comp set, +$40/nt', '$40/nt', true),
  ('Bay Bungalow · 1BR', 'Open the Sept window now', '—', false)
) as c(home, action, est_value, checked_default);
