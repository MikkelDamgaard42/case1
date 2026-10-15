# Manuel verifikation af tilmeldingsflow

Dato: 15. oktober 2026

## Testens status

Denne rapport er baseret på den eksterne testrapport `case1-tilmeldingsflow.md` fra:

`/Users/mikkel/Documents/Codex/2026-10-15/okay-x20/outputs/case1-tilmeldingsflow.md`

Testene blev udført før de seneste frontendændringer på `case1-event-state-reset` og `case1-documentation`. De dokumenterer derfor ikke den nyeste frontendversion. Der er ikke kopieret screenshots eller personlige/fiktive e-mailadresser ind i dette dokument.

Testen blev udført i den lokale app mod eksisterende Supabase-data, ikke på deployment.

## Observerede tests

### Succesfuld tilmelding

- Formularen viste: “Tak for din tilmelding. Din plads er reserveret.”
- Navn og e-mail blev tømt efter succes.
- Den nye række blev vist på `/tilmeldinger` med eventtitel, dato og status `Ny`.
- Event og dato i oversigten stemte med det valgte seed-event.
- En efterfølgende genindlæsning af `/tilmeldinger` viste rækken igen.

### Native formularvalidering

- Tom formular blev stoppet af browserens required-validering.
- En ugyldig e-mail uden `@` blev stoppet af browserens email-validering.
- Et navn med kun blanktegn blev afvist af applikationens `trim()`-validering.
- En tidligere testværdi blev accepteret som navn; dette er ikke en fejl i trim-valideringen.

### Kontrolleret netværksfejl

En separat lokal testserver lukkede forbindelsen for POST-requestet uden et HTTP-svar. Requestet blev ikke sendt videre til Supabase.

Observeret resultat:

- Brugeren fik: “Tilmeldingen kunne ikke gemmes. Prøv igen.”
- Navnefeltet beholdt sin værdi til et nyt forsøg.
- Knappen vendte tilbage til “Tilmeld mig”.

Dette simulerer et afbrudt request, ikke nødvendigvis en fysisk offline-enhed.

## Ikke verificeret i den tidligere test

Følgende blev ikke separat verificeret:

- Loading-state under et langsomt POST-request.
- Afvist POST med en konkret HTTP-status fra Supabase.
- Skærmlæserens oplæsning af feedback.
- E-mailfeltets bevarelse ved netværksfejl.
- Den nyeste EventPage state-reset ved skift mellem event-id’er.
- Den aktuelle deployment.

## Fortolkning

Testen dokumenterer, at den daværende version kunne gennemføre en tilmelding, vise succesfeedback, hente den nye række igen og håndtere et afbrudt POST med fejlfeedback. Den dokumenterer ikke, at den nyeste kodeversion eller deploymenten er browserverificeret.
