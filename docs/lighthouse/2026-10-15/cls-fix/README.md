# Rettelse af CLS-regression — Mellemrum Event 9

## Årsag og afgrænset ændring

Før rettelsen vises tilbage-link, loadingtekst og footer, mens eventdata hentes. Hovedindholdet har ingen minimumshøjde og er derfor kun omkring 209 CSS-pixels højt. I mobilsporet står footeren synligt fra y=328. Når eventdetaljer og tilmeldingsformular indsættes over den, skubbes den cirka 1.513 pixels ned. Lighthouse angiver footer.site-footer som påvirket node; årsagen er indholdsområdets højdeforøgelse efter API-svaret, ikke footerens egen styling. Det dokumenterede skift er 0,601458 i alle tre tidligere slutmålinger. Se original-layout-shift.json og de oprindelige rapporter i ../comparison/reports/.

Kun src/styles.css ændres:

```css
.event-page {
  max-width: 1280px;
  /* Reserve the first viewport while event data loads; the navbar is at least 80px tall. */
  min-height: calc(100svh - 80px);
}
```

Navigationen er mindst 80px høj, også når den vokser på mobil. Minimumshøjden holder footeren uden for den første viewport, mens data hentes. Det undgår et synligt stort skift, når main vokser; det låser ikke hele dokumentets højde. Efter indlæsning er Event 9 højere end minimumshøjden, så indhold, billeder og formular beholder deres placering. Korte loading-/fejlvisninger får et indholdsområde på mindst den første viewport.

Ingen footerregel, React-komponent, API-kald eller tilmeldingslogik er ændret. Den eksisterende lokale formateringsændring i EventPage.jsx er bevaret byte for byte og medtaget i den isolerede testbuild. Den committes ikke af denne opgave.

## Tre gentagne målinger med samme opsætning

URL: http://127.0.0.1:5270/case1/events/9. Målt 15. oktober 2026 kl. **23:33:42, 23:33:52 og 23:34:02 CEST** (Europe/Copenhagen), efter samme model som den tidligere sammenligning.

| Metrik | Før rettelse: median [min–max] | Efter rettelse: median [min–max] |
| --- | --- | --- |
| CLS | 0,601458 [0,601458–0,601458] | **0 [0–0]** |
| LCP | 5,830 s [5,799–5,867] | **5,837 s [5,661–5,905]** |
| Performance | 56 [56–56] | **79 [78–79]** |

LCP er i praksis uændret (median +7ms inden for målevariationen). Den dokumenterede forbedring er fjernelsen af det synlige layoutskift i de tre kontrollerede navigationsmålinger. TBT er fortsat 0ms; Accessibility, Best Practices og SEO er fortsat 100 i alle tre nye målinger. Dette dokumenterer ikke fuld WCAG-overholdelse eller feltperformance.

Samme Lighthouse 13.5.0, samme Chrome 155, mobil 412×823/DPR 1,75, simuleret 150ms RTT/1.638,4Kbps/4× CPU, samme origin/port, gzip og no-store, samme ni seed-events og samme 100ms REST-fixtureforsinkelse. Effektive indstillinger, Chrome-UA og Lighthouse-version er sammenlignet maskinelt med de tidligere rapporter og matcher. Ingen ignore-status-code. Eventbilledets ressource var i alle nye kørsler identisk i størrelse med før (705.461 bytes); de eksterne Unsplash-adresser og den generelle lab-/fixturebegrænsning er uændrede.

Testbuilden er et tredje isoleret worktree fra da11872 med det aktuelle EventPage.jsx og CSS-rettelsen kopieret ind. Build-env og base-override matcher før/efter-sammenligningen. Lint og build er desuden kørt i det faktiske Mellemrum-checkout.

## Kontroller

- `npm run lint` og `npm run build`: bestået i det faktiske repository.
- Alle tre nye navigationsmålinger: ingen runtimefejl eller run warnings; CLS 0.
- Den færdigindlæste mobile viewport-screenshot er **byte-identisk med før rettelsen** i alle tre nye kørsler; se checks.json og fixed-viewport.jpg. Dette dækker første mobilviewport, ikke en fuld visuel matrix.
- Hashkontrol af alle tidligere trackede filer: kun src/styles.css er ændret af opgaven. EventPage.jsx og dens eksisterende lokale ændringer er byte-identiske med før opgaven; se source-preservation.json.
- Kontrolleret API-fejl (503): den eksisterende fejlbesked vises i mobilvisningen; særskilt Lighthouse accessibility-only kontrol og screenshot ligger i checks/. Den kontrol er ikke en af de tre performancemålinger.
- Tilmeldingshandleren og komponentkoden ændres ikke. Der sendes ingen tilmelding til live Supabase eller testdatabasen.

## Rapporter

- Runde 1: [HTML](reports/fixed-event-9-1.report.html) · [JSON](reports/fixed-event-9-1.report.json)
- Runde 2: [HTML](reports/fixed-event-9-2.report.html) · [JSON](reports/fixed-event-9-2.report.json)
- Runde 3: [HTML](reports/fixed-event-9-3.report.html) · [JSON](reports/fixed-event-9-3.report.json)
- [Medianer og intervaller](summary.json), [rå målinger og tidspunkter](results.jsonl), [ens indstillinger og screenshots](checks.json).

De tidligere baseline- og slutrapporter ligger nu varigt under ../comparison/. De er ikke erstattet af de nye målinger. Git-kopi og de midlertidige worktrees er fortsat i /tmp; de er ikke den varige rapportopbevaring.

## Separat deploymentfund

Den offentlige /case1/events/9 returnerer fortsat den tidligere dokumenterede HTTP 404 gennem GitHub Pages-fallbacken. Den lokale testserver returnerer 200, præcis som i den tidligere lokale sammenligning. Denne CSS-rettelse ændrer ikke hosting eller HTTP-status. Der er ingen commit, push eller deployment i denne opgave.
