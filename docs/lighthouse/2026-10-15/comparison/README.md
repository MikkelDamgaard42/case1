# Lighthouse: oprindelig prototype og færdig version

Den 15. oktober 2026 kl. 23:24:58–23:26:54 dansk sommertid blev begge versioner målt lokalt under samme forhold. Der blev kørt tre Lighthouse-tests pr. side og version, i alt 12 målinger. Den oprindelige kode blev bygget igen til sammenligningen; baseline er derfor målt efter udviklingsarbejdet, ikke før det begyndte.

Sammenligningen afslørede et layoutskift på eventsiden. Det blev [rettet og målt separat bagefter](../cls-fix/README.md). Tabellen nedenfor viser versionen **før** den rettelse.

## Versioner

- **Oprindelig prototype: `f25fde8`.** Repositoryets første commit indeholder den udleverede kode, den flade datamodel og formularens `console.log` uden lagring. Audit og Git-sammenligninger peger på samme startpunkt. `8b529b2` ændrer base-sti og lockfil, og `5123b7d` tilføjer dokumentation; ingen af dem er en tidligere appversion end rodcommittet. Se [Git-kontrollen](baseline-evidence.txt).
- **Færdig version før CLS-rettelsen: `da11872`.** Den committede version ved sammenligningen. Den lokale, ukommittede formateringsændring i `EventPage.jsx` indgår ikke her. Fuld SHA og buildoplysninger findes i [manifest.json](manifest.json).

Commit-versionen bag underviserens offentlige prototype er ikke verificeret. Sammenligningen gælder repositoryets kode og må ikke læses som en historisk måling af underviserens hosting.

## Medianer af tre målinger

Hver metrik er beregnet som medianen af sine tre råværdier. Lavere LCP, CLS og TBT er bedre; højere scores er bedre.

| Side | Version | Performance | LCP | CLS | TBT | Accessibility | Best Practices | SEO |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Forside | Oprindelig | 83 | 4,640 s | 0 | 0 ms | 100 | 100 | 100 |
| Forside | Færdig før CLS-rettelse | 81 | 5,225 s | 0 | 0 ms | 100 | 100 | 100 |
| Event 9 | Oprindelig | 78 | 5,870 s | 0 | 0 ms | 100 | 100 | 100 |
| Event 9 | Færdig før CLS-rettelse | 56 | 5,830 s | 0,601 | 0 ms | 100 | 100 | 100 |

## Hvad viste sammenligningen?

**Forsiden indlæste færre billeddata, men var ikke hurtigere i målingerne.** Performance faldt fra 83 til 81, og median LCP steg fra 4,640 til 5,225 sekunder. Intervallerne overlappede: 4,582–5,817 sekunder for den oprindelige version og 5,202–5,230 for slutversionen. Den lille scoreforskel kan derfor ikke sikkert forklares med kodeændringerne alene.

Med lazy loading faldt antallet af billedrequests ved den første mobilindlæsning fra ti til seks. Billeddata faldt fra cirka 8,01 til 3,49 MB, og den samlede overførsel fra median 8,115 til 3,589 MB. Det siger ikke noget om den samlede datamængde, hvis brugeren ruller gennem hele siden.

**Eventsiden fik et layoutskift.** CLS steg fra 0 til 0,601 i alle tre gentagelser, og Performance faldt fra 78 til 56. Lighthouse registrerede footeren som det flyttede element. Det voksende indhold under datahentning blev efterfølgende fundet som årsagen og rettet; se [CLS-rettelsen](../cls-fix/README.md).

Eventets LCP var næsten det samme: 5,870 mod 5,830 sekunder. Det store eventbillede var fortsat LCP-elementet. Lighthouse anslog cirka 581 KiB i mulige billedbesparelser i begge versioner.

TBT var 0 ms, og Accessibility, Best Practices og SEO var 100 i alle 12 målinger. Testene kontrollerer indlæsning og automatiske audits, ikke formularlagring, fejlhåndtering eller databasens relationer. En Accessibility-score på 100 dokumenterer ikke fuld WCAG-overholdelse.

