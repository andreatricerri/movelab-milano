/* Shop: più acquistati, categorie, ricerca, ordinamento */
'use strict';
const SP = SITE_DATA.shopProducts;
let shopCat = 'Tutti', saleOnly = false;
const cats = ['Tutti', ...uniq(SP.map(p => p.category))];
function drawCats() {
  paint($('#shop-cats'), cats.map(c => `<button class="chip ${c === shopCat ? 'active' : ''}" aria-pressed="${c === shopCat}" data-scat="${c}">${c}</button>`).join('') +
    `<button class="chip chip-sale ${saleOnly ? 'active' : ''}" aria-pressed="${saleOnly}" data-sale>${icon('tag')}In offerta</button>`);
}
function filterShop() {
  const q = $('#fs-q').value.trim().toLowerCase(), sort = $('#fs-sort').value, sale = saleOnly;
  const list = SP.filter(p => (shopCat === 'Tutti' || p.category === shopCat) && (!sale || p.oldPrice) && (!q || `${p.name} ${p.desc} ${p.category}`.toLowerCase().includes(q)));
  if (sort === 'pa') list.sort((a, b) => a.price - b.price);
  if (sort === 'pd') list.sort((a, b) => b.price - a.price);
  if (sort === 'rate') list.sort((a, b) => b.rating - a.rating);
  $('#shop-count').textContent = `${list.length} ${list.length === 1 ? 'prodotto' : 'prodotti'}`;
  paint($('#shop-grid'), list.length ? list.map(productCard).join('') : emptyState('Nessun prodotto trovato. Prova con un’altra parola o categoria.', 'shop'));
}
$('#shop-cats').addEventListener('click', e => {
  if (e.target.closest('[data-sale]')) { saleOnly = !saleOnly; drawCats(); filterShop(); return; }
  const b = e.target.closest('[data-scat]'); if (!b) return; shopCat = b.dataset.scat; drawCats(); filterShop();
});
$('#fs-q').addEventListener('input', filterShop);
$('#fs-sort').addEventListener('change', filterShop);
document.addEventListener('click', e => { if (e.target.closest('[data-reset="shop"]')) { $('#fs-q').value = ''; $('#fs-sort').value = 'rel'; saleOnly = false; shopCat = 'Tutti'; drawCats(); filterShop(); } });
// Striscia compatta: miniatura, nome, prezzo e aggiunta rapida con selettore "− 1 +"
function renderBest() {
  paint($('#best-track'), SP.filter(p => p.best).map(p => `<article class="mini-product">
    <img src="${p.image}" alt="${esc(p.alt)}" loading="lazy" width="72" height="72">
    <div><h3 data-product="${p.id}">${p.name}</h3>
      <div class="mp-row"><b>${euro(isMember() ? p.price * .8 : p.price)}</b>${p.sizes
        ? `<button class="icon-add" data-add-product="${p.id}" aria-label="Scegli la taglia di ${esc(p.name)}">${icon('shirt')}</button>`
        : qtyControl('shop', p.id, p.name) || `<button class="icon-add" data-add-product="${p.id}" aria-label="Aggiungi ${esc(p.name)} al carrello">${icon('plus')}</button>`}</div></div>
  </article>`).join(''));
}
document.addEventListener('cart:change', () => { filterShop(); renderBest(); });
renderBest();
drawCats(); filterShop();
startPage();
