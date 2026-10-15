# 3. Fejlhåndtering og tilgængelighed

## Ændring

Et fejlet GET-kald gav tidligere en tom eventside. En fælles API-funktion kontrollerer nu HTTP-status og adskiller tekniske fejldetaljer fra brugerens fejlbesked. Siden håndterer ventetid, fejl, tomme svar og ukendte events. Igangværende datahentning afbrydes ved oprydning.

Formularen fik etiketter, autocomplete og tilgængelig feedback. Oversigten blev ændret til en semantisk tabel. Navigation, fokusmarkering og lazy loading af relevante billeder blev også tilpasset. Den tidligere implementering i `f37be8e` blev brugt som reference.

## Test og resultat

Testene blev kørt før merge med den lokale database og adapter:

| Test | Resultat |
| --- | --- |
| GET med status 503 | “Eventet kunne ikke hentes lige nu. Prøv igen senere.” |
| Tom eventliste | “Der er ingen events endnu.” |
| Ukendt event | “Eventet blev ikke fundet”. |
| GET forsinket 3.500 ms | “Henter event...” før indholdet vises. |
| POST med status 503 | “Tilmeldingen kunne ikke gemmes. Prøv igen.” Navnet bevares, og feedback har `role=alert`. |
| Formularstruktur | Felterne kan findes via etiketter, og e-mailfeltet har `type=email`. |
| Tastatur | Tab går fra navn til e-mail og derefter til knappen, som har en synlig fokusmarkering. |

Browserværktøjet skjulte e-mailværdien i tekstoutputtet, så dens bevarelse efter fejl blev ikke verificeret dér. E-mailfeltets outline blev aflæst som `none`; testen er derfor ikke en fuld kontrol af fokusmarkering eller tastaturtilgængelighed.

Billederne ligger i `evidence/`: `after-fetch-error.png`, `after-empty.png`, `after-not-found.png`, `after-loading.png` og `after-post-error.png`. Fejlkald er registreret i `network.jsonl`. Lint og build bestod.

Brugeren får nu en forklaring ved ventetid og fejl. En fuld WCAG- og skærmlæsertest er ikke gennemført. De senere [Lighthouse-målinger](../lighthouse/2026-10-15/README.md) dækker performance og automatiske tilgængelighedstjek.
