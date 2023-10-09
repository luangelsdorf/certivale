import styles from './Agenda.module.scss';
import { Button, ButtonGroup, Card, Col, Form, Modal, Row, Tab, Tabs } from "react-bootstrap";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptbrLocale from '@fullcalendar/core/locales/pt-br';
import { useCallback, useEffect, useRef, useState } from "react";
import AngleRight from '@icons/angle-right.svg';
import AngleLeft from '@icons/angle-left.svg';
import { useSession } from 'next-auth/react';
import api from 'services/axios';
import { FormProvider, useForm } from 'react-hook-form';
import PersonFields from '@/components/people/PersonFields';

export default function Agenda() {
  const fcRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState(null);
  const [action, setAction] = useState({ text: 'Ver', method: 'get' });
  const { data: session, status } = useSession();

  const [products, setProducts] = useState([]);
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [subsidiaryId, setSubsidiaryId] = useState('0');

  const [loading, setLoading] = useState(false);

  const closeModal = () => setIsModalOpen(false);
  const showModal = () => setIsModalOpen(true);

  const controller = new AbortController();

  const methods = useForm();

  /* const watchFields = methods.watch();
  console.log(watchFields); */


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
    methods.reset(undefined, { keepDefaultValues: true, keepSubmitCount: true });
    setAction({ text: 'Criar', method: 'post' });
    showModal();
    let year = info.date.getFullYear();
    let month = (info.date.getMonth() + 1).toString().padStart(2, '0');
    let monthDay = info.date.getDate().toString().padStart(2, '0');
    let time = info.date.toLocaleTimeString();
    let dateTime = `${year}-${month}-${monthDay}T${time}`;
    console.log(dateTime);
    methods.setValue('date_time', dateTime);
  }

  function handleEventClick(info) {
    console.log(info);
  }

  /*** Initial Data ***/
  useEffect(() => {
    if (status === 'authenticated') {
      api.defaults.headers.common.Authorization = `Bearer ${session?.token}`;
      api.get('/subsidiaries/list').then(response => setSubsidiaries(response.data.items));
      api.get('/products/list').then(response => setProducts(response.data.items));
    }

    return () => delete api.defaults.headers.common.Authorization;
  }, [status]);

  /*** Axios Interceptors ***/
  useEffect(() => {
    const interceptError = error => console.error(error);

    const interceptReq = (request) => {
      if (request.method === 'get' && request.url.includes('schedules') && request.url.includes(':')) {
        setLoading(true);
        /* console.info('%cloading schedules...', 'color: skyblue'); */
      }
      return request;
    }

    const interceptRes = (response) => {
      if (response.config.method !== 'get') {
        closeModal();
      } else if (response.config.url.includes('schedules') && response.config.url.includes(':')) {
        setLoading(false);
        /* console.info('%cloaded schedules!', 'color: limegreen'); */
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

  const getEvents = useCallback((info, successCallback, failureCallback) => {
    /* if (methods.formState.isValid) { */
      api.get(`/schedules/${subsidiaryId}/${info.startStr}/${info.endStr}`, { signal: controller.signal })
        .then(response => {
          let events = response.data.map(schedule => ({
            title: schedule.title.replace('Horario', 'Horário'),
            start: new Date(schedule.date_time).toISOString(),
            end: new Date(new Date(schedule.date_time).getTime() + 1.2e+6).toISOString(),
          }));
          console.log(events);
          successCallback(events);
        })
        .catch(error => failureCallback(error));
    /* } else {
      return successCallback(fcRef?.current?.calendar?.getEvents());
    } */
    /* console.log('submitCount:', methods.formState.submitCount); */
  }, [api, subsidiaryId, methods.formState.submitCount]);

  function onSubmit(data) {
    let isDirty = !!Object.keys(methods.formState.dirtyFields).length;
    console.log(`%cis dirty:%c ${isDirty}`, 'color: cyan', 'color: orchid');

    let bodyBase = {
      user_id: session.user.id,
      subsidiary_id: subsidiaryId,
      schedule_status: 'A',
      date_time: data.date_time,
    }

    if (!isDirty) {
      api.post(`/schedules/`, { ...bodyBase, schedule_type: 'R' });
    } else {
      if (data?.person?.id) {
        api.post(`/schedules/`, { ...bodyBase, person_id: data.person.id, schedule_type: 'P' });
      } else {
        let { contacts, addresses, ...personBody } = data.person;
        let [year, month, day] = personBody.birth_date.split('-');
        personBody.birth_date = `${day}-${month}-${year}`;
        api.post(`/people/`, personBody)
          .then(res => {
            if (contacts.length) {
              contacts.forEach(contact => api.post(`/people/${res.data.id}/contact`, contact));
            }
            return res;
          })
          .then(res => {
            if (addresses.length) {
              addresses.forEach(address => api.post(`/people/${res.data.id}/address`, address));
            }
            return res;
          })
          .then(res => api.post(`/schedules/`, { ...bodyBase, person_id: res.data.id, schedule_type: 'P' }));
      }
    }
  }

  function onSubmitError(errors) {
    console.error(errors);
  }

  const AgendaTitle = ({ view }) => {
    return (
      <Row className="justify-content-between align-items-center mb-4">
        <Col className="d-flex align-items-center">
          <h2 id="calendar-title" className="h4 d-inline-block mb-0 text-white">{view?.title}</h2>
        </Col>
        <Col lg="auto" className="mt-3 mt-lg-0 text-lg-right d-flex">
          <ButtonGroup className="mr-lg-1">
            <Button disabled={subsidiaryId === '0'} data-calendar-action="prev" onClick={handleNavigation} size="sm" variant="neutral">
              <AngleLeft />
            </Button>
            <Button disabled={subsidiaryId === '0'} data-calendar-action="next" onClick={handleNavigation} size="sm" variant="neutral">
              <AngleRight />
            </Button>
          </ButtonGroup>
          <ButtonGroup toggle>
            <Button active={view?.type === 'dayGridMonth'} disabled={subsidiaryId === '0'} data-calendar-view="dayGridMonth" onClick={handleNavigation} size="sm" variant="neutral">Mês</Button>
            <Button active={view?.type === 'timeGridWeek'} disabled={subsidiaryId === '0'} data-calendar-view="timeGridWeek" onClick={handleNavigation} size="sm" variant="neutral">Semana</Button>
            <Button active={view?.type === 'timeGridDay'} disabled={subsidiaryId === '0'} data-calendar-view="timeGridDay" onClick={handleNavigation} size="sm" variant="neutral">Dia</Button>
            <Form.Control value={subsidiaryId} as="select" className="ml-1" size="sm" onChange={e => setSubsidiaryId(e.target.value)}>
              <option disabled value="0">Selecione uma filial</option>
              {subsidiaries.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
            </Form.Control>
          </ButtonGroup>
        </Col>
      </Row>
    );
  };

  return (
    <div id="agenda">
      <AgendaTitle view={view} />
      <Row>
        <Col>
          {subsidiaryId?.length > 1 ? (
            <Card className={loading ? `${styles.card} ${styles.loading}` : styles.card}>
              <FullCalendar
                ref={fcRef}
                events={getEvents}
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
                datesSet={({ view }) => setView(view)}
                weekends={false}
                eventOverlap={false}
                slotEventOverlap={false}
                allDaySlot={false}
                stickyHeaderDates={false}
                displayEventTime={false}
                headerToolbar={false}
                nowIndicator={false}
                locale={ptbrLocale}
                height="auto"
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
          <FormProvider {...methods}>
            <Tabs defaultActiveKey="client" id="schedule-tabs" className="mb-4">
              <Tab eventKey="client" title="Dados do Cliente">
                <Form onSubmit={methods.handleSubmit(onSubmit, onSubmitError)} id="modalForm">
                  <PersonFields action={action} />
                  <hr />
                  <Form.Control className="mb-3" as="textarea" placeholder="Descrição" {...methods.register('description')} />
                  <Form.Control className="mb-3" as="textarea" placeholder="Observação" {...methods.register('observation')} />

                  {/* <hr />
                  <Form.Control defaultValue="0" as="select" {...methods.register('sale.product_id')}>
                    <option value="0">Selecione o produto</option>
                    {products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}
                  </Form.Control> */}
                </Form>
              </Tab>
              <Tab eventKey="payment" title="Dados do Pagamento" disabled>
                <Form.Control />
              </Tab>
            </Tabs>
          </FormProvider>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" form="modalForm">
            Salvar Agendamento
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}