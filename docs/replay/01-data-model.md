# 1. Datamodel og relationer

## Ændring

Den oprindelige datamodel i `f25fde8` gentog stedoplysninger på events og eventdata på tilmeldinger. En migration oprettede `venues`, forbandt events med steder og tilmeldinger med events og gjorde `eventId` obligatorisk.

Kopifelterne blev bevaret midlertidigt, så den gamle frontend kunne fungere under overgangen. De blev fjernet, efter at frontend var tilpasset. `starter.sql` blev også tilpasset til en ny database.

## Test og resultat

Migrationen blev kørt mod den oprindelige database i et isoleret PostgreSQL-miljø. Resultatet var ni events, syv steder og to tilmeldinger med korrekte relationer. Den tilpassede `starter.sql` blev desuden kørt i en tom database.

- En tilmelding uden `eventId` blev afvist med SQLSTATE `23502`.
- En tilmelding med et ukendt `eventId` blev afvist med SQLSTATE `23503`.
- Resultater: [data-after.json](evidence/data-after.json) og [schema-fresh-test.json](evidence/schema-fresh-test.json).

Testen ændrede ikke den offentlige Supabase-database. Audit og baseline er registreret i `5123b7d` før denne ændring.

Relationerne samler oplysningerne ét sted og sikrer, at tilmeldinger henviser til et eksisterende event.
