/* =====================================================================
   MoveLab Milano — core.js
   Utilità condivise: formattazione, icone, storage, toast, modale,
   countdown, validazione dei form. Caricato su tutte le pagine dopo data.js.
   ===================================================================== */
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const DAYS = ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'];
const DAY_FULL = { Lun:'Lunedì', Mar:'Martedì', Mer:'Mercoledì', Gio:'Giovedì', Ven:'Venerdì', Sab:'Sabato', Dom:'Domenica' };
const MONTHS = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];
const euro = n => n.toLocaleString('it-IT', { style:'currency', currency:'EUR' });
const euro0 = n => n.toLocaleString('it-IT', { style:'currency', currency:'EUR', maximumFractionDigits:0 });
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const icon = (name, cls = '') => `<i data-lucide="${name}"${cls ? ` class="${cls}"` : ''} aria-hidden="true"></i>`;
const dayKeyOf = d => DAYS[(d.getDay() + 6) % 7];
const todayKey = () => dayKeyOf(new Date());
const toMin = t => { const [h, m] = t.slice(0, 5).split(':').map(Number); return h * 60 + m; };
const nowMin = () => { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); };
const slotOf = t => { const h = toMin(t) / 60; return h < 12 ? 'mattina' : h < 18 ? 'pomeriggio' : 'sera'; };
const pad = n => String(n).padStart(2, '0');
const isoDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const fmtDate = d => `${DAY_FULL[dayKeyOf(d)]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
const uniq = arr => [...new Set(arr)];
const byId = (list, id) => list.find(x => x.id === id);
const round2 = n => Math.round(n * 100) / 100;
const randomCode = () => 'ML-' + Math.random().toString(36).slice(2, 7).toUpperCase();
const RX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RX_PHONE = /^\+?[\d\s]{6,16}$/;
const params = new URLSearchParams(location.search);
const PAGE = document.body.dataset.page || 'home';

const courseById = id => byId(SITE_DATA.courses, id);
const trainerById = id => byId(SITE_DATA.trainers, id);
const eventById = id => byId(SITE_DATA.events, id);
const productById = id => byId(SITE_DATA.shopProducts, id);
const barById = id => byId(SITE_DATA.barMenu, id);
const planById = id => byId(SITE_DATA.memberships, id);

/* ---------- Icone e inserimento HTML ---------- */
let booting = true;
function refreshIcons() { if (!booting && window.lucide && lucide.createIcons) lucide.createIcons(); }
function paint(el, html) { if (!el) return; el.innerHTML = html; refreshIcons(); observeReveals(el); }
function stars(r) {
  let h = '';
  for (let i = 1; i <= 5; i++) h += icon('star', i <= Math.round(r) ? 'on' : 'off');
  return `<span class="stars" role="img" aria-label="Valutazione ${r} su 5">${h}</span>`;
}
const codeBtn = code => `<button class="code-btn" data-copy="${code}" aria-label="Copia il codice ${code}">${icon('copy')}${code}</button>`;
function emptyState(msg, reset) {
  return `<div class="empty">${icon('search-x')}<p>${msg}</p>${reset ? `<button class="btn btn-ink btn-sm" data-reset="${reset}">Azzera i filtri</button>` : ''}</div>`;
}

/* ---------- Immagini: segnaposto locale se quella esterna non si carica ---------- */
function fallbackImg(label) {
  const text = esc(String(label || 'MoveLab').slice(0, 42));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#151515"/><rect y="568" width="800" height="32" fill="#C6FF00"/><text x="400" y="312" fill="#C6FF00" font-family="Arial, sans-serif" font-size="34" font-weight="700" text-anchor="middle">${text}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
// 1° tentativo: il segnaposto indicato in data.js (o in data-fb). 2°: segnaposto locale generato qui
document.addEventListener('error', e => {
  const t = e.target;
  if (!t || t.tagName !== 'IMG') return;
  const src = t.getAttribute('src'), fb = t.dataset.fb || (window.IMG_FALLBACK || {})[src];
  if (fb && !t.dataset.triedFb) { t.dataset.triedFb = '1'; t.src = fb; return; }
  if (!t.dataset.fallback) { t.dataset.fallback = '1'; t.src = fallbackImg(t.alt); }
}, true);

/* ---------- localStorage protetto ---------- */
const store = {
  get(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* non disponibile: si continua in memoria */ } }
};

/* ---------- Toast ---------- */
function toast(msg, type = '') {
  const box = $('#toasts'); if (!box) return;
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = `${icon(type === 'warn' ? 'circle-alert' : 'circle-check')}<span>${msg}</span>`;
  box.appendChild(t);
  if (window.lucide) lucide.createIcons();
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 3200);
}

/* ---------- Animazioni allo scroll ---------- */
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver(en => en.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .1, rootMargin: '0px 0px -30px 0px' })
  : null;
function observeReveals(root = document) {
  $$('[data-reveal]:not(.in)', root).forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 60}ms`; io ? io.observe(el) : el.classList.add('in'); });
}

