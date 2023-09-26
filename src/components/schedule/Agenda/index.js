import styles from './Agenda.module.scss';
import { Button, ButtonGroup, Card, Col, Form, Modal, Row } from "react-bootstrap";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptbrLocale from '@fullcalendar/core/locales/pt-br';
import { useEffect, useRef, useState } from "react";
import AngleRight from '@icons/angle-right.svg';
import AngleLeft from '@icons/angle-left.svg';
import { useSession } from 'next-auth/react';
import api from 'services/axios';
import { useForm } from 'react-hook-form';

export default function Agenda() {
  const fcRef = useRef(null);
  const [view, setView] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState({ text: 'Ver', method: 'get' });
  const { data: session, status } = useSession();

  const [subsidiaries, setSubsidiaries] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [people, setPeople] = useState([]);
  const [users, setUsers] = useState([]);

  const closeModal = () => setIsModalOpen(false);
  const showModal = () => setIsModalOpen(true);

  const { register, setValue, getValues, handleSubmit, reset, watch } = useForm({
    person_id: null,
    user_id: null,
    subsidiary_id: null,
    schedule_status: 'A',
    schedule_type: 'A',
    observation: null,
    description: null,
    date_time: null,
  });

  const watchAllFields = watch();
  console.log(watchAllFields);

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

  function handleDateClick(info) {
    /* info.date.setMinutes(0); */
    reset();
    showModal();
    let year = info.date.getFullYear();
    let month = (info.date.getMonth() + 1).toString().padStart(2, '0');
    let monthDay = info.date.getDate();
    let time = info.date.toLocaleTimeString();
    let dateTime = `${year}-${month}-${monthDay}T${time}`;
    console.log(dateTime);
  }

  function handleEventClick(info) {
    console.log(info);
  }

  useEffect(() => {
    if (status === 'authenticated') {
      api.defaults.headers.common.Authorization = `Bearer ${session?.token}`;
      api.get('/schedules/list').then(response => setSchedules(response.data.items));
      api.get('/subsidiaries/list').then(response => setSubsidiaries(response.data.items));
      api.get('/people/list').then(response => setPeople(response.data.items));
      api.get('/users/list').then(response => setUsers(response.data.items));
    }

    return () => delete api.defaults.headers.common.Authorization;
  }, [status]);

  useEffect(() => {
    const interceptError = error => console.error(error);
    const interceptRes = (response) => {
      if (response.config.method !== 'get') {
        closeModal();
        api.get('/schedules/list')
          .then(response => setSchedules(response.data.items))
          .catch(err => console.error(err));
      }
      return response;
    }

    let apiInt = api.interceptors.response.use(interceptRes, interceptError);

    return () => api.interceptors.response.eject(apiInt)
  }, [action]);

  const AgendaTitle = ({ view }) => (
    <Row className="justify-content-between align-items-center mb-4">
      <Col className="d-flex align-items-center">
        <h2 id="calendar-title" className="h4 d-inline-block mb-0 text-white">{view?.title}</h2>
      </Col>
      <Col lg="auto" className="mt-3 mt-lg-0 text-lg-right">
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
          <Form.Control defaultValue="0" as="select" className="ml-1" onChange={(e) => setValue('subsidiary_id', e.target.value)}>
            <option disabled value="0">Filial</option>
            {subsidiaries.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
          </Form.Control>
        </ButtonGroup>
      </Col>
    </Row>
  );

  return (
    <div id="agenda">
      <AgendaTitle view={view} />
      <Row>
        <Col>
          <Card>
            <FullCalendar
              viewDidMount={({ view: { title }, view: { type } }) => setView({ type, title })}
              ref={fcRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              weekends={false}
              eventOverlap={false}
              slotEventOverlap={false}
              allDaySlot={false}
              stickyHeaderDates={false}
              displayEventTime={false}
              headerToolbar={false}
              locale={ptbrLocale}
              slotLabelInterval="01:00:00"
              slotDuration="00:20:00"
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
                  end: '2023-08-08T09:20:00',
                  editable: true,
                },
                {
                  title: 'Evento 2',
                  start: '2023-08-08T09:20:00',
                  end: '2023-08-08T09:40:00',
                  editable: true,
                },
                {
                  title: 'Evento 3',
                  start: '2023-08-08T09:40:00',
                  end: '2023-08-08T10:00:00',
                  editable: true,
                },
                {
                  title: 'Evento 4',
                  start: '2023-08-09T09:00:00',
                  end: '2023-08-09T09:20:00',
                  editable: true,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Modal */}
      <Modal show={isModalOpen} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Novo Agendamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control defaultValue="0" className="mb-3" as="select" {...register('person_id', { required: true })}>
              <option disabled value="0">Cliente</option>
              {people.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}
            </Form.Control>

            <Form.Control defaultValue="0" className="mb-3" as="select" {...register('user_id', { required: true })}>
              <option disabled value="0">Usuário</option>
              {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
            </Form.Control>

            <Form.Control defaultValue="0" className="mb-3" as="select" {...register('subsidiary_id', { required: true })}>
              <option disabled value="0">Filial</option>
              {subsidiaries.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
            </Form.Control>

            <Form.Control defaultValue="0" className="mb-3" as="select" {...register('schedule_type', { required: true })}>
              <option disabled value="0">Tipo de Agendamento</option>
              <option value="A">Agendamento</option>
              <option value="R">Reserva de Horário</option>
              <option value="P">Pré-agendamento</option>
            </Form.Control>

            <Form.Control className="mb-3" as="textarea" placeholder="Descrição" {...register('description')} />
            <Form.Control className="mb-3" as="textarea" placeholder="Observação" {...register('observation')} />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={closeModal}>
            Salvar Agendamento
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}