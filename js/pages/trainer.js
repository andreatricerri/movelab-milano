/* Personal trainer: filtri, elenco, percorso */
'use strict';
const T = SITE_DATA.trainers;
const FT = ['#ft-spec', '#ft-slot', '#ft-day', '#ft-lang', '#ft-status'];
$('#ft-spec').insertAdjacentHTML('beforeend', uniq(T.flatMap(t => t.specs)).sort().map(s => `<option value="${s}">${cap(s)}</option>`).join(''));
$('#ft-day').insertAdjacentHTML('beforeend', DAYS.map(d => `<option value="${d}">${DAY_FULL[d]}</option>`).join(''));
$('#ft-lang').insertAdjacentHTML('beforeend', uniq(T.flatMap(t => t.langs)).sort().map(l => `<option>${l}</option>`).join(''));
const range = $('#ft-price'), prices = T.map(t => t.priceSingle);
range.min = Math.min(...prices); range.max = Math.max(...prices); range.value = range.max;
FT.forEach(s => $(s).addEventListener('change', filterTrainers));
range.addEventListener('input', filterTrainers);

function filterTrainers() {
  const f = { spec: $('#ft-spec').value, slot: $('#ft-slot').value, day: $('#ft-day').value, price: +range.value, lang: $('#ft-lang').value, status: $('#ft-status').value };
  $('#ft-price-out').textContent = euro0(f.price);
  const list = T.filter(t => (!f.spec || t.specs.includes(f.spec)) && (!f.slot || t.slots.includes(f.slot)) && (!f.day || t.days.includes(f.day)) &&
    t.priceSingle <= f.price && (!f.lang || t.langs.includes(f.lang)) && (!f.status || t.status === f.status));
  $('#trainers-count').textContent = `${list.length} ${list.length === 1 ? 'trainer trovato' : 'trainer trovati'}`;
  paint($('#trainers-grid'), list.length ? list.map(trainerCard).join('') : emptyState('Nessun trainer corrisponde ai filtri. Prova ad alzare il prezzo massimo o a cambiare giorno.', 'trainers'));
}
document.addEventListener('click', e => { if (e.target.closest('[data-reset="trainers"]')) { FT.forEach(s => { $(s).value = ''; }); range.value = range.max; filterTrainers(); } });
paint($('#pt-steps'), SITE_DATA.ptSteps.map((s, i) => `<li class="step" data-reveal><span class="step-n">${i + 1}</span><h3>${s.title}</h3><p>${s.text}</p></li>`).join(''));
filterTrainers();
startPage();
