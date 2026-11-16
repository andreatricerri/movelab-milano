/* =====================================================================
   MoveLab Milano — cart.js
   Carrello condiviso tra tutte le pagine, salvato SOLO nel localStorage
   del browser. Checkout simulato: nessun pagamento e nessun invio di dati.
   ===================================================================== */
'use strict';

const CART_KEY = 'movelab_cart_v1';
function loadCart() {
  const c = store.get(CART_KEY, null);
  if (!c || !Array.isArray(c.items)) return { items: [], member: null, coupon: '' };
  // la tessera salvata viene ricontrollata sull'elenco demo
  const m = c.member && typeof c.member === 'object' ? SITE_DATA.members.find(x => x.code === c.member.code) : null;
  return { items: c.items.filter(i => i && typeof i.price === 'number' && i.qty > 0 && i.key), member: m ? { code: m.code, name: m.name } : null, coupon: typeof c.coupon === 'string' ? c.coupon : '' };
}
const cart = loadCart();
// Le altre pagine possono ascoltare questo evento per aggiornarsi (es. prezzi abbonati del Bar Fit)
const cartChanged = () => document.dispatchEvent(new CustomEvent('cart:change'));

function isMember() { return !!cart.member || cart.items.some(i => i.kind === 'plan' && i.price > 0); }
function saveCart() { store.set(CART_KEY, cart); updateCartCount(); }
function updateCartCount(bump) {
  const n = cart.items.reduce((s, i) => s + i.qty, 0), el = $('#cart-count');
  if (!el) return;
  el.textContent = n; el.hidden = n === 0;
  $('#cart-btn').setAttribute('aria-label', `Apri il carrello, ${n} ${n === 1 ? 'articolo' : 'articoli'}`);
  if (bump) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
}
function addToCart(item, silent = false) {
  const key = `${item.kind}:${item.id}${item.variant ? ':' + item.variant : ''}`;
  if (item.kind === 'plan') cart.items = cart.items.filter(i => i.kind !== 'plan');
  const ex = cart.items.find(i => i.key === key), max = item.max || 20, add = item.qty || 1;
  if (ex) {
    if (ex.qty >= max) { toast(`Hai già aggiunto tutti i pezzi disponibili di ${esc(item.name)}.`, 'warn'); return; }
    ex.qty = Math.min(max, ex.qty + add);
  } else {
    cart.items.push({ key, kind: item.kind, id: item.id, name: item.name, price: item.price, variant: item.variant || '', image: item.image || '', qty: item.kind === 'plan' ? 1 : Math.min(max, add), max });
  }
  saveCart(); updateCartCount(true); renderCart(); cartChanged();
  if (!silent) toast(`${esc(item.name)}${item.variant ? ' (' + esc(item.variant) + ')' : ''} aggiunto al carrello.`);
}
// quantità totale di un prodotto nel carrello (tutte le taglie)
const qtyInCart = (kind, id) => cart.items.filter(i => i.kind === kind && i.id === id).reduce((s, i) => s + i.qty, 0);
function decFromCart(kind, id) {
  const it = [...cart.items].reverse().find(i => i.kind === kind && i.id === id); if (!it) return;
  it.qty -= 1;
  if (it.qty <= 0) cart.items = cart.items.filter(i => i !== it);
  saveCart(); updateCartCount(); renderCart(); cartChanged();
}
/* Tessera abbonato: 8 cifre, verificata sull'elenco demo in data.js */
function applyMemberCode(raw) {
  const code = String(raw || '').replace(/\s/g, '');
  if (!/^\d{8}$/.test(code)) return { ok: false, msg: 'Il codice tessera ha 8 cifre, senza lettere.' };
  const m = SITE_DATA.members.find(x => x.code === code);
  if (!m) return { ok: false, msg: 'Tessera non trovata. Controlla il numero sul retro della tessera.' };
  cart.member = { code: m.code, name: m.name }; saveCart(); renderCart(); cartChanged();
  toast(`Ciao ${esc(m.name.split(' ')[0])}, sconto abbonato del 20% attivo.`);
  return { ok: true };
}
function removeMember() { cart.member = null; saveCart(); renderCart(); cartChanged(); toast('Tessera rimossa dal carrello.', 'warn'); }
function validCoupon(code) {
  const c = SITE_DATA.coupons.find(x => x.code === code);
  if (!c) return { ok: false, msg: 'Codice non valido. Controlla di averlo scritto bene.' };
  const now = Date.now();
  if (c.from && now < c.from) return { ok: false, msg: 'Codice non ancora attivo: lo puoi usare dall’inizio della promo.' };
  if (c.to && now > c.to) return { ok: false, msg: 'Codice scaduto.' };
  return { ok: true, c };
}
// Sconto abbonato 20% su Shop e Bar Fit. Codice promo sul suo ambito. Non cumulabili: per ogni articolo vale il più conveniente
function cartTotals() {
  const subtotal = cart.items.reduce((s, i) => s + i.price * i.qty, 0), member = isMember();
  let coupon = null, couponMsg = '';
  if (cart.coupon) { const v = validCoupon(cart.coupon); if (v.ok) coupon = v.c; else couponMsg = v.msg; }
  let memberDisc = 0, couponDisc = 0, inScope = false;
  cart.items.forEach(i => {
    const line = i.price * i.qty;
    const m = member && (i.kind === 'shop' || i.kind === 'bar') ? 20 : 0;
    const c = coupon && coupon.scope.includes(i.kind) ? coupon.percent : 0;
    if (c) inScope = true;
    if (m && m >= c) memberDisc += line * m / 100; else if (c) couponDisc += line * c / 100;
  });
  memberDisc = round2(memberDisc); couponDisc = round2(couponDisc);
  if (coupon && !couponDisc) couponMsg = inScope
    ? 'Non cumulabile: per questi articoli lo sconto abbonato è già più conveniente.'
    : `Il codice vale per ${coupon.scope.map(s => ({ shop: 'lo shop', plan: 'gli abbonamenti', bar: 'il Bar Fit' })[s]).join(' e ')}: aggiungi un articolo idoneo.`;
  return { subtotal, memberDisc, couponDisc, coupon, couponMsg, total: Math.max(0, round2(subtotal - memberDisc - couponDisc)) };
}
const KIND_LABEL = { shop: 'Shop', bar: 'Bar Fit', plan: 'Abbonamento' };

