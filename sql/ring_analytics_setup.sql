alter table if exists public.rings
  add column if not exists first_activated_at timestamptz,
  add column if not exists open_count integer not null default 0,
  add column if not exists daily_message_count integer not null default 0,
  add column if not exists question_count integer not null default 0,
  add column if not exists issued_at timestamptz default now(),
  add column if not exists lifecycle_stage text not null default 'packed',
  add column if not exists ring_type text not null default 'production';

update public.rings
set lifecycle_stage = case
  when first_activated_at is not null then 'activated'
  else 'packed'
end
where lifecycle_stage is null
   or lifecycle_stage not in ('packed', 'issued', 'activated', 'disabled', 'lost');

update public.rings
set ring_type = 'production'
where ring_type is null
   or ring_type not in ('production', 'test');

create table if not exists public.ring_events (
  id bigint generated always as identity primary key,
  uuid text not null,
  event_type text not null,
  session_id text,
  path text,
  extra_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ring_events_uuid_idx
  on public.ring_events (uuid);

create index if not exists ring_events_event_type_idx
  on public.ring_events (event_type);

create index if not exists ring_events_created_at_idx
  on public.ring_events (created_at desc);
