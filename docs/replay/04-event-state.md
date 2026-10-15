# 4. Nulstilling ved eventskift

## Ændring

En `key` baseret på `eventId` nulstiller eventsiden, når brugeren skifter event. Det forhindrer, at tidligere eventindhold og formularfeedback følger med. Ændringen ligger i `App.jsx` og bygger på løsningen fra `4938707`.

## Test og resultat

Testindgangen `navigation-harness.html/jsx` gjorde det muligt at skifte med React Link i samme session uden at ændre appens brugerflade:

1. Åbn event 9, indtast kun mellemrum som navn, og fremkald formularfejlen.
2. Indstil adapteren til 3.500 ms GET-forsinkelse, og skift til event 1 uden fuld genindlæsning.
3. Kontrollér, at kun “Henter event” vises under ventetiden.
4. Kontrollér, at Lyd mellem husene derefter vises med et tomt navnefelt.
5. Skift til et ukendt event og tilbage til event 9.

Det tidligere event og dets formularfejl forsvandt ved skiftet. Efter sidste skift blev det gyldige event vist uden fejltilstanden fra det ukendte event. Billeder: [ventetilstand](evidence/state-switch-loading.png) og [gyldigt event efter skift](evidence/state-recovered-event.png).

Lint og build bestod. Testen omfattede tidligere formularfeedback, men ikke et igangværende POST-kald under eventskift. Testindgangen er et udviklingsværktøj og indgår ikke i appens normale build.
