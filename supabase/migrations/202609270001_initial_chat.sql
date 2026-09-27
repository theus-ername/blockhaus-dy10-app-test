begin;

create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  forum_username text check (forum_username is null or char_length(forum_username) between 1 and 40),
  role text not null default 'member' check (role in ('member', 'moderator', 'admin')),
  approved boolean not null default false,
  disabled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'private' check (kind in ('private', 'channel')),
  name text not null check (char_length(name) between 1 and 80),
  created_by uuid not null references public.profiles(id),
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.room_members (
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  membership_role text not null default 'member' check (membership_role in ('member', 'moderator', 'owner')),
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  body text not null check (char_length(body) between 1 and 2000),
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.room_invites (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  token_hash bytea not null unique,
  created_by uuid not null references public.profiles(id),
  expires_at timestamptz not null,
  max_uses integer not null default 20 check (max_uses between 1 and 100),
  uses integer not null default 0 check (uses >= 0),
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index room_members_user_id_idx on public.room_members(user_id);
create index messages_room_created_idx on public.messages(room_id, created_at);
create index room_invites_room_id_idx on public.room_invites(room_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1), 'Membre'), 40)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.is_approved(check_user uuid default auth.uid())
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = check_user
      and approved = true
      and disabled_at is null
  );
$$;

create or replace function public.is_room_member(check_room uuid, check_user uuid default auth.uid())
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.room_members
    where room_id = check_room and user_id = check_user
  );
$$;

create or replace function public.update_own_profile(new_display_name text, new_forum_username text default null)
returns public.profiles
language plpgsql
security definer set search_path = ''
as $$
declare
  updated_profile public.profiles;
begin
  if new_display_name is null or char_length(trim(new_display_name)) not between 1 and 40 then
    raise exception 'Nom invalide';
  end if;
  if auth.uid() is null then
    raise exception 'Connexion requise';
  end if;
  update public.profiles
  set display_name = trim(new_display_name),
      forum_username = nullif(trim(new_forum_username), ''),
      updated_at = now()
  where id = auth.uid()
  returning * into updated_profile;
  return updated_profile;
end;
$$;

create or replace function public.create_private_room(room_name text, invite_hours integer default 48)
returns table (room_id uuid, invite_token text)
language plpgsql
security definer set search_path = ''
as $$
declare
  new_room_id uuid;
  raw_token text;
begin
  if not public.is_approved(auth.uid()) then
    raise exception 'Compte non validé';
  end if;
  if char_length(trim(room_name)) not between 1 and 80 then
    raise exception 'Nom de discussion invalide';
  end if;
  if invite_hours not between 1 and 168 then
    raise exception 'Durée d invitation invalide';
  end if;

  insert into public.rooms (kind, name, created_by)
  values ('private', trim(room_name), auth.uid())
  returning id into new_room_id;

  insert into public.room_members (room_id, user_id, membership_role)
  values (new_room_id, auth.uid(), 'owner');

  raw_token := encode(extensions.gen_random_bytes(24), 'hex');
  insert into public.room_invites (room_id, token_hash, created_by, expires_at)
  values (new_room_id, extensions.digest(raw_token, 'sha256'), auth.uid(), now() + make_interval(hours => invite_hours));

  return query select new_room_id, raw_token;
end;
$$;

create or replace function public.join_room_by_invite(invite_token text)
returns uuid
language plpgsql
security definer set search_path = ''
as $$
declare
  matched_invite public.room_invites;
  inserted_rows integer;
begin
  if not public.is_approved(auth.uid()) then
    raise exception 'Compte non validé';
  end if;

  select * into matched_invite
  from public.room_invites
  where token_hash = extensions.digest(invite_token, 'sha256')
    and revoked_at is null
    and expires_at > now()
    and uses < max_uses
  for update;

  if not found then
    raise exception 'Invitation invalide ou expirée';
  end if;

  insert into public.room_members (room_id, user_id)
  values (matched_invite.room_id, auth.uid())
  on conflict do nothing;
  get diagnostics inserted_rows = row_count;

  if inserted_rows > 0 then
    update public.room_invites set uses = uses + 1 where id = matched_invite.id;
  end if;

  return matched_invite.room_id;
end;
$$;

create or replace function public.revoke_room_invites(target_room uuid)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.room_members
    where room_id = target_room and user_id = auth.uid() and membership_role = 'owner'
  ) then
    raise exception 'Action réservée au créateur';
  end if;
  update public.room_invites set revoked_at = now()
  where room_id = target_room and revoked_at is null;
end;
$$;

alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.messages enable row level security;
alter table public.room_invites enable row level security;

revoke all on public.profiles, public.rooms, public.room_members, public.messages, public.room_invites from anon, authenticated;
grant select on public.profiles, public.rooms, public.room_members, public.messages to authenticated;
grant insert on public.messages to authenticated;

create policy profiles_read on public.profiles
  for select to authenticated
  using (id = auth.uid() or (public.is_approved(auth.uid()) and approved = true and disabled_at is null));

create policy rooms_read_by_members on public.rooms
  for select to authenticated
  using (public.is_approved(auth.uid()) and public.is_room_member(id, auth.uid()));

create policy room_members_read_by_members on public.room_members
  for select to authenticated
  using (public.is_approved(auth.uid()) and public.is_room_member(room_id, auth.uid()));

create policy messages_read_by_members on public.messages
  for select to authenticated
  using (public.is_approved(auth.uid()) and public.is_room_member(room_id, auth.uid()));

create policy messages_send_by_members on public.messages
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and public.is_approved(auth.uid())
    and public.is_room_member(room_id, auth.uid())
  );

revoke execute on function public.update_own_profile(text, text) from public, anon;
revoke execute on function public.create_private_room(text, integer) from public, anon;
revoke execute on function public.join_room_by_invite(text) from public, anon;
revoke execute on function public.revoke_room_invites(uuid) from public, anon;
revoke execute on function public.is_approved(uuid) from public, anon;
revoke execute on function public.is_room_member(uuid, uuid) from public, anon;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.create_private_room(text, integer) to authenticated;
grant execute on function public.join_room_by_invite(text) to authenticated;
grant execute on function public.revoke_room_invites(uuid) to authenticated;
grant execute on function public.is_approved(uuid) to authenticated;
grant execute on function public.is_room_member(uuid, uuid) to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.messages;
exception
  when duplicate_object then null;
end $$;

commit;
