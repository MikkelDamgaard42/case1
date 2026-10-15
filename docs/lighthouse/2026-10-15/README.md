# Mellemrum: hvad viste Lighthouse-testene?

Lighthouse blev brugt til at undersøge indlæsning, layoutstabilitet og automatiske tilgængelighedstjek. Den oprindelige prototype og den færdige version blev bygget og målt lokalt under samme forhold. Sammenligningen viste, at eventsiden havde fået et layoutskift. Det blev rettet og målt igen.

## Sådan blev der sammenlignet

Der blev kørt tre målinger af forsiden og event 9 i hver version, i alt 12. Begge brugte samme mobilprofil, testdata, lokale server og simulerede netværks- og CPU-indstillinger. Tabellen viser medianerne, altså den midterste værdi af tre målinger.

Den oprindelige prototype er commit `f25fde8`. Versionen før CLS-rettelsen er `da11872`. Begge blev målt den 15. oktober 2026; baseline er ikke en måling gemt før udviklingsarbejdet.

## Før og efter

| Måling | Oprindelig prototype | Før CLS-rettelsen | Efter CLS-rettelsen |
| --- | ---: | ---: | ---: |
| Forside: Performance | 83 | 81 | Ikke målt igen i denne rettelse |
| Forside: LCP | 4,640 s | 5,225 s | Ikke målt igen i denne rettelse |
| Event 9: Performance | 78 | 56 | 79 |
| Event 9: LCP | 5,870 s | 5,830 s | 5,837 s |
| Event 9: CLS | 0 | 0,601 | 0 |

- **Performance** er Lighthouse-scoren fra 0 til 100. Den samler flere mål og skal læses sammen med dem.
- **LCP** måler, hvornår det største synlige indholdselement vises. På eventsiden er det det store eventbillede. Lavere er bedre.
- **CLS** måler uventede forskydninger af layoutet under indlæsning. Lavere er bedre; 0 betyder, at der ikke blev registreret layoutskift i målingen.

### Hvorfor blev eventsiden dårligere?

Under datahentning var indholdsområdet kort, så footeren stod synligt på mobilskærmen. Da eventdetaljer og formular blev indlæst, blev footeren skubbet cirka 1.513 pixels ned. Lighthouse registrerede derfor et stort layoutskift.

Rettelsen reserverer plads til indholdet med en minimumshøjde i CSS. Footeren står dermed uden for den første skærm, mens data hentes. Tilmeldingsflowet og det færdige layout blev ikke ændret.

### Hvad forbedrede rettelsen?

CLS blev 0 i alle tre nye målinger, og Performance steg fra 56 til median 79. LCP lå stadig på cirka 5,8 sekunder. Rettelsen fjernede altså layoutskiftet, men gjorde ikke hovedindholdet hurtigere synligt.

### Hvad med forsiden?

Forsiden overførte mindre data ved den første mobilindlæsning: cirka 8,12 MB før og 3,59 MB efter ændringerne. Lazy loading betød, at færre eventbilleder blev hentet med det samme. Det gav dog ikke en dokumenteret forbedring af LCP. Målingernes intervaller overlappede, så forskellen mellem Performance 83 og 81 kan ikke sikkert tilskrives kodeændringerne.

## Testindstillinger og begrænsninger

Lighthouse 13.5.0 og Chrome 155 blev brugt med mobilprofil 412 × 823, 150 ms simuleret netværksforsinkelse, 1.638,4 Kbps og 4× CPU-nedskalering. Begge versioner fik de samme ni testevents og 100 ms lokal API-forsinkelse. Billederne blev hentet fra Unsplash.

Testene bruger en lokal adapter frem for live Supabase. De måler derfor ikke den offentlige databases svartid. Eksterne billeder og computerens belastning kan også påvirke resultatet. Målingerne giver en sammenligning under faste forhold, ikke et løfte om samme hastighed hos alle brugere.

Accessibility, Best Practices og SEO var 100 i alle 12 sammenligningsmålinger og i de tre målinger efter rettelsen. Accessibility-scoren er et automatisk tjek og dokumenterer ikke fuld WCAG-overholdelse. Formularlagring og fejlvisning blev kontrolleret gennem separate funktionstests.

## Kontrol efter publicering

CLS-rettelsen blev publiceret i `986fa7e`. En separat Lighthouse-kontrol af den offentlige eventside målte CLS 0 og Performance 78.

Eventrouten returnerer dog stadig HTTP 404, selvom browseren viser siden. Det blokerer standardtesten, så den offentlige kontrol brugte `--ignore-status-code`. Den er derfor en særskilt diagnostisk måling og erstatter ikke de lokale sammenligninger. HTTP-fejlen er fortsat uløst.

## Rapporter og testfiler

Forklaringen ovenfor samler de vigtigste resultater. Her findes intervaller, indstillinger og rå rapporter:

- [Den oprindelige sammenligning: tre målinger pr. side og version](comparison/README.md)
- [CLS-rettelsen: årsag, CSS og tre kontrolmålinger](cls-fix/README.md)
- [De 12 sammenligningsmålinger som ZIP](comparison/mellemrum-foer-efter-rapporter.zip)
- [Funktionstest af tilmelding, data og fejlvisning](../../replay/README.md)

De 12 sammenligningsmålinger og de tre efter rettelsen er bevaret hver for sig. Der er desuden en separat test af fejlvisningen ved HTTP 503.

### Arkivering og genkørsel

Filerne blev kopieret fra det midlertidige testmiljø og hashkontrolleret; se [archive-checksums.json](archive-checksums.json). Hashlisten beskriver den oprindelige arkivering. README-teksterne er siden redigeret; rapporter, rådata og testværktøjer er uændrede. De oprindelige README-filer findes i commit `986fa7e`. De midlertidige worktrees er ikke en del af arkivet. Ved genkørsel skal deres stier genskabes eller tilpasses i testværktøjerne. Testdataene er fiktive; arkivet indeholder ikke kopier af tilmeldingsdata eller hemmelige nøgler fra Supabase.
