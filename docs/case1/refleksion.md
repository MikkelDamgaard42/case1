# Refleksion og forretningspotentiale

## Valg

- Jeg prioriterede den centrale handling: en faktisk tilmelding, der gemmes med forbindelse til det valgte event.
- Jeg valgte relationelle tabeller frem for at fortsætte med kopifelter.
- Jeg valgte en lille fælles Supabase utility frem for en større data- eller state-arkitektur.
- Jeg beholdt den eksisterende visuelle retning og arbejdede lokalt med states, semantik og feedback.
- Event-state-rettelsen bruger en route-specifik key, fordi den nulstiller hele lokale state-træet og samtidig lader eksisterende AbortController-cleanup fungere.

## Fravalg

- Authentication og authorization var uden for den leverede case.
- Der er ikke bygget kapacitetsstyring, betaling eller arrangørlogin.
- Der er ikke introduceret nye dependencies eller en større testarkitektur.
- Der er ikke ændret på det eksisterende design.
- Der er ikke påstået målte performance-, konverterings- eller accessibility-resultater.

## Proces

Forbedringerne blev først samlet i en backup-version og derefter rekonstrueret i en lineær branchkæde. Det gør leverancen nemmere at gennemgå, men branchene må ikke beskrives som den oprindelige udviklingsrækkefølge. Flere audits og tests blev udført efter implementeringen.

## Forretningspotentiale

Et kortere og mere pålideligt tilmeldingsflow kan gøre det lettere for en bruger at gå fra opdagelse til handling. Et relationelt arrangøroverblik kan reducere manuel afstemning mellem tilmeldinger og events. En mere robust frontend kan reducere forvirring ved netværksfejl og navigation.

Dette er forventet potentiale, ikke målt effekt. Der findes ingen dokumenterede konverteringstal, brugerinterviews, tidsmålinger eller performancebenchmarks.

## Resterende udfordringer

- Event-state-reset ved langsomt eventskift og fejl → gyldigt event mangler browserverifikation.
- Den dokumenterede tilmeldingstest blev udført før de seneste frontendændringer.
- Deployment blev rapporteret som succesfuld, men den nyeste publicerede version er ikke fuldt browserauditeret.
- Der mangler automatiske browser- og integrationstests.
- Frisk databaseopsætning med `starter.sql` er ikke afprøvet i en tom PostgreSQL-database.
- Fuld accessibility-compliance er ikke dokumenteret.
