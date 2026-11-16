/* Prenotazioni: il tipo si può preselezionare con ?tipo=corso&id=hiit */
'use strict';
mountBooking($('#booking-root'), { type: params.get('tipo') || 'prova', id: params.get('id') || '' });
renderMyBookings();
startPage();
