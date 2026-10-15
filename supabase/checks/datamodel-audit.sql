-- Case 1: read-only audit. Run in Supabase SQL Editor.
-- Does not change schema or data. Results contain no names/emails.
begin transaction read only;

-- 1. Actual columns and mandatory fields, including legacy duplicates.
select table_name, column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name in ('events', 'venues', 'registrations')
order by table_name, ordinal_position;

-- 2. Primary keys, foreign keys, validation rules and indexes.
select c.relname as table_name, con.conname as constraint_name,
       pg_get_constraintdef(con.oid) as definition
from pg_constraint con
join pg_class c on c.oid = con.conrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('events', 'venues', 'registrations')
order by c.relname, con.conname;

-- 3. Counts and missing/broken relationships. All issue counts should be 0.
select 'events_total' as check_name, count(*) as count from public.events
union all select 'venues_total', count(*) from public.venues
union all select 'registrations_total', count(*) from public.registrations
union all select 'events_without_venue', count(*) from public.events where "venueId" is null
union all select 'registrations_without_event', count(*) from public.registrations where "eventId" is null
union all select 'events_with_broken_venue', count(*)
  from public.events e left join public.venues v on v.id = e."venueId"
  where e."venueId" is not null and v.id is null
union all select 'registrations_with_broken_event', count(*)
  from public.registrations r left join public.events e on e.id = r."eventId"
  where r."eventId" is not null and e.id is null;

commit;
