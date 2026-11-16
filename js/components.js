/* =====================================================================
   MoveLab Milano — components.js
   Card e finestre di dettaglio riutilizzate in più pagine (corsi, trainer,
   eventi, prodotti, Bar Fit, offerte), gestione dei click e avvio pagina.
   ===================================================================== */
'use strict';

/* ---------- Selettore "− 1 +" mostrato quando il prodotto è già nel carrello ---------- */
function qtyControl(kind, id, label) {
  const n = qtyInCart(kind, id);
  if (!n) return '';
  return `<div class="qty-step" role="group" aria-label="${esc(label)} nel carrello: ${n}">
    <button type="button" data-step="-1" data-kind="${kind}" data-id="${id}" aria-label="Togli un ${esc(label)}">${icon('minus')}</button>
    <span aria-live="polite">${n}</span>
    <button type="button" data-step="1" data-kind="${kind}" data-id="${id}" aria-label="Aggiungi un ${esc(label)}">${icon('plus')}</button></div>`;
}

/* ---------- Banner tessera abbonato (Shop e Bar Fit) ---------- */
function renderMemberBanner() {
  const el = $('#member-banner'); if (!el) return;
  el.className = 'member-banner' + (cart.member ? ' active' : '');
  paint(el, cart.member
    ? `<span class="ic">${icon('badge-check')}</span><p><strong>Ciao ${esc(cart.member.name.split(' ')[0])}, sconto abbonato attivo.</strong> Il 20% è già applicato ai prezzi di Shop e Bar Fit.</p><button class="btn btn-ghost btn-sm" data-open-member>Gestisci tessera</button>`
    : `<span class="ic">${icon('credit-card')}</span><p><strong>Sei abbonato?</strong> Inserisci nel carrello il codice della tua tessera (8 cifre) e avrai il 20% di sconto su Shop e Bar Fit.</p><button class="btn btn-lime btn-sm" data-open-member>Inserisci il codice</button>`);
}
document.addEventListener('cart:change', renderMemberBanner);

/* ---------- Corsi ---------- */
function courseBadge(c) {
  if (c.spots === 0) return ['Completo', 'b-ink'];
  if (c.spots <= 3) return ['Ultimi posti', 'b-promo'];
  if (c.badge === 'Nuovo') return ['Nuovo', 'b-dark'];
  if (c.badge === 'Popolare') return ['Popolare', 'b-ink'];
  return ['Disponibile', 'b-lime'];
}
function courseCard(c) {
  const [b, bc] = courseBadge(c), pct = Math.round((c.capacity - c.spots) / c.capacity * 100);
  return `<article class="card" data-reveal>
    <div class="card-media"><img src="${c.image}" alt="${esc(c.alt)}" loading="lazy" width="800" height="600">
      <span class="badge ${bc} on-media">${b}</span><span class="badge level lv-${c.level}">${cap(c.level)}</span></div>
    <div class="card-body">
      <h3>${c.name}</h3>
      <p class="card-text">${c.desc}</p>
      <div class="meta"><span>${icon('clock')}${c.duration} min</span><span>${icon('flame')}${c.kcal} kcal</span><span>${icon('user')}${c.instructor}</span></div>
      <ul class="times" aria-label="Giorni e orari">${c.schedule.map(s => `<li>${s.day} ${s.time}</li>`).join('')}</ul>
      <div><div class="spots-label"><span>${c.spots ? c.spots + ' posti liberi' : 'Nessun posto libero'}</span><span>su ${c.capacity}</span></div>
        <div class="spots-bar ${c.spots <= 3 ? 'low' : ''}" aria-hidden="true"><span style="width:${pct}%"></span></div></div>
      <div class="card-actions pair">
        <button class="btn btn-lime btn-sm" data-book="corso" data-id="${c.id}" ${c.spots ? '' : 'disabled'}>Prenota</button>
        <button class="btn btn-ghost btn-sm" data-course="${c.id}">Dettagli</button>
      </div>
    </div></article>`;
}
function nextSessions(c, n = 4) {
  const out = [], d = new Date();
  for (let i = 0; i < 15 && out.length < n; i++) {
    const k = dayKeyOf(d);
    c.schedule.filter(s => s.day === k).forEach(s => { if (i > 0 || toMin(s.time) > nowMin() + 30) out.push({ date: new Date(d), time: s.time }); });
    d.setDate(d.getDate() + 1);
  }
  return out.slice(0, n);
}
function openCourseModal(id) {
  const c = courseById(id); if (!c) return;
  const t = SITE_DATA.trainers.find(x => x.name === c.instructor), [b, bc] = courseBadge(c);
  openModal(`<div class="modal-media"><img src="${c.image}" alt="${esc(c.alt)}"></div>
    <div class="modal-content">
      <div class="chips"><span class="badge ${bc}">${b}</span><span class="badge b-gray">${cap(c.level)}</span><span class="badge b-gray">${c.category}</span></div>
      <h2>${c.name}</h2>
      <p class="lead">${c.desc}</p>
      <div class="meta"><span>${icon('clock')}${c.duration} minuti</span><span>${icon('flame')}${c.kcal} kcal stimate</span><span>${icon('users')}${c.spots} posti liberi su ${c.capacity}</span></div>
      <p>Istruttore: <strong>${c.instructor}</strong> ${t ? `<button class="link" data-trainer="${t.id}">Vedi il profilo</button>` : ''}</p>
      <h3>Prossime lezioni</h3>
      <div class="schedule-list">${nextSessions(c).map(s => `<div class="slot-row"><span class="slot-time">${s.time}</span><span class="slot-name">${fmtDate(s.date)}</span><span></span>
        <button class="btn btn-lime btn-sm" data-book="corso" data-id="${c.id}" data-date="${isoDate(s.date)}" data-time="${s.time}" ${c.spots ? '' : 'disabled'}>Prenota</button></div>`).join('')}</div>
    </div>`, '', c.name);
}

