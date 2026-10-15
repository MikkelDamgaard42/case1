# 2. Tilmelding og arrangøroverblik

## Ændring

Formularens konsollog blev erstattet med en POST-request med `name`, `email`, `status` og `eventId`. Formularen validerer input, viser feedback og deaktiverer knappen, mens svaret afventes.

Events henter stedoplysninger gennem relationen til `venues`. Oversigten henter eventtitel og dato gennem tilmeldingens eventrelation. Efter frontendtilpasningen fjernede migration 002 kopifelterne. Den tidligere implementering i `b534398` blev brugt som reference.

## Test og resultat

Testen blev kørt efter datamodelændringen og før merge:

- Event 9 viste Åboulevarden med adresse.
- Den fiktive tilmelding “Replay Test” gav en succesbesked og tømte felterne.
- Oversigten gik fra to til tre tilmeldinger. Den nye række viste Søndagsjazz ved åen, 15.11.2026 og status Ny.
- Rækken blev hentet igen efter genindlæsning.
- Netværksloggen viste POST 201 med `eventId=9` og efterfølgende GET.

Billeder: [succesbesked](evidence/registration-success.png) og [oversigt efter genindlæsning](evidence/registration-after-reload.png).

Frisk databaseopsætning og databasebegrænsninger blev testet igen. Lint og build bestod. Denne test brugte den lokale adapter og ændrede ikke Supabase; den senere [onlinetest](05-production.md#kontrol-efter-publicering) kontrollerede tilmeldingen mod Supabase.

Brugeren kan nu gemme sin tilmelding, og arrangøren ser den sammen med det rigtige event uden kopierede eventdata.
