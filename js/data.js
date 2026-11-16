/* MoveLab Milano - dati del sito
   Caricato PRIMA di main.js. Modifica qui contenuti, prezzi e immagini. */
'use strict';

/* Funzioni di supporto usate dai dati */
// Segnaposto esterno coerente con la palette. SOSTITUISCI con foto reali nei dati.
function ph(text, bg = '111111', fg = 'B5E33A', w = 800, h = 600) {
  return `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${encodeURIComponent(text)}&font=oswald`;
}
// Timestamp "tra n giorni" all'ora indicata (usato per offerte ed eventi demo)
function inDays(days, hh = 23, mm = 59) {
  const d = new Date(); d.setDate(d.getDate() + days); d.setHours(hh, mm, 0, 0); return d.getTime();
}

/* Immagini: ogni voce punta a un file .jpg in img/. Se il file non c'è ancora,
   viene mostrato in automatico il segnaposto indicato (vedi IMMAGINI.md). */
function img(path, label, bg, fg, w, h) {
  (window.IMG_FALLBACK = window.IMG_FALLBACK || {})[path] = ph(label, bg, fg, w, h);
  return path;
}

/* =====================================================================
   DATI DEL SITO
   Tutte le sezioni dinamiche vengono generate da questo oggetto.
   Per modificare corsi, trainer, prezzi, offerte ecc. basta cambiare qui.

   IMMAGINI: ogni campo "image" usa img('img/cartella/nome.jpg', ...).
   Basta copiare la foto con quel nome nella cartella giusta: il sito la usa
   subito. Finché il file manca resta il segnaposto. Elenco completo in IMMAGINI.md

   DATE: offerte ed eventi usano inDays(n) = "tra n giorni da oggi", così la
   demo resta sempre attuale. Per date fisse usa new Date('2026-12-24T23:59').getTime()
   ===================================================================== */
