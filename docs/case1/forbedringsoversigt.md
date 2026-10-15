# Teknisk audit og forbedringsoversigt

## Afgrænsning

Dette er en efterfølgende audit af startkode, commits, SQL og tests. Den konkrete Canvas-auditskabelon er ikke gennemgået her, så dokumentationen må ikke beskrives som en udfyldt version af netop den skabelon.

Flere forbedringer blev først lavet samlet og derefter rekonstrueret i feature branches. Branchkæden er derfor en efterfølgende dokumentations- og leverancestruktur, ikke en fuldstændig historik over den oprindelige udviklingsrækkefølge.

## Prioritering

| Prioritet | Problem og konsekvens | Valgt løsning og begrundelse |
|---|---|---|
| 1 | Formularen loggede kun input; ingen tilmelding blev gemt | Implementér Supabase POST, validering og feedback. Det var den centrale brugerhandling. |
| 1 | Venue- og eventdata blev gentaget i flere tabeller | Normalisér til `venues -> events -> registrations` for at reducere modstridende kopier. |
| 2 | Manglende loading-, fejl-, tom- og not-found-states | Gør brugerens status tydelig uden at udvide produktets scope. |
| 2 | Manglende labels, semantik og synlig fokus | Forbedr tastatur- og hjælpemiddelbrug med små lokale ændringer. |
| 2 | Event-state kunne hænge ved ved route-skift | Remount `EventPage` med route-specifik key; afgrænset og lavrisiko React-løsning. |
| 3 | Gentaget Supabase-konfiguration og unødvendig datahentning | Del request-håndtering og vælg kun nødvendige REST-felter. |

## Udvalgte forbedringer

### Normaliseret datamodel

- **Problem:** Venueoplysninger og eventoplysninger på tilmeldinger blev duplikeret.
- **Konsekvens:** Flere steder skulle vedligeholdes, og kopier kunne blive uenige.
- **Løsning:** `venues` indeholder steddata, `events.venueId` refererer til venues, og `registrations.eventId` refererer til events.
- **Branch/commit:** `case1-data-model` / `cd0ea64`; senere databaseverifikation i `case1-datamodel-verification` / `2c05a06`, `0358d55`.
- **Verifikation:** SQL Editor-resultater dokumenterer foreign keys, `eventId` som NOT NULL, 9 events, 7 venues, 3 tilmeldinger og bevarede relationer efter migration 002.
- **Værdi:** Mindre risiko for modstridende data; faktisk tidsbesparelse er ikke målt.
- **Begrænsning:** Frisk `starter.sql` er ikke testet i en tom PostgreSQL-database.

### Registration POST og relationel oversigt

- **Problem:** Startformularen loggede kun input.
- **Konsekvens:** Brugeren kunne ikke gennemføre den centrale handling.
- **Løsning:** POST med `{ name, email, status: "Ny", eventId }`; oversigten læser eventtitel og dato gennem relationen.
- **Branch/commit:** `case1-registration-flow` / `33b65a8`; `case1-relational-fetching` / `b534398`.
- **Verifikation:** Tidligere lokal manuel test observerede succesfeedback, tømt formular, ny række og relationel event/dato. Native required/email-validering og trim-validering blev også observeret.
- **Værdi:** Sammenhæng fra eventopdagelse til tilmelding og arrangøroverblik.
- **Begrænsning:** Testen blev udført før de seneste frontendændringer; den dokumenterer ikke den nyeste kodeversion. Konvertering og kapacitetsstyring er ikke målt.

### Robusthed og tilgængelighed

- **Problem:** Fetch-fejl, loading og tomme svar var ikke tydelige; markup havde manglende semantik.
- **Konsekvens:** Tomme eller misvisende sider og vanskeligere brug med tastatur/hjælpemidler.
- **Løsning:** Fælles Supabase utility, `response.ok`, AbortController, UI-states, labels, live feedback, semantisk tabel, `scope`, fokusstile og passende lazy loading.
- **Branch/commit:** `case1-robustness-accessibility` / `f37be8e`.
- **Verifikation:** `npm run lint` og `npm run build` bestod. Koden er gennemgået. Isoleret afbrudt POST-test gav dansk fejlfeedback i en tidligere version.
- **Værdi:** Tydeligere feedback og bedre vedligeholdelse.
- **Begrænsning:** Fuld keyboard-, skærmlæser- og accessibility-compliance er ikke målt.

### Event state reset

- **Problem:** Event-, fejl- og formularstate kunne følge med mellem forskellige `eventId`.
- **Konsekvens:** Gamle oplysninger kunne se aktuelle ud og skabe risiko for forkert tilmelding.
- **Løsning:** `EventPage` remountes med route-specifik key i `App.jsx`; eksisterende AbortController bevares.
- **Branch/commit:** `case1-event-state-reset` / `4938707`.
- **Verifikation:** Lint/build bestod. State-reset ved langsomt skift, not-found → gyldigt event og feedback-reset er ikke browserverificeret.
- **Værdi:** UI-state følger det aktuelle event.

## Historik

Den rapporterede backup-commit `484464f` indeholdt en samlet version. Den lineære branchkæde blev efterfølgende rekonstrueret og suppleret med databaseverifikation, dokumentation og state-reset. Det skal beskrives åbent og ikke som oprindelig trinvis udvikling.
