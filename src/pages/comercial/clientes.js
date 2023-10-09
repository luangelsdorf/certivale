import Plus from '@icons/plus.svg';
import Pencil from '@icons/pencil.svg';
import Trash from '@icons/trash.svg';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';
import api from 'services/axios';
import Head from 'next/head';
import PersonFields from '@/components/people/PersonFields';

export default function ClientsPage() {
  const { data: session, status } = useSession();

  const [people, setPeople] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState({ text: 'Ver', method: 'get' });

  const closeModal = () => setIsModalOpen(false);
  const showModal = () => setIsModalOpen(true);

  function onError(error) {
    console.error(error);
  }

  /*** fetch data when authenticated ***/
  useEffect(() => {
    if (status === 'authenticated') {
      api.defaults.headers.common.Authorization = `Bearer ${session?.token}`;
      api.get('/people/list')
        .then(response => setPeople(response.data.items))
        .catch(err => console.error(err));
    }

    return () => delete api.defaults.headers.common.Authorization;
  }, [status]);

  /*** fetch/revalidate page data ***/
  useEffect(() => {
    const interceptError = error => console.error(error);
    const interceptRes = (response) => {
      if (response.config.method !== 'get') {
        closeModal();
        api.get('/people/list')
          .then(response => setPeople(response.data.items))
          .catch(err => console.error(err));
      } else {
        /* closeModal(); */
      }

      return response;
    }

    let apiInt = api.interceptors.response.use(interceptRes, interceptError);

    return () => api.interceptors.response.eject(apiInt)
  }, [action]);

  const methods = useForm({
    defaultValues: {
      person: {
        id: null,
        name: null,
        person_type: '0',
        document: null,
        fantasy_name: null,
        state_registration: null,
        county_registration: null,
        representative_id: null,
        birth_date: null,
        contacts: [],
        addresses: [],
      }
    }
  });

  /* const watchAllFields = methods.watch();
  console.log(watchAllFields); */

  function onSubmit(data) {
    let { contacts, addresses, ...body } = data;
    if (data.person_type === 'F') {
      body = {
        person_type: data.person_type,
        name: data.name,
        document: data.document,
      };
    }

    switch (action.text) {
      case 'Criar':
        api.post(`/people/`, body)
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
          });
        break;
      case 'Editar':
        api.put(`/people/${methods.getValues('id')}`, body)
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
          });
        break;
      case 'patch':
        api.patch(`/people/${methods.getValues('id')}/toggleBlock`);
        break;
      case 'Excluir':
        api.delete(`/people/${methods.getValues('id')}`);
        break;
    }
  }

  const PersonEntry = (props) => (
    <tr>
      <th scope="row">
        <div className="media align-items-center">
          <div className="media-body">
            <a href="#" className="name h6 mb-0 text-sm">{props.name}</a>
            <small className="d-block font-weight-bold">#{props.id.split('-')[0]}</small>
          </div>
        </div>
      </th>
      <td>{props.person_type}</td>
      <td>{props.document}</td>
      <td className="text-right">
        {/* Actions */}
        <div className="actions ml-3">
          <Button
            onClick={() => {
              methods.reset({ person: props }, { keepDefaultValues: true });
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
              methods.reset({ person: props }, { keepDefaultValues: true });
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
        <title>Clientes | Comercial</title>
      </Head>

      {/* Page title */}
      <div className="row justify-content-between align-items-center mb-4">
        <div className="col-md-6 d-flex align-items-center justify-content-between justify-content-md-start mb-3 mb-md-0">
          <div className="d-inline-block">
            <h4 className="d-inline-block font-weight-400 mb-0 text-white">Pessoas</h4>
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
            title="Editar"
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
              <h6 className="d-inline-block mb-0">Pessoas</h6>
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="table-responsive">
          <table className="table align-items-center">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Tipo</th>
                <th scope="col">Documento</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {
                people.map(person => (
                  <PersonEntry key={person.id} {...person} />
                ))
              }
            </tbody>
          </table>
        </div>


        {/* Modal */}
        <Modal show={isModalOpen} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{action.text} Pessoa</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <FormProvider {...methods}>
              <Form id="modalForm">
                <PersonFields action={action} />
              </Form>
            </FormProvider>
            {action.method === 'delete' && (
              <h4>Tem certeza que deseja excluir {methods.getValues('person.name')}?</h4>
            )}
            {action.method === 'patch' && (
              <h4>Tem certeza que deseja {methods.getValues('is_blocked') ? 'desbloquear' : 'bloquear'} {methods.getValues('name')}?</h4>
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
            {action.method === 'patch' && (
              <Button type="submit" form="modalForm" variant="danger">
                {methods.getValues('is_blocked') ? 'Desbloquear' : 'Bloquear'}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}