/* ---------- Blocco dello scroll quando un pannello è aperto ---------- */
function lockScroll() {
  const open = ['#modal', '#cart', '#nav-menu'].some(s => { const el = $(s); return el && el.classList.contains('open'); });
  document.body.classList.toggle('no-scroll', open);
}

/* ---------- Modale ---------- */
let lastFocus = null, modalKeyHandler = null, modalToken = 0;
function openModal(html, size = '', label = 'Dettaglio') {
  const modal = $('#modal'), box = $('.modal-box', modal), body = $('#modal-body');
  if (!modal.classList.contains('open')) lastFocus = document.activeElement;
  modalToken++; modalKeyHandler = null; body.onclick = null;
  box.className = 'modal-box' + (size ? ' ' + size : '');
  box.setAttribute('aria-label', label);
  body.innerHTML = html; box.scrollTop = 0;
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
  lockScroll(); refreshIcons();
  setTimeout(() => $('#modal-close').focus(), 60);
}
function closeModal() {
  const modal = $('#modal');
  if (!modal || !modal.classList.contains('open')) return;
  modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
  modalKeyHandler = null; lockScroll();
  const token = modalToken;
  setTimeout(() => { if (token === modalToken) $('#modal-body').innerHTML = ''; }, 260);
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
}

/* ---------- Countdown ---------- */
function countdownHTML(ts, cls = '') {
  const units = [['d', 'giorni'], ['h', 'ore'], ['m', 'min'], ['s', 'sec']];
  return `<div class="countdown ${cls}" data-countdown="${ts}" role="timer" aria-label="Tempo rimanente">${units.map(([u, l]) => `<div><b data-u="${u}">00</b><small>${l}</small></div>`).join('')}</div>`;
}
// Versione compatta su una riga, es. "20 g 06 h 53 min"
const countdownInline = ts => `<span class="cd-inline" data-cd="${ts}">…</span>`;
function tickCountdowns() {
  const now = Date.now();
  $$('[data-cd]').forEach(el => {
    const ms = Math.max(0, +el.dataset.cd - now);
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60;
    el.textContent = ms ? `${d} g ${pad(h)} h ${pad(m)} min` : 'terminata';
    el.classList.toggle('ended', !ms);
  });
  $$('[data-countdown]').forEach(el => {
    const ms = Math.max(0, +el.dataset.countdown - now);
    const v = { d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 };
    $$('b', el).forEach(b => { b.textContent = pad(v[b.dataset.u]); });
    el.classList.toggle('ended', ms === 0);
  });
}

