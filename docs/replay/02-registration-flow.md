# 2. Fra konsollog til gemt og relateret tilmelding

Førgrundlag: README-audit og baseline-form.png er committed før arbejdet. Datamodelbranchen er allerede testet og merged. Kode fra tidligere kendt commit b534398 genbruges som implementeringsreference; dette fremstilles ikke som ny opfindelse.

Løsning: POST med name/email/status/eventId, normal validering, pending og feedback; event/venue samt tilmelding/event hentes relationelt. Efter tilpasningen fjernes kopifelterne lokalt med migration 002. Frisk starter.sql er nu normaliseret.

Faktisk browsertest på denne branch: event 9 viste Åboulevarden med adresse; Replay Test blev indsendt, succes viste sig og felterne blev tømt. Intern oversigt viste 3 tilmeldinger og den nye række med Søndagsjazz ved åen, 15.11.2026 og Ny. Reload af oversigten bevarede rækken. Network-log viser POST 201 med eventId=9 og efterfølgende GET. Før var der 2 rækker og ingen POST. Skærmbilleder: registration-success.png og registration-after-reload.png.

Frisk normaliseret starter.sql blev afprøvet i tom isoleret PostgreSQL; antal og constraints består igen. Lint/build bestod. Live Supabase er ikke ændret; adapteren er ikke en fuld PostgREST-integrationstest.

Værdi: brugeren kan gennemføre en gemt tilmelding, og arrangøren får relaterede eventdata uden kopifelter. Robust GET, formularsemantik og event-state er bevidst næste afgrænsede forbedringer.
