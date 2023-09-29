import styles from './Agenda.module.scss';
import { Button, ButtonGroup, Card, Col, Form, Modal, Row } from "react-bootstrap";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState({ text: 'Ver', method: 'get' });
  const { data: session, status } = useSession();

  const [subsidiaries, setSubsidiaries] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [people, setPeople] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const closeModal = () => setIsModalOpen(false);
  const showModal = () => setIsModalOpen(true);

  const controller = new AbortController();

  const { register, setValue, getValues, handleSubmit, reset, watch } = useForm({
    person_id: null,
    user_id: null,
    subsidiary_id: '0',
    schedule_status: 'A',
    schedule_type: 'A',
    observation: null,
    description: null,
    date_time: null,
  });

  const watchFields = watch();

  function handleNavigation({ currentTarget: { dataset } }) {
    let fc = fcRef.current;
    if (dataset.calendarAction) {
      fc.getApi()[dataset.calendarAction]();
    }
    else if (dataset.calendarView) {
      fc.calendar.changeView(dataset.calendarView);
      document.querySelectorAll('[data-calendar-view]')?.forEach(el => {
        el.dataset.calendarView === fc.calendar.view.type ? el.classList.add('active') : el.classList.remove('active')
      })
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

  function handleDatesSet({ view }) {
    let calendarTitle = document.querySelector('#calendar-title');
    if (calendarTitle) calendarTitle.textContent = view.title;
  }

  /*** Initial Data ***/
  useEffect(() => {
    if (status === 'authenticated') {
      api.defaults.headers.common.Authorization = `Bearer ${session?.token}`;
      /* api.get('/schedules/list').then(response => setSchedules(response.data.items)); */
      api.get('/subsidiaries/list').then(response => setSubsidiaries(response.data.items));
      /* api.get('/people/list').then(response => setPeople(response.data.items)); */
      api.get('/users/list').then(response => setUsers(response.data.items));
    }

    return () => delete api.defaults.headers.common.Authorization;
  }, [status]);

  /*** Axios Interceptors ***/
  useEffect(() => {
    const interceptError = error => console.error(error);

    const interceptReq = (request) => {
      if (request.method === 'get' && request.url.includes('schedules')) {
        console.log('%cloading schedules...', 'color: skyblue');
        document.querySelector(`.${styles.card}`)?.classList.add(styles.loading);
      }
      return request;
    }

    const interceptRes = (response) => {
      if (response.config.method !== 'get') {
        closeModal();
      } else if (response.config.url.includes('schedules')) {
        console.log('%cloaded schedules!', 'color: limegreen');
        document.querySelector(`.${styles.card}`)?.classList.remove(styles.loading);
      }
      return response;
    }

    let requestInt = api.interceptors.request.use(interceptReq, interceptError);
    let responseInt = api.interceptors.response.use(interceptRes, interceptError);

    return () => {
      api.interceptors.request.eject(requestInt);
      api.interceptors.response.eject(responseInt);
    }
  }, []);

  /*** Update events based on subsidiary ***/
  useEffect(() => {
    /* console.log('changed subsidiary:', getValues('subsidiary_id')); */
  }, [watchFields.subsidiary_id]);

  const AgendaTitle = () => {
    return (
      <Row className="justify-content-between align-items-center mb-4">
        <Col className="d-flex align-items-center">
          <h2 id="calendar-title" className="h4 d-inline-block mb-0 text-white" />
        </Col>
        <Col lg="auto" className="mt-3 mt-lg-0 text-lg-right d-flex">
          <ButtonGroup className="mr-lg-1">
            <Button disabled={getValues('subsidiary_id') === '0'} data-calendar-action="prev" onClick={handleNavigation} size="sm" variant="neutral">
              <AngleLeft />
            </Button>
            <Button disabled={getValues('subsidiary_id') === '0'} data-calendar-action="next" onClick={handleNavigation} size="sm" variant="neutral">
              <AngleRight />
            </Button>
          </ButtonGroup>
          <ButtonGroup toggle>
            <Button disabled={getValues('subsidiary_id') === '0'} data-calendar-view="dayGridMonth" onClick={handleNavigation} size="sm" variant="neutral">Mês</Button>
            <Button disabled={getValues('subsidiary_id') === '0'} data-calendar-view="timeGridWeek" onClick={handleNavigation} size="sm" variant="neutral">Semana</Button>
            <Button disabled={getValues('subsidiary_id') === '0'} data-calendar-view="timeGridDay" onClick={handleNavigation} size="sm" variant="neutral">Dia</Button>
            <Form.Control defaultValue="0" as="select" className="ml-1" size="sm" {...register('subsidiary_id', { required: true })}>
              <option disabled value="0">Filial</option>
              {subsidiaries.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
            </Form.Control>
          </ButtonGroup>
        </Col>
      </Row>
    );
  };

  return (
    <div id="agenda">
      <AgendaTitle />
      <Row>
        <Col>
          {getValues('subsidiary_id')?.length > 1 ? (
            <Card className={styles.card}>
              <FullCalendar
                ref={fcRef}
                events={(info, successCallback, failureCallback) => {
                  api.get(`/schedules/${getValues('subsidiary_id')}/${info.startStr}/${info.endStr}`, { signal: controller.signal })
                    .then(response => {
                      successCallback(
                        response.data.map(schedule => ({
                          title: schedule.title,
                          start: new Date(schedule.date_time).toISOString(),
                          end: new Date(new Date(schedule.date_time).getTime() + 1.2e+6).toISOString(),
                        }))
                      )
                    })
                    .catch(error => failureCallback(error));
                }}
                businessHours={[
                  {
                    daysOfWeek: [1, 2, 3, 4, 5],
                    startTime: '07:00',
                    endTime: '19:00',
                  }
                ]}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                datesSet={handleDatesSet}
                weekends={false}
                eventOverlap={false}
                slotEventOverlap={false}
                allDaySlot={false}
                stickyHeaderDates={false}
                displayEventTime={false}
                headerToolbar={false}
                nowIndicator={false}
                locale={ptbrLocale}
                slotLabelInterval="01:00:00"
                slotDuration="00:20:00"
                slotMinTime="08:00:00"
                slotMaxTime="18:00:00"
                initialView="timeGridWeek"
              />
            </Card>
          ) : (
            <h4 className="mt-3 text-danger text-center">Por favor selecione uma filial.</h4>
          )}
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

            {/* <Form.Control className="mb-3" as="select">
              <option disabled value="0">Filial</option>
              {subsidiaries.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
            </Form.Control> */}

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