/* ---------- Personal trainer ---------- */
const STATUS_CLASS = { 'Disponibile': 'b-lime', 'Pochi slot': 'b-promo', 'Non disponibile': 'b-ink' };
function trainerCard(t) {
  const off = t.status === 'Non disponibile';
  return `<article class="card" data-reveal>
    <div class="card-media tall"><img src="${t.image}" alt="${esc(t.alt)}" loading="lazy" width="600" height="750"><span class="badge ${STATUS_CLASS[t.status]} on-media">${t.status}</span></div>
    <div class="card-body">
      <h3>${t.name}</h3>
      <p class="card-text"><strong style="color:var(--text)">${t.role}</strong>, ${t.years} anni di esperienza</p>
      <div class="spec-list">${t.specs.map(s => `<span class="tag">${cap(s)}</span>`).join('')}</div>
      <div class="meta"><span>${icon('calendar')}${t.days.join(', ')}</span><span>${icon('clock')}${t.slots.map(cap).join(', ')}</span><span>${icon('globe')}${t.langs.join(', ')}</span></div>
      <div class="pt-prices"><div><small>1 sessione</small><b>${euro0(t.priceSingle)}</b></div><div><small>${t.pack.sessions} sessioni</small><b>${euro0(t.pack.price)}</b></div></div>
      <div class="card-actions pair">
        ${off ? `<button class="btn btn-soft btn-sm" data-waitlist="${t.id}">${icon('bell')}Lista d’attesa</button>` : `<button class="btn btn-lime btn-sm" data-book="pt" data-id="${t.id}">Prenota</button>`}
        <button class="btn btn-ghost btn-sm" data-trainer="${t.id}">Profilo</button>
      </div>
    </div></article>`;
}
function openTrainerModal(id) {
  const t = trainerById(id); if (!t) return;
  const off = t.status === 'Non disponibile', courses = SITE_DATA.courses.filter(c => c.instructor === t.name);
  openModal(`<div class="modal-grid"><div class="modal-media"><img src="${t.image}" alt="${esc(t.alt)}"></div>
    <div class="modal-content">
      <span class="badge ${STATUS_CLASS[t.status]}" style="justify-self:start">${t.status}</span>
      <h2>${t.name}</h2>
      <p><strong>${t.role}</strong>, ${t.years} anni di esperienza</p>
      <p class="card-text">${t.desc}</p>
      <div class="spec-list">${t.specs.map(s => `<span class="tag">${cap(s)}</span>`).join('')}</div>
      <div><strong>Certificazioni</strong><ul class="check-list" style="margin-top:.5rem">${t.certs.map(c => `<li>${icon('award')}${c}</li>`).join('')}</ul></div>
      <dl class="summary"><dt>Giorni</dt><dd>${t.days.map(d => DAY_FULL[d]).join(', ')}</dd><dt>Fasce</dt><dd>${t.slots.map(cap).join(', ')}</dd><dt>Lingue</dt><dd>${t.langs.join(', ')}</dd>
        ${courses.length ? `<dt>Corsi</dt><dd>${courses.map(c => c.name).join(', ')}</dd>` : ''}</dl>
      <div class="pt-prices"><div><small>1 sessione</small><b>${euro0(t.priceSingle)}</b></div><div><small>${t.pack.sessions} sessioni</small><b>${euro0(t.pack.price)}</b></div></div>
      ${off ? `<p class="card-text">Agenda piena fino a gennaio: entra in lista d’attesa e ti avvisiamo appena si libera un posto.</p><button class="btn btn-soft" data-waitlist="${t.id}">${icon('bell')}Entra in lista d’attesa</button>` : `<button class="btn btn-lime" data-book="pt" data-id="${t.id}">Prenota una sessione</button>`}
    </div></div>`, 'wide', t.name);
}