function renderCart() {
  const body = $('#cart-body'), foot = $('#cart-foot');
  if (!body) return;
  if (!cart.items.length) {
    foot.hidden = true; foot.innerHTML = '';
    paint(body, `<div class="empty" style="margin-top:1rem">${icon('shopping-bag')}<p>Il carrello è vuoto. Aggiungi integratori, abbigliamento, un ordine per il Bar Fit o un abbonamento.</p>
      <div class="chips" style="justify-content:center"><a class="btn btn-lime btn-sm" href="shop.html">Vai allo shop</a><a class="btn btn-ghost btn-sm" href="bar.html">Menù Bar Fit</a></div></div>`);
    return;
  }
  const t = cartTotals();
  foot.hidden = false;
  paint(body, cart.items.map(i => `<div class="cart-item">
      <img src="${i.image}" alt="" loading="lazy">
      <div><h4>${esc(i.name)}</h4><small>${KIND_LABEL[i.kind]}${i.variant ? `, taglia ${esc(i.variant)}` : ''}</small><small>${euro(i.price)} cad.</small></div>
      <div class="ci-right">
        ${i.kind === 'plan' ? '' : `<div class="qty" role="group" aria-label="Quantità di ${esc(i.name)}"><button data-qty="-1" data-key="${i.key}" aria-label="Diminuisci">${icon('minus')}</button><span>${i.qty}</span><button data-qty="1" data-key="${i.key}" aria-label="Aumenta">${icon('plus')}</button></div>`}
        <strong>${euro(i.price * i.qty)}</strong>
        <button class="remove-btn" data-remove="${i.key}" aria-label="Rimuovi ${esc(i.name)}">${icon('trash-2')}</button>
      </div></div>`).join('') + `
    <div class="cart-extra">
      <div class="member-box">
        ${cart.member
          ? `<div class="member-ok"><span><span class="ok-icon">${icon('check')}</span>Ciao ${esc(cart.member.name.split(' ')[0])}, −20% abbonato attivo</span><button class="link" id="member-remove" type="button">Rimuovi</button></div><small class="card-text">Tessera ${cart.member.code.replace(/(\d{4})(\d{4})/, '$1 $2')}, ${esc(cart.member.name)}</small>`
          : `<div class="field"><label for="member-input">Codice tessera abbonato</label>
              <div class="coupon-row"><input id="member-input" inputmode="numeric" maxlength="9" autocomplete="off" placeholder="8 cifre, es. 1048 2736">
              <button class="btn btn-ink btn-sm" id="member-apply" type="button">Verifica</button></div>
              <span class="err" id="member-msg" role="status"></span>
              <small class="card-text">20% di sconto su Shop e Bar Fit. Non cumulabile con i codici promo.</small></div>`}
      </div>
      <div class="field"><label for="coupon-input">Codice sconto</label>
        <div class="coupon-row"><input id="coupon-input" value="${esc(cart.coupon)}" placeholder="Es. BLACKFIT" autocomplete="off" autocapitalize="characters" spellcheck="false">
        <button class="btn btn-ink btn-sm" id="coupon-apply" type="button">${cart.coupon ? 'Aggiorna' : 'Applica'}</button></div>
        <span class="err" id="coupon-msg" role="status">${esc(t.couponMsg)}</span></div>
    </div>`);
  paint(foot, `<div class="totals">
      <div><span>Subtotale</span><span>${euro(t.subtotal)}</span></div>
      ${t.memberDisc ? `<div class="discount"><span>Sconto abbonato (20%)</span><span>−${euro(t.memberDisc)}</span></div>` : ''}
      ${t.couponDisc ? `<div class="discount"><span>Codice ${t.coupon.code} (−${t.coupon.percent}%)</span><span>−${euro(t.couponDisc)}</span></div>` : ''}
      <div class="grand"><span>Totale</span><span>${euro(t.total)}</span></div></div>
    <button class="btn btn-lime btn-block" id="checkout-btn">${icon('lock')}Vai al checkout</button>
    <button class="link" id="cart-clear" style="justify-self:center">Svuota il carrello</button>`);
}
function openCart(focusMember = false) {
  renderCart();
  $('#cart').classList.add('open'); $('#cart').setAttribute('aria-hidden', 'false');
  $('#overlay').classList.add('show'); lockScroll();
  setTimeout(() => { const m = focusMember && $('#member-input'); (m || $('#cart-close')).focus(); }, 80);
}
function closeCart() {
  const c = $('#cart'); if (!c || !c.classList.contains('open')) return;
  c.classList.remove('open'); c.setAttribute('aria-hidden', 'true');
  $('#overlay').classList.remove('show'); lockScroll();
  $('#cart-btn').focus();
}

