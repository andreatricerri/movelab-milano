/* =====================================================================
   MoveLab Milano — layout.js
   Header con menu a tendina, footer, carrello, modale e sotto-menu di pagina.
   Il menu è definito una sola volta qui sotto (NAV) e vale per tutte le pagine.
   ===================================================================== */
'use strict';

/* Voci del menu: per aggiungere o spostare una pagina modifica solo questo array */
const NAV = [
  { label: 'Palestra', items: [
    { href: 'palestra.html', page: 'palestra', icon: 'building-2', title: 'La palestra', text: 'Spazi, attrezzature e galleria' },
    { href: 'palestra.html#orari', page: 'palestra', icon: 'clock', title: 'Orari e servizi', text: 'Quando siamo aperti e cosa è incluso' }
  ]},
  { label: 'Allenamento', items: [
    { href: 'corsi.html', page: 'corsi', icon: 'users', title: 'Corsi di gruppo', text: '12 corsi, filtri per giorno e livello' },
    { href: 'corsi.html#orario', page: 'corsi', icon: 'calendar-days', title: 'Orario settimanale', text: 'Tutte le lezioni giorno per giorno' },
    { href: 'trainer.html', page: 'trainer', icon: 'user-check', title: 'Personal trainer', text: 'Sette professionisti, prima consulenza gratuita' }
  ]},
  { label: 'Abbonamenti', items: [
    { href: 'abbonamenti.html', page: 'abbonamenti', icon: 'credit-card', title: 'Piani e prezzi', text: 'Mensile, annuale, studenti e aziende' },
    { href: 'offerte.html', page: 'offerte', icon: 'tag', title: 'Offerte', text: 'Promo in corso e in arrivo' }
  ]},
  { label: 'Shop e Bar', items: [
    { href: 'shop.html', page: 'shop', icon: 'shopping-bag', title: 'Shop', text: 'Integratori e abbigliamento, ritiro in sede' },
    { href: 'bar.html', page: 'bar', icon: 'cup-soda', title: 'Bar Fit', text: 'Shake e pranzi fit, −20% per gli abbonati' }
  ]},
  { label: 'Eventi', href: 'eventi.html', page: 'eventi' },
  { label: 'Contatti', href: 'contatti.html', page: 'contatti' }
];

function renderHeader() {
  const groups = NAV.map((g, i) => {
    const active = g.page === PAGE || (g.items || []).some(it => it.page === PAGE);
    if (!g.items) return `<li class="nav-item"><a class="nav-link ${active ? 'active' : ''}" href="${g.href}" ${active ? 'aria-current="page"' : ''}>${g.label}</a></li>`;
    return `<li class="nav-item">
      <button class="nav-link ${active ? 'active' : ''}" aria-expanded="false" aria-controls="dd-${i}" data-dd>${g.label}${icon('chevron-down', 'chev')}</button>
      <div class="dropdown" id="dd-${i}"><div class="dd-inner">
        ${g.items.map(it => {
          const current = it.page === PAGE && !it.href.includes('#');
          return `<a class="dd-link ${current ? 'current' : ''}" href="${it.href}" ${current ? 'aria-current="page"' : ''}><span class="dd-icon">${icon(it.icon)}</span><span><strong>${it.title}</strong><small>${it.text}</small></span></a>`;
        }).join('')}
      </div></div></li>`;
  }).join('');
  $('#site-header').outerHTML = `
  <header class="site-header">
    <div class="container nav">
      <a href="index.html" class="logo" aria-label="MoveLab Milano, home"><span class="logo-mark">${icon('dumbbell')}</span>MoveLab <small>Milano</small></a>
      <nav aria-label="Navigazione principale" style="display:contents">
        <ul class="nav-menu" id="nav-menu">
          ${groups}
          <li class="nav-mobile-extra">
            <a href="prenotazioni.html?tipo=prova" class="btn btn-lime btn-block">${icon('calendar-check')}Prenota la prova gratuita</a>
            <p id="menu-open-status"></p>
          </li>
        </ul>
      </nav>
      <div class="nav-actions">
        <a href="prenotazioni.html?tipo=prova" class="btn btn-lime btn-sm nav-cta">Prova gratuita</a>
        <button class="icon-btn" id="cart-btn" aria-label="Apri il carrello">${icon('shopping-bag')}<span class="cart-count" id="cart-count" hidden>0</span></button>
        <button class="icon-btn hamburger" id="hamburger" aria-label="Apri il menu" aria-expanded="false" aria-controls="nav-menu">${icon('menu')}</button>
      </div>
    </div>
  </header>`;
}

