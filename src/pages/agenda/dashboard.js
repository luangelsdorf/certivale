import { Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptbrLocale from '@fullcalendar/core/locales/pt-br';
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import AngleRight from '@icons/angle-right.svg';
import AngleLeft from '@icons/angle-left.svg';

export default function AgendaDashBoard() {
  const fcRef = useRef(null);
  const [view, setView] = useState({});

  function handleNavigation({ currentTarget: { dataset } }) {
    let fc = fcRef.current;
    if (dataset.calendarAction) {
      fc.getApi()[dataset.calendarAction]();
      setView({ ...view, type: fc.calendar.view.type, title: fc.calendar.view.title, });
    }
    else if (dataset.calendarView) {
      fc.calendar.changeView(dataset.calendarView);
    }
  }

  function handleChangeView(e) {
  }

  return (
    <>
      <Head>
        <title>Agenda | Certivale</title>
      </Head>

      <div className="page-title">
        <Row className="justify-content-between align-items-center">
          <Col className="d-flex align-items-center">
            <h2 id="calendar-title" className="h4 d-inline-block mb-0 text-white">{view?.title}</h2>
          </Col>
          <Col lg="6" className="mt-3 mt-lg-0 text-lg-right">
            <ButtonGroup className="mr-lg-1">
              <Button data-calendar-action="prev" onClick={handleNavigation} size="sm" variant="neutral">
                <AngleLeft height="1em" />
              </Button>
              <Button data-calendar-action="next" onClick={handleNavigation} size="sm" variant="neutral">
                <AngleRight height="1em" />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button className={view?.type === 'dayGridMonth' ? 'active' : undefined} data-calendar-view="dayGridMonth" onClick={handleNavigation} size="sm" variant="neutral">Mês</Button>
              <Button className={view?.type === 'timeGridWeek' ? 'active' : undefined} data-calendar-view="timeGridWeek" onClick={handleNavigation} size="sm" variant="neutral">Semana</Button>
              <Button className={view?.type === 'listWeek' ? 'active' : undefined} data-calendar-view="listWeek" onClick={handleNavigation} size="sm" variant="neutral">Fechar</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </div>

      <Row>
        <Col>
          <Card>
            <FullCalendar
              viewDidMount={({ view: { title }, view: { type } }) => setView({ type, title })}
              ref={fcRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              weekends={false}
              eventOverlap={false}
              slotEventOverlap={false}
              allDaySlot={false}
              stickyHeaderDates={false}
              displayEventTime={false}
              headerToolbar={false}
              locale={ptbrLocale}
              slotLabelInterval="01:00:00"
              slotDuration="00:15:00"
              slotMinTime="08:00:00"
              slotMaxTime="18:00:00"
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
        </Col>
      </Row>
    </>
  )
}
