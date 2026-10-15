# Mellemrum — rekonstrueret før/efter-måling

Målt 15. oktober 2026 kl. **23:24:58–23:26:54, Europe/Copenhagen (CEST)**. Der er gennemført 12 nye lokale Lighthouse-kørsler: tre pr. side og version. Tidspunkter er Lighthouse fetchTime, ikke rapportens skrivetid. Dette er en efterfølgende rekonstruktion, ikke en historisk måling fra før udviklingsarbejdet.

## Versioner og begrundelse

- **Baseline: `f25fde8dec21b5d13fcca7bd7002d76de9c6cea1` — Initial commit.** Repositoryets rodcommit indeholder den udleverede prototype, den flade datamodel og formularens `console.log` uden lagring. Den eksisterende audit og replay-dokumentation identificerer samme commit som oprindelig kildekode/startpunkt. Den senere `8b529b2` ændrer kun base-sti og lockfil; der er ingen ændringer i src, index.html, vite.config.js eller schema mellem de to. `5123b7d` tilføjer senere baseline-dokumentation, men har identiske app-/buildfiler med rodcommittet. Derfor vælges det oprindelige rodcommit, ikke en efterfølgende dokumentationscommit eller en allerede optimeret version.
- **Færdig version: `da11872` — Record successful replay deployment and live registration reload.** Den fulde SHA står i manifest.json. Det er det eksisterende checkout og origin/main's committede version ved undersøgelsen. Den ukommittede ændring i src/pages/EventPage.jsx er bevidst ikke inkluderet.
- Det præcise commit bag underviserens offentlige prototype kan ikke fastslås alene fra disse lokale Git-data. Baseline-valget dokumenterer repositoryets oprindelige udleverede kode, ikke en verificeret historisk online-deployment.

## Medianer af tre målinger

Hver metrik er beregnet separat som median af de tre råværdier. LCP og TBT er tidsmål; lavere er bedre. Scores er ud af 100; højere er bedre.

| Side | Version | Performance | LCP | CLS | TBT | Accessibility | Best Practices | SEO |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Forside | Baseline | 83 | 4,640 s | 0 | 0 ms | 100 | 100 | 100 |
| Forside | Færdig | 81 | 5,225 s | 0 | 0 ms | 100 | 100 | 100 |
| Event 9 | Baseline | 78 | 5,870 s | 0 | 0 ms | 100 | 100 | 100 |
| Event 9 | Færdig | 56 | 5,830 s | 0,601 | 0 ms | 100 | 100 | 100 |

## Kort før/efter-vurdering

- **Forsiden er ikke hurtigere på de målte medianer:** Performance falder 2 point, og LCP stiger 0,585 s. Baselinens LCP varierer dog fra 4,582 til 5,817 s og overlapper slutversionens interval 5,202–5,230 s. Tre kørsler og eksterne billeder giver ikke grundlag for at tilskrive den lille scoreforskel sikkert til kodeændringer alene.
- **Der er en konkret reduktion i indlæste billeddata på forsiden:** 10 billedrequests mod 6, cirka 8,01 MB mod 3,49 MB i billedressourcer. Den færdige version har loading="lazy" på eventkortene; baseline indlæser dem uden lazy loading. Samlet overført datamængde falder fra median 8,115 MB til 3,589 MB. Det er færre bytes ved denne indledende mobilindlæsning, ikke bevis for en hurtigere LCP eller lavere total ved gennemscrollning af hele siden.
- **Eventsiden er tydeligt dårligere på layoutstabilitet:** Performance falder 22 point, og CLS går fra 0 til 0,601 i alle tre gentagelser. Lighthouse peger på footer.site-footer som den forskudte node. Slutversionen viser footer under eventets loadingtilstand, mens baseline returnerer null indtil eventet er hentet; det peger på indlæsningslayoutet som mulig forklaring. Ingen rettelse er udført.
- Eventets LCP falder kun cirka 40 ms og vurderes i praksis som omtrent uændret. Det store eventbillede er fortsat LCP-element, og Lighthouse estimerer cirka 581 KiB i mulige billedbesparelser i begge versioner.
- **Uændret:** TBT er 0 ms, og Accessibility, Best Practices og SEO er 100 i alle 12 kørsler. Automatiske accessibility-scores dokumenterer ikke fuld WCAG-overholdelse. Disse navigationstests måler ikke korrekt formularlagring, fejlhåndtering, tastaturflows eller databasens normalisering.

## Ens testopsætning

- En separat lokal Git-kopi med to detached worktrees under denne mappe. Det eksisterende case1-checkout bruges kun til læsning. Ingen kildefiler eller lockfiler er ændret i worktrees.
- `npm ci` fra hver versions lockfil. De installerede dependency-versioner er identiske. Node 24.13.0, Vite 8.2.1 i begge builds.
- Begge er **production builds** med `npm run build -- --base=/case1/`. Samme CLI-base tilsidesætter baseline-pakkens /mellemrum/ uden at redigere filer. Samme build-env: VITE_SUPABASE_URL=http://127.0.0.1:5270/api og en ufølsom lokal dummy-API-key.
- Samme skrivebeskyttede statiske server, origin og port for begge: **http://127.0.0.1:5270/case1/** og **http://127.0.0.1:5270/case1/events/9**. Serveren skifter udelukkende dist-rod mellem kørslerne. Identiske MIME-, gzip- og no-store-regler; lokale SPA-dokumenter returnerer 200.
- Lighthouse **13.5.0**, installeret Chrome **155.0.8059.41** (rapportens host-UA: HeadlessChrome/155.0.0.0). Navigation mode, mobilprofil **412 × 823**, device scale factor **1,75**, Moto G Power-emulering. Simuleret throttling: **150 ms RTT, 1.638,4 Kbps, 4× CPU**. Samme effektive konfiguration er maskinelt kontrolleret i alle 12 rapporter; se effective-settings.json.
- Ny midlertidig Chrome-profil pr. kørsel, ingen udvidelser/login, normal storage reset. Ingen ignore-status-code, score- eller audit-undtagelser. Ingen parallelle målinger. Versionsrækkefølgen skifter mellem runderne; se run-plan.json. Der er ikke udført ændringer i kildekode eller deployment.

