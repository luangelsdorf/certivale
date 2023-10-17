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
import Trash from '@icons/trash.svg';
import { useSession } from 'next-auth/react';
import api from 'services/axios';
import { FormProvider, useForm } from 'react-hook-form';
import PersonFields from '@/components/people/PersonFields';
import { formatPerson } from '@/utils/people';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

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
  const [successCount, setSuccessCount] = useState(0);

  const closeModal = () => setIsModalOpen(false);
  const showModal = () => setIsModalOpen(true);

  const DeleteConfirmation = withReactContent(Swal);

  const methods = useForm({
    id: '',
    date_time: '',
    person: {
      id: '',
      person_type: '',
      document: '',
      name: '',
      birth_date: '',
      fantasy_name: '',
      address: {},
      contact: {},
    },
    representative: {
      id: '',
      person_type: '',
      document: '',
      name: '',
      birth_date: '',
      fantasy_name: '',
      address: {},
      contact: {},
    },
  });

  const watchPersonType = methods.watch('person.person_type');

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
    methods.setValue('date_time', dateTime);
  }

  function handleEventClick(info) {
    api.get(`/schedules/${info.event.id}`)
      .then(res => {
        setAction({ method: 'put', text: 'Editar' })
        if (res.data.person) {
          formatPerson(methods, res.data.person);
          methods.setValue('id', res.data.id);
        } else {
          methods.reset(undefined, { keepDefaultValues: true, keepSubmitCount: true });
          methods.setValue('id', res.data.id);
        }
        showModal();
      })
      .catch(error => console.error(error));
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
    api.get(`/schedules/${subsidiaryId}/${info.startStr}/${info.endStr}`)
      .then(response => {
        let events = response.data.map(schedule => ({
          id: schedule.id,
          title: schedule.title.replace('Horario', 'Horário'),
          start: new Date(schedule.date_time).toISOString(),
          end: new Date(new Date(schedule.date_time).getTime() + 1.2e+6).toISOString(),
        }));
        successCallback(events);
      })
      .catch(error => failureCallback(error));
    /* } else {
      return successCallback(fcRef?.current?.calendar?.getEvents());
    } */
    /* console.log('submitCount:', methods.formState.submitCount); */
  }, [api, subsidiaryId, methods.formState.submitCount, successCount]);

  function onSubmit(data) {
    let isDirty = !!Object.keys(methods.formState.dirtyFields).length;

    let bodyBase = {
      user_id: session.user.id,
      subsidiary_id: subsidiaryId,
      schedule_status: 'A',
      date_time: data.date_time,
    }

    let clientData = data.person;
    let representativeData = data.representative;

    if (!isDirty) {
      api.post(`/schedules/`, { ...bodyBase, schedule_type: 'R' })
      return;
    }

    if (data?.person?.id) {
      api.post(`/schedules/`, { ...bodyBase, person_id: data.person.id, schedule_type: 'P' });
    } else {
      let { contact, address, ...personBody } = data?.person?.person_type === 'F' ? clientData : representativeData;
      let [year, month, day] = personBody.birth_date.split('-');
      personBody.birth_date = `${day}-${month}-${year}`;
      api.post(`/people/`, personBody)
        .then(res => { api.post(`/people/${res.data.id}/contact`, { contact_type_id: contact.phone.length > 14 ? '1' : '2', value: contact.phone }); return res; })
        .then(res => { api.post(`/people/${res.data.id}/contact`, { contact_type_id: '3', value: contact.email }); return res; })
        .then(res => { api.post(`/people/${res.data.id}/address`, address); return res; })
        .then(res => {
          if (data?.person?.person_type === 'F') {
            api.post(`/schedules/`, { ...bodyBase, person_id: res.data.id, schedule_type: 'P' })
              .then(() => setSuccessCount(prev => prev + 1));
          } else {
            let { contact, address, ...personBody } = clientData;
            api.post(`/people/`, { ...personBody, county_registration: '0', state_registration: '0', representative_id: res.data.id })
              .then(res => { api.post(`/people/${res.data.id}/contact`, { contact_type_id: contact.phone.length > 14 ? '1' : '2', value: contact.phone }); return res; })
              .then(res => { api.post(`/people/${res.data.id}/contact`, { contact_type_id: '3', value: contact.email }); return res; })
              .then(res => { api.post(`/people/${res.data.id}/address`, address); return res; })
              .then(res => api.post(`/schedules/`, { ...bodyBase, person_id: res.data.id, schedule_type: 'P' }))
              .then(() => setSuccessCount(prev => prev + 1));
          }
        });
    }
  }

  function onSubmitError(errors) {
    console.log('%cRHF Error', 'color:tomato');
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
            {/* <Tabs defaultActiveKey="client" id="schedule-tabs" className="mb-4">
              <Tab eventKey="client" title="Dados do Cliente"> */}
            <Form onSubmit={methods.handleSubmit(onSubmit, onSubmitError)} id="modalForm">
              <Form.Control className="mb-3" defaultValue="" as="select" {...methods.register('person.person_type')}>
                <option value="">Selecione o produto</option>
                {/* {products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)} */}
                <optgroup label="e-CPF">
                  <option value="F">e-CPF A1 - 1 Ano</option>
                  <option value="F">e-CPF A3 - 1 Ano</option>
                  <option value="F">e-CPF A3 - 2 Anos</option>
                  <option value="F">e-CPF A3 - 3 Anos</option>
                </optgroup>
                <optgroup label="e-CNPJ">
                  <option value="J">e-CNPJ A1 - 1 Ano</option>
                  <option value="J">e-CNPJ A3 - 1 Ano</option>
                  <option value="J">e-CNPJ A3 - 2 Anos</option>
                  <option value="J">e-CNPJ A3 - 3 Anos</option>
                </optgroup>
                <optgroup label="SafeID">
                  <option value="F">SafeID CPF A3 - 1 Ano</option>
                  <option value="J">SafeID CNPJ A3 - 1 Ano</option>
                </optgroup>
              </Form.Control>
              <div>
                {watchPersonType && <h5 className="mt-5 mb-3">Dados do Cliente</h5>}
                <PersonFields personType={watchPersonType} action={action} />
              </div>
              {watchPersonType === 'J' && (
                <div>
                  <h5 className="mt-5 mb-3">Dados do Representante</h5>
                  <PersonFields baseName="representative" personType="F" action={action} />
                </div>
              )}
              {/* <hr />
              <Form.Control className="mb-3" as="textarea" placeholder="Descrição" {...methods.register('description')} />
              <Form.Control className="mb-3" as="textarea" placeholder="Observação" {...methods.register('observation')} /> */}
            </Form>
            {/* </Tab>
              <Tab eventKey="payment" title="Dados do Pagamento" disabled>
                <Form.Control />
              </Tab>
            </Tabs> */}
          </FormProvider>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
          {action.text === 'Editar' && (
            <Button className="btn-icon-only mr-auto" variant="danger" onClick={() => {
              closeModal();
              DeleteConfirmation.fire({
                title: 'Deseja excluir este agendamento?',
                text: 'Esta ação é irreversível.',
                icon: 'warning',
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: 'Excluir',
                cancelButtonText: 'Cancelar',
                customClass: { confirmButton: 'btn btn-danger', cancelButton: 'btn btn-secondary' },
                allowEscapeKey: true,
              })
                .then(result => {
                  if (result.isConfirmed) {
                    api.delete(`/schedules/${methods.getValues('id')}`)
                      .then(() => setSuccessCount(prev => prev + 1))
                  }
                })
            }}>
              <Trash />
            </Button>
          )}
          <Button type="submit" variant="primary" form="modalForm">
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div >
  )
}