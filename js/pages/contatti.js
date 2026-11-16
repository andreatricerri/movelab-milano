/* Contatti: recapiti, orari, modulo, domande frequenti */
'use strict';
const CT = SITE_DATA.contacts;
// Recapiti mostrati come testo: nessun link che avvii chiamate, email o chat reali
function renderInfoCards() {
  const [street, ...city] = CT.address.split(', '), st = openStatus(), today = SITE_DATA.hours[todayKey()];
  const cards = [
    { ic: 'map-pin', label: 'Indirizzo', value: street, sub: city.join(', '), note: 'Metro a 400 m, parcheggio convenzionato a 100 m' },
    { ic: 'phone', label: 'Telefono', value: CT.phone, sub: `Messaggi: ${CT.whatsapp}`, note: 'Reception attiva negli orari di apertura' },
    { ic: 'mail', label: 'Email', value: CT.email, sub: 'Per info, abbonamenti e aziende', note: 'Risposta entro un giorno lavorativo' },
    { ic: 'clock', label: 'Orari di oggi', value: `${today[0]}–${today[1]}`, sub: `<span class="status-dot"><span class="live-dot ${st.open ? '' : 'closed'}"></span>${st.open ? 'Aperto ora' : 'Chiuso ora'}</span>`, note: `<ul>${hoursGroupedHTML()}</ul>` }
  ];
  paint($('#contact-info'), cards.map(c => `<article class="info-card">
    <span class="ic">${icon(c.ic)}</span>
    <span class="info-label">${c.label}</span>
    <span class="info-value">${esc(c.value)}</span>
    <span class="info-sub">${c.sub.startsWith('<') ? c.sub : esc(c.sub)}</span>
    <div class="info-note">${c.note}</div>
  </article>`).join(''));
}
renderInfoCards();

const form = $('#contact-form');
if (params.get('argomento')) { const opt = [...form.elements.subject.options].find(o => o.value === params.get('argomento')); if (opt) form.elements.subject.value = opt.value; }
form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = validatePerson(form);
  ok = setErr(form.elements.subject, form.elements.subject.value ? '' : 'Scegli un argomento.') && ok;
  ok = setErr(form.elements.message, form.elements.message.value.trim().length < 10 ? 'Scrivi almeno 10 caratteri.' : '') && ok;
  if (!ok) { focusFirstError(form); return; }
  const first = form.elements.name.value.trim().split(' ')[0], r = $('#contact-result');
  form.hidden = true; r.hidden = false;
  paint(r, `<div class="success" tabindex="-1"><h3><span class="ok-icon">${icon('check')}</span>Messaggio pronto, ${esc(first)}</h3>
    <p>In un sito reale ti risponderemmo entro un giorno lavorativo. In questa demo il messaggio non è stato inviato né salvato.</p>
    <dl class="summary"><dt>Argomento</dt><dd>${esc(form.elements.subject.value)}</dd><dt>Risposta a</dt><dd>${esc(form.elements.email.value.trim())}</dd></dl>
    <button class="btn btn-ink btn-sm" style="justify-self:start" id="contact-new">Scrivi un altro messaggio</button></div>`);
  $('.success', r).focus();
  $('#contact-new').onclick = () => { form.reset(); form.hidden = false; r.hidden = true; form.elements.name.focus(); };
});

const faq = $('#faq-list'), F = SITE_DATA.faqs, half = Math.ceil(F.length / 2);
const faqItem = (f, i) => `<div class="faq-item">
  <h3><button class="faq-q" id="faq-q-${i}" aria-expanded="false" aria-controls="faq-a-${i}">${f.q}<span class="faq-ico">${icon('plus')}</span></button></h3>
  <div class="faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}"><div><p>${f.a}</p></div></div></div>`;
paint(faq, `<div class="faq-col">${F.slice(0, half).map((f, i) => faqItem(f, i)).join('')}</div><div class="faq-col">${F.slice(half).map((f, i) => faqItem(f, i + half)).join('')}</div>`);
faq.addEventListener('click', e => {
  const q = e.target.closest('.faq-q'); if (!q) return;
  const item = q.closest('.faq-item'), open = !item.classList.contains('open');
  $$('.faq-item', faq).forEach(it => { it.classList.remove('open'); $('.faq-q', it).setAttribute('aria-expanded', 'false'); });
  if (open) { item.classList.add('open'); q.setAttribute('aria-expanded', 'true'); }
});
startPage();
