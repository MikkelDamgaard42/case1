# Case 1 · Mellemrum

Samlet dokumentation og råmateriale for Case 1. Dette er ikke den endelige portfolio-caseside.

## Links

- [Repository](https://github.com/MikkelDamgaard42/case1)
- [Publiceret løsning](https://mikkeldamgaard42.github.io/case1/)
- [GitHub Actions-deployment](https://github.com/MikkelDamgaard42/case1/actions/runs/38748253241)

## Dokumentation

- [Teknisk audit og prioritering](forbedringsoversigt.md)
- [Datamodel og relationer](datamodel.md)
- [Verifikation af tilmeldingsflow](tilmeldingsflow-verifikation.md)
- [Event state reset](event-state-reset.md)
- [Evidensoversigt](evidensoversigt.md)
- [Refleksion og forretningspotentiale](refleksion.md)
- [Afsluttende audit](final-audit.md)
- [Manuel deploymentverifikation](deployment-status.md)

## Branchkæde

```text
case1-data-model
→ case1-registration-flow
→ case1-relational-fetching
→ case1-datamodel-verification
→ case1-robustness-accessibility
→ case1-event-state-reset
→ case1-documentation
```

Branchene blev efterfølgende rekonstrueret som en lineær progression. De dokumenterer derfor ikke, at alle forbedringer oprindeligt blev udviklet trin for trin.

## Resterende mangler

- Event-state-reset er lintet og buildet, men de specifikke browserflows ved eventskift er ikke browserverificeret.
- Lokale validerings- og netværkstests gælder en tidligere frontendversion. Den senere manuelle online-test af den publicerede version dokumenterer succesfuld tilmelding og visning af relaterede eventdata; se [deploymentstatus](deployment-status.md).
- Deployment blev rapporteret som succesfuld, men browserflows på den publicerede løsning er kun delvist dokumenteret.
- Der findes ingen automatiske browser- eller integrationstests i projektets scripts.
- Performance, tilgængeligheds-compliance, konvertering og tidsbesparelse er ikke målt.
- Den opdaterede `starter.sql` er ikke afprøvet i en tom PostgreSQL-database.
