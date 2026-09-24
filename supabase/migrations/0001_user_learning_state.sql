-- Design Engineering Academy — cloud learning state
--
-- One row per user holding everything that is specific to that person:
-- lesson progress, exercise and reflection answers, project records, notes,
-- resource marks and preferences.
--
-- The curriculum is NOT here. Modules, lessons, projects, resources and
-- competency definitions stay in the application repository: they are authored
-- content, identical for every user, and versioned with the code.

create table if not exists public.user_learning_state (
  user_id        uuid primary key references auth.users (id) on delete cascade,
  data           jsonb       not null default '{}'::jsonb,
  schema_version integer     not null default 1,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.user_learning_state is
  'One learning-state row per user. Curriculum content lives in the application, not here.';
comment on column public.user_learning_state.data is
  'Application state: progress, notes, resources, preferences. No curriculum content.';
comment on column public.user_learning_state.schema_version is
  'Payload shape version, raised only when older clients cannot read the data.';

-- user_id is the primary key, so "one row per user" is enforced by the schema
-- rather than by application discipline. This is what makes upsert safe.

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
-- Kept in the database so the timestamp is true even if a client forgets to
-- send one, and so it cannot be back-dated by a caller.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_learning_state_set_updated_at on public.user_learning_state;

create trigger user_learning_state_set_updated_at
  before update on public.user_learning_state
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Table privileges
-- ---------------------------------------------------------------------------
-- Supabase grants these to new public tables through project-level default
-- privileges, so on a standard project this is a no-op. Stated explicitly
-- anyway: if those defaults are ever absent the table is simply unreachable,
-- and "permission denied for table user_learning_state" looks nothing like the
-- configuration mistake that caused it.
--
-- These are table-level grants only. Which *rows* each user may touch is
-- decided entirely by the policies below.

grant select, insert, update, delete on public.user_learning_state to authenticated;

-- Nothing for anon: signed-out visitors have no business here at all.

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
-- Ownership is enforced here, not in the client. Without RLS the publishable
-- key shipped to the browser would be able to read every row in the table.

alter table public.user_learning_state enable row level security;

drop policy if exists "read own learning state"   on public.user_learning_state;
drop policy if exists "insert own learning state" on public.user_learning_state;
drop policy if exists "update own learning state" on public.user_learning_state;
drop policy if exists "delete own learning state" on public.user_learning_state;

create policy "read own learning state"
  on public.user_learning_state
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "insert own learning state"
  on public.user_learning_state
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- Both clauses are required. USING decides which rows may be targeted;
-- WITH CHECK decides what they may be changed into. Omitting WITH CHECK would
-- let a user reassign their own row's user_id to somebody else.
create policy "update own learning state"
  on public.user_learning_state
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "delete own learning state"
  on public.user_learning_state
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- No policy is granted to `anon`, so an unauthenticated request sees nothing
-- at all rather than an empty result it might mistake for "no progress yet".
