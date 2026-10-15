# Teknisk audit — sammenholdt med trin 1–6

Suppleret 15. oktober 2026 efter at underviserens fulde auditskabelon blev indsat i samtalen. Dette er en efterfølgende strukturering af dokumenterede fund, ikke en påstand om, at trin 1–5 blev udført før den oprindelige implementering.

## 1. Afgræns løsningen

**Formål:** Mellemrum samler lokale kulturoplevelser i Aarhus. Primær målgruppe er personer, som vil finde og tilmelde sig events. Sekundær målgruppe er arrangører, som skal kunne se tilmeldinger med relevante eventdata.

**Undersøgte flows:** eventoversigt → eventdetalje; eventdetalje → tilmelding → intern oversigt. Lokale tests og en senere onlinekontrol er beskrevet i [tilmeldingsflow](tilmeldingsflow-verifikation.md) og [deploymentstatus](deployment-status.md).

**Scope:** React-datahentning, UI-states, formular, intern oversigt, datamodel, API-organisering og deployment. Authentication/authorization, betaling, kapacitetsstyring og større redesign er fravalgt. Ingen fuld skærmlæseraudit eller performancebenchmark er udført.

**Procesforbehold:** Der findes efterfølgende lokale og onlinekontroller, men ikke en dokumenteret komplet baseline af begge versioner før de oprindelige ændringer. Første arbejdspas med to flows og tre fund er ikke dokumenteret som gennemført på det foreskrevne tidspunkt.

## 2. Baseline og efterprøvelig evidens

- Oprindelig kildekode: `f25fde8`. Deploymentforberedelse: `8b529b2`.
- Samlet tidligere forbedringsversion: `484464f`, senere rekonstrueret i branches.
- Før state-reset: `f37be8e`; efter: `4938707`.
- Git-diffs kan efterprøves med `git diff f25fde8 33b65a8 -- src/pages/EventPage.jsx` og `git diff f37be8e 4938707 -- src/App.jsx`.
- SQL Editor-resultater før og efter de nyere migrationer er gengivet i [datamodeldokumentationen](datamodel.md).
- [Evidensoversigten](evidensoversigt.md) angiver billedernes oprindelse og begrænsninger.

Der foreligger ingen gentaget Lighthouse-baseline fra den oprindelige deployede produktionsversion under dokumenterede forhold. Historiske målinger, keyboard-tests og Network-optagelser må ikke konstrueres efterfølgende som oprindelig baseline.

## 3. Undersøgelse af relevante områder

| Fokusområde | Undersøgelse og resultat | Begrænsning |
|---|---|---|
| React/kodekvalitet | Gentaget API-konfiguration samlet i utility. Afledt antal vises med registrations.length. Route-specifik key håndterer state pr. event. | Ingen påstand om fuld arkitekturaudit af alle komponenter. |
| Robusthed | HTTP-kontrol, tekniske errors, loading/empty/error/not-found og abort-cleanup indført. Normal POST og tidligere afbrudt POST testet. | Seneste fejlsituationer og langsomme requests mangler fuld browsertest. |
| UI/accessibility | Labels, email/required/autocomplete, tabelsemantik, live feedback og fokusstile gennemgået i kode. | Samlet keyboardflow, skærmlæser, route-fokus og dynamisk document.title er ikke dokumenteret som verificeret. |
| Datamodel/Supabase | Relationer, NOT NULL, kopifelter og rækkeantal kontrolleret i SQL; relationelle GET-kald udført. | Frisk opsætning i tom database mangler test. |
| Performance | Afgrænsede REST-selects og lazy loading på egnede billeder implementeret. Lokal filtrering undgår et nyt API-kald pr. søgning i den lille eventliste. | Ingen målt effekt eller dokumenteret oprindelig beslutning om lokal kontra serverfiltrering. |
| Deployment | Build bestod; Actions-success rapporteret; direkte eventlink/genindlæsning og normalt tilmeldingsflow kontrolleret online. | Ikke alle routes, assets, Console og Network er fuldt kontrolleret online. |

## 4. Registrerede fund

Tabellen er rekonstrueret fra dokumenteret kode og resultater. Kolonnen med verifikation angiver en efterprøvelig kontrol og dens faktiske status, ikke en oprindelig testplan.