/* Lista d'attesa per i trainer al completo (solo simulata) */
function openWaitlist(id) {
  const t = trainerById(id); if (!t) return;
  openModal(`<div class="modal-content"><h2>Lista d’attesa</h2>
    <p class="card-text">${t.name} ha l’agenda piena fino a gennaio. Lascia i tuoi dati: ti avviseremo appena si libera uno slot.</p>
    <form id="wl-form" novalidate><div class="form-grid">${personFields('wl')}${privacyField}</div>
      <div class="demo-note" style="margin:1rem 0">${icon('shield-check')}<span>Demo: i dati non vengono inviati né salvati.</span></div>
      <button class="btn btn-lime" type="submit">${icon('bell')}Avvisami</button></form>
    <div id="wl-result" hidden></div></div>`, '', 'Lista d’attesa');
  const form = $('#wl-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validatePerson(form)) { focusFirstError(form); return; }
    form.hidden = true; const r = $('#wl-result'); r.hidden = false;
    paint(r, `<div class="success" tabindex="-1"><h3><span class="ok-icon">${icon('check')}</span>Sei in lista d’attesa</h3><p>Ti avviseremo quando ${t.name.split(' ')[0]} avrà uno slot libero. Messaggio dimostrativo: nessuna notifica verrà inviata.</p></div>`);
    $('.success', r).focus(); toast('Iscrizione alla lista d’attesa simulata.');
  });
}