function renderFooter() {
  const cols = NAV.filter(g => g.items).slice(0, 3).map(g => `<div><h3>${g.label}</h3><ul class="foot-links">${g.items.map(it => `<li><a href="${it.href}">${it.title}</a></li>`).join('')}</ul></div>`).join('');
  const C = SITE_DATA.contacts;
  $('#site-footer').outerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo"><span class="logo-mark">${icon('dumbbell')}</span>MoveLab <small>Milano</small></a>
          <p style="margin-top:.6rem;max-width:34ch;font-size:.9rem">${esc(C.address)}<br>${esc(C.phone)}</p>
        </div>
        ${cols}
        <div class="footer-news">
          <h3>Newsletter</h3>
          <p class="news-note" style="font-size:.88rem;color:#9a9a9a">Novità e promo, una mail al mese.</p>
          <form class="news-form" id="news-form" novalidate>
            <label for="news-email" class="visually-hidden">La tua email</label>
            <input id="news-email" type="email" inputmode="email" placeholder="La tua email" autocomplete="email">
            <button class="btn btn-lime btn-sm" type="submit">Iscriviti</button>
          </form>
          <p class="err" id="news-err" style="color:#FF8A80"></p>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} MoveLab Milano. Progetto dimostrativo: nomi, dati e prezzi sono fittizi.</span>
        <span><a href="eventi.html">Eventi</a> · <a href="shop.html">Shop</a> · <a href="bar.html">Bar Fit</a> · <a href="contatti.html">Contatti</a></span>
      </div>
    </div>
  </footer>`;
}

function renderGlobals() {
  document.body.insertAdjacentHTML('beforeend', `
  <div class="overlay" id="overlay"></div>
  <aside class="drawer" id="cart" aria-label="Carrello" aria-hidden="true">
    <div class="drawer-head"><h2>Carrello</h2><button class="icon-btn" id="cart-close" aria-label="Chiudi il carrello">${icon('x')}</button></div>
    <div class="drawer-body" id="cart-body"></div>
    <div class="drawer-foot" id="cart-foot" hidden></div>
  </aside>
  <div class="modal" id="modal" aria-hidden="true">
    <div class="modal-box" role="dialog" aria-modal="true" aria-label="Dettaglio">
      <button class="modal-close" id="modal-close" aria-label="Chiudi">${icon('x')}</button>
      <div id="modal-body"></div>
    </div>
  </div>
  <div class="toasts" id="toasts" aria-live="polite"></div>
  <button class="to-top" id="to-top" aria-label="Torna in cima">${icon('arrow-up')}</button>`);
}

/* ---------- Comportamento del menu ---------- */
function closeDropdowns(except) {
  $$('.nav-item.open').forEach(li => { if (li !== except) { li.classList.remove('open'); $('[data-dd]', li).setAttribute('aria-expanded', 'false'); } });
}
function toggleMenu(open) {
  const menu = $('#nav-menu'), hb = $('#hamburger');
  const o = typeof open === 'boolean' ? open : !menu.classList.contains('open');
  menu.classList.toggle('open', o);
  hb.setAttribute('aria-expanded', String(o));
  hb.setAttribute('aria-label', o ? 'Chiudi il menu' : 'Apri il menu');
  hb.innerHTML = icon(o ? 'x' : 'menu');
  if (o) {
    $('#menu-open-status').innerHTML = openStatus().text;
    // su mobile apre già il gruppo della pagina corrente
    const cur = $('.nav-item .nav-link.active[data-dd]');
    if (cur) { cur.parentElement.classList.add('open'); cur.setAttribute('aria-expanded', 'true'); }
  } else closeDropdowns();
  if (window.lucide) lucide.createIcons();
  lockScroll();
}
function bindLayout() {
  const menu = $('#nav-menu');
  menu.addEventListener('click', e => {
    const b = e.target.closest('[data-dd]');
    if (b) {
      const li = b.parentElement, open = !li.classList.contains('open');
      closeDropdowns(li);
      li.classList.toggle('open', open); b.setAttribute('aria-expanded', String(open));
      return;
    }
    if (e.target.closest('a')) { closeDropdowns(); if (menu.classList.contains('open')) toggleMenu(false); }
  });
  // con il mouse il menu si apre anche al passaggio: aggiorniamo aria-expanded
  $$('.nav-item').forEach(li => {
    const b = $('[data-dd]', li); if (!b) return;
    li.addEventListener('mouseleave', () => { if (window.matchMedia('(hover:hover) and (min-width:1181px)').matches) { li.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); } });
  });
  document.addEventListener('click', e => { if (!e.target.closest('.nav-item')) closeDropdowns(); });
  $('#hamburger').addEventListener('click', () => toggleMenu());
  window.matchMedia('(min-width:1181px)').addEventListener('change', e => { if (e.matches && menu.classList.contains('open')) toggleMenu(false); });

  $('#modal-close').addEventListener('click', closeModal);
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
  $('#to-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  $('#news-form').addEventListener('submit', e => {
    e.preventDefault();
    const inp = $('#news-email'), err = $('#news-err');
    if (!RX_EMAIL.test(inp.value.trim())) { err.textContent = 'Inserisci un’email valida.'; inp.focus(); return; }
    err.textContent = ''; inp.value = '';
    toast('Iscrizione simulata: nessuna email verrà inviata.');
  });

  document.addEventListener('keydown', e => {
    const modal = $('#modal'), cart = $('#cart');
    if (e.key === 'Escape') {
      if (modal.classList.contains('open')) closeModal();
      else if (cart.classList.contains('open')) closeCart();
      else if (menu.classList.contains('open')) { toggleMenu(false); $('#hamburger').focus(); }
      else if ($('.nav-item.open')) { const b = $('.nav-item.open [data-dd]'); closeDropdowns(); b.focus(); }
      return;
    }
    // il focus resta dentro modale o carrello quando sono aperti
    const box = modal.classList.contains('open') ? $('.modal-box', modal) : cart.classList.contains('open') ? cart : null;
    if (e.key === 'Tab' && box) {
      const f = $$('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])', box).filter(x => !x.disabled && x.offsetParent !== null);
      if (f.length) {
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    if (modalKeyHandler && modal.classList.contains('open')) modalKeyHandler(e);
  });
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    $('.site-header').classList.toggle('scrolled', y > 10);
    $('#to-top').classList.toggle('show', y > 700);
  }, { passive: true });
}

/* ---------- Sotto-menu di pagina con evidenziazione della sezione visibile ---------- */
function bindSubnav() {
  const nav = $('.subnav'); if (!nav) return;
  document.documentElement.classList.add('has-subnav');
  const links = $$('a[href^="#"]', nav);
  const targets = links.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  const setActive = id => links.forEach(a => {
    const on = a.getAttribute('href') === '#' + id;
    a.classList.toggle('active', on);
    on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
    const row = a.parentElement; if (on && row.scrollWidth > row.clientWidth) row.scrollTo({ left: a.offsetLeft - 20, behavior: 'smooth' });
  });
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entries => {
    const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (vis) setActive(vis.target.id);
  }, { rootMargin: '-35% 0px -55% 0px' });
  targets.forEach(t => obs.observe(t));
  if (targets[0]) setActive(location.hash ? location.hash.slice(1) : targets[0].id);
}

renderHeader();
renderFooter();
renderGlobals();
bindLayout();
bindSubnav();
