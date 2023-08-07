import { Card } from "react-bootstrap";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptbrLocale from '@fullcalendar/core/locales/pt-br';
import Head from "next/head";

export default function AgendaDashBoard() {
  return (
    <>
      <Head>
        <title>Agenda | Certivale</title>
      </Head>

      <div>
        <Card>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            weekends={false}
            eventOverlap={false}
            slotEventOverlap={false}
            allDaySlot={false}
            stickyHeaderDates={false}
            headerToolbar={false}
            displayEventTime={false}
            slotLabelInterval="01:00:00"
            slotDuration="00:15:00"
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            locale={ptbrLocale}
            initialView="timeGridWeek"
            businessHours={[
              {
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: '08:00',
                endTime: '12:00',
              },
              {
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: '13:00',
                endTime: '18:00',
              }
            ]}
            events={[
              {
                title: 'Evento 1',
                start: '2023-08-08T09:00:00',
                end: '2023-08-08T09:15:00',
                editable: true,
              },
              {
                title: 'Evento 2',
                start: '2023-08-08T09:15:00',
                end: '2023-08-08T09:30:00',
                editable: true,
              },
              {
                title: 'Evento 3',
                start: '2023-08-08T09:30:00',
                end: '2023-08-08T09:45:00',
                editable: true,
              },
              {
                title: 'Evento 4',
                start: '2023-08-09T09:00:00',
                end: '2023-08-09T09:15:00',
                editable: true,
              },
            ]}
          />
        </Card>
      </div>
    </>
  )
}
