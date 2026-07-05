-- Run this after schema.sql. Adds the pieces spec §9 didn't cover:
-- a storage bucket for avatar uploads, and a table for push subscriptions
-- (needed for real web push; not part of the original minimum schema).

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Users can upload their own avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own avatar" on storage.objects
  for update using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

create table push_subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  updated_at timestamptz not null default now()
);

alter table push_subscriptions enable row level security;

create policy "manage own push subscription" on push_subscriptions for all using (
  auth.uid() = user_id
);
