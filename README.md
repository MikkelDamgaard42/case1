# Mellemrum

Mellemrum er en React-prototype for en lokal kultur- og eventplatform. Projektet er startpunktet for Case 1 i Product Optimization.

Den primære målgruppe er personer, der ønsker en enkel vej til at opdage og tilmelde sig lokale kulturoplevelser i Aarhus. Arrangører er en sekundær målgruppe, som bruger platformen til at dele events og få overblik over tilmeldinger.

Guiden hjælper dig med at få React-projektet til at køre lokalt og forbinde det til dit eget Supabase-projekt. Du behøver ikke kunne skrive SQL for at følge opsætningen.

[Se den udleverede løsning online](https://cederdorff.com/mellemrum/), hvis du vil udforske prototypen, før du sætter projektet op lokalt.

## Det skal du bruge

- Node.js installeret på din computer
- en Supabase-konto
- projektet åbnet i VS Code

## 1. Installér projektet

Åbn terminalen i projektets mappe, og installér dependencies:

```bash
npm install
```

Vent med at starte appen, til Supabase og `.env` er sat op i de næste trin.

## 2. Datamodel og Supabase-opsætning

Projektet bruger tre relationelle tabeller:

- `venues`: `id`, `name`, `address`, `postalCode`, `city`, `website`
- `events`: eventfelter samt `venueId -> venues.id`
- `registrations`: `id`, `createdAt`, `name`, `email`, `status` samt `eventId -> events.id`

### Frisk database

Til en ny, tom database kan [supabase/starter.sql](supabase/starter.sql) bruges. Den opretter den normaliserede model og indsætter fiktive seed-data. Filen er beregnet til frisk opsætning og bør ikke køres blindt mod den eksisterende Case 1-database.

### Eksisterende database

Til en eksisterende database bruges migrationsfilerne i `supabase/migrations/` i den dokumenterede rækkefølge:

1. `001-require-registration-event.sql` gør `registrations.eventId` obligatorisk efter relationerne er kontrolleret.
2. `002-remove-duplicate-fields.sql` fjerner de gamle kopifelter fra `events` og `registrations`, når data og afhængigheder er kontrolleret.

Kør migrationerne i Supabase SQL Editor, og kontrollér resultaterne med [supabase/checks/datamodel-audit.sql](supabase/checks/datamodel-audit.sql). Projektet ændrer ikke databasen automatisk fra frontend.

![SQL-koden indsat i Supabase SQL Editor](docs/images/setup/paste-sql-in-editor.webp)

Hvis Supabase viser advarslen på billedet nedenfor, skal du vælge **Run without RLS** for denne starter.

![Supabase-advarsel med knappen Run without RLS](docs/images/setup/run-without-rls.webp)

Det er et bevidst scopevalg i Case 1: Authentication og authorization indgår ikke, og den interne side skal derfor ikke adgangsbeskyttes. Brug kun de udleverede eller andre fiktive testdata – aldrig rigtige personoplysninger.

### Kontrollér resultatet

Åbn **Table Editor**, og vælg tabellen `events`. Du bør kunne se ni events.

![Events i Supabase Table Editor](docs/images/setup/table-events.webp)

Vælg derefter tabellen `registrations`. Her bør du kunne se de to starttilmeldinger.

![Tilmeldinger i Supabase Table Editor](docs/images/setup/table-registrations.webp)

Du kan også åbne **Database → Schema Visualizer**. Her skal du kunne se relationerne `venues -> events -> registrations`. Event- og tilmeldingsdata hentes via deres fremmednøgler i frontend i stedet for via de tidligere duplicatede felter.

![Events og registrations i Supabase Schema Visualizer](docs/images/setup/schema-visualiser.webp)

## 3. Forbind React-projektet til Supabase

Kopiér først projektets eksempel på en miljøfil:

```bash
cp .env.example .env
```

Du kan også duplikere `.env.example` i VS Code og omdøbe kopien til `.env`.

Åbn derefter `.env` i VS Code. Du skal indsætte din Supabase API URL og din publishable key.

### Find API URL

Gå til **Integrations → Data API** i Supabase, og kopiér værdien under **API URL**.

![API URL i Supabase Data API](docs/images/setup/copy-api-url.webp)

Fjern den afsluttende `/`, hvis den følger med. Værdien skal ende på `/rest/v1`.

### Find din publishable key

Gå til **Project Settings → API Keys**, og kopiér projektets **Publishable key**. Brug ikke en key fra området **Secret keys**.

![Publishable key i Supabase](docs/images/setup/copy-api-key.webp)

Din `.env` skal nu have denne form:

```bash
VITE_SUPABASE_URL=https://dit-projekt.supabase.co/rest/v1
VITE_SUPABASE_APIKEY=din-publishable-key
```

Gem filen. `.env` er allerede tilføjet til `.gitignore` og skal ikke pushes til GitHub.

## 4. Start appen og kontrollér brugerflows

Kør udviklingsserveren:

```bash
npm run dev
```

Åbn den adresse, terminalen viser. Det er normalt [http://localhost:5173](http://localhost:5173).

Kontrollér, at:

- forsiden viser events fra Supabase
- du kan åbne en eventside
- eventdetaljen viser venue-data fra den relaterede `venues`-række
- en gyldig tilmelding sender `name`, `email`, `status: "Ny"` og det aktuelle `eventId` til Supabase
- siden `/tilmeldinger` viser eventtitel og dato fra den relaterede event
- invalid input, loading, succes og fejl giver forståelig feedback

Tilmeldingsformularen gemmer nye tilmeldinger via Supabase REST API. Den sender ikke de tidligere `eventTitle`, `eventDate` eller `eventLocation`-felter.

## 5. Deploy appen

Når løsningen virker lokalt, skal du deploye den til GitHub Pages. Projektet indeholder allerede et GitHub Actions-workflow, som bygger og deployer ved push til `main`.

Før du pusher:

1. Kontrollér, at `base` i `package.json` svarer til navnet på dit GitHub-repository.
2. Opret GitHub Environment `github-pages-deployment`.
3. Tilføj `VITE_SUPABASE_URL` og `VITE_SUPABASE_APIKEY` som **Environment variables** i dette environment.
4. Kør `npm run lint` og `npm run build` lokalt.
5. Push til `main`, og følg deploymenten under **Actions** på GitHub.

Når workflowet er gennemført, skal du åbne den deployede løsning og kontrollere de samme brugerflows som lokalt. Afprøv også direkte links og genindlæsning af undersider.

Se den gennemgåede proces på Canvas: [Web App-forbedringer og teknisk fundament – 19/08/2026](https://eaaa.instructure.com/courses/30922/pages/race-product-optimization-web-app-forbedringer-og-teknisk-fundament-19-08-2026).

## Hvis appen ikke viser data

- Kontrollér, at både `events` og `registrations` findes i Supabase.
- Kontrollér, at API URL ender på `/rest/v1` uden en ekstra `/`.
- Kontrollér, at du har kopieret din publishable key og ikke en secret key.
- Genstart `npm run dev`, hvis du har ændret `.env`, mens serveren kørte.
- Se efter fejl i browserens Console og Network-panel.

## Ruter

- `/` – eventoversigt
- `/events/:eventId` – eventdetalje og tilmelding
- `/om` – om Mellemrum
- `/tilmeldinger` – internt overblik

## Arbejdsform

Arbejd med én sammenhængende forbedring ad gangen i en tydeligt navngivet feature branch. Lav forståelige commits, verificér ændringen, og merge derefter branchen til `main`.

Arbejd ikke direkte på `main`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```
