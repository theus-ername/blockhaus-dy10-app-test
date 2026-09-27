begin;

create table public.admin_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  target_user_id uuid references public.profiles(id) on delete set null,
  target_room_id uuid references public.rooms(id) on delete set null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin(check_user uuid default auth.uid())
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
      and role = 'admin'
  );
$$;

create or replace function public.is_channel(check_room uuid)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.rooms
    where id = check_room and kind = 'channel'
  );
$$;

create or replace function public.admin_set_member(
  target_user uuid,
  new_approved boolean,
  new_role text,
  new_disabled boolean default false
)
returns public.profiles
language plpgsql
security definer set search_path = ''
as $$
declare
  updated_profile public.profiles;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Action réservée aux administrateurs';
  end if;
  if new_role not in ('member', 'moderator', 'admin') then
    raise exception 'Rôle invalide';
  end if;
  if target_user = auth.uid() and (new_role <> 'admin' or new_approved = false or new_disabled = true) then
    raise exception 'Un administrateur ne peut pas retirer lui-même ses propres droits';
  end if;
  if exists (select 1 from public.profiles where id = target_user and role = 'admin' and approved = true and disabled_at is null)
     and (new_role <> 'admin' or new_approved = false or new_disabled = true)
     and not exists (
       select 1 from public.profiles
       where id <> target_user and role = 'admin' and approved = true and disabled_at is null
     ) then
    raise exception 'Impossible de retirer le dernier administrateur actif';
  end if;

  update public.profiles
  set approved = new_approved,
      role = new_role,
      disabled_at = case when new_disabled then coalesce(disabled_at, now()) else null end,
      updated_at = now()
  where id = target_user
  returning * into updated_profile;

  if updated_profile.id is null then
    raise exception 'Membre introuvable';
  end if;
  insert into public.admin_audit_log (actor_id, target_user_id, action, details)
  values (auth.uid(), target_user, 'member_updated', jsonb_build_object('approved', new_approved, 'role', new_role, 'disabled', new_disabled));
  return updated_profile;
end;
$$;

create or replace function public.admin_create_channel(channel_name text)
returns uuid
language plpgsql
security definer set search_path = ''
as $$
declare
  new_room_id uuid;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Action réservée aux administrateurs';
  end if;
  if channel_name is null or char_length(trim(channel_name)) not between 1 and 80 then
    raise exception 'Nom de salon invalide';
  end if;

  insert into public.rooms (kind, name, created_by)
  values ('channel', trim(channel_name), auth.uid())
  returning id into new_room_id;

  insert into public.room_members (room_id, user_id, membership_role)
  values (new_room_id, auth.uid(), 'owner');

  insert into public.admin_audit_log (actor_id, target_room_id, action, details)
  values (auth.uid(), new_room_id, 'channel_created', jsonb_build_object('name', trim(channel_name)));

  return new_room_id;
end;
$$;

create or replace function public.admin_update_channel(
  target_room uuid,
  new_name text,
  archive_channel boolean default false
)
returns public.rooms
language plpgsql
security definer set search_path = ''
as $$
declare
  updated_room public.rooms;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Action réservée aux administrateurs';
  end if;
  if new_name is null or char_length(trim(new_name)) not between 1 and 80 then
    raise exception 'Nom de salon invalide';
  end if;

  update public.rooms
  set name = trim(new_name),
      archived_at = case when archive_channel then coalesce(archived_at, now()) else null end
  where id = target_room and kind = 'channel'
  returning * into updated_room;

  if updated_room.id is null then
    raise exception 'Salon introuvable';
  end if;
  insert into public.admin_audit_log (actor_id, target_room_id, action, details)
  values (auth.uid(), target_room, 'channel_updated', jsonb_build_object('name', trim(new_name), 'archived', archive_channel));
  return updated_room;
end;
$$;

create or replace function public.admin_add_channel_member(target_room uuid, target_user uuid)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Action réservée aux administrateurs';
  end if;
  if not public.is_channel(target_room) or not public.is_approved(target_user) then
    raise exception 'Salon ou membre invalide';
  end if;
  insert into public.room_members (room_id, user_id)
  values (target_room, target_user)
  on conflict do nothing;
  insert into public.admin_audit_log (actor_id, target_user_id, target_room_id, action)
  values (auth.uid(), target_user, target_room, 'channel_member_added');
end;
$$;

create or replace function public.admin_remove_channel_member(target_room uuid, target_user uuid)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Action réservée aux administrateurs';
  end if;
  if not public.is_channel(target_room) then
    raise exception 'Salon invalide';
  end if;
  delete from public.room_members
  where room_id = target_room and user_id = target_user;
  insert into public.admin_audit_log (actor_id, target_user_id, target_room_id, action)
  values (auth.uid(), target_user, target_room, 'channel_member_removed');
end;
$$;

alter table public.admin_audit_log enable row level security;
revoke all on public.admin_audit_log from anon, authenticated;
grant select on public.admin_audit_log to authenticated;

create policy admin_audit_read on public.admin_audit_log
  for select to authenticated
  using (public.is_admin(auth.uid()));

drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles
  for select to authenticated
  using (
    id = auth.uid()
    or public.is_admin(auth.uid())
    or (public.is_approved(auth.uid()) and approved = true and disabled_at is null)
  );

drop policy if exists rooms_read_by_members on public.rooms;
create policy rooms_read_by_members on public.rooms
  for select to authenticated
  using (
    public.is_approved(auth.uid())
    and (
      public.is_room_member(id, auth.uid())
      or (public.is_admin(auth.uid()) and kind = 'channel')
    )
  );

drop policy if exists room_members_read_by_members on public.room_members;
create policy room_members_read_by_members on public.room_members
  for select to authenticated
  using (
    public.is_approved(auth.uid())
    and (
      public.is_room_member(room_id, auth.uid())
      or (public.is_admin(auth.uid()) and public.is_channel(room_id))
    )
  );

drop policy if exists messages_read_by_members on public.messages;
create policy messages_read_by_members on public.messages
  for select to authenticated
  using (
    public.is_approved(auth.uid())
    and (
      public.is_room_member(room_id, auth.uid())
      or (public.is_admin(auth.uid()) and public.is_channel(room_id))
    )
  );

drop policy if exists messages_send_by_members on public.messages;
create policy messages_send_by_members on public.messages
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and public.is_approved(auth.uid())
    and (
      public.is_room_member(room_id, auth.uid())
      or (public.is_admin(auth.uid()) and public.is_channel(room_id))
    )
  );

revoke execute on function public.is_admin(uuid) from public, anon;
revoke execute on function public.is_channel(uuid) from public, anon;
revoke execute on function public.admin_set_member(uuid, boolean, text, boolean) from public, anon;
revoke execute on function public.admin_create_channel(text) from public, anon;
revoke execute on function public.admin_update_channel(uuid, text, boolean) from public, anon;
revoke execute on function public.admin_add_channel_member(uuid, uuid) from public, anon;
revoke execute on function public.admin_remove_channel_member(uuid, uuid) from public, anon;

grant execute on function public.is_admin(uuid) to authenticated;
grant execute on function public.is_channel(uuid) to authenticated;
grant execute on function public.admin_set_member(uuid, boolean, text, boolean) to authenticated;
grant execute on function public.admin_create_channel(text) to authenticated;
grant execute on function public.admin_update_channel(uuid, text, boolean) to authenticated;
grant execute on function public.admin_add_channel_member(uuid, uuid) to authenticated;
grant execute on function public.admin_remove_channel_member(uuid, uuid) to authenticated;

commit;
