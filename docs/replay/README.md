# Ny optimeringsrunde — startet 15. oktober 2026

Dette er en reel ny gennemgang fra f25fde8 efter et tidligere gennemført projekt. Den tidligere løsning bruges som kendt reference, ikke som nyopdaget arbejde. Oprindelig main, live Supabase, stash, lokale ændringer og portfolio bevares.

## Trin 1–2: scope og baseline før nye kodeændringer

Formål/målgrupper: lokale eventbesøgende og sekundært arrangører. Scope: eventvisning, tilmelding, arrangøroverblik, datamodel, robuste states, accessibility og deployment. Betaling/login/kapacitet og redesign er udenfor.

Lokal frontend: http://127.0.0.1:5190, originalt commit f25fde8. Dependencies installeret med npm ci fra original lockfile. Node v24.13.0, Vite 8.2.1. Lint og build bestod før ændringer.

Databasen er isoleret PGlite (PostgreSQL) med original starter.sql og fiktive seed-data. Lokal HTTP-adapter simulerer de anvendte REST-endpoints. Det er ikke Supabase/PostgREST og beviser ikke Supabase-konfiguration, RLS eller hosting. Ingen ændringer i live Supabase.

To flows udført før ændringer: (1) eventoversigt → event 9 → indsendelse af formular, som kun loggede Object i console og beholdt input; databasen havde stadig 2 tilmeldinger. (2) direkte intern oversigt viste begge seed-tilmeldinger. Kontrolleret GET-fejl (503) gav eventside uden indhold/feedback ud over navbar.

Onlinebaseline: udleveret https://cederdorff.com/mellemrum/ indlæste 9 events ved browserkontrol. Screenshot gemt. Ingen testtilmelding sendt til underviserens løsning. Onlineversionens commit-identitet kan ikke fastslås her.

## Trin 3–5: fund, prioritering og færdigkriterier FØR implementering

| Område | Fund/evidens | Konsekvens | Planlagt løsning | Prioritet | Verifikation/færdigkriterium |
|---|---|---|---|---|---|
| Data | starter.sql gentager venue/eventfelter; 4 events bruger gentagne venues; baseline-db.json | Dobbeltvedligeholdelse og ingen eventrelation | Additive relationer først; fjern kopier efter frontendtilpasning | Høj | Migration på original DB; 9 events/7 venues/2 tilmeldinger med relationer; constraints testet |
| Tilmelding | EventPage console.log; browser og DB viser ingen ny række | Central handling er ikke funktionel | POST og relationelle læsninger | Høj | Browser sender til event 9, success og ny korrekt relation i oversigt efter reload |
| Robusthed | GET 503 giver tom eventside, baseline-fetch-error.png | Ingen forklaring eller næste skridt | Shared utility, states, cleanup | Høj | Kontrolleret 503, tomt svar, ukendt id, langsomt svar og afvist POST giver korrekte states |
| Accessibility | E-mailfelt uden label; oversigt er div; før-screenshots og kode | Hjælpemidler mangler sammenhæng | Labels, feedback, tabel og fokus | Middel | DOM-semantik og centralt keyboardflow; ingen påstand om fuld compliance |
| React-state | Kendt fund fra tidligere audit: eventId genbruger state | Tidligere indhold/feedback kan hænge ved | Remount per eventId | Middel | Same-session eventskift med tidligere formularstate nulstilles |
| Deployment | Oprindelig base /mellemrum/ matcher ikke case1-repo | Assets/routes kan ramme forkert | Bevar kendt /case1/-konfiguration | Før publicering | Production preview og direkte route/reload; senere eksisterende live deployment sammenholdes |

Arbejdsrækkefølge: audit → datamodel (additiv) → POST + relationelle læsninger → robusthed → accessibility → state-reset → samlet kontrol. Hver branch oprettes fra opdateret case1-replay-main og merges først efter dokumenteret test. Integrationsbranchen er adskilt fra det oprindelige main for at undgå historikomskrivning og liveændringer.

## Evidens

Baseline-billeder: evidence/baseline-home.png, baseline-form.png, baseline-registrations.png, baseline-fetch-error.png og baseline-original-online.png. Databasekontrol: evidence/baseline-db.json. Netværkslog: evidence/network.jsonl (GET/POST, status og id'er; ingen credentials).

## Trin 6

Udfyldes på hver feature branch efter faktisk implementering og test. Efterfølgende resultater må ikke skrives ind som oprindelig baseline.
