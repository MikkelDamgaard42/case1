# Test- og deploymentstatus

## Statusgrundlag

- Repository: https://github.com/MikkelDamgaard42/case1
- Publiceret løsning: https://mikkeldamgaard42.github.io/case1/
- Workflow: https://github.com/MikkelDamgaard42/case1/actions/runs/38748253241
- Rapporteret publiceret commit: `db598ea3f249950b76c9e1aacda140c2ecdb63d1`

Den tidligere VS Code-session rapporterede workflow-kørsel 38748253241 som `completed/success` for `db598ea`. Denne status er gengivet som rapporteret og er ikke genhentet uafhængigt i denne dokumentationsopgave.

## Hvad der er kontrolleret

| Kontrol | Status | Grundlag |
|---|---|---|
| Lint | Bestået | Tidligere lokal kørsel på den færdige branch |
| Production build | Bestået | Tidligere lokal kørsel på den færdige branch |
| Relationelle REST-GET-kald | Udført | `datamodel-api-check.json` |
| Lokal registration success | Udført på tidligere version | `tilmeldingsflow-verifikation.md` og tilmeldingsevidens |
| Isoleret afbrudt POST | Udført på tidligere version | `tilmelding-netvaerksfejl.png` og arbejdsrapport |
| Direkte eventlink online | Rapporteret udført | `case1-deployment-verifikation.md` |
| Online registration success | Rapporteret udført | `case1-deployment-verifikation.md` |
| Online oversigt efter særskilt genindlæsning | Ikke bekræftet | Arbejdsrapportens begrænsning |
| Seneste EventPage state-reset i browser | Ikke udført | Ingen godkendt browserverifikation |

## Skelnen mellem kode og runtime

Lint og build viser, at kodebasen kan lintes og bygges. De viser ikke, at POST-flow, loading states, browsernavigation, direkte routes eller deployment fungerer i alle runtime-scenarier.

De manuelle tilmeldingstests blev udført før de seneste frontendændringer og verificerer derfor ikke den nyeste version. Den offentlige kontrol dokumenterer enkelte onlineflows, men er ikke en fuld browseraudit.

## Planlagte, ikke udførte tests

- Langsomt eventskift fra event A til B.
- Skift fra ukendt event til gyldigt event.
- Kontrol af at tidligere formularfeedback ikke følger med.
- Afvist POST med konkret HTTP-status.
- Loading-state ved langsomt POST.
- Keyboard- og skærmlæsergennemgang.
- Direkte genindlæsning af alle publicerede routes.