| Område | Fund og evidens | Konsekvens | Forslag/udført løsning | Prioritet | Verifikation og status |
|---|---|---|---|---|---|
| Tilmelding | f25fde8: handleSubmit logger input; diff til 33b65a8 viser POST | Ingen gemt tilmelding fra formularen | POST med eventId og feedback | Høj | Gyldig tilmelding → succes → relateret række. Udført lokalt på tidligere version og senere online. |
| Data | Start-SQL gentager venue- og eventdata; SQL-kontrol viste nullable eventId | Risiko for uenige kopier og tilmelding uden event | Relationer, obligatorisk eventId og fjernelse af kopifelter | Høj | SQL-kontrol: ingen forskelle før fjernelse; 9/7/3 rækker og relationer bevaret efter. Udført. |
| Robusthed | Startsidernes GET-kald mangler response.ok/catch og eksplicitte states | Netværksfejl kan give tom/misvisende side | Fælles utility, states og cleanup | Høj | Afbrudt POST gav fejlfeedback i tidligere version. Seneste GET-fejl/empty/loading mangler browserverifikation. |
| Accessibility | Startformularens emailtekst er span; oversigten bruger div-rækker | Svagere programmatisk sammenhæng og tabelnavigation | Labels, semantisk tabel og feedback | Middel | Kodeinspektion udført; samlet keyboard-/skærmlæsertest mangler. |
| React-state | f37be8e genbruger eventstate ved ændring af eventId | Gammelt indhold/feedback kan stå under nyt id | Key pr. eventId i 4938707 | Middel | Lint/build bestået ifølge rapport. Langsom navigation og fejl → gyldigt event mangler browsertest. |
| Vedligeholdelse | API-opsætning gentages på tre sider | Rettelser skal gentages flere steder | Fælles request-funktion | Middel | Kodegennemgang og build; normalt POST fungerer online. |

## 5. Prioritering og færdigkriterier

Centrale krav fik højeste prioritet: gemt tilmelding og konsistente relationer. De understøtter både brugernes handling og arrangørernes overblik. Robusthed blev prioriteret over visuelle ændringer; en lille utility og lokale semantiske rettelser begrænser implementeringsrisiko og vedligeholdelse.

| Forbedring | Færdigkriterium | Status |
|---|---|---|
| Datamodel | Kopier kontrolleret/fjernet, relationer virker, eventId obligatorisk og rækker bevaret | Dokumenteret opfyldt |
| Normalt tilmeldingsflow | Valgt event → gemt tilmelding → korrekt event/dato i oversigt | Dokumenteret opfyldt online |
| Robust UI | Korrekt loading/fejl/tom/not-found ved kontrollerede svar på seneste version | Implementeret; ikke fuldt runtime-verificeret |
| Accessibility | Korrekt semantik samt gennemført centralt keyboardflow | Semantik implementeret; keyboardflow ikke dokumenteret |
| Event-state | Ingen gammel state ved langsomt skift, not-found eller tidligere feedback | Implementeret; specifik browserverifikation mangler |
| Deployment | Build/deploy samt centrale onlineflows og direkte route | Centrale kontroller dokumenteret; ikke en fuld siteaudit |

**Afvigelse fra den foreskrevne Git-proces:** Flere oprindelige ændringer blev samlet før den efterfølgende lineære branchopdeling. Branchene blev ikke alle udviklet fra en løbende opdateret main med individuel merge mellem hver forbedring. Den samlede kæde blev til sidst fast-forwardet til main. Den rekonstruerede historik er nyttig, men opfylder ikke i sig selv skabelonens oprindelige rækkefølge. Historikken omskrives ikke for at skjule afvigelsen.

## 6. Effekt, værdi og refleksion

Problem, løsning, verifikation og værdi er beskrevet pr. forbedring i [forbedringsoversigten](forbedringsoversigt.md). Valg, fravalg, proces og forretningspotentiale findes i [refleksionen](refleksion.md).

Dokumenteret resultat: relationel model uden de gamle kopifelter, obligatorisk eventtilknytning, bevarede data og et gennemført normalt tilmeldingsflow på den publicerede løsning. Bedre konvertering, sparet administrationstid, fuld accessibility og performancegevinster er ikke målt. Manglende tests markeres som begrænsninger, ikke som gennemførte resultater.