/* ---------- Orari ---------- */
function openStatus() {
  const d = todayKey(), [o, c] = SITE_DATA.hours[d], m = nowMin();
  if (m >= toMin(o) && m < toMin(c)) return { open: true, text: `Aperto ora, chiude alle ${c}` };
  if (m < toMin(o)) return { open: false, text: `Chiuso, apre oggi alle ${o}` };
  const nd = DAYS[(DAYS.indexOf(d) + 1) % 7];
  return { open: false, text: `Chiuso, apre ${DAY_FULL[nd].toLowerCase()} alle ${SITE_DATA.hours[nd][0]}` };
}
function openPillHTML() { const s = openStatus(); return `<span class="live-dot ${s.open ? '' : 'closed'}"></span>${s.text}`; }
function hoursHTML() {
  return DAYS.map(d => `<li class="${d === todayKey() ? 'today' : ''}"><span>${DAY_FULL[d]}</span><span>${SITE_DATA.hours[d][0]}–${SITE_DATA.hours[d][1]}</span></li>`).join('');
}
function hoursGroupedHTML() {
  const H = SITE_DATA.hours, groups = [];
  DAYS.forEach(d => { const k = H[d].join('–'), g = groups[groups.length - 1]; g && g.k === k ? g.days.push(d) : groups.push({ k, days: [d] }); });
  return groups.map(g => `<li class="${g.days.includes(todayKey()) ? 'today' : ''}"><span>${g.days.length > 1 ? g.days[0] + '–' + g.days[g.days.length - 1] : DAY_FULL[g.days[0]]}</span><span>${g.k}</span></li>`).join('');
}
function sessionsOf(day) {
  const out = [];
  SITE_DATA.courses.forEach(c => c.schedule.forEach(s => { if (s.day === day) out.push({ course: c, time: s.time }); }));
  return out.sort((a, b) => toMin(a.time) - toMin(b.time));
}
function nextDateFor(dayKey) {
  const d = new Date();
  for (let i = 0; i < 7; i++) { if (dayKeyOf(d) === dayKey) return d; d.setDate(d.getDate() + 1); }
  return d;
}

/* ---------- Validazione form ---------- */
function setErr(input, msg) {
  const field = input.closest('.field');
  if (field) { field.classList.toggle('invalid', !!msg); const e = $('.err', field); if (e) e.textContent = msg || ''; }
  input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  return !msg;
}
function validatePerson(form) {
  let ok = true;
  const { name, email, phone, privacy } = form.elements;
  if (name) ok = setErr(name, name.value.trim().length < 2 ? 'Inserisci nome e cognome.' : '') && ok;
  if (email) ok = setErr(email, !email.value.trim() ? 'Inserisci la tua email.' : !RX_EMAIL.test(email.value.trim()) ? 'Controlla l’email, ad esempio nome@dominio.it.' : '') && ok;
  if (phone) ok = setErr(phone, phone.value.trim() && !RX_PHONE.test(phone.value.trim()) ? 'Usa solo numeri e spazi, con prefisso facoltativo.' : '') && ok;
  const pe = $('[data-err="privacy"]', form);
  if (privacy) { const m = privacy.checked ? '' : 'Conferma di aver letto l’informativa per continuare.'; if (pe) pe.textContent = m; ok = !m && ok; }
  return ok;
}
function focusFirstError(form) { const f = $('[aria-invalid="true"]', form); if (f) f.focus(); }
document.addEventListener('input', e => {
  const f = e.target.closest && e.target.closest('.field.invalid');
  if (f) { f.classList.remove('invalid'); const er = $('.err', f); if (er) er.textContent = ''; e.target.setAttribute('aria-invalid', 'false'); }
});
document.addEventListener('change', e => {
  if (e.target.name === 'privacy' && e.target.checked) { const pe = $('[data-err="privacy"]', e.target.form || document); if (pe) pe.textContent = ''; }
});
const personFields = uid => `
  <div class="field"><label for="${uid}-name">Nome e cognome *</label><input id="${uid}-name" name="name" autocomplete="name"><span class="err"></span></div>
  <div class="field"><label for="${uid}-email">Email *</label><input id="${uid}-email" name="email" type="email" inputmode="email" autocomplete="email"><span class="err"></span></div>
  <div class="field"><label for="${uid}-phone">Telefono</label><input id="${uid}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Facoltativo"><span class="err"></span></div>`;
const privacyField = `<label class="check full"><input type="checkbox" name="privacy">Ho letto l’informativa privacy (testo dimostrativo).</label><span class="err full" data-err="privacy" role="alert"></span>`;

/* ---------- Copia codice sconto ---------- */
function copyCode(code) {
  const done = () => toast(`Codice ${code} copiato. Incollalo nel carrello.`);
  const fallback = () => {
    const ta = document.createElement('textarea'); ta.value = code; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { toast(`Il tuo codice è ${code}`); }
    ta.remove();
  };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(code).then(done).catch(fallback); else fallback();
}
