# 5. Preview og publicering

## Rettelse af preview

Startprojektets `/mellemrum/` blev tilpasset til repositoryets `/case1/`. Den kendte opsætning fra `8b529b2` blev brugt som udgangspunkt.

Under kontrollen startede `npm run preview` ved `/`, mens buildets HTML henviste til `/case1/assets`. Det gav en tom side på `/case1/events/9`. `vite.config.js` behandlede preview som udvikling, fordi begge bruger `command=serve`.

Konfigurationen tager nu også højde for `isPreview`: udvikling bruger `/`, mens build og preview bruger `package.base`.

## Lokal kontrol

Med standardkommandoen `npm run preview`, uden ekstra base-indstilling:

- Direkte eventlink og genindlæsning viste Søndagsjazz ved åen med stedoplysninger.
- Et POST-kald forsinket 3.000 ms viste “Tilmelder...” og deaktiverede knappen.
- Svaret gav succesbesked og tomme felter.
- Oversigten viste “Production Replay” med event 9, 15.11.2026 og status Ny, også efter genindlæsning.
- Tabellen havde fire kolonneoverskrifter i DOM-strukturen.
- Lint og build bestod.

Billeder i `evidence/`: `production-direct-route.png`, `production-post-pending.png` og `production-registration-reload.png`.

Kontrollen brugte den isolerede database og adapter. Appens frontendfiler matchede på dette tidspunkt `ea36ef1`; rettelsen var i preview-konfigurationen.

## Gentag den isolerede test

`test-server.mjs` bruger PGlite 0.5.10. Installer testværktøjet separat fra appens pakker. Serveren opretter databasen fra `f25fde8:supabase/starter.sql` ved hver start og lytter kun på `127.0.0.1:5191`.

1. Start `test-server.mjs` med `PGLITE_MODULE=file:///absolut/test-tools/node_modules/@electric-sql/pglite/dist/index.js`.
2. Start udviklingsserveren på port 5190 med `VITE_SUPABASE_URL=http://127.0.0.1:5191` og `VITE_SUPABASE_APIKEY=local-test-only`.
3. Send migrationsfilerne 001 og 002 som rå SQL til `/__sql` i rækkefølge, før den relationelle frontend testes.
4. Styr fejl og forsinkelser med POST til `/__control`, eksempelvis `{"mode":"normal","delay":0}`. Tilstandene omfatter `fail`, `post-fail` og `empty`.
5. Til preview: byg med de samme miljøværdier, kopiér `dist/index.html` til `dist/404.html`, og start preview på port 5192.

Adapteren understøtter projektets konkrete requests, ikke hele PostgREST. `/__sql` og `/__control` er lokale testendpoints og skal ikke publiceres. De indgår ikke i appens normale build.

## Kontrol efter publicering

GitHub Actions-run [38758122358](https://github.com/MikkelDamgaard42/case1/actions/runs/38758122358) gennemførte build og deployment af `e0f5e16`.

Den publicerede eventside viste Søndagsjazz ved åen med relaterede stedoplysninger. Den fiktive tilmelding “Replay deployment test” blev sendt til Supabase og gav en succesbesked. Oversigten hentede rækken igen efter genindlæsning med det rigtige event, 15.11.2026 og status Ny. [Billedet viser den fiktive række og tabeloverskriften](evidence/live-replay-after-reload.png).

Den senere [CLS-rettelse](../lighthouse/2026-10-15/cls-fix/README.md) blev publiceret i `986fa7e`. En efterfølgende offentlig Lighthouse-kontrol målte CLS 0 og Performance 78. Eventrouten returnerer dog stadig HTTP 404 gennem GitHub Pages-fallbacken; den diagnostiske måling brugte derfor `--ignore-status-code`. Den måling erstatter ikke de tre lokale gentagelser.
