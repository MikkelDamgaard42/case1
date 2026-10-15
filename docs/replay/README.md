# Mellemrum: ændringer og test

Mellemrum blev videreudviklet fra den udleverede React-prototype. Målet var at få tilmeldinger gemt korrekt, samle gentagne oplysninger i databasen og give brugeren feedback ved ventetid og fejl.

Den første implementering var utilstrækkeligt dokumenteret. Kodeændringerne blev derfor gennemført igen fra startkoden den 15. oktober 2026, med audit før ændringerne og test før hver merge. Erfaringer og løsninger fra første implementering indgik i arbejdet. Denne mappe dokumenterer den gentagne implementering.

## Udgangspunkt og prioritering

Startkoden er commit `f25fde8`; audit og baseline blev gemt i `5123b7d`.

Ved den første lokale kontrol viste oversigten ni events. Formularen på event 9 skrev kun input i konsollen: der blev ikke sendt en POST-request, og databasen havde fortsat to tilmeldinger. En simuleret GET-fejl med status 503 efterlod eventsiden uden indhold eller fejlbesked.

| Område | Problem | Prioritet og plan | Kontrol |
| --- | --- | --- | --- |
| Datamodel | Stedoplysninger gentages på events, og tilmeldinger har kopier af eventdata. | Høj: opret relationer, tilpas frontend og fjern kopifelter. | Migration, frisk database og fremmednøgler. |
| Tilmelding | Formularen gemmer ikke input. | Høj: gem via POST og knyt tilmeldingen til eventet. | Tilmelding og korrekt event i oversigten efter genindlæsning. |
| Fejlhåndtering | Et fejlet API-kald giver en tom eventside. | Høj: fælles API-håndtering og tydelige tilstande. | Fejl, tomme svar, ukendt event og forsinkede svar. |
| Tilgængelighed | E-mailfeltet mangler en etiket, og oversigten er bygget med div-elementer. | Middel: feltetiketter, semantisk tabel og fokusmarkering. | Formularfelter, tabelstruktur og centralt tastaturflow. |
| Eventskift | Tidligere formularfeedback kan følge med til et andet event. | Middel: nulstil siden ved ændret `eventId`. | Skift mellem events i samme React-session. |
| Publicering | Startprojektets `/mellemrum/` passer ikke til dette repository. | Før publicering: brug `/case1/` til build og preview. | Direkte eventlink, genindlæsning og tilmelding. |

## Gennemførte ændringer

1. [Datamodel og relationer](01-data-model.md)
2. [Tilmelding og arrangøroverblik](02-registration-flow.md)
3. [Fejlhåndtering og tilgængelighed](03-robustness-accessibility.md)
4. [Nulstilling ved eventskift](04-event-state.md)
5. [Preview og kontrol af den publicerede løsning](05-production.md)

Hver del blev testet på sin feature branch og derefter flettet ind i `case1-replay-main`. Den tidligere historik blev bevaret ved merge til `main`.

| Feature branch | Ændring og test | Merge |
| --- | --- | --- |
| case1-replay-data-model | `71c57c0` | `f9573db` |
| case1-replay-registration-flow | `5b97379` | `e6c2e91` |
| case1-replay-robust-fetch | `928d470` | `7e1f716` |
| case1-replay-event-reset | `dc923a2` | `4a10391` |
| case1-replay-deployment | `4456639` | `8c5eb29` |

Integrationen med den tidligere historik er `c3be5c4`. Før preview-rettelsen var appfilerne identiske med den tidligere løsning; preview-rettelsen ændrede `vite.config.js`.

## Testmiljø og dokumentation

De kontrollerede fejltests brugte PGlite med den oprindelige `starter.sql` og fiktive testdata. En lokal HTTP-adapter efterlignede de REST-kald, som appen bruger. Det gjorde det muligt at styre fejl og forsinkelser. Testen kontrollerer appens adfærd og databaserelationer, men erstatter ikke en test af Supabase og dets adgangsregler. Den publicerede tilmelding blev derfor også kontrolleret separat mod Supabase; se [publiceringstesten](05-production.md#kontrol-efter-publicering).

Frontend kørte på `http://127.0.0.1:5190`. Pakker blev installeret med `npm ci` fra den oprindelige lockfil. Node var 24.13.0 og Vite 8.2.1; lint og build bestod før ændringerne.

Baseline-billederne ligger i `evidence/`: `baseline-home.png`, `baseline-form.png`, `baseline-registrations.png`, `baseline-fetch-error.png` og `baseline-original-online.png`. Databasekontrollen findes i `baseline-db.json` og netværkskald i `network.jsonl`.

Underviserens [offentlige prototype](https://cederdorff.com/mellemrum/) viste også ni events. Der blev ikke sendt tilmeldinger til den. Git-versionen bag den offentlige prototype er ikke verificeret.

## Resultat og næste skridt

Tilmeldinger gemmes og vises med det rigtige event. Datamodellen bruger relationer, og brugeren får feedback ved ventetid, fejl og manglende events. Det kan give færre afbrudte tilmeldinger og mindre dobbeltvedligeholdelse; effekten er ikke målt.

[Lighthouse-sammenligningen og den efterfølgende CLS-rettelse](../lighthouse/2026-10-15/README.md) dokumenterer den senere kontrol af indlæsning og layoutstabilitet. HTTP 404 på den offentlige eventroute er fortsat en uløst publiceringsfejl. Betaling, login, kapacitetsstyring og visuelt redesign indgik ikke. En fuld skærmlæsertest er ikke gennemført.

## Migrationer

`001-add-relations.sql` er beregnet til den oprindelige datamodel i det isolerede testmiljø. Den skal ikke køres på den allerede normaliserede database. Migrationerne køres ikke automatisk ved publicering. Se de enkelte filer og databasekontrollerne før manuel kørsel.
