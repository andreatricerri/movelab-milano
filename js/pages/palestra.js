/* Palestra: aree, galleria, orari, servizi, come raggiungerci */
'use strict';
$('#gym-open').innerHTML = openPillHTML();
paint($('#gym-areas'), SITE_DATA.gymAreas.map(a => `<article class="area" data-reveal><span class="area-icon">${icon(a.icon)}</span><div><h3>${a.name}</h3><p>${a.text}</p><small>${a.size}</small></div></article>`).join(''));
paint($('#gallery'), SITE_DATA.gallery.map((g, i) => `<button data-gallery="${i}" aria-label="Ingrandisci: ${esc(g.alt)}"><img src="${g.image}" alt="${esc(g.alt)}" loading="lazy"></button>`).join(''));
$('#hours-list').innerHTML = hoursHTML();
paint($('#services-list'), SITE_DATA.services.map(s => `<li>${icon('check')}${s}</li>`).join(''));
paint($('#reach-list'), SITE_DATA.reach.map(r => `<li><span class="area-icon">${icon(r.icon)}</span><div><strong>${r.title}</strong><p>${r.text}</p></div></li>`).join(''));
startPage();
