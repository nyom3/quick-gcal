'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function CalendarView() {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={[
        { title: 'event 1', date: '2025-07-01' },
        { title: 'event 2', date: '2025-07-02' }
      ]}
    />
  );
}
