# Eventsiden: rettelse af layoutskift

## Problem og årsag

Mens eventdata blev hentet, var hovedindholdet kun cirka 209 pixels højt. Footeren stod derfor synligt på mobilskærmen. Da eventdetaljerne og formularen blev indlæst, blev footeren skubbet cirka 1.513 pixels ned.

Lighthouse registrerede footeren som det flyttede element. Årsagen var dog det voksende indhold over den, ikke footerens egne CSS-regler. CLS var 0,601458 i alle tre målinger før rettelsen. Se [det registrerede layoutskift](original-layout-shift.json) og [før/efter-sammenligningen](../comparison/README.md).

## Rettelse

`src/styles.css` reserverer nu plads til den første skærm, mens data hentes:

```css
.event-page {
  max-width: 1280px;
  min-height: calc(100svh - 80px);
}
```

Navigationen er mindst 80 pixels høj. Minimumshøjden holder footeren uden for den første skærm under indlæsning. Når det fulde indhold er hentet, vokser siden som normalt. Korte vente- og fejlvisninger får også denne minimumshøjde.

Rettelsen ændrer ikke tilmeldingsflowet, API-kaldene eller komponenternes logik. Kun `src/styles.css` blev ændret. Den eksisterende lokale formateringsændring i `EventPage.jsx` var med i testbuildet, men ikke i rettelsens commit. Det er dokumenteret i [source-preservation.json](source-preservation.json).

## Resultater

Tre målinger af `http://127.0.0.1:5270/case1/events/9` den 15. oktober 2026 kl. 23:33:42, 23:33:52 og 23:34:02 dansk sommertid:

| Metrik | Før: median [min–max] | Efter: median [min–max] |
| --- | --- | --- |
| CLS | 0,601458 [0,601458–0,601458] | **0 [0–0]** |
| LCP | 5,830 s [5,799–5,867] | **5,837 s [5,661–5,905]** |
| Performance | 56 [56–56] | **79 [78–79]** |

Layoutskiftet forsvandt i alle tre målinger. LCP lå stadig på cirka 5,8 sekunder; forskellen i medianen var 7 ms og lå inden for variationen mellem kørslerne. Rettelsen gjorde altså layoutet stabilt, men ikke hovedindholdet hurtigere synligt.

TBT var fortsat 0 ms. Accessibility, Best Practices og SEO var 100 i alle tre lokale målinger. Accessibility-scoren er et automatisk tjek, ikke en fuld WCAG-vurdering.

## Testopsætning og kontroller

- Lighthouse 13.5.0 og Chrome 155; mobilprofil 412 × 823 med DPR 1,75.
- Simuleret 150 ms RTT, 1.638,4 Kbps og 4× CPU-nedskalering.
- Samme lokale server, port, gzip, cacheindstillinger, ni testevents og 100 ms API-forsinkelse som i sammenligningen.
- Testbuild fra `da11872` med CSS-rettelsen og den eksisterende lokale `EventPage.jsx`. Miljøværdier og base-indstilling matchede sammenligningen.
- Eventbilledet havde samme størrelse i hver måling: 705.461 bytes. Billederne blev stadig hentet fra Unsplash.
- Testserveren returnerede HTTP 200. Der blev ikke brugt `--ignore-status-code`.

[checks.json](checks.json) dokumenterer ens indstillinger og versioner. Den færdigindlæste første mobilskærm var identisk med før rettelsen i alle tre kørsler; se også `fixed-viewport.jpg`. Der var ingen Lighthouse-kørselsfejl eller advarsler.

Lint og build bestod. Ved en separat test med API-status 503 blev den eksisterende fejlbesked vist. Billede og automatisk tilgængelighedstjek ligger i `checks/`; denne test indgår ikke i performance-medianerne. Der blev ikke sendt tilmeldinger under disse målinger.

## Rapporter

- Runde 1: [HTML](reports/fixed-event-9-1.report.html) · [JSON](reports/fixed-event-9-1.report.json)
- Runde 2: [HTML](reports/fixed-event-9-2.report.html) · [JSON](reports/fixed-event-9-2.report.json)
- Runde 3: [HTML](reports/fixed-event-9-3.report.html) · [JSON](reports/fixed-event-9-3.report.json)
- [Medianer og intervaller](summary.json)
- [Rå målinger og tidspunkter](results.jsonl)

De oprindelige målinger er bevaret i `../comparison/`. Ved genkørsel skal stierne til de midlertidige worktrees genskabes eller tilpasses.

## Publicering og HTTP-status

Rettelsen blev publiceret i `986fa7e`. Den efterfølgende offentlige Lighthouse-kontrol målte CLS 0 og Performance 78. Eventrouten returnerer stadig HTTP 404 gennem GitHub Pages-fallbacken, selvom siden vises korrekt. Den offentlige måling brugte derfor `--ignore-status-code`; den er separat fra de tre lokale målinger. CSS-rettelsen ændrer ikke HTTP-statussen.