/* ---------- Eventi ---------- */
function eventCard(ev) {
  const d = new Date(ev.date);
  return `<article class="card" data-reveal>
    <div class="card-media"><img src="${ev.image}" alt="${esc(ev.alt)}" loading="lazy" width="800" height="600">
      <span class="badge b-ink on-media">${ev.type}</span>
      <span class="event-date" aria-hidden="true"><b>${d.getDate()}</b><small>${MONTHS[d.getMonth()]}</small></span></div>
    <div class="card-body">
      <h3>${ev.title}</h3>
      <div class="meta"><span>${icon('calendar')}${fmtDate(d)}</span><span>${icon('clock')}${ev.time}</span><span>${icon('map-pin')}${ev.place}</span></div>
      <p class="card-text">${ev.desc}</p>
      <div class="meta"><span>${icon('ticket')}${ev.price ? euro(ev.price) : 'Gratuito'}</span><span>${icon('users')}${ev.spots ? ev.spots + ' posti disponibili' : 'Al completo'}</span></div>
      <div class="card-actions pair">
        <button class="btn btn-lime btn-sm" data-book="evento" data-id="${ev.id}" ${ev.spots ? '' : 'disabled'}>Iscriviti</button>
        <button class="btn btn-ghost btn-sm" data-event="${ev.id}">Dettagli</button>
      </div>
    </div></article>`;
}
function openEventModal(id) {
  const ev = eventById(id); if (!ev) return;
  const d = new Date(ev.date);
  openModal(`<div class="modal-media"><img src="${ev.image}" alt="${esc(ev.alt)}"></div>
    <div class="modal-content">
      <div class="chips"><span class="badge b-ink">${ev.type}</span><span class="badge ${ev.spots ? 'b-lime' : 'b-gray'}">${ev.spots ? ev.spots + ' posti disponibili' : 'Al completo'}</span></div>
      <h2>${ev.title}</h2>
      <p class="lead">${ev.desc}</p>
      <dl class="summary"><dt>Quando</dt><dd>${fmtDate(d)}, ore ${ev.time}</dd><dt>Dove</dt><dd>${ev.place}</dd><dt>Prezzo</dt><dd>${ev.price ? euro(ev.price) + ' (gratis per gli abbonati Annuale)' : 'Gratuito'}</dd></dl>
      <button class="btn btn-lime" style="justify-self:start" data-book="evento" data-id="${ev.id}" ${ev.spots ? '' : 'disabled'}>${icon('ticket')}Iscriviti all’evento</button>
    </div>`, '', ev.title);
}

/* ---------- Shop ---------- */
function productCard(p) {
  const badgeCls = { 'In offerta': 'b-promo', 'Nuovo': 'b-dark', 'Bestseller': 'b-ink' }[p.badge] || 'b-gray';
  return `<article class="card product" data-reveal>
    <div class="card-media"><img src="${p.image}" alt="${esc(p.alt)}" loading="lazy" width="600" height="600">
      ${p.badge && p.badge !== 'In offerta' ? `<span class="badge ${badgeCls} on-media">${p.badge}</span>` : ''}
      ${p.oldPrice ? `<span class="sticker on-media-r">−${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ''}
      ${p.stock <= 5 ? `<span class="badge b-ink on-media-bl">Ultimi ${p.stock} pezzi</span>` : ''}</div>
    <div class="card-body">
      <span class="card-text" style="font-size:.82rem">${p.category}</span>
      <h3>${p.name}</h3>
      <div class="meta">${stars(p.rating)}<span>${p.rating.toFixed(1)}</span></div>
      <div class="price-row">${isMember()
        ? `<span class="price-now">${euro(p.price * .8)}</span><span class="price-old">${euro(p.price)}</span><span class="sticker sm member-price">−20%</span>`
        : `<span class="price-now">${euro(p.price)}</span>${p.oldPrice ? `<span class="price-old">${euro(p.oldPrice)}</span>` : ''}<small class="card-text" style="font-size:.8rem">${euro(p.price * .8)} abbonati</small>`}</div>
      <div class="card-actions pair">
        ${p.sizes
          ? `<button class="btn btn-lime btn-sm" data-add-product="${p.id}">${icon('shirt')}Taglia${qtyInCart('shop', p.id) ? ` <span class="count-badge">${qtyInCart('shop', p.id)}</span>` : ''}</button>`
          : qtyControl('shop', p.id, p.name) || `<button class="btn btn-lime btn-sm" data-add-product="${p.id}">${icon('shopping-bag')}Aggiungi</button>`}
        <button class="btn btn-ghost btn-sm" data-product="${p.id}">Dettagli</button>
      </div>
    </div></article>`;
}
function addProduct(p, qty = 1, size = '', silent = false) { addToCart({ kind: 'shop', id: p.id, name: p.name, price: p.price, variant: size, image: p.image, qty, max: p.stock }, silent); }
function openProductModal(id) {
  const p = productById(id); if (!p) return;
  let qty = 1;
  openModal(`<div class="modal-grid"><div class="modal-media"><img src="${p.image}" alt="${esc(p.alt)}"></div>
    <div class="modal-content">
      <span class="card-text">${p.category}</span>
      <h2>${p.name}</h2>
      <div class="meta">${stars(p.rating)}<span>${p.rating.toFixed(1)} su 5</span></div>
      <div class="price-row"><span class="price-now">${euro(p.price)}</span>${p.oldPrice ? `<span class="price-old">${euro(p.oldPrice)}</span><span class="sticker sm">−${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ''}</div>
      <p>${p.desc}</p>
      ${p.sizes ? `<fieldset style="border:0;padding:0"><legend style="font-weight:700;margin-bottom:.5rem">Taglia</legend>
        <div class="size-picker">${p.sizes.map(s => `<label><input type="radio" name="size" value="${s}"><span>${s}</span></label>`).join('')}</div>
        <span class="err" id="size-err" role="alert"></span></fieldset>` : ''}
      <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap">
        <div class="qty" role="group" aria-label="Quantità"><button type="button" data-pq="-1" aria-label="Diminuisci la quantità">${icon('minus')}</button><span id="pq" aria-live="polite">1</span><button type="button" data-pq="1" aria-label="Aumenta la quantità">${icon('plus')}</button></div>
        <small class="card-text">${p.stock <= 5 ? `Solo ${p.stock} disponibili` : 'Disponibile, ritiro in reception'}</small>
      </div>
      <button class="btn btn-lime" id="p-add">${icon('shopping-bag')}Aggiungi al carrello</button>
    </div></div>`, 'wide', p.name);
  $('#modal-body').onclick = e => {
    const b = e.target.closest('[data-pq]');
    if (b) { qty = Math.min(p.stock, Math.max(1, qty + Number(b.dataset.pq))); $('#pq').textContent = qty; return; }
    if (e.target.closest('#p-add')) {
      let size = '';
      if (p.sizes) {
        const s = $('#modal-body input[name=size]:checked');
        if (!s) { $('#size-err').textContent = 'Scegli una taglia per continuare.'; return; }
        size = s.value;
      }
      addProduct(p, qty, size); closeModal(); openCart();
    }
  };
}

