/* Home: lavagna "Oggi in sala", vantaggi, corsi e trainer in evidenza, offerta, teaser, testimonianze */
'use strict';

function renderBoard() {
  const now = new Date();
  let date = now, list = sessionsOf(todayKey()).filter(s => toMin(s.time) > nowMin()), title = 'Oggi in sala';
  if (!list.length) { date = new Date(now); date.setDate(now.getDate() + 1); list = sessionsOf(dayKeyOf(date)); title = 'Domani in sala'; }
  $('#board-title').textContent = title;
  $('#board-day').textContent = fmtDate(date);
  paint($('#today-board'), list.slice(0, 4).map(({ course: c, time }) => {
    const pct = Math.round((c.capacity - c.spots) / c.capacity * 100);
    return `<div class="board-row">
      <span class="board-time">${time}</span>
      <div class="board-name">${c.name}<small>${c.instructor}, ${c.spots} posti liberi</small>
        <div class="spots-bar ${c.spots <= 3 ? 'low' : ''}" aria-hidden="true"><span style="width:${pct}%"></span></div></div>
      <button class="btn btn-lime" data-book="corso" data-id="${c.id}" data-date="${isoDate(date)}" data-time="${time}" ${c.spots ? '' : 'disabled'}>${c.spots ? 'Prenota' : 'Completo'}</button>
    </div>`;
  }).join(''));
}
function renderFeatures() {
  paint($('#features'), SITE_DATA.features.map(f => `<article class="feature" data-reveal><span class="feature-icon">${icon(f.icon)}</span><div><h3>${f.title}</h3><p>${f.text}</p></div></article>`).join(''));
}
function renderHomeCourses() { paint($('#home-courses'), SITE_DATA.courses.filter(c => c.featured).slice(0, 3).map(courseCard).join('')); }
function renderHomeTrainers() { paint($('#home-trainers'), SITE_DATA.trainers.filter(t => t.status !== 'Non disponibile').slice(0, 3).map(trainerCard).join('')); }

let bannerTimer = null;
function renderOffer() {
  const list = SITE_DATA.offers.filter(o => o.status === 'attiva' && o.featured && o.ends), root = $('#home-offer');
  if (!list.length) { root.closest('section').hidden = true; return; }
  let i = 0;
  const draw = () => {
    const o = list[i];
    paint(root, `<div class="offer-banner" aria-live="polite">
      <div class="offer-slide">
        <span class="badge b-lime">${icon(o.icon)}Offerta a tempo</span>
        <h2>${o.title}</h2><p>${o.text}</p>
        <div class="hero-ctas" style="margin-top:1.4rem">${o.code ? codeBtn(o.code) : ''}<a href="${o.link}.html" class="btn btn-promo">Approfitta dell’offerta</a></div>
        ${list.length > 1 ? `<div class="banner-dots">${list.map((x, j) => `<button aria-label="Mostra l’offerta ${x.title}" class="${j === i ? 'active' : ''}" data-banner="${j}"></button>`).join('')}</div>` : ''}
      </div>
      <div class="offer-side offer-slide"><span class="sticker offer-big">${o.discount}</span><div><strong>Termina tra</strong>${countdownHTML(o.ends)}</div></div>
    </div>`);
    tickCountdowns();
  };
  const start = () => { clearInterval(bannerTimer); if (list.length > 1) bannerTimer = setInterval(() => { i = (i + 1) % list.length; draw(); }, 8000); };
  draw(); start();
  root.addEventListener('click', e => { const b = e.target.closest('[data-banner]'); if (b) { i = +b.dataset.banner; draw(); start(); } });
  root.addEventListener('mouseenter', () => clearInterval(bannerTimer));
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', () => clearInterval(bannerTimer));
}
function renderTeasers() {
  const m = isMember();
  paint($('#bar-list'), ['choco', 'protcoffee', 'poke'].map(barById).map(b => `<li>
    <img class="mini-thumb" src="${b.image}" alt="${esc(b.alt)}" loading="lazy">
    <span>${b.name}<small>${b.kcal} kcal${b.protein ? `, ${b.protein} g proteine` : ''}</small></span>
    <b>${euro(m ? b.price * .8 : b.price)}</b></li>`).join(''));
  paint($('#events-list'), upcomingEvents().slice(0, 3).map(ev => { const d = new Date(ev.date); return `<li>
    <span class="mini-date"><strong>${d.getDate()}</strong><small>${MONTHS[d.getMonth()]}</small></span>
    <span>${ev.title}<small>${ev.time}, ${ev.price ? euro(ev.price) : 'gratuito'}</small></span>
    <button class="btn btn-lime btn-sm" data-book="evento" data-id="${ev.id}" ${ev.spots ? '' : 'disabled'}>Iscriviti</button></li>`; }).join(''));
}

let testiTimer = null;
function renderTestimonials() {
  const track = $('#testi-track');
  paint(track, SITE_DATA.testimonials.map(t => `<figure class="testi-card">
      ${stars(t.rating)}<blockquote>“${t.text}”</blockquote>
      <figcaption class="testi-who"><span class="avatar" aria-hidden="true">${t.name.split(' ').map(w => w[0]).join('')}</span><span><strong>${t.name}</strong><small>${t.since}</small></span></figcaption>
    </figure>`).join(''));
  // scorrimento automatico, si ferma al passaggio del mouse o al tocco
  const step = () => {
    const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    track.scrollTo({ left: end ? 0 : track.scrollLeft + track.clientWidth * .9, behavior: 'smooth' });
  };
  const start = () => { clearInterval(testiTimer); testiTimer = setInterval(step, 7000); };
  ['mouseenter', 'focusin', 'touchstart'].forEach(ev => track.addEventListener(ev, () => clearInterval(testiTimer), { passive: true }));
  track.addEventListener('mouseleave', start);
  start();
}

$('#hero-open').innerHTML = openPillHTML();
renderBoard(); renderFeatures(); renderHomeCourses(); renderHomeTrainers(); renderOffer(); renderTeasers(); renderTestimonials();
document.addEventListener('data:change', () => { renderBoard(); renderHomeCourses(); renderTeasers(); });
document.addEventListener('cart:change', renderTeasers);
setInterval(() => { $('#hero-open').innerHTML = openPillHTML(); renderBoard(); }, 60000);
startPage();
