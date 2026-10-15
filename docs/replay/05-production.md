# 5. Production-base og samlet verifikation

Udgangspunkt: oprindelig base /mellemrum/ matcher ikke case1-repo. I denne branch genbruges den kendte package/lock-konfiguration fra 8b529b2 med /case1/.

Nyt fund før rettelse: npm run preview startede ved /, mens buildets HTML refererede /case1/assets. Browseren viste tom side på /case1/events/9. vite.config.js behandlede preview som almindelig dev (command=serve). Løsning: medtag isPreview i konfigurationen; dev bruger /, build og preview bruger package.base. Ingen produktionsfunktion eller database ændres af dette preview-fix.

Faktisk eftertest med standard npm run preview, uden --base override:
- Direkte /case1/events/9 og reload viste Søndagsjazz ved åen med venue.
- En 3000 ms POST viste Tilmelder... med disabled submit (isEnabled=false).
- Efter svar: succes og tomme felter.
- /case1/tilmeldinger og reload viste Production Replay med event 9, 15.11.2026 og Ny.
- DOM fandt fire columnheader-elementer i den semantiske tabel.
- Lint/build bestod. Screenshots: production-direct-route.png, production-post-pending.png, production-registration-reload.png.

Frontendfilerne matcher det eksisterende main-commit ea36ef1 byte-for-byte; preview-konfigurationen er en ny rettelse. Lokal preview bruger isoleret database/adapter, ikke live Supabase. Der foretages ingen ny live-databaseændring. Den tidligere live deployment må ikke fremstilles som deployment af denne nye branch.

## Gentagelig isoleret test

Testserveren i test-server.mjs bruger PGlite 0.5.10 (den faktisk installerede version kontrolleres i tools package-lock). Installér testværktøjet separat fra appens dependencies, og peg PGLITE_MODULE på dets dist/index.js. Serveren opretter den originale database fra git show f25fde8:supabase/starter.sql ved hver start. Alle endpoints lytter kun på 127.0.0.1:5191.

1. Start test-server.mjs med PGLITE_MODULE=file:///absolut/test-tools/node_modules/@electric-sql/pglite/dist/index.js.
2. Start dev med VITE_SUPABASE_URL=http://127.0.0.1:5191 og VITE_SUPABASE_APIKEY=local-test-only på port 5190.
3. POST migrationsfilerne 001 og 002 som rå SQL til /__sql i rækkefølge, før den færdige relationelle frontend testes.
4. Kontroller mode via POST /__control med JSON {"mode":"normal","delay":0}. Muligheder er fail, post-fail, empty og en forsinkelse i ms.
5. Til production preview: build med de samme test-envværdier, kopiér dist/index.html til dist/404.html som workflowet gør, og kør npm run preview på port 5192.

Adapteren understøtter kun projektets konkrete requests; den er ikke fuld PostgREST. /__sql og /__control er testværktøjer og må aldrig deployes som service. Vites normale build inkluderer kun index.html-appens imports, ikke disse dokumentationsfiler.

## Ny live-verifikation efter publicering

GitHub Actions-run [38758122358](https://github.com/MikkelDamgaard42/case1/actions/runs/38758122358) blev kontrolleret via GitHub API. Deploy-job og alle trin, herunder Deploy to GitHub Pages, sluttede med success for e0f5e16c8a7fa897a454a3fd067d419e437f385c.

Derefter blev den publicerede /case1/events/9 åbnet i browseren og viste Søndagsjazz ved åen med relaterede venuedata. En ny fiktiv Replay deployment test blev indsendt til live Supabase: success blev vist. Oversigten blev åbnet og genindlæst; rækken blev igen hentet med Søndagsjazz ved åen, 15.11.2026 og Ny. Evidens: [kun den fiktive række og tabelheader](evidence/live-replay-after-reload.png). Ingen eksisterende tilmeldinger blev ændret eller slettet. Dette er normal-flow-verifikation mod faktisk Supabase, til forskel fra de kontrollerede fejltests med lokal adapter.

Efterfølgende dokumentationscommits ændrer ikke appens src, buildkonfiguration eller database. Fuld siteaudit, skærmlæser og performancemålinger er fortsat udenfor det verificerede scope.