function openCheckout() {
  if (!cart.items.length) return;
  const t = cartTotals(), hasBar = cart.items.some(i => i.kind === 'bar');
  closeCart();
  openModal(`<div class="modal-content"><h2>Checkout</h2>
    <div class="demo-note">${icon('shield-check')}<span>Checkout dimostrativo: nessun pagamento reale e nessun dato inviato. Non inserire dati di carte o documenti.</span></div>
    <dl class="summary">${cart.items.map(i => `<dt>${i.qty} × ${esc(i.name)}${i.variant ? ' (' + esc(i.variant) + ')' : ''}</dt><dd>${euro(i.price * i.qty)}</dd>`).join('')}
      ${t.memberDisc ? `<dt>Sconto abbonato</dt><dd>−${euro(t.memberDisc)}</dd>` : ''}${t.couponDisc ? `<dt>Codice ${t.coupon.code}</dt><dd>−${euro(t.couponDisc)}</dd>` : ''}
      <dt><strong>Totale</strong></dt><dd><strong>${euro(t.total)}</strong></dd></dl>
    <form id="checkout-form" novalidate><div class="form-grid">
      ${personFields('co')}
      <div class="field full"><span class="label">Ritiro</span><div class="slots">
        <label><input type="radio" name="pickup" value="Reception" checked><span>Reception</span></label>
        ${hasBar ? '<label><input type="radio" name="pickup" value="Bancone Bar Fit"><span>Bancone Bar Fit</span></label>' : ''}</div></div>
      <div class="field full"><span class="label">Pagamento</span><div class="slots">
        <label><input type="radio" name="pay" value="Al ritiro in palestra" checked><span>Al ritiro in palestra</span></label>
        <label><input type="radio" name="pay" value="Pagamento simulato (demo)"><span>Pagamento simulato (demo)</span></label></div></div>
      ${privacyField}
    </div><button class="btn btn-lime" type="submit" style="margin-top:1.2rem">${icon('check')}Conferma l’ordine</button></form>
    <div id="checkout-result" hidden></div></div>`, '', 'Checkout');
  const form = $('#checkout-form');
  if (cart.member) form.elements.name.value = cart.member.name; // tessera riconosciuta: nome precompilato
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validatePerson(form)) { focusFirstError(form); return; }
    const code = randomCode(), total = cartTotals().total, pickup = form.elements.pickup.value, pay = form.elements.pay.value;
    cart.items = []; cart.coupon = ''; saveCart(); renderCart(); cartChanged();
    form.hidden = true;
    const r = $('#checkout-result'); r.hidden = false;
    paint(r, `<div class="success" tabindex="-1"><h3><span class="ok-icon">${icon('check')}</span>Ordine confermato</h3>
      <p>Mostra il codice ${pickup === 'Reception' ? 'in reception' : 'al bancone del Bar Fit'}: l’ordine resta valido 48 ore. Nessun addebito è stato effettuato.</p>
      <dl class="summary"><dt>Codice ordine</dt><dd>${code}</dd><dt>Totale</dt><dd>${euro(total)}</dd><dt>Pagamento</dt><dd>${esc(pay)}</dd></dl>
      <button class="btn btn-ink btn-sm" style="justify-self:start" id="co-close">Torna al sito</button></div>`);
    $('.success', r).focus();
    $('#co-close').onclick = closeModal;
    toast(`Ordine ${code} confermato.`);
  });
}