## Data og begrænsninger

- Identiske ni events og samme event 9, **Søndagsjazz ved åen**, udtrukket fra f25fde8:supabase/starter.sql. Samme titler, datoer, beskrivelser, venuedata, priser og originale billed-URL'er. Begge eventvisninger er kontrolleret, og viewportbilleder fra runde 2 er gemt.
- En skrivebeskyttet lokal REST-fixture leverer baseline-felterne fladt og slutversionens venue som et relateret objekt. Slutversionens select-projektion respekteres, så dens mindre API-svar bevares. Begge får en fast **100 ms adapterforsinkelse**. Ingen migrationer, live-dataændringer eller formularindsendelser udføres.
- Denne adapter er **ikke Supabase/PostgREST** og måler ikke database-, RLS-, DNS-, TLS-, CORS- eller live-netværksperformance. Normaliseringens eventuelle servereffekt er ikke dokumenteret af denne test.
- De oprindelige billeder hentes stadig eksternt fra Unsplash. Alle målte requests lykkedes; eventbilledets resourceSize var identisk på tværs af alle seks eventkørsler. En lille variation i baselinens samlede billedbytes blev observeret på forsiden. CDN-responser og øvrig maskinbelastning er ikke fuldt kontrollerede. Resultaterne er laboratoriemålinger med tre observationer, ikke field data eller statistisk sikker kausal effekt.
- Lokal localhost/HTTP, kontrollerede data, base-override og lokale serverheaders gør forholdene ens mellem versionerne, men de er ikke identiske med offentlig hosting. Ingen af medianerne sammenlignes med den tidligere offentlige måling.

## Særskilt deploymentfund: offentlig HTTP 404

Den offentlige eventadresse https://mikkeldamgaard42.github.io/case1/events/9 returnerede HTTP 404 ved den tidligere offentlige kontrol, selvom SPA-fallbacken viser eventet. Det stoppede en normal Lighthouse-navigation; en separat diagnostisk kørsel måtte tillade fejlstatus. Dette er et **fortsat særskilt deploymentfund**. Den lokale servers 200-fallback skjuler det og forklarer, hvorfor lokale Best Practices/SEO-scores på 100 ikke løser eller afkræfter den offentlige 404. Ingen deploymentændring er foretaget.

## Rapporter og reproduktion

- [Rå målinger som CSV](runs.csv), [medianer og differencer som JSON](summary.json), [alle måletidspunkter](results.jsonl).
- [Baseline-begrundelse fra Git](baseline-evidence.txt), [build/dependency/fixture-manifest](manifest.json), [kontrol af uændret checkout](preservation-check.json).
- [Effektiv Lighthouse-konfiguration](effective-settings.json), [billedrequests pr. kørsel](network-images.json), [serverlog](server-requests.jsonl).
- HTML/JSON-rapporter, Chrome-spor og DevTools-log ligger under reports/. Data og måleværktøjer ligger ved siden af denne fil. Kør server.mjs og derefter run-comparison.mjs for at gentage efter builds; gentag ikke runneren uden først at flytte/tømme dens eksisterende resultatfiler, da den tilføjer til results.jsonl. Der ændres ikke i appkoden.

### Forside

| Runde | Baseline | Færdig |
| --- | --- | --- |
| 1 | [HTML](reports/baseline-home-1.report.html) · [JSON](reports/baseline-home-1.report.json) | [HTML](reports/final-home-1.report.html) · [JSON](reports/final-home-1.report.json) |
| 2 | [HTML](reports/baseline-home-2.report.html) · [JSON](reports/baseline-home-2.report.json) | [HTML](reports/final-home-2.report.html) · [JSON](reports/final-home-2.report.json) |
| 3 | [HTML](reports/baseline-home-3.report.html) · [JSON](reports/baseline-home-3.report.json) | [HTML](reports/final-home-3.report.html) · [JSON](reports/final-home-3.report.json) |

### Event 9

| Runde | Baseline | Færdig |
| --- | --- | --- |
| 1 | [HTML](reports/baseline-event-9-1.report.html) · [JSON](reports/baseline-event-9-1.report.json) | [HTML](reports/final-event-9-1.report.html) · [JSON](reports/final-event-9-1.report.json) |
| 2 | [HTML](reports/baseline-event-9-2.report.html) · [JSON](reports/baseline-event-9-2.report.json) | [HTML](reports/final-event-9-2.report.html) · [JSON](reports/final-event-9-2.report.json) |
| 3 | [HTML](reports/baseline-event-9-3.report.html) · [JSON](reports/baseline-event-9-3.report.json) | [HTML](reports/final-event-9-3.report.html) · [JSON](reports/final-event-9-3.report.json) |
