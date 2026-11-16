/* =====================================================================
   MoveLab Milano — booking.js
   Form di prenotazione condiviso (pagina Prenotazioni e finestre modali).
   Tutto simulato nel browser: le prenotazioni restano in memoria e
   spariscono ricaricando la pagina. Nessun dato viene inviato.
   ===================================================================== */
'use strict';

const bookings = [];
const dataChanged = () => document.dispatchEvent(new CustomEvent('data:change'));
const BOOK_TYPES = {
  prova:  { label: 'Prova gratuita', icon: 'gift', item: '' },
  corso:  { label: 'Corso', icon: 'calendar-check', item: 'Corso' },
  pt:     { label: 'Personal trainer', icon: 'user-check', item: 'Personal trainer' },
  visita: { label: 'Visita guidata', icon: 'map-pin', item: '' },
  evento: { label: 'Evento', icon: 'ticket', item: 'Evento' }
};
const PT_TIMES = { mattina: ['07:00','08:00','09:00','10:00','11:00'], pomeriggio: ['12:30','14:00','15:00','16:00','17:00'], sera: ['18:00','19:00','20:00','21:00'] };
const TYPE_HINTS = {
  prova: 'Sette giorni di prova: questa è la data del primo ingresso, con consulenza iniziale.',
  corso: 'Scegli il corso: la data si imposta sulla prossima lezione disponibile.',
  pt: 'La prima consulenza con un trainer è gratuita. Gli orari barrati sono già occupati.',
  visita: 'Visita guidata di circa 30 minuti con un trainer, dalle 10 alle 20.',
  evento: 'La data è quella dell’evento. Riceverai un codice da mostrare all’ingresso.'
};
const upcomingEvents = () => SITE_DATA.events.filter(e => e.date > Date.now() - 36e5 * 12).sort((a, b) => a.date - b.date);

function getSlots(type, itemId, date) {
  const key = dayKeyOf(date), isToday = isoDate(date) === isoDate(new Date());
  const past = t => isToday && toMin(t) <= nowMin() + 30; // prenotabile fino a 30 minuti prima
  const taken = t => bookings.some(b => b.type === type && b.itemId === (itemId || '') && b.date === isoDate(date) && b.time === t);
  let out = [];
  if (type === 'prova' || type === 'visita') {
    const [o, c] = SITE_DATA.hours[key];
    for (let m = Math.ceil((toMin(o) + 30) / 60) * 60; m <= toMin(c) - 60; m += 60) out.push({ time: `${pad(m / 60)}:00` });
    if (type === 'visita') out = out.filter(s => toMin(s.time) >= 600 && toMin(s.time) <= 1200);
  }
  if (type === 'corso') { const c = courseById(itemId); if (c) out = c.schedule.filter(s => s.day === key).map(s => ({ time: s.time, full: !c.spots, note: c.spots ? `${c.spots} posti` : 'completo' })); }
  if (type === 'pt') {
    const t = trainerById(itemId);
    if (t && t.status !== 'Non disponibile' && t.days.includes(key))
      t.slots.forEach(sl => PT_TIMES[sl].forEach((tm, i) => { const busy = (date.getDate() + i + t.id.length) % 4 === 0; out.push({ time: tm, full: busy, note: busy ? 'occupato' : '' }); }));
  }
  if (type === 'evento') { const ev = eventById(itemId); if (ev && isoDate(new Date(ev.date)) === isoDate(date)) out = [{ time: ev.time, full: !ev.spots }]; }
  return out.map(s => ({ ...s, disabled: s.full || past(s.time) || taken(s.time), note: taken(s.time) ? 'già prenotato' : s.note }));
}
function defaultDate(type, itemId) {
  if (type === 'evento') { const ev = eventById(itemId); return ev ? new Date(ev.date) : null; }
  const d = new Date();
  for (let i = 0; i < 21; i++) { if (getSlots(type, itemId, d).some(s => !s.disabled)) return d; d.setDate(d.getDate() + 1); }
  return new Date();
}
function itemOptions(type) {
  if (type === 'corso') return SITE_DATA.courses.map(c => `<option value="${c.id}" ${c.spots ? '' : 'disabled'}>${c.name} (${c.instructor})${c.spots ? '' : ', completo'}</option>`).join('');
  if (type === 'pt') return SITE_DATA.trainers.map(t => `<option value="${t.id}" ${t.status === 'Non disponibile' ? 'disabled' : ''}>${t.name}, ${t.role}${t.status === 'Non disponibile' ? ' (non disponibile)' : ''}</option>`).join('');
  if (type === 'evento') return upcomingEvents().map(e => `<option value="${e.id}" ${e.spots ? '' : 'disabled'}>${e.title}, ${fmtDate(new Date(e.date))}</option>`).join('');
  return '';
}

