import Plus from '@icons/plus.svg';
import Pencil from '@icons/pencil.svg';
import Trash from '@icons/trash.svg';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';
import api from 'services/axios';
import Head from 'next/head';
import OpeningHours from '@/components/subsidiaries/OpeningHours';

export default function SubsidiariesPage() {
  const { data: session, status } = useSession();

  const [subsidiaries, setSubsidiaries] = useState([]);
  const [people, setPeople] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState({ text: 'Ver', method: 'get' });

  const closeModal = () => setIsModalOpen(false);
  const showModal = () => setIsModalOpen(true);

  function onError(error) {
    console.error(error);
  }

  useEffect(() => {
    const interceptError = error => console.error(error);
    const interceptRes = (response) => {
      if (response.config.method !== 'get') {
        if (!response.config.url.includes('time')) closeModal();
        api.get('/subsidiaries/list').then(response => setSubsidiaries(response.data.items));
        if (response.config.url.includes('people')) {
          api.get('/people/list').then(response => setPeople(response.data.items));
        }
      }
      return response;
    }

    let apiInt = api.interceptors.response.use(interceptRes, interceptError);

    return () => api.interceptors.response.eject(apiInt)
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      api.defaults.headers.common.Authorization = `Bearer ${session?.token}`;
      api.get('/subsidiaries/list').then(response => setSubsidiaries(response.data.items));
      api.get('/people/list').then(response => setPeople(response.data.items));
    }

    return () => delete api.defaults.headers.common.Authorization;
  }, [status]);

  const methods = useForm({
    defaultValues: {
      id: null,
      name: null,
      google_maps_loc: null,
      is_active: null,
      person_id: '0',
      times: [],
    }
  });

  const watchPersonId = methods.watch('person_id');

  /* const watchAllFields = methods.watch();
  console.log(watchAllFields); */

  function onSubmit(data) {
    let body = data;
    switch (action.text) {
      case 'Criar':
        api.post(`/subsidiaries/`, body);
        break;
      case 'Editar':
        api.put(`/subsidiaries/${methods.getValues('id')}`, body);
        break;
      case 'Ativar/Desativar':
        api.patch(`/subsidiaries/${methods.getValues('id')}/toggleActive`);
        break;
      case 'Excluir':
        api.delete(`/subsidiaries/${methods.getValues('id')}`, body);
        break;
    }
  }

  const SubsidiaryEntry = (props) => (
    <tr>
      <th scope="row">
        <div className="media align-items-center">
          <div className="media-body">
            <a href="#" className="name h6 mb-0 text-sm">{props.name}</a>
            <small className="d-block font-weight-bold">#{props.id.split('-')[0]}</small>
          </div>
        </div>
      </th>

      <td>
        <Button
          onClick={() => {
            Object.keys(methods.getValues()).forEach(key => methods.setValue(key, props[key]));
            setAction({ text: 'Ativar/Desativar', method: 'patch' });
            showModal();
          }}
          className="block-btn"
          size="xs"
          variant={props.is_active ? 'success' : 'danger'}
        >
          {props.is_active ? 'Sim' : 'Não'}
        </Button>
      </td>

      <td className="text-right">
        {/* Actions */}
        <div className="actions ml-3">
          <Button
            onClick={() => {
              let { times, ...rest } = methods.getValues();
              Object.keys(rest).forEach(key => methods.setValue(key, props[key]));
              methods.setValue('person_id', props.person.id);
              methods.setValue('times', props.times.toSorted((a, b) => parseInt(a.time) - parseInt(b.time)));
              setAction({ text: 'Editar', method: 'put' });
              showModal();
            }}
            variant=""
            className="action-item mr-2"
            title="Editar"
          >
            <Pencil />
          </Button>
          <Button
            onClick={() => {
              Object.keys(methods.getValues()).forEach(key => methods.setValue(key, props[key]));
              methods.setValue('person_id', props.person.id);
              setAction({ text: 'Excluir', method: 'delete' });
              showModal();
            }}
            variant=""
            className="action-item text-danger mr-2"
            title="Excluir"
          >
            <Trash />
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <Head>
        <title>Filiais | Administrativo</title>
      </Head>

      {/* Page title */}
      <div className="row justify-content-between align-items-center mb-4">
        <div className="col-md-6 d-flex align-items-center justify-content-between justify-content-md-start mb-3 mb-md-0">
          <div className="d-inline-block">
            <h4 className="d-inline-block font-weight-400 mb-0 text-white">Filiais</h4>
          </div>
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-between justify-content-md-end">
          <Button
            onClick={() => {
              methods.reset();
              setAction({ text: 'Criar', method: 'post' });
              showModal();
            }}
            variant="white"
            size="sm"
            className="btn-icon-only rounded-circle"
            title="Nova Filial"
          >
            <Plus style={{ height: 'inherit' }} />
          </Button>
        </div>
      </div>

      <div className="card">
        {/* Card header */}
        <div className="card-header actions-toolbar border-0">
          <div className="row justify-content-between align-items-center">
            <div className="col">
              <h6 className="d-inline-block mb-0">Filiais</h6>
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="table-responsive">
          <table className="table align-items-center">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Ativa</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {
                subsidiaries.map(subsidiary => (
                  <SubsidiaryEntry key={subsidiary.id} {...subsidiary} />
                ))
              }
            </tbody>
          </table>
        </div>


        {/* Modal */}
        <Modal show={isModalOpen} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{action.text} Filial</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <FormProvider {...methods}>
              <Form id="modalForm" onSubmit={methods.handleSubmit(onSubmit, onError)}>
                {/*** Subsidiary fields ***/}
                {(action.text === 'Editar' || action.text === 'Criar') && (
                  <>
                    <Form.Control
                      className="mb-3"
                      placeholder="Nome"
                      {...methods.register('name', { required: true, })}
                    />
                    <Form.Control
                      className="mb-3"
                      placeholder="Localização (Google Maps)"
                      {...methods.register('google_maps_loc')}
                    />
                    <Form.Control
                      as="select"
                      defaultValue="0"
                      className="mb-3"
                      placeholder="Pessoa"
                      {...methods.register('person_id', { required: true, })}
                    >
                      <option disabled value="0">Pessoa</option>
                      {people.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}
                    </Form.Control>
                  </>
                )}
                {/*** Person data preview ***/}
                {(watchPersonId !== '0' && (action.text === 'Criar' || action.text === 'Editar')) && Array.from(Object.values(people.find(person => person.id === watchPersonId))).map((val, i) => (
                  (typeof val === 'string' && i !== 0) && <Form.Control disabled key={i} className="mb-2" value={val} />
                ))}
                {/*** Subsidiary opening hours ***/}
                {action.text === 'Editar' && <OpeningHours />}
                <Form.Control
                  type="hidden"
                  {...methods.register('id')}
                />
              </Form>
            </FormProvider>
            {action.method === 'delete' && (
              <h4>Tem certeza que deseja excluir {methods.getValues('name')}?</h4>
            )}
            {action.text === 'Ativar/Desativar' && (
              <h4>Tem certeza que deseja {methods.getValues('is_active') ? 'desativar' : 'ativar'} {methods.getValues('name')}?</h4>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            {(action.text === 'Editar' || action.text === 'Criar') && (
              <Button type="submit" form="modalForm" variant="primary">
                {action.text}
              </Button>
            )}
            {action.method === 'delete' && (
              <Button type="submit" form="modalForm" variant="danger">
                Excluir
              </Button>
            )}
            {action.text === 'Ativar/Desativar' && (
              <Button type="submit" form="modalForm" variant={methods.getValues('is_active') ? 'danger' : 'success'}>
                {methods.getValues('is_active') ? 'Desativar' : 'Ativar'}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}