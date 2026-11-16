/* Bar Fit: categorie del menù e prezzo abbonati */
'use strict';
let barCat = 'Tutto';
const barCats = ['Tutto', ...uniq(SITE_DATA.barMenu.map(b => b.category))];
function drawTabs() { paint($('#bar-tabs'), barCats.map(c => `<button class="chip ${c === barCat ? 'active' : ''}" role="tab" aria-selected="${c === barCat}" data-bcat="${c}">${c}</button>`).join('')); }
function renderBar() {
  paint($('#bar-grid'), SITE_DATA.barMenu.filter(b => barCat === 'Tutto' || b.category === barCat).map(barCard).join(''));
}
$('#bar-tabs').addEventListener('click', e => { const b = e.target.closest('[data-bcat]'); if (!b) return; barCat = b.dataset.bcat; drawTabs(); renderBar(); });
document.addEventListener('cart:change', renderBar);
drawTabs(); renderBar();
startPage();
