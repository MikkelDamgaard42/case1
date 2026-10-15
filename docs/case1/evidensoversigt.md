# Evidensoversigt

## Formål

Filerne understøtter udvalgte forbedringer. De er råmateriale og dokumentation, ikke en endelig portfolio-caseside.

## Evidensfiler

| Fil | Oprindelse/dato | Version/usikkerhed | Understøtter | Dokumenterer | Dokumenterer ikke |
|---|---|---|---|---|---|
| [datamodel-foer-efter.svg](evidence/datamodel-foer-efter.svg) | Ekstern Case 1-evidensmappe; dato ikke angivet | Efterfølgende illustration; ikke et originalt før-screenshot | Datamodel før/efter | Den beskrevne relationelle retning | Faktisk migration eller tidsbesparelse |
| [deployment-test-offentlig.png](evidence/deployment-test-offentlig.png) | Ekstern Case 1-evidensmappe; manuel test 15. oktober 2026 | Publiceret løsning; testversion er dokumenteret eksternt | Deployment og relateret registration-visning | En testrække med eventtitel, dato og status | At alle browserflows eller genindlæsning er verificeret |
| [tilmelding-succes.png](evidence/tilmelding-succes.png) | Ekstern lokal test; 15. oktober 2026 | Tidligere frontendversion | Registration POST og succesfeedback | Succesbesked, tømt formular og ny række | Den nyeste frontendversion, loading eller afvist POST |
| [tilmelding-netvaerksfejl.png](evidence/tilmelding-netvaerksfejl.png) | Ekstern isoleret netværkstest; 15. oktober 2026 | Tidligere frontendversion og lokal testserver | Fejlfeedback ved afbrudt POST | Dansk fejlfeedback og mulighed for nyt forsøg | Fysisk offline-situation, langsomt request eller nyeste version |

Screenshots indeholder kun de angivne fiktive testadresser. Ingen yderligere screenshots eller `docs/before/` er inkluderet.

## Git som teknisk før/efter-evidens

- `f25fde8..33b65a8` viser, at `EventPage` går fra `console.log` til Supabase POST med validering, status og `eventId`.
- `f37be8e..4938707` viser, at `App.jsx` tilføjer en route-wrapper med `key={eventId}`, så EventPage-state starter forfra ved eventskift.
- `case1-data-model..case1-relational-fetching` viser overgangen til nested venue/event-selects i frontend.

## Kilde- og versionsforbehold

Flere tests og audits blev udført efter implementeringen. Evidensen må derfor ikke bruges som om den dokumenterer en oprindelig trinvis udvikling. Lint/build er kodeverifikation, ikke browserverifikation. Deploymentstatus er rapporteret som success for commit `db598ea`; den er ikke uafhængigt genhentet i denne dokumentationsopgave.
