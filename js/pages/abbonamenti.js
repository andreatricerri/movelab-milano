/* Abbonamenti: piani, confronto, promo */
'use strict';
const P = SITE_DATA.memberships;
paint($('#plans-grid'), P.map(p => `<article class="plan ${p.featured ? 'featured' : ''}" data-reveal>
  <div class="plan-top"><h3>${p.name}</h3>${p.badge ? `<span class="badge ${p.featured ? 'b-lime' : 'b-promo'}">${p.badge}</span>` : ''}</div>
  <div><span class="price">${p.price === 0 ? 'Gratis' : (p.quote ? 'da ' : '') + euro0(p.price)}</span> <small style="color:var(--muted)">${p.unit}</small>
    ${p.oldPrice ? `<div class="price-old">invece di ${euro0(p.oldPrice)}</div>` : ''}</div>
  <p class="plan-note">${p.note}</p>
  <ul class="feat-list">${p.included.map(i => `<li class="yes">${icon('check')}${i}</li>`).join('')}${p.excluded.map(i => `<li class="no">${icon('x')}<span>${i}<span class="visually-hidden"> (non incluso)</span></span></li>`).join('')}</ul>
  <button class="btn ${p.featured ? 'btn-lime' : 'btn-ghost'}" data-plan="${p.id}">Scegli questo piano</button>
</article>`).join(''));

const cell = (p, key) => {
  if (key === 'price') return p.price === 0 ? 'Gratis' : `${p.quote ? 'da ' : ''}${euro0(p.price)}<br><small style="color:var(--muted)">${p.unit}</small>`;
  const v = p.compare[key];
  if (v === true) return `<span class="tick" role="img" aria-label="Incluso">${icon('check')}</span>`;
  if (v === false) return `<span class="cross" role="img" aria-label="Non incluso">${icon('x')}</span>`;
  return esc(v);
};
$('#compare-table').insertAdjacentHTML('beforeend',
  `<thead><tr><th scope="col">Servizio</th>${P.map(p => `<th scope="col" class="${p.featured ? 'hl' : ''}">${p.name}</th>`).join('')}</tr></thead>
   <tbody>${SITE_DATA.compareRows.map(r => `<tr><th scope="row">${r.label}</th>${P.map(p => `<td class="${p.featured ? 'hl' : ''}">${cell(p, r.key)}</td>`).join('')}</tr>`).join('')}
   <tr><th scope="row"><span class="visually-hidden">Scelta</span></th>${P.map(p => `<td class="${p.featured ? 'hl' : ''}"><button class="btn btn-sm ${p.featured ? 'btn-lime' : 'btn-ghost'}" data-plan="${p.id}">Scegli</button></td>`).join('')}</tr></tbody>`);

paint($('#promo-grid'), SITE_DATA.membershipPromos.map(p => `<article class="promo ${p.hot ? 'hot' : ''}" data-reveal>
  <div class="promo-head"><span class="promo-icon">${icon(p.icon)}</span><h3>${p.title}</h3>${p.hot ? '<span class="sticker sm">Scade a breve</span>' : ''}</div>
  <p>${p.text}</p>
  <div class="promo-foot">${p.ends ? `<span>Termina tra ${countdownInline(p.ends)}</span>` : '<span>Sempre attiva</span>'}
    ${p.code ? codeBtn(p.code).replace('code-btn', 'code-btn sm') : '<a href="contatti.html" class="link">Chiedi in reception</a>'}</div>
</article>`).join(''));
startPage();
