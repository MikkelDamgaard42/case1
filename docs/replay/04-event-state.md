# 4. Event-state i samme React-session

Forudgående audit registrerer risikoen ved genbrugt state. Implementering genbruger den kendte route-key-løsning fra 4938707. App.jsx er den eneste produktionsfil i denne forbedring.

Testindgangen navigation-harness.html/jsx tilføjer React Link-navigation uden at ændre produktets UI. Åbn testindgangen i dev-serveren, vælg event 9, udfyld kun blanktegn som navn og fremkald formularfejl. Indstil adapteren til 3500 ms GET-forsinkelse og klik event 1. Ingen fuld sidenavigation/reload foretages under disse klik.

Faktisk resultat før merge: efter skift vises kun Henter event, ikke event 9 eller tidligere formularfejl. Efter svar vises Lyd mellem husene med tomt navnefelt. Skift til ukendt event viser not-found; efterfølgende skift til event 9 viser gyldigt event uden gammel not-found-state. Screenshots: state-switch-loading.png og state-recovered-event.png.

Valideringen af blankt navn blev samtidig observeret med dansk alert. Lint/build bestod. Testen dokumenterer state-reset med tidligere fejlfeedback, men der er ikke lavet en særskilt test af et allerede igangværende POST under unmount. Testindgangen er kun udviklingsdokumentation og indgår ikke i Vites normale index.html-build.

Værdi: loading, event og formularfeedback følger route-id frem for det tidligere event. Ingen ændring i database eller payload.