## Testopsætning

Versionerne blev bygget i to separate worktrees med `npm ci` fra deres lockfiler. Installerede pakkeversioner var identiske; Node var 24.13.0 og Vite 8.2.1.

Begge production builds brugte `npm run build -- --base=/case1/`. Det gav samme base-sti uden at ændre kildefiler. Miljøværdierne pegede på `http://127.0.0.1:5270/api` med en lokal testnøgle.

Samme server skiftede buildmappe mellem kørslerne. Adresserne var:

- `http://127.0.0.1:5270/case1/`
- `http://127.0.0.1:5270/case1/events/9`

MIME-typer, gzip og `no-store` var ens. Serverens SPA-fallback returnerede HTTP 200.

Lighthouse 13.5.0 og Chrome 155.0.8059.41 blev brugt med mobilprofil 412 × 823, DPR 1,75 og Moto G Power-emulering. Netværket blev simuleret med 150 ms RTT og 1.638,4 Kbps samt 4× CPU-nedskalering. [effective-settings.json](effective-settings.json) viser de ens indstillinger i alle rapporter.

Hver kørsel brugte en ny Chrome-profil uden login eller udvidelser og med nulstillet lager. Målingerne kørte efter hinanden, og versionsrækkefølgen skiftede mellem runderne; se [run-plan.json](run-plan.json). Ingen målinger brugte `--ignore-status-code`.

## Data og begrænsninger

Begge versioner fik de samme ni events fra den oprindelige `starter.sql`, herunder event 9, Søndagsjazz ved åen. En lokal REST-adapter leverede den oprindelige flade datamodel eller den nye relationelle model med samme faste forsinkelse på 100 ms. Slutversionens mindre API-svar blev bevaret. Der blev ikke sendt tilmeldinger under målingerne.

Adapteren er ikke Supabase/PostgREST. Testen måler derfor ikke effekten af databasen, adgangsregler eller det offentlige API. Billederne blev hentet fra Unsplash, og alle billedrequests lykkedes. Eventbilledets størrelse var ens i alle seks eventmålinger; forsidens billeddata varierede lidt. Eksterne billedservere og computerens belastning kan påvirke resultaterne.

Tre lokale målinger pr. side giver et sammenligningsgrundlag under faste indstillinger, men viser ikke oplevelsen hos alle brugere. De lokale medianer er ikke sammenlignet direkte med den offentlige måling.

## Den offentlige eventroute returnerer HTTP 404

[Den offentlige eventadresse](https://mikkeldamgaard42.github.io/case1/events/9) returnerede HTTP 404, selvom browseren viste eventet via SPA-fallbacken. Det stoppede standardtesten. Den særskilte offentlige måling tillod derfor fejlstatus.

Den lokale servers HTTP 200 forklarer, hvorfor de lokale Best Practices- og SEO-scores ikke viser denne fejl. Den senere CSS-rettelse løste layoutskiftet, men ikke HTTP-statussen.

## Rapporter og genkørsel

- [Rå målinger som CSV](runs.csv), [medianer og forskelle](summary.json) og [tidspunkter](results.jsonl).
- [Git-grundlag](baseline-evidence.txt), [build- og datagrundlag](manifest.json) og [kontrol af checkout](preservation-check.json).
- [Lighthouse-indstillinger](effective-settings.json), [billedrequests](network-images.json) og [serverlog](server-requests.jsonl).

HTML- og JSON-rapporter samt Chrome-spor ligger i `reports/`. Testværktøjerne ligger ved siden af denne fil. De oprindelige worktrees var midlertidige og er ikke med i arkivet: genskab dem og deres builds, eller tilpas stierne i værktøjerne før genkørsel. Start derefter `server.mjs` og `run-comparison.mjs` med samme indstillinger. Runneren føjer til `results.jsonl`; gem eksisterende resultater separat før en ny serie, så målingerne ikke blandes.

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