/* ---------- Bar Fit ---------- */
function barCard(b) {
  const m = isMember();
  const price = m
    ? `<b>${euro(b.price * .8)}</b><s>${euro(b.price)}</s><span class="sticker sm member-price">−20%</span>`
    : `<b>${euro(b.price)}</b><small>${euro(b.price * .8)} abbonati</small>`;
  return `<article class="bar-card" data-reveal>
    <img class="bar-thumb" src="${b.image}" alt="${esc(b.alt)}" loading="lazy" width="88" height="88">
    <div class="bar-main">
      <div class="bar-top"><div><span class="bar-cat">${b.category}</span><h3>${b.name}</h3></div><div class="bar-price">${price}</div></div>
      <p class="bar-desc">${b.desc}</p>
      <div class="bar-foot">
        <div class="macros"><span>${b.kcal} kcal</span>${b.protein ? `<span>${b.protein} g prot.</span>` : ''}${b.tags.map(t => `<span>${t}</span>`).join('')}</div>
        ${qtyControl('bar', b.id, b.name) || `<button class="add-round" data-add-bar="${b.id}" aria-label="Aggiungi ${esc(b.name)} all’ordine" title="Aggiungi all’ordine">${icon('plus')}</button>`}
      </div>
    </div></article>`;
}
function addBar(id, silent = false) { const b = barById(id); if (b) addToCart({ kind: 'bar', id: b.id, name: b.name, price: b.price, image: b.image, max: 20 }, silent); }

/* ---------- Offerte e abbonamenti ---------- */
function choosePlan(id) {
  const p = planById(id); if (!p) return;
  closeModal();
  if (p.id === 'trial') { location.href = 'prenotazioni.html?tipo=prova'; return; }
  if (p.quote) { location.href = 'contatti.html?argomento=' + encodeURIComponent('Abbonamento Corporate'); return; }
  addToCart({ kind: 'plan', id: p.id, name: `Abbonamento ${p.name}`, price: p.price, image: ph(p.name, '1C1D21', 'B5E33A', 200, 200) });
  openCart();
}

