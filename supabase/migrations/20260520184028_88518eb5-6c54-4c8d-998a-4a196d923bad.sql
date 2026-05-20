
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Chat sessions
create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.chat_sessions enable row level security;
create policy "own sessions select" on public.chat_sessions for select using (auth.uid() = user_id);
create policy "own sessions insert" on public.chat_sessions for insert with check (auth.uid() = user_id);
create policy "own sessions update" on public.chat_sessions for update using (auth.uid() = user_id);
create policy "own sessions delete" on public.chat_sessions for delete using (auth.uid() = user_id);
create index chat_sessions_user_idx on public.chat_sessions(user_id, updated_at desc);

-- Chat messages
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.chat_messages enable row level security;
create policy "own messages select" on public.chat_messages for select using (auth.uid() = user_id);
create policy "own messages insert" on public.chat_messages for insert with check (auth.uid() = user_id);
create index chat_messages_session_idx on public.chat_messages(session_id, created_at);
