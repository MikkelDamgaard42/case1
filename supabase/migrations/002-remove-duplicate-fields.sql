-- Reapplied to the isolated replay test database after frontend adaptation.
-- Earlier live migration was performed separately; this file is not rerun live.
-- Reviewed comparison results:
-- 0 venue differences and 0 non-null legacy registration differences.
-- Removes only redundant columns; preserves rows and foreign keys.
-- No CASCADE: unexpected dependent objects will block the transaction.
begin;

alter table public.events
  drop column "venueName",
  drop column "venueAddress",
  drop column "venuePostalCode",
  drop column "venueCity",
  drop column "venueWebsite";

alter table public.registrations
  drop column "eventTitle",
  drop column "eventDate",
  drop column "eventLocation";

commit;

select table_name, column_name, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name in ('events', 'registrations')
order by table_name, ordinal_position;
