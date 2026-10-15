# Mellemrum: Lighthouse og layoutstabilitet

Vi sammenlignede den oprindelige prototype med den færdige løsning gennem tre Lighthouse-målinger pr. side og version den 15. oktober 2026. Sammenligningen viste et layoutskift på eventsiden. Rettelsen fjernede skiftet i alle tre efterfølgende målinger: CLS faldt fra 0,601 til 0, og performance-scoren steg fra 56 til 79. LCP lå fortsat på cirka 5,8 sekunder.

## Rapporter

- [Årsagen til layoutskiftet, CSS-rettelsen og de tre nye målinger](cls-fix/README.md)
- [Sammenligning af den oprindelige prototype og versionen før CLS-rettelsen](comparison/README.md)
- [De 12 sammenligningsmålinger som ZIP](comparison/mellemrum-foer-efter-rapporter.zip)

Rettelsen blev publiceret i commit `986fa7e`. En separat kontrol af den offentlige eventside målte efterfølgende CLS 0 og Performance 78. Den offentlige eventroute returnerer stadig HTTP 404, selvom browseren viser siden. Den offentlige Lighthouse-kontrol brugte derfor `--ignore-status-code` og skal læses separat fra de lokale målinger.

## Testgrundlag

Rapporterne indeholder HTML, JSON, Chrome-spor og testopsætning. De 12 oprindelige målinger og de tre målinger efter rettelsen er bevaret hver for sig. Der er også en separat kontrol af fejlvisningen ved HTTP 503.

Filerne blev kopieret fra det midlertidige testmiljø og hashkontrolleret; se [archive-checksums.json](archive-checksums.json). Hashlisten beskriver den oprindelige arkivering. README-teksterne er siden redigeret; rapporter, rådata og testværktøjer er uændrede. De oprindelige README-filer findes i commit `986fa7e`. De midlertidige worktrees er ikke en del af arkivet. Ved genkørsel skal deres stier genskabes eller tilpasses i testværktøjerne. Testdataene er fiktive; arkivet indeholder ikke kopier af tilmeldingsdata eller hemmelige nøgler fra Supabase.
