/* Offerte: filtri per stato e ambito */
'use strict';
// Fascia della card: sfondo antracite e colore dello sticker
const OFFER_COLORS = { promo: ['var(--dark-band)', ''], lime: ['var(--dark-band)', 'lime'], white: ['var(--dark-band)', 'white'] };
let offerStatus = 'tutte';
function offerCard(o) {
  const [bg, st] = OFFER_COLORS[o.color] || OFFER_COLORS.lime;
  const badge = { 'attiva': '<span class="badge b-lime">Attiva</span>', 'in-arrivo': '<span class="badge b-dark">In arrivo</span>', 'conclusa': '<span class="badge b-gray">Conclusa</span>' }[o.status];
  let timer = '';
  if (o.status === 'attiva') timer = o.ends ? `<span>Termina tra ${countdownInline(o.ends)}</span>` : '<span>Sempre attiva</span>';
  if (o.status === 'in-arrivo') timer = `<span>Inizia tra ${countdownInline(o.starts)}</span>`;
  if (o.status === 'conclusa') timer = '<span>Torna il prossimo anno</span>';
  return `<article class="card offer-card ${o.status === 'conclusa' ? 'is-ended' : ''}" data-reveal>
    <div class="offer-top" style="background:${bg}"><span class="sticker lg ${st}">${o.discount}</span><span class="offer-icon">${icon(o.icon)}</span></div>
    <div class="card-body">
      <div style="display:flex;justify-content:space-between;gap:.6rem;align-items:center"><h3>${o.title}</h3>${badge}</div>
      <p class="card-text">${o.text}</p>
      <div class="spec-list">${o.scope.map(s => `<span class="tag">${s}</span>`).join('')}</div>
      <div class="offer-meta">${timer}${o.code && o.status !== 'conclusa' ? codeBtn(o.code).replace('code-btn', 'code-btn sm') : ''}</div>
      ${o.status === 'attiva' ? `<div class="card-actions"><a href="${o.link}.html" class="btn btn-lime btn-sm">Usa l’offerta</a></div>` : ''}
    </div></article>`;
}
function drawChips() {
  paint($('#offer-status'), [['tutte', 'Tutte'], ['attiva', 'Attive'], ['in-arrivo', 'In arrivo'], ['conclusa', 'Concluse']]
    .map(([k, l]) => `<button class="chip ${k === offerStatus ? 'active' : ''}" aria-pressed="${k === offerStatus}" data-ostatus="${k}">${l}</button>`).join(''));
}
function renderOffers() {
  const scope = $('#fo-scope').value, order = { 'attiva': 0, 'in-arrivo': 1, 'conclusa': 2 };
  const list = SITE_DATA.offers.filter(o => (offerStatus === 'tutte' || o.status === offerStatus) && (!scope || o.scope.includes(scope)))
    .sort((a, b) => order[a.status] - order[b.status] || (a.ends || a.starts || 9e15) - (b.ends || b.starts || 9e15));
  $('#offers-count').textContent = `${list.length} ${list.length === 1 ? 'offerta' : 'offerte'}`;
  paint($('#offers-grid'), list.length ? list.map(offerCard).join('') : emptyState('Nessuna offerta con questi filtri.'));
  tickCountdowns();
}
$('#offer-status').addEventListener('click', e => { const b = e.target.closest('[data-ostatus]'); if (!b) return; offerStatus = b.dataset.ostatus; drawChips(); renderOffers(); });
$('#fo-scope').insertAdjacentHTML('beforeend', uniq(SITE_DATA.offers.flatMap(o => o.scope)).map(s => `<option>${s}</option>`).join(''));
$('#fo-scope').addEventListener('change', renderOffers);
drawChips(); renderOffers();
startPage();
