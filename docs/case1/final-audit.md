# Afsluttende read-only gennemgang: Case 1 Mellemrum

Dato: 15. oktober 2026

## Git-status

- Auditgrundlag: `case1-robustness-accessibility` ved `f37be8e6afe6273a7e13d051a7f575af0caccae5`
- Efterfølgende rettelse: `case1-event-state-reset` ved `4938707`
- Dokumentationsbranch: `case1-documentation`
- `case1-backup`, alle feature branches og stash findes fortsat
- Ingen `AGENTS.md` blev fundet i workspace
- Ingen filer, branches, commits, merges, pushes eller databaseændringer blev foretaget under gennemgangen

## Verifikation

- `npm run lint`: passerer
- `npm run build`: passerer
- `docs/case1/datamodel-api-check.json` dokumenterer read-only REST-kald for relationerne
- Der findes ingen automatiske browser- eller integrationstests i projektets scripts

## Faktiske fund

### 1. EventPage viste forældede eventdata ved skift mellem events — rettet

På før-committen [f37be8e](https://github.com/MikkelDamgaard42/case1/commit/f37be8e6afe6273a7e13d051a7f575af0caccae5) startede [EventPage.jsx](../../src/pages/EventPage.jsx#L12-L39) et nyt fetch-kald ved ændring af `eventId`, men state blev ikke nulstillet først.

Konsekvens:

- Det gamle event kan blive vist, mens det nye event indlæses.
- En gammel fejl eller “ikke fundet”-tilstand kan kortvarigt blive vist for det nye event.
- Det gamle event kan blive hængende, hvis det nye kald fejler.

Abort cleanup findes, men state reset ved route-skift mangler.

Commit [4938707](https://github.com/MikkelDamgaard42/case1/commit/4938707) retter dette ved at remounte EventPage med en route-specifik `key` i [App.jsx](../../src/App.jsx#L8-L12). Det giver frisk event-, loading-, fejl-, not-found- og formularstate, mens AbortController stadig afbryder det gamle request.

Rettelsen er lintet og buildet, men er endnu ikke browserverificeret.

**Status: rettet i kode, browserverifikation mangler.**

### 2. README var tidligere forældet — rettet i dokumentationsbranchen

Før dokumentationsbranchen var README’en ikke synkroniseret med den færdige løsning:

- Den beskriver stadig ingen relation mellem `events` og `registrations` på [README.md](../../README.md#L59).
- Den beskriver stadig duplicatede venuefelter som den aktuelle model på [README.md](../../README.md#L59).
- Den siger, at tilmeldingsformularen kun logger data på [README.md](../../README.md#L108-L114).
- Den omtaler ikke den aktuelle `venues`-relation i opsætningsvejledningen.

Datamodeldokumentationen er nyere og mere korrekt, men README’en er stadig den primære opsætningsvejledning.

README’en er opdateret på `case1-documentation`. Den historiske mangel bevares her som auditspor.

**Status: rettet i dokumentationen.**

### 3. Deployment er ikke verificeret end-to-end

Workflowet indeholder de nødvendige mekanismer:

- Deploy ved push til `main`: [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml#L4-L9)
- Supabase environment variables: [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml#L44-L49)
- SPA fallback via `404.html`: [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml#L51-L54)
- Production base `/case1/`: [package.json](../../package.json#L2-L4)

Der foreligger dog ingen dokumentation for en faktisk succesfuld GitHub Pages-deployment eller browserverifikation af direkte routes efter deployment.

**Status: uafklaret, ikke nødvendigvis en kodefejl.**

## Kravstabel

| Område | I kode | Verificeret | Status |
|---|---|---|---|
| Events fra Supabase REST | HomePage henter events fra REST API | Lint/build | Opfyldt |
| Events → venues | Nested `venue:venues(...)` | Read-only REST-evidens | Opfyldt |
| Registrering gemmes | POST med `name`, `email`, `status`, `eventId` | Ikke browser-/Network-testet i denne audit | Implementeret, ikke fuldt verificeret |
| Registrations → events | Nested `event:events(title,date)` | Read-only REST-evidens | Opfyldt |
| Normaliseret SQL | Foreign keys, venues og `eventId` | SQL-/REST-dokumentation | Opfyldt |
| Legacyfelter fjernet live | Migration 002 og datamodeldokumentation | Dokumenteret af projektet, ikke genkørt her | Uafhængigt dokumenteret |
| Loading/error/empty states | HomePage, EventPage og RegistrationsPage | Lint/build | Opfyldt i kode |
| Event not-found | EventPage | Ikke browser-testet her | Implementeret |
| Async cleanup | `AbortController` på fetch-sider | Lint/build | Opfyldt, men state-reset ved route-skift mangler |
| Formularaccessibility | Labels, email, autocomplete, required, live feedback | Kodeinspektion | Opfyldt i kode |
| Keyboard focus | `:focus-visible` i [styles.css](../../src/styles.css#L39-L45) | Ikke browser-testet | Implementeret |
| Semantisk tabel | `table`, `th`, `scope`, `caption` | Kodeinspektion | Opfyldt |
| Billeder/performance | Alt-tekster og lazy loading | Kodeinspektion | Opfyldt |
| 404-navigation | Link tilbage til forsiden | Kodeinspektion | Opfyldt |
| Deployment | Workflow og SPA fallback | Workflow læst | Ikke end-to-end verificeret |
| Dokumentation | Datamodel/audit findes | Læst | README er delvist forældet |
| Tests | Ingen testscript eller browsertests | `package.json` læst | Mangler |

## Datamodel og audit-evidens

[docs/case1/datamodel-api-check.json](datamodel-api-check.json) dokumenterer:

- 9 events med venue-relation
- 3 registrations med event-relation
- 7 venues
- API-rootens begrænsning med publishable key

Auditfilen dokumenterer kun read-only relationelle GET-kald og udvalgte ID’er. Den verificerer ikke POST-flow, browserfeedback eller deployment.

## Adskillelse mellem fejl og valgfrie forbedringer

### Fejl eller reel risiko

1. EventPage-stateproblemet er rettet i `4938707`, men mangler browserverifikation.
2. Den dokumenterede tilmeldingstest blev udført før de seneste frontendændringer.
3. Production deployment og direkte route-genindlæsning er ikke dokumenteret som faktisk verificeret.

### Valgfrie forbedringer

1. Tilføj en retry-knap til fetch-fejl på de offentlige sider.
2. Tilføj en lille browser smoke test for eventvisning, registrering og `/tilmeldinger`.
3. Dokumentér den faktiske deployment-URL og seneste manuelle Network-test.

## Anbefalet sidste feature branch

Opret én afgrænset branch, eksempelvis `case1-final-verification`, der:

1. Browserverificér state-reset ved eventskift.
2. Gennemfør de resterende manuelle registration- og deploymenttests.

README og datamodeldokumentation er opdateret på `case1-documentation`. Der er ikke behov for nye dependencies, redesign eller yderligere databaseændringer.
