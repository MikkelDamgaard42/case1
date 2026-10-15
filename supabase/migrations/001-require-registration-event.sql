-- Applied by Mikkel in Supabase SQL Editor on 2026-10-15.
-- Before: 0 registrations without event. After: is_nullable = NO.
begin;
alter table public.registrations
  alter column "eventId" set not null;
commit;