function bindCart() {
  const el = $('#cart');
  $('#cart-btn').addEventListener('click', openCart);
  $('#cart-close').addEventListener('click', closeCart);
  $('#overlay').addEventListener('click', closeCart);
  el.addEventListener('click', e => {
    const q = e.target.closest('[data-qty]'), r = e.target.closest('[data-remove]');
    if (q) {
      const it = cart.items.find(i => i.key === q.dataset.key); if (!it) return;
      it.qty += Number(q.dataset.qty);
      if (it.qty > it.max) { it.qty = it.max; toast('Quantità massima disponibile raggiunta.', 'warn'); }
      if (it.qty <= 0) cart.items = cart.items.filter(i => i !== it);
      saveCart(); renderCart(); cartChanged(); return;
    }
    if (r) { cart.items = cart.items.filter(i => i.key !== r.dataset.remove); saveCart(); renderCart(); cartChanged(); $('#cart-close').focus(); return; }
    if (e.target.closest('#coupon-apply')) {
      cart.coupon = $('#coupon-input').value.trim().toUpperCase(); saveCart(); renderCart();
      const t = cartTotals();
      if (t.coupon && t.couponDisc) toast(`Codice ${t.coupon.code} applicato.`);
      $('#coupon-input').focus(); return;
    }
    if (e.target.closest('#member-apply')) {
      const r = applyMemberCode($('#member-input').value);
      if (!r.ok) { $('#member-msg').textContent = r.msg; $('#member-input').focus(); } else if ($('#member-remove')) $('#member-remove').focus();
      return;
    }
    if (e.target.closest('#member-remove')) { removeMember(); if ($('#member-input')) $('#member-input').focus(); return; }
    if (e.target.closest('#cart-clear')) { cart.items = []; cart.coupon = ''; saveCart(); renderCart(); cartChanged(); toast('Carrello svuotato.', 'warn'); return; }
    if (e.target.closest('#checkout-btn')) openCheckout();
  });
  el.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    if (e.target.id === 'coupon-input') { e.preventDefault(); $('#coupon-apply').click(); }
    if (e.target.id === 'member-input') { e.preventDefault(); $('#member-apply').click(); }
  });
  // carrello aggiornato in un'altra scheda o pagina
  window.addEventListener('storage', e => {
    if (e.key !== CART_KEY) return;
    Object.assign(cart, loadCart()); updateCartCount(); renderCart(); cartChanged();
  });
}
bindCart();