function mountBooking(root, opts = {}) {
  const type = BOOK_TYPES[opts.type] ? opts.type : 'prova', cfg = BOOK_TYPES[type];
  const uid = 'bk' + Math.random().toString(36).slice(2, 7);
  const today = new Date(), maxD = new Date(); maxD.setDate(today.getDate() + 60);
  root.innerHTML = `
    <div class="chips booking-tabs" role="tablist" aria-label="Tipo di prenotazione">${Object.entries(BOOK_TYPES).map(([k, v]) =>
      `<button type="button" class="chip ${k === type ? 'active' : ''}" role="tab" aria-selected="${k === type}" data-btype="${k}">${icon(v.icon)}${v.label}</button>`).join('')}</div>
    <form class="booking-form" novalidate>
      <p class="card-text" style="margin-bottom:1.2rem">${TYPE_HINTS[type]}</p>
      <div class="form-grid">
        ${cfg.item ? `<div class="field"><label for="${uid}-item">${cfg.item} *</label><select id="${uid}-item" name="choice"><option value="">Scegli…</option>${itemOptions(type)}</select><span class="err"></span></div>` : ''}
        <div class="field ${cfg.item ? '' : 'full'}"><label for="${uid}-date">Data *</label><input type="date" id="${uid}-date" name="date" min="${isoDate(today)}" max="${isoDate(maxD)}"><span class="err"></span></div>
        <div class="field full"><span class="label" id="${uid}-sl">Orario *</span><div class="slots" data-slots role="radiogroup" aria-labelledby="${uid}-sl"></div><span class="err" data-err="slot" role="alert"></span></div>
        ${personFields(uid)}
        <div class="field"><label for="${uid}-notes">${type === 'pt' ? 'Obiettivo principale' : 'Note'}</label><input id="${uid}-notes" name="notes" maxlength="200" placeholder="Facoltativo"></div>
        ${privacyField}
      </div>
      <div class="demo-note" style="margin:1.2rem 0">${icon('shield-check')}<span>Prenotazione dimostrativa: nessun dato viene inviato o salvato, la conferma appare solo in questa pagina.</span></div>
      <button class="btn btn-lime" type="submit">${icon('calendar-check')}Conferma la prenotazione</button>
    </form>
    <div class="booking-result" hidden></div>`;
  const form = $('form', root), dateIn = form.elements.date, itemSel = form.elements.namedItem('choice'), slotsBox = $('[data-slots]', form), result = $('.booking-result', root);
  const keep = opts.keep || {};
  ['name', 'email', 'phone'].forEach(k => { if (keep[k]) form.elements[k].value = keep[k]; });
  if (itemSel && opts.id && $(`option[value="${opts.id}"]:not([disabled])`, itemSel)) itemSel.value = opts.id;

  const setDate = preferred => {
    dateIn.readOnly = type === 'evento';
    if (type === 'evento') dateIn.removeAttribute('max');
    if (preferred) { dateIn.value = preferred; return; }
    const d = (cfg.item && !itemSel.value) ? null : defaultDate(type, itemSel ? itemSel.value : '');
    dateIn.value = d ? isoDate(d) : '';
  };
  const renderSlots = () => {
    $('[data-err="slot"]', form).textContent = '';
    if (cfg.item && !itemSel.value) { slotsBox.innerHTML = `<p class="slots-empty">Scegli prima ${type === 'corso' ? 'il corso' : type === 'pt' ? 'il trainer' : 'l’evento'}.</p>`; return; }
    if (!dateIn.value) { slotsBox.innerHTML = '<p class="slots-empty">Scegli una data.</p>'; return; }
    const d = fromIso(dateIn.value), list = getSlots(type, itemSel ? itemSel.value : '', d), dn = DAY_FULL[dayKeyOf(d)].toLowerCase();
    if (!list.length) {
      let msg = `Nessun orario disponibile ${dn}.`;
      if (type === 'corso') { const c = courseById(itemSel.value); msg = `${c.name} non è in programma ${dn}. Giorni: ${uniq(c.schedule.map(s => DAY_FULL[s.day])).join(', ')}.`; }
      if (type === 'pt') { const t = trainerById(itemSel.value); msg = `${t.name} non lavora ${dn}. Giorni: ${t.days.map(x => DAY_FULL[x]).join(', ')}.`; }
      slotsBox.innerHTML = `<p class="slots-empty">${msg}</p>`; return;
    }
    slotsBox.innerHTML = list.map(s => `<label><input type="radio" name="slot" value="${s.time}" ${s.disabled ? 'disabled' : ''}><span>${s.time}${s.note ? `&nbsp;<small style="font-weight:500;opacity:.75">${s.note}</small>` : ''}</span></label>`).join('');
    if (!list.some(s => !s.disabled)) slotsBox.insertAdjacentHTML('beforeend', '<p class="slots-empty" style="width:100%">Orari esauriti per questa data: prova il giorno successivo.</p>');
  };
  setDate(opts.date); renderSlots();
  if (opts.time) { const r = $(`input[name="slot"][value="${opts.time}"]:not([disabled])`, slotsBox); if (r) r.checked = true; }

  if (itemSel) itemSel.addEventListener('change', () => { setDate(); renderSlots(); });
  dateIn.addEventListener('change', renderSlots);
  const keepValues = () => ({ name: form.elements.name.value, email: form.elements.email.value, phone: form.elements.phone.value });
  $('[role="tablist"]', root).addEventListener('click', e => {
    const b = e.target.closest('[data-btype]'); if (!b || b.dataset.btype === type) return;
    mountBooking(root, { type: b.dataset.btype, keep: keepValues() });
    $(`[data-btype="${b.dataset.btype}"]`, root).focus();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    if (itemSel) ok = setErr(itemSel, itemSel.value ? '' : `Scegli ${type === 'corso' ? 'un corso' : type === 'pt' ? 'un trainer' : 'un evento'}.`) && ok;
    let dMsg = '';
    if (!dateIn.value) dMsg = 'Scegli una data.';
    else if (fromIso(dateIn.value) < fromIso(isoDate(new Date()))) dMsg = 'Scegli una data da oggi in poi.';
    else if (type !== 'evento' && fromIso(dateIn.value) > maxD) dMsg = 'Puoi prenotare fino a 60 giorni in anticipo.';
    ok = setErr(dateIn, dMsg) && ok;
    const slot = $('input[name="slot"]:checked', form);
    $('[data-err="slot"]', form).textContent = slot ? '' : 'Scegli un orario disponibile.';
    ok = !!slot && ok;
    ok = validatePerson(form) && ok;
    if (!ok) { focusFirstError(form); return; }

    const itemId = itemSel ? itemSel.value : '';
    let itemName = '', duration = type === 'visita' ? 30 : 60;
    if (type === 'corso') { const c = courseById(itemId); itemName = c.name; duration = c.duration; c.spots = Math.max(0, c.spots - 1); }
    if (type === 'pt') itemName = trainerById(itemId).name;
    if (type === 'evento') { const ev = eventById(itemId); itemName = ev.title; ev.spots = Math.max(0, ev.spots - 1); }
    const b = { code: randomCode(), type, itemId, title: itemName ? `${cfg.label}: ${itemName}` : cfg.label, date: dateIn.value, time: slot.value, duration };
    bookings.unshift(b);
    renderMyBookings(); dataChanged();

    const first = form.elements.name.value.trim().split(' ')[0], kept = keepValues();
    $('[role="tablist"]', root).hidden = true; form.hidden = true; result.hidden = false;
    paint(result, `<div class="success" tabindex="-1">
      <h3><span class="ok-icon">${icon('check')}</span>Prenotazione confermata</h3>
      <p>Ti aspettiamo, ${esc(first)}. Questa è una conferma dimostrativa: non riceverai email o SMS.</p>
      <dl class="summary"><dt>Codice</dt><dd>${b.code}</dd><dt>Tipo</dt><dd>${cfg.label}</dd>${itemName ? `<dt>${cfg.item}</dt><dd>${esc(itemName)}</dd>` : ''}
        <dt>Quando</dt><dd>${fmtDate(fromIso(b.date))}, ore ${b.time}</dd></dl>
      <div class="card-actions"><button class="btn btn-ink btn-sm" data-ics="${b.code}">${icon('calendar-plus')}Aggiungi al calendario</button>
        <button class="btn btn-ghost btn-sm" data-new-booking>Nuova prenotazione</button></div>
    </div>`);
    $('.success', result).focus();
    $('[data-new-booking]', result).onclick = () => mountBooking(root, { type, keep: kept });
    toast(`Prenotazione confermata, codice ${b.code}`);
  });
  refreshIcons();
}
function openBookingModal(type, id, extra = {}) {
  openModal(`<div class="modal-content"><h2>Prenota</h2><div id="modal-booking"></div></div>`, '', 'Prenotazione');
  mountBooking($('#modal-booking'), { type, id, date: extra.date, time: extra.time });
}
function renderMyBookings() {
  const el = $('#my-bookings'); if (!el) return;
  if (!bookings.length) { el.innerHTML = '<p class="card-text">Nessuna prenotazione in questa visita. Nella demo le prenotazioni non vengono salvate: cambiando o ricaricando pagina spariscono.</p>'; return; }
  paint(el, bookings.map(b => `<div class="my-booking"><div><strong>${esc(b.title)}</strong><small>${fmtDate(fromIso(b.date))}, ore ${b.time}</small><small>Codice ${b.code}</small></div>
    <button class="btn btn-ghost btn-sm" data-cancel="${b.code}">Annulla</button></div>`).join(''));
}
function cancelBooking(code) {
  const i = bookings.findIndex(b => b.code === code); if (i < 0) return;
  const b = bookings[i];
  if (b.type === 'corso') { const c = courseById(b.itemId); if (c) c.spots = Math.min(c.capacity, c.spots + 1); }
  if (b.type === 'evento') { const ev = eventById(b.itemId); if (ev) ev.spots++; }
  bookings.splice(i, 1);
  renderMyBookings(); dataChanged();
  toast(`Prenotazione ${code} annullata.`, 'warn');
}
// File .ics generato nel browser: nessun invio di dati
function downloadICS(code) {
  const b = bookings.find(x => x.code === code); if (!b) return;
  const d = fromIso(b.date), [h, m] = b.time.slice(0, 5).split(':').map(Number);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m), end = new Date(start.getTime() + b.duration * 6e4);
  const f = x => `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`;
  const escIcs = s => s.replace(/[,;\\]/g, c => '\\' + c);
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MoveLab Milano//Demo//IT', 'BEGIN:VEVENT', `UID:${b.code}@movelab.example`,
    `DTSTAMP:${f(new Date())}`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`, `SUMMARY:${escIcs('MoveLab - ' + b.title)}`,
    `LOCATION:${escIcs(SITE_DATA.contacts.address)}`, `DESCRIPTION:Codice prenotazione ${b.code} (demo)`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = document.createElement('a'); a.href = url; a.download = `movelab-${b.code}.ics`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
