# Mellemrum — Lighthouse og CLS-rettelse, 15. oktober 2026

- [CLS-rettelsen: årsag, ændring, medianer og intervaller](cls-fix/README.md)
- [Den oprindelige isolerede baseline/slut-sammenligning](comparison/README.md)
- [Baseline/slutrapporterne som ZIP](comparison/mellemrum-foer-efter-rapporter.zip)

Rapporter, rådata og spor er flyttet fra /tmp til denne varige dokumentationsmappe. SHA-256 er kontrolleret efter flytningen; se archive-checksums.json. De oprindelige 12 målinger er bevaret, og de tre målinger efter CSS-rettelsen ligger separat. Der er desuden en særskilt fejlvisningskontrol.

De eksisterende Git-kopier/worktrees under /tmp er midlertidige testmiljøer og er ikke flyttet. Gemte testværktøjer og manifester dokumenterer opsætningen; deres oprindelige relative worktree-stier skal genskabes eller justeres før genkørsel. Ingen tilmeldingsdata eller secrets er kopieret fra live-miljøet.

Kun src/styles.css er ændret af denne rettelse. Den eksisterende lokale EventPage.jsx er bevaret. Ingen commit, push eller deployment. Den offentlige eventroutes HTTP 404 er et separat, urettet hostingfund.