/* ---------- Galleria a schermo intero ---------- */
function openLightbox(i) {
  const G = SITE_DATA.gallery, body = $('#modal-body');
  openModal('', 'lightbox', 'Galleria fotografica');
  const draw = () => {
    body.innerHTML = `<img class="lb-img" src="${G[i].image}" alt="${esc(G[i].alt)}">
      <div class="lb-bar"><button class="car-btn" data-lb="-1" aria-label="Foto precedente">${icon('chevron-left')}</button>
      <span>${esc(G[i].alt)} <small style="color:#9a9a9a">${i + 1}/${G.length}</small></span>
      <button class="car-btn" data-lb="1" aria-label="Foto successiva">${icon('chevron-right')}</button></div>`;
    refreshIcons();
  };
  const step = n => { i = (i + n + G.length) % G.length; draw(); };
  draw();
  body.onclick = e => { const b = e.target.closest('[data-lb]'); if (b) step(Number(b.dataset.lb)); };
  modalKeyHandler = e => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); };
  // swipe su touch
  let x0 = null;
  body.ontouchstart = e => { x0 = e.touches[0].clientX; };
  body.ontouchend = e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); x0 = null; };
}

/* ---------- Click delegati, validi su tutte le pagine ---------- */
document.addEventListener('click', e => {
  const t = e.target;
  const a = t.closest('a[href]');
  if (a) { if ($('#modal').contains(a)) closeModal(); return; }
  let el;
  // selettore "− 1 +" sulle card
  if ((el = t.closest('[data-step]'))) {
    const { kind, id } = el.dataset;
    if (Number(el.dataset.step) > 0) { kind === 'bar' ? addBar(id, true) : addProduct(productById(id), 1, '', true); }
    else decFromCart(kind, id);
    const again = $(`[data-step="${el.dataset.step}"][data-kind="${kind}"][data-id="${id}"]`) || $(`[data-add-bar="${id}"],[data-add-product="${id}"]`);
    if (again) again.focus();
    return;
  }
  if ((el = t.closest('[data-open-member]'))) return openCart(true);
  if ((el = t.closest('[data-book]'))) { if (!el.disabled) openBookingModal(el.dataset.book, el.dataset.id, { date: el.dataset.date, time: el.dataset.time }); return; }
  if ((el = t.closest('[data-course]'))) return openCourseModal(el.dataset.course);
  if ((el = t.closest('[data-waitlist]'))) return openWaitlist(el.dataset.waitlist);
  if ((el = t.closest('[data-trainer]'))) return openTrainerModal(el.dataset.trainer);
  if ((el = t.closest('[data-product]'))) return openProductModal(el.dataset.product);
  if ((el = t.closest('[data-add-product]'))) { const p = productById(el.dataset.addProduct); if (p) p.sizes ? openProductModal(p.id) : addProduct(p); return; }
  if ((el = t.closest('[data-add-bar]'))) return addBar(el.dataset.addBar);
  if ((el = t.closest('[data-event]'))) return openEventModal(el.dataset.event);
  if ((el = t.closest('[data-plan]'))) return choosePlan(el.dataset.plan);
  if ((el = t.closest('[data-copy]'))) return copyCode(el.dataset.copy);
  if ((el = t.closest('[data-gallery]'))) return openLightbox(Number(el.dataset.gallery));
  if ((el = t.closest('[data-ics]'))) return downloadICS(el.dataset.ics);
  if ((el = t.closest('[data-cancel]'))) return cancelBooking(el.dataset.cancel);
  if ((el = t.closest('[data-car-prev], [data-car-next]'))) {
    const tr = $('#' + (el.dataset.carPrev || el.dataset.carNext));
    if (tr) tr.scrollBy({ left: (el.dataset.carPrev ? -1 : 1) * tr.clientWidth * .9, behavior: 'smooth' });
  }
});

/* ---------- Avvio: ogni pagina chiama startPage() alla fine del proprio script ---------- */
function startPage() {
  renderCart(); updateCartCount(); renderMemberBanner();
  booting = false;
  refreshIcons(); observeReveals(); tickCountdowns();
  setInterval(tickCountdowns, 1000);
}
