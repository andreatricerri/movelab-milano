/* Eventi: filtro per tipologia */
'use strict';
let eventType = 'Tutti';
const types = ['Tutti', ...uniq(SITE_DATA.events.map(e => e.type))];
function drawTypes() { paint($('#event-filters'), types.map(t => `<button class="chip ${t === eventType ? 'active' : ''}" aria-pressed="${t === eventType}" data-etype="${t}">${t}</button>`).join('')); }
function renderEvents() {
  const list = upcomingEvents().filter(e => eventType === 'Tutti' || e.type === eventType);
  $('#events-count').textContent = `${list.length} ${list.length === 1 ? 'evento' : 'eventi'} in programma`;
  paint($('#events-grid'), list.length ? list.map(eventCard).join('') : emptyState('Nessun evento di questo tipo in programma.'));
}
$('#event-filters').addEventListener('click', e => { const b = e.target.closest('[data-etype]'); if (!b) return; eventType = b.dataset.etype; drawTypes(); renderEvents(); });
document.addEventListener('data:change', renderEvents);
drawTypes(); renderEvents();
startPage();
