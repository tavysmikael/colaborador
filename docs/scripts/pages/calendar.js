// frontend/src/scripts/pages/calendar.js

export function initCalendarPage() {
  console.log('[Calendário] Página de calendário inicializada.');

  const calendar = document.getElementById('calendar');
  const eventForm = document.getElementById('eventForm');

  if (!calendar || !eventForm) {
    console.warn('[Calendário] Elementos do calendário não encontrados.');
    return;
  }

  let events = JSON.parse(localStorage.getItem('calendarEvents') || '[]');

  function renderCalendar() {
    calendar.innerHTML = '';

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // Cabeçalho da semana
    weekDays.forEach(d => {
      const el = document.createElement('div');
      el.className = 'calendar-header';
      el.textContent = d;
      calendar.appendChild(el);
    });

    // Dias vazios antes do dia 1
    for (let i = 0; i < startDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      calendar.appendChild(empty);
    }

    // Dias do mês
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const event = events.find(ev => ev.date === dateStr);

      const day = document.createElement('div');
      day.className = 'calendar-day';
      day.textContent = d;

      if (d === today) day.classList.add('today');
      if (event) day.classList.add(event.type);

      day.title = event ? event.title : '';
      day.tabIndex = 0;

      day.addEventListener('click', () => {
        if (event) {
          alert(`${event.type === 'holiday' ? 'Feriado' : 'Evento'}: ${event.title}`);
        }
      });

      calendar.appendChild(day);
    }
  }

  // Renderiza ao carregar
  renderCalendar();

  // Formulário para adicionar evento
  eventForm.addEventListener('submit', e => {
    e.preventDefault();

    const date = document.getElementById('eventDate').value;
    const title = document.getElementById('eventTitle').value;
    const type = document.getElementById('eventType').value;

    if (!date || !title) return;

    events.push({ date, title, type });
    localStorage.setItem('calendarEvents', JSON.stringify(events));

    renderCalendar();
    eventForm.reset();
  });
}
