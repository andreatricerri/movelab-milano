/* Corsi: filtri, elenco e orario settimanale */
'use strict';
const C = SITE_DATA.courses;
const FC = ['#fc-q', '#fc-cat', '#fc-day', '#fc-slot', '#fc-level', '#fc-instr'];
let scheduleDay = todayKey();

$('#fc-cat').insertAdjacentHTML('beforeend', uniq(C.map(c => c.category)).sort().map(v => `<option>${v}</option>`).join(''));
$('#fc-day').insertAdjacentHTML('beforeend', DAYS.map(d => `<option value="${d}">${DAY_FULL[d]}</option>`).join(''));
$('#fc-instr').insertAdjacentHTML('beforeend', uniq(C.map(c => c.instructor)).sort().map(v => `<option>${v}</option>`).join(''));
FC.forEach(s => $(s).addEventListener(s === '#fc-q' ? 'input' : 'change', filterCourses));

function filterCourses() {
  const f = { q: $('#fc-q').value.trim().toLowerCase(), cat: $('#fc-cat').value, day: $('#fc-day').value, slot: $('#fc-slot').value, level: $('#fc-level').value, instr: $('#fc-instr').value };
  const list = C.filter(c => (!f.cat || c.category === f.cat) && (!f.level || c.level === f.level) && (!f.instr || c.instructor === f.instr) &&
    (!f.q || `${c.name} ${c.desc} ${c.category}`.toLowerCase().includes(f.q)) &&
    c.schedule.some(s => (!f.day || s.day === f.day) && (!f.slot || slotOf(s.time) === f.slot)));
  $('#courses-count').textContent = `${list.length} ${list.length === 1 ? 'corso trovato' : 'corsi trovati'}`;
  paint($('#courses-grid'), list.length ? list.map(courseCard).join('') : emptyState('Nessun corso corrisponde ai filtri. Prova a cambiare giorno o fascia oraria.', 'courses'));
}
function renderScheduleTabs() {
  paint($('#day-tabs'), DAYS.map(d => `<button class="chip ${d === scheduleDay ? 'active' : ''}" role="tab" aria-selected="${d === scheduleDay}" data-day="${d}">${DAY_FULL[d]}${d === todayKey() ? ' <small>(oggi)</small>' : ''}</button>`).join(''));
}
function renderSchedule() {
  const date = nextDateFor(scheduleDay), isToday = scheduleDay === todayKey();
  paint($('#schedule-list'), sessionsOf(scheduleDay).map(({ course: c, time }) => {
    const past = isToday && toMin(time) <= nowMin();
    return `<div class="slot-row ${past ? 'past' : ''}">
      <span class="slot-time">${time}</span>
      <span class="slot-name">${c.name}<small>${c.instructor}, ${c.duration} min, ${c.level}</small></span>
      <span class="slot-spots"><span class="badge ${c.spots <= 3 ? 'b-promo' : 'b-lime'}">${c.spots} posti</span></span>
      <button class="btn btn-ink btn-sm" data-book="corso" data-id="${c.id}" data-date="${isoDate(date)}" data-time="${time}" ${past || !c.spots ? 'disabled' : ''}>${past ? 'Già iniziato' : 'Prenota'}</button>
    </div>`;
  }).join('') || emptyState('Nessuna lezione in programma per questo giorno.'));
}
$('#day-tabs').addEventListener('click', e => { const b = e.target.closest('[data-day]'); if (!b) return; scheduleDay = b.dataset.day; renderScheduleTabs(); renderSchedule(); $(`[data-day="${scheduleDay}"]`).focus(); });
document.addEventListener('click', e => { if (e.target.closest('[data-reset="courses"]')) { FC.forEach(s => { $(s).value = ''; }); filterCourses(); } });
document.addEventListener('data:change', () => { filterCourses(); renderSchedule(); });

filterCourses(); renderScheduleTabs(); renderSchedule();
startPage();