const SITE_DATA = {
  contacts: {
    address: "Viale dell'Energia 18, 20141 Milano (MI)",
    phone: '+39 02 0000 0000',
    email: 'info@movelab-milano.example',
    whatsapp: '+39 300 000 0000'
  },

  // Orari di apertura [apertura, chiusura]
  hours: { Lun:['06:30','23:00'], Mar:['06:30','23:00'], Mer:['06:30','23:00'], Gio:['06:30','23:00'], Ven:['06:30','22:00'], Sab:['08:00','20:00'], Dom:['09:00','14:00'] },

  features: [
    { icon:'dumbbell', title:'Attrezzi moderni', text:'Rack, macchine isotoniche e cardio rinnovati nel 2026, con manutenzione settimanale.' },
    { icon:'award', title:'Personal trainer certificati', text:'Sette professionisti con specializzazioni diverse, presenti in sala anche senza appuntamento.' },
    { icon:'users', title:'Corsi di gruppo', text:'Oltre 90 lezioni a settimana, dal functional allo yoga, con posti limitati.' },
    { icon:'cup-soda', title:'Bar Fit e shake proteici', text:'Shake, caffè e pranzi bilanciati. Gli abbonati hanno il 20% di sconto.' },
    { icon:'party-popper', title:'Eventi e community', text:'Challenge mensili, workshop sulla nutrizione e domeniche dedicate al benessere.' },
    { icon:'calendar-check', title:'Prenotazioni online', text:'Prenoti corsi e sessioni dal sito in meno di un minuto e annulli fino a 2 ore prima.' }
  ],

  /* ------------------------- CORSI -------------------------
     level: principiante | intermedio | avanzato
     badge: 'Nuovo' | 'Popolare' | '' (Ultimi posti e Disponibile sono calcolati dai posti)
     schedule: giorni Lun..Dom e orari HH:MM                                      */
  courses: [
    { id:'functional', name:'Functional Training', category:'Funzionale', level:'intermedio', duration:50, kcal:'450–550', instructor:'Luca Moretti', spots:8, capacity:16, badge:'Popolare', featured:true,
      desc:'Movimenti multiarticolari con kettlebell, sandbag e corpo libero per forza e coordinazione.',
      schedule:[{day:'Lun',time:'07:00'},{day:'Mer',time:'18:30'},{day:'Ven',time:'07:00'}],
      image: img('img/corsi/functional.jpg', 'Functional Training','1C1D21','B5E33A'), alt:'Allenamento functional con kettlebell nella sala corsi' },
    { id:'hiit', name:'HIIT', category:'Cardio', level:'avanzato', duration:45, kcal:'500–650', instructor:'Sara Conti', spots:2, capacity:14, badge:'Popolare', featured:true,
      desc:'Intervalli ad alta intensità alternati a recuperi brevi. Si lavora a cardiofrequenza.',
      schedule:[{day:'Mar',time:'12:30'},{day:'Gio',time:'19:00'},{day:'Sab',time:'10:00'}],
      image: img('img/corsi/hiit.jpg', 'HIIT','111111','FFD60A'), alt:'Lezione HIIT con salti e affondi su tappetino' },
    { id:'spinning', name:'Spinning', category:'Cardio', level:'intermedio', duration:45, kcal:'450–600', instructor:'Paolo Ricci', spots:11, capacity:22, badge:'Popolare',
      desc:'Pedalata a ritmo di musica su bike professionali, con salite, sprint e recuperi.',
      schedule:[{day:'Lun',time:'19:00'},{day:'Mer',time:'07:15'},{day:'Ven',time:'18:00'},{day:'Dom',time:'10:30'}],
      image: img('img/corsi/spinning.jpg', 'Spinning','1C1D21','B5E33A'), alt:'Sala spinning con bike allineate e luci colorate' },
    { id:'pilates', name:'Pilates', category:'Mente e corpo', level:'principiante', duration:55, kcal:'250–320', instructor:'Elena Marchetti', spots:6, capacity:12, badge:'',
      desc:'Controllo del centro, respirazione e postura con piccoli attrezzi e tappetino.',
      schedule:[{day:'Mar',time:'09:30'},{day:'Gio',time:'13:00'},{day:'Sab',time:'11:30'}],
      image: img('img/corsi/pilates.jpg', 'Pilates','F4F4F4','111111'), alt:'Esercizio di pilates su tappetino con palla piccola' },
    { id:'yoga', name:'Yoga', category:'Mente e corpo', level:'principiante', duration:60, kcal:'200–300', instructor:'Chiara Gallo', spots:9, capacity:18, badge:'', featured:true,
      desc:'Hatha yoga con sequenze dinamiche e rilassamento finale. Adatto a tutti.',
      schedule:[{day:'Lun',time:'20:00'},{day:'Mer',time:'09:00'},{day:'Dom',time:'09:30'}],
      image: img('img/corsi/yoga.jpg', 'Yoga','F4F4F4','1C1D21'), alt:'Sala yoga con tappetini e luce naturale' },
    { id:'boxe', name:'Boxe', category:'Combattimento', level:'intermedio', duration:60, kcal:'600–750', instructor:'Paolo Ricci', spots:3, capacity:16, badge:'',
      desc:'Tecnica al sacco, lavoro ai colpitori e condizionamento. Senza contatto.',
      schedule:[{day:'Mar',time:'19:30'},{day:'Gio',time:'19:30'},{day:'Sab',time:'12:00'}],
      image: img('img/corsi/boxe.jpg', 'Boxe','111111','B5E33A'), alt:'Sacchi da boxe appesi nell’area functional' },
    { id:'crosstraining', name:'CrossTraining', category:'Funzionale', level:'avanzato', duration:60, kcal:'650–800', instructor:'Luca Moretti', spots:10, capacity:14, badge:'Nuovo', featured:true,
      desc:'Workout del giorno con sollevamenti, ginnastica e parte metabolica a tempo.',
      schedule:[{day:'Lun',time:'12:30'},{day:'Mer',time:'20:00'},{day:'Ven',time:'19:30'}],
      image: img('img/corsi/crosstraining.jpg', 'CrossTraining','111111','B5E33A'), alt:'Box di cross training con bilancieri e corde' },
    { id:'stretching', name:'Stretching e mobilità', category:'Mente e corpo', level:'principiante', duration:40, kcal:'120–180', instructor:'Davide Rinaldi', spots:14, capacity:20, badge:'',
      desc:'Allungamento attivo e mobilità articolare per anche, colonna e spalle.',
      schedule:[{day:'Mar',time:'07:30'},{day:'Gio',time:'20:30'},{day:'Dom',time:'11:00'}],
      image: img('img/corsi/stretching.jpg', 'Stretching','F4F4F4','111111'), alt:'Esercizi di mobilità con rullo e tappetino' },
    { id:'totalbody', name:'Total Body', category:'Tonificazione', level:'principiante', duration:50, kcal:'350–450', instructor:'Giulia Ferri', spots:12, capacity:20, badge:'',
      desc:'Circuito completo con manubri leggeri ed elastici per tonificare tutto il corpo.',
      schedule:[{day:'Lun',time:'10:00'},{day:'Mer',time:'13:00'},{day:'Ven',time:'12:30'},{day:'Sab',time:'09:00'}],
      image: img('img/corsi/totalbody.jpg', 'Total Body','1C1D21','FFFFFF'), alt:'Circuito total body con manubri ed elastici' },
    { id:'core', name:'Core & Abs', category:'Tonificazione', level:'intermedio', duration:30, kcal:'200–260', instructor:'Giulia Ferri', spots:7, capacity:16, badge:'Nuovo',
      desc:'Mezz’ora intensa per addominali, lombari e stabilità del tronco.',
      schedule:[{day:'Mar',time:'18:00'},{day:'Gio',time:'07:30'}],
      image: img('img/corsi/core.jpg', 'Core & Abs','111111','FFD60A'), alt:'Esercizio plank su tappetino' },
    { id:'forza', name:'Potenza e forza', category:'Forza', level:'avanzato', duration:60, kcal:'400–500', instructor:'Marco Bellini', spots:5, capacity:10, badge:'',
      desc:'Squat, stacco e panca in piccoli gruppi, con progressione dei carichi a cicli.',
      schedule:[{day:'Lun',time:'18:00'},{day:'Gio',time:'18:00'},{day:'Sab',time:'15:00'}],
      image: img('img/corsi/forza.jpg', 'Potenza e forza','1C1D21','B5E33A'), alt:'Rack con bilanciere carico di dischi' },
    { id:'running', name:'Corsa indoor', category:'Cardio', level:'intermedio', duration:45, kcal:'500–650', instructor:'Sara Conti', spots:9, capacity:15, badge:'Nuovo',
      desc:'Ripetute e progressivi su tapis roulant curvi, con tecnica di corsa.',
      schedule:[{day:'Mar',time:'07:00'},{day:'Ven',time:'13:00'},{day:'Dom',time:'08:30'}],
      image: img('img/corsi/running.jpg', 'Corsa indoor','111111','B5E33A'), alt:'Fila di tapis roulant nell’area cardio' }
  ],

  /* --------------------- PERSONAL TRAINER ---------------------
     status: 'Disponibile' | 'Pochi slot' | 'Non disponibile'
     slots: fasce in cui lavora (mattina | pomeriggio | sera)            */
  trainers: [
    { id:'bellini', name:'Marco Bellini', role:'Forza e powerlifting', years:12, status:'Pochi slot',
      certs:['Strength Coach Liv. 3, Accademia Lombarda Allenatori','Istruttore di sollevamento pesi (diploma fittizio)'],
      desc:'Ex atleta di powerlifting. Lavora su tecnica dei fondamentali e programmazione dei carichi.',
      specs:['powerlifting','ipertrofia'], langs:['Italiano','Inglese'], days:['Lun','Mer','Gio','Sab'], slots:['pomeriggio','sera'],
      priceSingle:55, pack:{ sessions:10, price:490 },
      image: img('img/trainer/bellini.jpg', 'Foto trainer','1C1D21','B5E33A',600,750), alt:'Ritratto segnaposto del personal trainer Marco Bellini' },
    { id:'ferri', name:'Giulia Ferri', role:'Dimagrimento e nutrizione sportiva', years:8, status:'Disponibile',
      certs:['Laurea in Scienze Motorie','Corso di nutrizione sportiva, Istituto Benessere Milano (fittizio)'],
      desc:'Imposta percorsi di ricomposizione corporea che uniscono allenamento e abitudini alimentari.',
      specs:['dimagrimento','nutrizione sportiva'], langs:['Italiano','Inglese','Spagnolo'], days:['Lun','Mar','Mer','Ven'], slots:['mattina','pomeriggio'],
      priceSingle:50, pack:{ sessions:10, price:440 },
      image: img('img/trainer/ferri.jpg', 'Foto trainer','1C1D21','B5E33A',600,750), alt:'Ritratto segnaposto della personal trainer Giulia Ferri' },
    { id:'rinaldi', name:'Davide Rinaldi', role:'Riabilitazione post-infortunio', years:15, status:'Pochi slot',
      certs:['Laurea in Scienze Motorie Preventive e Adattate','Specializzazione in rieducazione funzionale (fittizia)'],
      desc:'Segue il rientro in sala dopo infortuni a ginocchio, spalla e schiena, in contatto con il tuo fisioterapista.',
      specs:['riabilitazione post-infortunio','mobilità'], langs:['Italiano','Inglese'], days:['Mar','Gio','Ven'], slots:['mattina','sera'],
      priceSingle:65, pack:{ sessions:10, price:590 },
      image: img('img/trainer/rinaldi.jpg', 'Foto trainer','1C1D21','B5E33A',600,750), alt:'Ritratto segnaposto del personal trainer Davide Rinaldi' },
    { id:'conti', name:'Sara Conti', role:'Running e preparazione atletica', years:9, status:'Disponibile',
      certs:['Allenatrice di atletica leggera (titolo fittizio)','Certificazione Endurance Coach, Scuola MoveLab'],
      desc:'Prepara mezze maratone e maratone con tabelle personalizzate e lavoro di forza specifico.',
      specs:['running','preparazione atletica'], langs:['Italiano','Inglese','Francese'], days:['Mar','Mer','Ven','Dom'], slots:['mattina','pomeriggio'],
      priceSingle:50, pack:{ sessions:10, price:450 },
      image: img('img/trainer/conti.jpg', 'Foto trainer','1C1D21','B5E33A',600,750), alt:'Ritratto segnaposto della personal trainer Sara Conti' },
    { id:'moretti', name:'Luca Moretti', role:'Preparazione atletica e ipertrofia', years:6, status:'Disponibile',
      certs:['Laurea in Scienze Motorie','Functional Coach Liv. 2 (certificazione fittizia)'],
      desc:'Lavora con atleti di sport di squadra e con chi vuole aumentare massa muscolare in modo strutturato.',
      specs:['preparazione atletica','ipertrofia','dimagrimento'], langs:['Italiano'], days:['Lun','Mer','Ven','Sab'], slots:['mattina','sera'],
      priceSingle:45, pack:{ sessions:10, price:400 },
      image: img('img/trainer/moretti.jpg', 'Foto trainer','1C1D21','B5E33A',600,750), alt:'Ritratto segnaposto del personal trainer Luca Moretti' },
    { id:'marchetti', name:'Elena Marchetti', role:'Mobilità e postura', years:11, status:'Non disponibile',
      certs:['Insegnante di Pilates matwork (diploma fittizio)','Corso avanzato di posturologia, Accademia MoveLab'],
      desc:'Specializzata in mobilità, postura e dolore lombare da lavoro sedentario. Agenda piena fino a gennaio.',
      specs:['mobilità','riabilitazione post-infortunio'], langs:['Italiano','Tedesco'], days:['Gio','Sab'], slots:['mattina'],
      priceSingle:55, pack:{ sessions:10, price:500 },
      image: img('img/trainer/marchetti.jpg', 'Foto trainer','1C1D21','B5E33A',600,750), alt:'Ritratto segnaposto della personal trainer Elena Marchetti' },
    { id:'haddad', name:'Omar Haddad', role:'Ipertrofia e nutrizione', years:7, status:'Disponibile',
      certs:['Laurea in Scienze dell’Alimentazione','Bodybuilding Coach (certificazione fittizia)'],
      desc:'Programmi di ipertrofia con piano alimentare indicativo e controlli ogni quattro settimane.',
      specs:['ipertrofia','nutrizione sportiva','powerlifting'], langs:['Italiano','Inglese','Arabo'], days:['Lun','Mar','Gio','Ven'], slots:['sera'],
      priceSingle:50, pack:{ sessions:10, price:450 },
      image: img('img/trainer/haddad.jpg', 'Foto trainer','1C1D21','B5E33A',600,750), alt:'Ritratto segnaposto del personal trainer Omar Haddad' }
  ],

  ptSteps: [
    { title:'Prima consulenza gratuita', text:'Trenta minuti per conoscerci, capire da dove parti e cosa vuoi ottenere.' },
    { title:'Analisi degli obiettivi', text:'Test di mobilità, forza e composizione corporea per fissare obiettivi misurabili.' },
    { title:'Piano personalizzato', text:'Un programma su misura per i giorni e il tempo che hai davvero a disposizione.' },
    { title:'Sessioni guidate', text:'Il trainer ti segue su tecnica, carichi e ritmo, una o più volte a settimana.' },
    { title:'Monitoraggio dei progressi', text:'Controlli periodici di misure, carichi e sensazioni, condivisi con te.' },
    { title:'Aggiornamento del programma', text:'Ogni 4–6 settimane il piano cambia in base ai risultati raggiunti.' }
  ],

  /* ----------------------- ABBONAMENTI ----------------------- */
  memberships: [
    { id:'trial', name:'Prova gratuita', price:0, unit:'7 giorni', note:'Una volta per persona. Serve un documento all’ingresso.', badge:'',
      included:['3 ingressi in sala','2 corsi di gruppo','Consulenza iniziale con un trainer'], excluded:['Sconto Bar Fit','Eventi riservati agli iscritti'],
      compare:{ accessi:'3 ingressi', corsi:'2 lezioni', bar:false, eventi:false, consulenza:true, pt:'—', freeze:false } },
    { id:'monthly', name:'Mensile', price:59, unit:'/mese', note:'Rinnovo mensile, disdici quando vuoi con 15 giorni di preavviso.', badge:'',
      included:['Accesso illimitato','8 corsi al mese','Sconto 20% Shop e Bar Fit','Accesso agli eventi'], excluded:['Sessioni PT incluse','Congelamento abbonamento'],
      compare:{ accessi:'Illimitati', corsi:'8 al mese', bar:true, eventi:true, consulenza:true, pt:'—', freeze:false } },
    { id:'quarterly', name:'Trimestrale', price:159, oldPrice:177, unit:'/3 mesi', note:'Pari a 53 € al mese, pagamento unico.', badge:'',
      included:['Accesso illimitato','Corsi illimitati','Sconto 20% Shop e Bar Fit','Accesso agli eventi','1 sessione con un PT'], excluded:['Congelamento abbonamento'],
      compare:{ accessi:'Illimitati', corsi:'Illimitati', bar:true, eventi:true, consulenza:true, pt:'1', freeze:false } },
    { id:'annual', name:'Annuale', price:549, oldPrice:708, unit:'/anno', note:'Pari a 45,75 € al mese. Pagabile anche in 2 rate.', badge:'Il più scelto', featured:true,
      included:['Accesso illimitato','Corsi illimitati','Sconto 20% Shop e Bar Fit','Eventi con priorità di iscrizione','3 sessioni con un PT','Congelamento fino a 30 giorni'], excluded:[],
      compare:{ accessi:'Illimitati', corsi:'Illimitati', bar:true, eventi:true, consulenza:true, pt:'3', freeze:true } },
    { id:'students', name:'Studenti', price:39, unit:'/mese', note:'Under 26 con tessera universitaria o di istituto valida.', badge:'Under 26',
      included:['Accesso illimitato','8 corsi al mese','Sconto 20% Shop e Bar Fit','Accesso agli eventi'], excluded:['Sessioni PT incluse','Congelamento abbonamento'],
      compare:{ accessi:'Illimitati', corsi:'8 al mese', bar:true, eventi:true, consulenza:true, pt:'—', freeze:false } },
    { id:'corporate', name:'Corporate', price:42, unit:'/mese a persona', note:'Per aziende da 5 dipendenti in su, fatturazione unica.', badge:'Aziende', quote:true,
      included:['Accesso illimitato','Corsi illimitati','Sconto 20% Shop e Bar Fit','Accesso agli eventi','Workshop in azienda 2 volte l’anno'], excluded:['Congelamento abbonamento'],
      compare:{ accessi:'Illimitati', corsi:'Illimitati', bar:true, eventi:true, consulenza:true, pt:'—', freeze:false } }
  ],
  compareRows: [
    { key:'price', label:'Prezzo' }, { key:'accessi', label:'Accessi in sala' }, { key:'corsi', label:'Corsi di gruppo' },
    { key:'bar', label:'Sconto 20% Shop e Bar Fit' }, { key:'eventi', label:'Eventi e challenge' }, { key:'consulenza', label:'Consulenza iniziale' },
    { key:'pt', label:'Sessioni PT incluse' }, { key:'freeze', label:'Congelamento' }
  ],
  membershipPromos: [
    { title:'Sconto nuovi iscritti', text:'30% di sconto sul primo abbonamento per chi non è mai stato iscritto.', code:'BENVENUTO30', ends:inDays(20), icon:'sparkles' },
    { title:'Black Friday', text:'30% su abbonamenti e shop, solo per pochi giorni.', code:'BLACKFIT', ends:inDays(2,23,59), icon:'tag', hot:true },
    { title:'Natale', text:'Regala un trimestrale: in omaggio la felpa MoveLab Wear.', code:'NATALE25', ends:inDays(42), icon:'gift' },
    { title:'Porta un amico', text:'Un mese gratis a te e uno a chi porti, quando si iscrive con almeno un trimestrale.', code:'', ends:null, icon:'users' },
    { title:'Offerta studenti', text:'Un ulteriore 15% sul piano Studenti trimestrale fino a fine anno.', code:'STUDIO15', ends:inDays(48), icon:'graduation-cap' }
  ],

  /* ------------------------ OFFERTE ------------------------
     status: 'attiva' (countdown alla fine) | 'in-arrivo' (countdown all'inizio) | 'conclusa'
     scope: dove vale l'offerta
     color: colore dello sticker dello sconto (promo = giallo, lime, white)        */
  offers: [
    { id:'blackfriday', title:'Black Friday', discount:'−30%', text:'Su tutti gli abbonamenti e su tutto lo shop. Codice valido online e in reception.', status:'attiva', ends:inDays(2,23,59), code:'BLACKFIT', scope:['Abbonamenti','Shop'], icon:'tag', color:'promo', link:'abbonamenti', featured:true },
    { id:'benvenuto', title:'Nuovi iscritti', discount:'−30%', text:'Sul primo abbonamento a pagamento, per chi non è mai stato iscritto.', status:'attiva', ends:inDays(20), code:'BENVENUTO30', scope:['Abbonamenti'], icon:'sparkles', color:'lime', link:'abbonamenti', featured:true },
    { id:'amico', title:'Porta un amico', discount:'1 mese', text:'Un mese gratis a te e uno a chi porti, se si iscrive con almeno un trimestrale.', status:'attiva', ends:null, code:'', scope:['Abbonamenti'], icon:'users', color:'lime', link:'contatti' },
    { id:'happyhour', title:'Happy hour Bar Fit', discount:'2x1', text:'Dal lunedì al venerdì dalle 16 alle 18, il secondo shake è gratis.', status:'attiva', ends:null, code:'', scope:['Bar Fit'], icon:'cup-soda', color:'lime', link:'bar' },
    { id:'natale', title:'Natale', discount:'−25%', text:'Su abbigliamento e accessori MoveLab Wear, più gift card in tutti i tagli.', status:'in-arrivo', starts:inDays(18,0,0), code:'NATALE25', scope:['Shop'], icon:'gift', color:'promo', link:'shop' },
    { id:'capodanno', title:'Nuovo anno', discount:'0 €', text:'Quota di iscrizione azzerata e 2 sessioni PT in omaggio con l’annuale.', status:'in-arrivo', starts:inDays(49,0,0), code:'', scope:['Abbonamenti','Personal trainer'], icon:'sparkles', color:'white', link:'abbonamenti' },
    { id:'sanvalentino', title:'San Valentino', discount:'2x1', text:'Allenatevi in coppia: pacchetto PT da 10 sessioni condivisibile in due.', status:'in-arrivo', starts:inDays(90,0,0), code:'', scope:['Personal trainer'], icon:'heart', color:'promo', link:'trainer' },
    { id:'primavera', title:'Primavera', discount:'−20%', text:'Sui pacchetti PT dedicati a dimagrimento e ricomposizione corporea.', status:'in-arrivo', starts:inDays(130,0,0), code:'', scope:['Personal trainer'], icon:'leaf', color:'lime', link:'trainer' },
    { id:'estate', title:'Summer pass', discount:'129 €', text:'Tre mesi estivi, corsi inclusi, con il pacchetto shake del Bar Fit.', status:'in-arrivo', starts:inDays(200,0,0), code:'', scope:['Abbonamenti','Bar Fit'], icon:'sun', color:'promo', link:'abbonamenti' },
    { id:'backtoschool', title:'Back to School, Back to Gym', discount:'−15%', text:'Sui piani Studenti e Trimestrale per chi riprendeva dopo l’estate.', status:'conclusa', code:'', scope:['Abbonamenti'], icon:'graduation-cap', color:'white', link:'abbonamenti' }
  ],

  // Tessere abbonato DEMO (8 cifre): servono solo per provare lo sconto del 20% nel carrello.
  // In un sito reale la verifica avverrebbe sul server, non nel browser.
  members: [
    { code:'10482736', name:'Mario Rossi', plan:'Annuale' },
    { code:'20591847', name:'Giulia Bianchi', plan:'Mensile' },
    { code:'30715928', name:'Luca Verdi', plan:'Studenti' }
  ],

  // Codici sconto accettati dal carrello (applicazione solo simulata)
  coupons: [
    { code:'BLACKFIT', percent:30, scope:['shop','plan'], from:null, to:inDays(2,23,59) },
    { code:'BENVENUTO30', percent:30, scope:['plan'], from:null, to:inDays(20) },
    { code:'STUDIO15', percent:15, scope:['plan'], from:null, to:inDays(48) },
    { code:'NATALE25', percent:25, scope:['shop'], from:inDays(18,0,0), to:inDays(42) }
  ],

  /* -------------------------- SHOP --------------------------
     sizes: se presente, l'utente sceglie la taglia prima di aggiungere al carrello */
  shopProducts: [
    { id:'whey', name:'Whey Isolate Vaniglia 900 g', category:'Integratori', price:34.90, oldPrice:42.90, rating:4.8, stock:24, badge:'In offerta', best:true,
      desc:'Proteine isolate del siero del latte, 27 g di proteine per dose. Si scioglie bene anche in acqua.', image: img('img/shop/whey.jpg', 'Whey Isolate','F4F4F4','111111',600,600), alt:'Barattolo di proteine whey gusto vaniglia' },
    { id:'creatina', name:'Creatina Monoidrato 300 g', category:'Integratori', price:19.90, rating:4.9, stock:40, badge:'Bestseller', best:true,
      desc:'Creatina micronizzata senza aromi. 3 g al giorno, in qualsiasi momento.', image: img('img/shop/creatina.jpg', 'Creatina','F4F4F4','111111',600,600), alt:'Confezione di creatina monoidrato in polvere' },
    { id:'vegan', name:'Proteine vegetali Cacao 750 g', category:'Integratori', price:32.50, rating:4.6, stock:12, badge:'Nuovo',
      desc:'Mix di pisello e riso, 22 g di proteine per dose. Vegano e senza lattosio.', image: img('img/shop/vegan.jpg', 'Proteine vegetali','F4F4F4','111111',600,600), alt:'Barattolo di proteine vegetali al cacao' },
    { id:'preworkout', name:'Pre-workout Agrumi 300 g', category:'Integratori', price:24.90, rating:4.4, stock:4, badge:'',
      desc:'Caffeina, citrullina e beta-alanina. Da assumere 20 minuti prima dell’allenamento.', image: img('img/shop/preworkout.jpg', 'Pre-workout','F4F4F4','111111',600,600), alt:'Confezione di pre-workout gusto agrumi' },
    { id:'barrette', name:'Barrette proteiche, box da 12', category:'Integratori', price:21.00, oldPrice:25.20, rating:4.7, stock:30, badge:'In offerta', best:true,
      desc:'Gusti misti cioccolato, nocciola e cocco. 20 g di proteine a barretta.', image: img('img/shop/barrette.jpg', 'Barrette','F4F4F4','111111',600,600), alt:'Scatola di barrette proteiche assortite' },
    { id:'elettroliti', name:'Elettroliti Limone, 20 bustine', category:'Integratori', price:14.90, rating:4.5, stock:18, badge:'',
      desc:'Sodio, potassio e magnesio senza zuccheri aggiunti, per allenamenti lunghi.', image: img('img/shop/elettroliti.jpg', 'Elettroliti','F4F4F4','111111',600,600), alt:'Bustine di sali minerali al limone' },
    { id:'tshirt', name:'T-shirt tecnica MoveLab Wear', category:'Abbigliamento', price:24.90, oldPrice:29.90, rating:4.6, stock:35, badge:'In offerta', sizes:['XS','S','M','L','XL','XXL'],
      desc:'Tessuto traspirante ad asciugatura rapida, taglio regolare. Logo MoveLab sul petto.', image: img('img/shop/tshirt.jpg', 'T-shirt tecnica','111111','B5E33A',600,600), alt:'T-shirt tecnica nera con logo verde lime' },
    { id:'felpa', name:'Felpa con cappuccio MoveLab Wear', category:'Abbigliamento', price:54.90, rating:4.8, stock:14, badge:'Bestseller', best:true, sizes:['S','M','L','XL'],
      desc:'Cotone felpato pesante, tasca a marsupio e cappuccio foderato.', image: img('img/shop/felpa.jpg', 'Felpa','111111','B5E33A',600,600), alt:'Felpa con cappuccio grigio antracite' },
    { id:'leggings', name:'Leggings performance', category:'Abbigliamento', price:39.90, rating:4.7, stock:20, badge:'Nuovo', sizes:['XS','S','M','L','XL'],
      desc:'Vita alta, tessuto coprente e tasca laterale per il telefono.', image: img('img/shop/leggings.jpg', 'Leggings','111111','B5E33A',600,600), alt:'Leggings sportivi neri a vita alta' },
    { id:'shorts', name:'Shorts da training', category:'Abbigliamento', price:27.90, rating:4.3, stock:22, badge:'', sizes:['S','M','L','XL','XXL'],
      desc:'Leggeri ed elasticizzati, con slip interno e tasca con zip.', image: img('img/shop/shorts.jpg', 'Shorts','111111','B5E33A',600,600), alt:'Pantaloncini da allenamento blu scuro' },
    { id:'shaker', name:'Shaker 700 ml', category:'Accessori', price:9.90, rating:4.5, stock:60, badge:'', best:true,
      desc:'Con griglia miscelatrice e scomparto per la polvere. Lavabile in lavastoviglie.', image: img('img/shop/shaker.jpg', 'Shaker','B5E33A','111111',600,600), alt:'Shaker trasparente con tappo verde lime' },
    { id:'guanti', name:'Guanti da allenamento', category:'Accessori', price:16.90, rating:4.2, stock:16, badge:'', sizes:['S','M','L','XL'],
      desc:'Palmo imbottito e polsino regolabile per un grip sicuro sul bilanciere.', image: img('img/shop/guanti.jpg', 'Guanti','B5E33A','111111',600,600), alt:'Paio di guanti da palestra neri' },
    { id:'borraccia', name:'Borraccia termica 750 ml', category:'Accessori', price:19.90, rating:4.8, stock:25, badge:'',
      desc:'Acciaio inox a doppia parete, mantiene fresco per 24 ore.', image: img('img/shop/borraccia.jpg', 'Borraccia','B5E33A','111111',600,600), alt:'Borraccia termica in acciaio opaco' },
    { id:'elastici', name:'Set elastici fitness (3 pz)', category:'Accessori', price:18.50, oldPrice:22.00, rating:4.4, stock:3, badge:'In offerta',
      desc:'Tre resistenze diverse, con sacchetto. Ideali per riscaldamento e allenamento a casa.', image: img('img/shop/elastici.jpg', 'Elastici','B5E33A','111111',600,600), alt:'Tre elastici fitness di colori diversi' }
  ],

  /* ------------------------ BAR FIT ------------------------ */
  barMenu: [
    { id:'choco', name:'Choco Power', category:'Shake proteici', price:5.50, kcal:340, protein:30, tags:[], desc:'Cacao amaro, banana, whey e bevanda d’avena.', image: img('img/bar/choco.jpg', 'Choco Power','B5E33A','111111',400,400), alt:'Shake al cacao in bicchiere alto' },
    { id:'berry', name:'Berry Recovery', category:'Shake proteici', price:5.80, kcal:290, protein:26, tags:['Vegano'], desc:'Frutti di bosco, proteine di pisello e latte di cocco.', image: img('img/bar/berry.jpg', 'Berry Recovery','B5E33A','111111',400,400), alt:'Shake ai frutti di bosco viola' },
    { id:'peanut', name:'Peanut Gainer', category:'Shake proteici', price:6.50, kcal:520, protein:35, tags:[], desc:'Burro d’arachidi, avena, whey e latte. Per chi vuole aumentare massa.', image: img('img/bar/peanut.jpg', 'Peanut Gainer','B5E33A','111111',400,400), alt:'Shake cremoso al burro di arachidi' },
    { id:'green', name:'Green Shake', category:'Shake proteici', price:5.90, kcal:220, protein:20, tags:['Vegano','Senza glutine'], desc:'Spinaci, mela verde, zenzero e proteine vegetali.', image: img('img/bar/green.jpg', 'Green Shake','B5E33A','111111',400,400), alt:'Shake verde con spinaci e mela' },
    { id:'espresso', name:'Espresso', category:'Caffetteria', price:1.20, kcal:2, protein:0, tags:['Vegano'], desc:'Miscela 100% arabica.', image: img('img/bar/espresso.jpg', 'Espresso','111111','B5E33A',400,400), alt:'Tazzina di caffè espresso' },
    { id:'cappuccino', name:'Cappuccino d’avena', category:'Caffetteria', price:1.80, kcal:110, protein:3, tags:['Vegano'], desc:'Espresso e bevanda d’avena montata.', image: img('img/bar/cappuccino.jpg', 'Cappuccino','111111','B5E33A',400,400), alt:'Cappuccino con schiuma in tazza bianca' },
    { id:'protcoffee', name:'Caffè proteico', category:'Caffetteria', price:3.20, kcal:130, protein:20, tags:[], desc:'Doppio espresso shakerato con whey alla vaniglia.', image: img('img/bar/protcoffee.jpg', 'Caffè proteico','111111','B5E33A',400,400), alt:'Caffè shakerato in bicchiere con ghiaccio' },
    { id:'matcha', name:'Matcha latte', category:'Caffetteria', price:3.50, kcal:140, protein:4, tags:['Senza glutine'], desc:'Tè matcha e latte, caldo o freddo.', image: img('img/bar/matcha.jpg', 'Matcha latte','111111','B5E33A',400,400), alt:'Matcha latte verde in tazza' },
    { id:'acqua', name:'Acqua naturale o frizzante 0,5 L', category:'Bevande', price:1.00, kcal:0, protein:0, tags:['Vegano'], desc:'Bottiglia in vetro riutilizzabile.', image: img('img/bar/acqua.jpg', 'Acqua','1C1D21','FFFFFF',400,400), alt:'Bottiglia d’acqua in vetro' },
    { id:'isotonica', name:'Bevanda isotonica', category:'Bevande', price:2.50, kcal:120, protein:0, tags:['Vegano'], desc:'Sali minerali e carboidrati per allenamenti lunghi.', image: img('img/bar/isotonica.jpg', 'Isotonica','1C1D21','FFFFFF',400,400), alt:'Bottiglia di bevanda isotonica arancione' },
    { id:'centrifugato', name:'Centrifugato arancia, carota e zenzero', category:'Bevande', price:4.50, kcal:130, protein:2, tags:['Vegano','Senza glutine'], desc:'Preparato al momento con frutta e verdura fresche.', image: img('img/bar/centrifugato.jpg', 'Centrifugato','1C1D21','FFFFFF',400,400), alt:'Centrifugato arancione con fetta di zenzero' },
    { id:'te', name:'Tè freddo senza zucchero', category:'Bevande', price:2.80, kcal:5, protein:0, tags:['Vegano'], desc:'Tè nero infuso a freddo con limone.', image: img('img/bar/te.jpg', 'Tè freddo','1C1D21','FFFFFF',400,400), alt:'Bicchiere di tè freddo con limone' },
    { id:'poke', name:'Poke pollo e riso integrale', category:'Pranzi fit', price:9.90, kcal:560, protein:42, tags:[], desc:'Pollo alla griglia, riso integrale, edamame, avocado e salsa di soia.', image: img('img/bar/poke.jpg', 'Poke pollo','FFD60A','111111',400,400), alt:'Ciotola di poke con pollo e riso' },
    { id:'quinoa', name:'Bowl quinoa e ceci', category:'Pranzi fit', price:9.50, kcal:520, protein:22, tags:['Vegano','Senza glutine'], desc:'Quinoa, ceci speziati, verdure arrosto e hummus.', image: img('img/bar/quinoa.jpg', 'Bowl quinoa','FFD60A','111111',400,400), alt:'Bowl di quinoa con ceci e verdure' },
    { id:'wrap', name:'Wrap tacchino e avocado', category:'Pranzi fit', price:7.90, kcal:480, protein:34, tags:[], desc:'Piadina integrale, tacchino, avocado, rucola e yogurt greco.', image: img('img/bar/wrap.jpg', 'Wrap','FFD60A','111111',400,400), alt:'Wrap tagliato a metà con tacchino e avocado' },
    { id:'salmone', name:'Insalata di salmone', category:'Pranzi fit', price:10.90, kcal:450, protein:32, tags:['Senza glutine'], desc:'Salmone, patate dolci, spinacini, semi di sesamo e lime.', image: img('img/bar/salmone.jpg', 'Insalata salmone','FFD60A','111111',400,400), alt:'Insalata con salmone e patate dolci' },
    { id:'barretta', name:'Barretta proteica', category:'Snack', price:2.80, kcal:210, protein:20, tags:[], desc:'Gusti a rotazione, chiedi al bancone.', image: img('img/bar/barretta.jpg', 'Barretta','F4F4F4','111111',400,400), alt:'Barretta proteica al cioccolato' },
    { id:'yogurt', name:'Yogurt greco e frutti di bosco', category:'Snack', price:3.90, kcal:180, protein:15, tags:['Senza glutine'], desc:'Yogurt greco 0%, frutti di bosco e granola senza zucchero.', image: img('img/bar/yogurt.jpg', 'Yogurt greco','F4F4F4','111111',400,400), alt:'Coppetta di yogurt greco con frutti di bosco' },
    { id:'pancake', name:'Pancake proteici', category:'Snack', price:5.50, kcal:380, protein:28, tags:[], desc:'Tre pancake con albume e avena, sciroppo d’acero a parte.', image: img('img/bar/pancake.jpg', 'Pancake','F4F4F4','111111',400,400), alt:'Pila di pancake con frutti rossi' }
  ],

  /* ------------------------- EVENTI ------------------------- */
  events: [
    { id:'openday', title:'Black Friday Open Day', type:'Open Day', date:inDays(2,10,0), time:'10:00–20:00', place:'Tutta la palestra', price:0, spots:60,
      desc:'Ingresso libero per tutti: lezioni di prova ogni ora, check-up gratuiti e promo riservate.', image: img('img/eventi/openday.jpg', 'Open Day','FFD60A','111111'), alt:'Reception della palestra decorata per l’open day' },
    { id:'runclub', title:'Running Club del sabato', type:'Community', date:inDays(5,8,0), time:'08:00', place:'Ritrovo davanti alla palestra', price:0, spots:25,
      desc:'Uscita di gruppo da 5 o 10 km con Sara Conti, a ritmo libero. Colazione al Bar Fit al rientro.', image: img('img/eventi/runclub.jpg', 'Running Club','1C1D21','B5E33A'), alt:'Gruppo di runner in partenza all’alba' },
    { id:'hiit100', title:'Challenge HIIT 100', type:'Challenge', date:inDays(9,18,30), time:'18:30', place:'Sala corsi', price:10, spots:18,
      desc:'Cento ripetizioni per cinque esercizi nel minor tempo possibile. Classifica e premi dallo shop.', image: img('img/eventi/hiit100.jpg', 'Challenge HIIT','111111','B5E33A'), alt:'Partecipanti che eseguono burpees durante una challenge' },
    { id:'nutrizione', title:'Workshop: alimentazione e performance', type:'Workshop', date:inDays(16,19,0), time:'19:00', place:'Sala riunioni', price:15, spots:30,
      desc:'Giulia Ferri spiega come organizzare i pasti intorno all’allenamento. Assaggi del Bar Fit inclusi.', image: img('img/eventi/nutrizione.jpg', 'Workshop nutrizione','F4F4F4','111111'), alt:'Tavolo con ciotole di cibo sano e appunti' },
    { id:'wellness', title:'Wellness Sunday', type:'Wellness', date:inDays(23,9,30), time:'09:30', place:'Sala yoga e Bar Fit', price:25, spots:20,
      desc:'Yoga, mobilità guidata e brunch proteico. Una mattina per ricaricarsi.', image: img('img/eventi/wellness.jpg', 'Wellness Sunday','F4F4F4','1C1D21'), alt:'Sala yoga preparata con tappetini e candele' },
    { id:'xmas', title:'Xmas Functional Party', type:'Community', date:inDays(38,19,30), time:'19:30', place:'Area funzionale', price:0, spots:40,
      desc:'Allenamento a squadre a tema natalizio, musica e brindisi analcolico al Bar Fit.', image: img('img/eventi/xmas.jpg', 'Xmas Party','FFD60A','111111'), alt:'Area funzionale con decorazioni natalizie' },
    { id:'powermeet', title:'Powerlifting Meet interno', type:'Challenge', date:inDays(51,15,0), time:'15:00', place:'Sala pesi', price:20, spots:16,
      desc:'Gara interna di squat, panca e stacco con giudici e categorie di peso. Aperta anche al pubblico.', image: img('img/eventi/powermeet.jpg', 'Powerlifting Meet','111111','FFD60A'), alt:'Bilanciere carico su pedana da sollevamento' }
  ],

  testimonials: [
    { name:'Francesca R.', since:'Iscritta dal 2023', rating:5, text:'Mi alleno in pausa pranzo: prenoto il posto a Total Body dal telefono e in 50 minuti sono di nuovo in ufficio.' },
    { name:'Matteo L.', since:'Iscritto dal 2021', rating:5, text:'Dopo l’operazione al ginocchio Davide mi ha riportato a fare squat senza dolore. In sala c’è sempre qualcuno che ti corregge.' },
    { name:'Aisha K.', since:'Iscritta dal 2024', rating:5, text:'Ho preparato la mia prima mezza maratona con Sara. Le tabelle cambiavano ogni settimana in base a come stavo.' },
    { name:'Giorgio P.', since:'Iscritto dal 2022', rating:4, text:'Sala pesi ampia e mai affollata, anche alle sette di sera. Lo shake al burro d’arachidi dopo l’allenamento è diventato un rito.' },
    { name:'Lucia M.', since:'Iscritta dal 2025', rating:5, text:'Sono arrivata con la prova gratuita senza aver mai fatto palestra. Il clima è tranquillo e nessuno ti fa sentire fuori posto.' }
  ],

  faqs: [
    { q:'Come funziona la prova gratuita?', a:'Hai 7 giorni con 3 ingressi in sala, 2 corsi di gruppo e una consulenza con un trainer. Basta prenotarla dal sito e presentarsi con un documento.' },
    { q:'Serve un certificato medico?', a:'Per iscriversi è richiesto un certificato medico per attività sportiva non agonistica. Per la prova gratuita basta un’autocertificazione.' },
    { q:'Posso congelare l’abbonamento?', a:'Sì, con l’Annuale puoi sospenderlo fino a 30 giorni all’anno, per esempio per vacanze o infortuni.' },
    { q:'Come si prenotano i corsi?', a:'Dalla pagina Corsi o da Prenotazioni. Puoi annullare fino a 2 ore prima; dopo tre assenze non annullate la prenotazione online si sospende per una settimana.' },
    { q:'Come funziona lo sconto abbonati?', a:'Il 20% vale per tutti gli abbonamenti a pagamento, su Shop e Bar Fit. Online inserisci nel carrello il codice della tessera (8 cifre), al bancone basta mostrarla.' },
    { q:'C’è un parcheggio?', a:'Abbiamo una convenzione con un parcheggio a 100 metri (2 ore a 3 €) e una rastrelliera bici coperta davanti all’ingresso.' },
    { q:'Ci sono armadietti e docce?', a:'Sì, spogliatoi separati con docce, phon e armadietti con lucchetto digitale, inclusi in tutti gli abbonamenti.' },
    { q:'Avete convenzioni per aziende?', a:'Sì, con l’abbonamento Corporate dai 5 dipendenti in su. Scrivici dalla pagina Contatti scegliendo “Abbonamento Corporate”.' }
  ],

  gymAreas: [
    { icon:'dumbbell', name:'Sala pesi', size:'420 m²', text:'8 rack, 2 pedane da stacco, manubri fino a 50 kg e macchine isotoniche.' },
    { icon:'heart-pulse', name:'Area cardio', size:'180 m²', text:'Tapis roulant, tapis curvi, ellittiche, vogatori e air bike affacciati sulle vetrate.' },
    { icon:'activity', name:'Area funzionale', size:'200 m²', text:'Prato sintetico, slitte, kettlebell, wall ball e una struttura per trazioni.' },
    { icon:'move', name:'Area stretching e mobilità', size:'80 m²', text:'Tappetini, rulli, palle e spalliere in una zona tranquilla e luminosa.' },
    { icon:'users', name:'Sala corsi di gruppo', size:'160 m²', text:'Impianto audio, pavimento ammortizzato e 22 bike per lo spinning.' },
    { icon:'zap', name:'Area boxing e functional', size:'120 m²', text:'Sacchi pesanti, sacca a pera, colpitori e corde per il condizionamento.' },
    { icon:'shower-head', name:'Spogliatoi', size:'2 zone', text:'Docce, phon, armadietti con lucchetto digitale e area beauty.' },
    { icon:'coffee', name:'Bar Fit', size:'40 posti', text:'Shake, caffetteria e pranzi fit, con tavoli e prese per lavorare.' }
  ],

  // SOSTITUISCI: foto reali della palestra (formato consigliato 4:3, es. 1200x900)
  gallery: [
    { image: img('img/galleria/01-sala-pesi.jpg', 'Sala pesi','1b1b1b','B5E33A',1200,800), alt:'Panoramica della sala pesi con rack allineati', size:'' },
    { image: img('img/galleria/02-area-cardio.jpg', 'Area cardio','1C1D21','B5E33A',800,800), alt:'Area cardio con tapis roulant', size:'' },
    { image: img('img/galleria/03-area-funzionale.jpg', 'Functional','1b1b1b','FFD60A',800,800), alt:'Area funzionale con prato sintetico', size:'' },
    { image: img('img/galleria/04-sala-corsi.jpg', 'Sala corsi','1C1D21','FFFFFF',1200,600), alt:'Sala corsi durante una lezione', size:'' },
    { image: img('img/galleria/05-area-boxing.jpg', 'Boxing','1b1b1b','B5E33A',800,1200), alt:'Sacchi da boxe nell’area boxing', size:'' },
    { image: img('img/galleria/06-spogliatoi.jpg', 'Spogliatoi','F4F4F4','111111',800,800), alt:'Spogliatoi con armadietti in legno', size:'' },
    { image: img('img/galleria/07-bar-fit.jpg', 'Bar Fit','B5E33A','111111',800,800), alt:'Bancone del Bar Fit', size:'' },
    { image: img('img/galleria/08-area-stretching.jpg', 'Stretching','1C1D21','B5E33A',1200,600), alt:'Area stretching con tappetini', size:'' }
  ],

  services: [
    'Consulenza iniziale e scheda di allenamento', 'Analisi della composizione corporea ogni 3 mesi', 'Wi-Fi gratuito in tutta la struttura',
    'Armadietti con lucchetto digitale', 'Docce, phon e prodotti per la doccia', 'Asciugamani a noleggio (1 €)', 'Rastrelliera bici coperta', 'Istruttore sempre presente in sala'
  ],

  reach: [
    { icon:'train-front', title:'Metropolitana', text:'Fermata a circa 400 metri, 5 minuti a piedi.' },
    { icon:'bus', title:'Tram e autobus', text:'Tre linee con fermata a 200 metri dall’ingresso.' },
    { icon:'car', title:'Auto', text:'Parcheggio convenzionato a 100 metri: 2 ore a 3 € con la tessera MoveLab.' },
    { icon:'bike', title:'Bici e monopattino', text:'Rastrelliera coperta e area di sosta davanti all’ingresso.' }
  ]
};

