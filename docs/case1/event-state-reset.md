# Event state reset

## Problem

Før-commit: `f37be8e6afe6273a7e13d051a7f575af0caccae5`.

`EventPage` havde allerede `AbortController`, men state fra det forrige `eventId` blev ikke nulstillet, når brugeren navigerede til et andet event. `event`, `isLoading`, `loadError`, `eventNotFound`, formularfelter og feedback kunne derfor repræsentere det tidligere event, mens det nye request kørte eller efter en fejl.

## Konsekvens

- Det gamle event kunne blive vist under indlæsning af et nyt event.
- En tidligere fejl eller not-found-tilstand kunne hænge ved.
- Formularens tidligere succes- eller fejlfeedback kunne se ud til at høre til det nye event.
- Det gamle event kunne i praksis være grundlaget for en tilmelding, hvis brugeren nåede at interagere under skiftet.

## Løsning

I [App.jsx](../../src/App.jsx#L8-L12) får `EventPage` en route-specifik `key` baseret på `eventId`. Når id’et skifter, remountes siden, så følgende lokale state starter forfra, før det nye request kører:

- `event`
- `isLoading`
- `loadError`
- `eventNotFound`
- `name` og `email`
- `submissionStatus`
- `submissionMessage`

Den eksisterende `AbortController` og kontrollen mod opdateringer fra afbrudte requests er bevaret. Det gamle `EventPage` unmountes og dets request afbrydes, mens det nye event renderes fra en frisk state, når det aktuelle request har leveret data.

## Verifikation udført

- `npm run lint`: bestået.
- `npm run build`: køres efter commitforberedelsen og skal bestå.
- Koden blev gennemgået for at sikre, at det normaliserede POST-payload med `eventId` ikke er ændret.
- Ingen databasefiler, dependencies eller README blev ændret.

Browseradgang var ikke tilgængelig i denne session. Derfor er følgende scenarier ikke udført automatisk:

- Skift fra event A til B med langsomt svar.
- Skift til et ukendt event.
- Skift fra fejl/not-found til et gyldigt event.
- Kontrol af, at tidligere formularfeedback ikke følger med.

## Foreslået manuel test

1. Åbn et event og navigér hurtigt til et andet event.
2. Begræns netværket i browserens DevTools og kontrollér, at det gamle event ikke bliver stående som det aktuelle.
3. Åbn et ukendt event-id og derefter et gyldigt event-id.
4. Fremprovokér en formularfejl eller succes, skift event, og kontrollér at feedback og felter er nulstillet.
5. Kontrollér i Network, at POST-requestet bruger det nye events `eventId`.

## Forventet værdi

State i brugerfladen følger nu det event, der faktisk vises i URL’en. Det reducerer risikoen for forvirrende feedback og forkerte tilmeldinger uden at ændre datamodel, design eller eksisterende async-arkitektur.
