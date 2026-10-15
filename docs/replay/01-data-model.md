# 1. Additive relationer

Førgrundlag: baseline-commit 5123b7d, original schema f25fde8. Problem/prioritet/færdigkriterium er registreret før ændringen i README.

Løsning: en migration opretter venues fra eksisterende felter, forbinder events og tilmeldinger og kræver eventId. Kopifelter bevares midlertidigt, så den gamle frontend fortsat virker indtil næste forbedring. Frisk starter.sql er tilpasset separat.

Faktisk test: migration mod original isoleret PostgreSQL gav 9 events, 7 venues og 2 tilmeldinger med alle relationer bevaret. Frisk starter.sql blev kørt i en separat tom PostgreSQL-instans. INSERT med NULL eventId afvises med SQLSTATE 23502; ukendt eventId afvises med 23503. Se evidence/data-after.json og schema-fresh-test.json. Live Supabase er ikke ændret.

Værdi: relationer og obligatorisk eventtilknytning, uden at gamle visninger ødelægges under overgangen. Kopifelternes endelige fjernelse gennemføres efter den relationelle frontend.
