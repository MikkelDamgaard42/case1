# 3. Robust datahentning og tilgængelig feedback

Førfund: audit og baseline-fetch-error.png blev gemt før ændringer. Implementeringsreference: tidligere f37be8e; ingen påstand om uafhængigt nyudviklet løsning.

Ændringer: fælles API-funktion, HTTP-kontrol, tekniske fejldetaljer adskilt fra dansk brugerfeedback, abort-cleanup og loading/error/empty/not-found. Formularlabels/autocomplete/live-feedback, semantisk tabel, navbar-landmark, fokusstile og egnede lazy billeder følger samme afgrænsede brugerfladeforbedring.

Faktiske tests før merge på denne branch, mod isoleret PostgreSQL og kontrolleret adapter:

- GET 503: eventside viser “Eventet kunne ikke hentes lige nu. Prøv igen senere.” Før var siden uden eventindhold/fejlfeedback.
- Tom liste: “Der er ingen events endnu.”
- Tomt eventsvar for ukendt id: “Eventet blev ikke fundet”.
- 3500 ms GET-forsinkelse: “Henter event...” vises før indhold.
- POST 503: “Tilmeldingen kunne ikke gemmes. Prøv igen.” og navn bevares; feedback har role=alert. E-mailværdi redigeres væk af browserværktøjet og påstås derfor ikke verificeret i tekstoutput.
- Formularens felter findes via labels; email har type=email. Tab fra navn går til e-mail, næste Tab til submit. Knappen har solid fokusoutline. Email-outline blev aflæst som none; fuld fokuskontrast/keyboardaudit er ikke dokumenteret.

Screenshots: after-fetch-error.png, after-empty.png, after-not-found.png, after-loading.png og after-post-error.png. Kontrollerede 503-requests fremgår af network.jsonl. Lint/build bestod.

Værdi: brugeren kan skelne ventetid, manglende event og fejl; fælles requestkode reducerer gentagelser. Ingen fuld WCAG-, skærmlæser- eller performancemåling er udført. State ved eventId-skift er fortsat næste særskilte forbedring.
