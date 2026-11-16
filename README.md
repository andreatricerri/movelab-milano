# MoveLab Milano — sito dimostrativo

Sito statico multipagina per una palestra fittizia, pensato per un portfolio.
HTML, CSS e JavaScript vanilla: nessun framework, nessuna build.

## Struttura

```
movelab-milano/
├── index.html            Home
├── palestra.html         Spazi, galleria, orari, dove siamo
├── corsi.html            Corsi con filtri + orario settimanale
├── trainer.html          Personal trainer + percorso
├── abbonamenti.html      Piani, confronto, promo
├── offerte.html          Offerte stagionali
├── shop.html             Shop
├── bar.html              Bar Fit
├── eventi.html           Eventi
├── contatti.html         Modulo, recapiti, FAQ
├── prenotazioni.html     Prenotazioni (?tipo=prova|corso|pt|visita|evento&id=…)
├── 404.html              Pagina non trovata
│
├── css/
│   ├── base.css          Stili comuni: colori, font, header, footer, card, form, modale
│   └── pages/            Un CSS per ogni pagina (home.css, corsi.css, …)
│
├── js/
│   ├── data.js           TUTTI i contenuti: corsi, trainer, prezzi, offerte, prodotti…
│   ├── core.js           Utilità comuni
│   ├── layout.js         Header con menu a tendina, footer, sotto-menu di pagina
│   ├── cart.js           Carrello (localStorage) e checkout simulato
│   ├── booking.js        Form di prenotazione
│   ├── components.js     Card e finestre di dettaglio condivise
│   └── pages/            Uno script per ogni pagina
│
├── assets/icons/         Icone per smartphone, tablet e app installata
├── img/                  Le tue foto reali
├── favicon.svg
├── site.webmanifest      Configurazione "aggiungi alla schermata Home"
├── netlify.toml          Configurazione per Netlify (pubblicazione attuale)
├── vercel.json           Configurazione alternativa per Vercel
└── package.json          Comando per avviare un server locale
```

Ogni pagina HTML carica `css/base.css` + il suo `css/pages/<pagina>.css`,
poi gli script comuni e infine `js/pages/<pagina>.js`.
**L'ordine degli script è importante** e non vanno trasformati in `type="module"`.

## Modificare il menu

Il menu è scritto una sola volta, nell'array `NAV` in cima a `js/layout.js`.
Aggiungendo o spostando una voce lì, cambia su tutte le pagine (anche nel footer).

## Vederlo in VS Code e su tutti i dispositivi

### Sul computer
1. Apri la cartella in VS Code (`File > Apri cartella…`).
2. Installa l'estensione consigliata **Live Server** (VS Code te la propone).
3. Clic destro su `index.html` → **Open with Live Server**.

### Su telefono e tablet (stessa rete Wi-Fi)
Le impostazioni in `.vscode/settings.json` rendono Live Server raggiungibile dalla rete locale.
1. Avvia Live Server come sopra.
2. Trova l'indirizzo IP del computer (Windows: `ipconfig`; Mac: Impostazioni > Wi-Fi > Dettagli).
3. Sul telefono apri `http://IP-DEL-COMPUTER:5500`, ad esempio `http://192.168.1.20:5500`.
   Se non si apre, consenti l'accesso quando il firewall lo chiede.

In alternativa, senza VS Code: `npm run dev` e apri l'indirizzo **Network** che compare nel terminale.

### Simulare i dispositivi dal computer
- Chrome / Edge: `F12` → icona dispositivi (`Ctrl+Shift+M`) e scegli iPhone, iPad, Galaxy…
- Firefox: `Ctrl+Shift+M`. Safari: Sviluppo > Modalità di progettazione responsive.

### Cosa è già configurato per i dispositivi
- `viewport-fit=cover` e margini per notch e barra inferiore di iPhone (safe area).
- Campi dei form a 16px: iPhone non fa lo zoom quando li tocchi.
- Pulsanti e voci di menu di almeno 44px per il tocco.
- Menu a tendina su desktop (si apre con mouse, tastiera o tocco) e menu a pannello con sezioni a fisarmonica sotto i 1024px.
- Finestre di dettaglio che diventano pannelli dal basso su smartphone.
- Galleria e testimonianze scorrevoli con il dito.
- Tema chiaro/scuro automatico, rispetto di "riduci movimento", layout per telefoni in orizzontale.
- Icone e manifest per "Aggiungi alla schermata Home" su iOS e Android.

## Pubblicazione

Il sito è pubblicato su **Netlify** a partire dal repository GitHub: ogni push sul ramo `main` aggiorna il sito online in automatico.

- `netlify.toml`: sito statico senza build, intestazioni di sicurezza e cache. Netlify usa da solo `404.html` per le pagine inesistenti e apre `/corsi` come `corsi.html`.
- `vercel.json`: configurazione equivalente se un giorno vuoi pubblicare su Vercel.

## Personalizzare

- **Contenuti e prezzi**: solo `js/data.js`.
- **Immagini**: l'elenco completo (78 file, con nomi, formati e soggetti) è in **`IMMAGINI.md`**.
  Copia ogni foto .jpg con il nome indicato nella sua cartella (`img/hero/`, `img/corsi/`, `img/trainer/`, `img/shop/`,
  `img/bar/`, `img/eventi/`, `img/galleria/`): compare subito. Finché manca, resta il segnaposto.
- **Colori e font**: variabili in cima a `css/base.css`. Il giallo delle promozioni e degli sticker è `--promo`.
- **Segnaposto delle intestazioni**: `img/placeholder/hero-*.svg`. Sostituisci il percorso nell'HTML con la tua foto (cerca `SOSTITUISCI`).
- **Date di offerte ed eventi**: `inDays(n)` = tra n giorni da oggi.

## Tessera abbonato (demo)

Nel carrello si può inserire il codice tessera di 8 cifre: il sito riconosce l'abbonato e applica il 20% su Shop e Bar Fit.
Lo sconto abbonato non si somma ai codici promo: per ogni articolo vale il più conveniente.
Tessere di prova (elenco in `js/data.js`, voce `members`):

| Codice | Nome |
|---|---|
| 10482736 | Mario Rossi |
| 20591847 | Giulia Bianchi |
| 30715928 | Luca Verdi |

In un sito reale la verifica della tessera va fatta sul server, non nel browser.

## Privacy (demo)

Nessun dato viene inviato a server o terzi. Solo il carrello è salvato nel `localStorage` del browser
(chiave `movelab_cart_v1`) ed è condiviso tra le pagine. Prenotazioni e messaggi restano nella pagina
aperta e spariscono cambiando pagina o ricaricando. Pagamenti ed email sono simulati.

Codici sconto di prova: `BLACKFIT`, `BENVENUTO30`, `STUDIO15` (`NATALE25` risulta non ancora attivo).
