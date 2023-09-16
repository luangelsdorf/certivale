import Plus from '@icons/plus.svg';
import Pencil from '@icons/pencil.svg';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Col, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import api from 'services/axios';
import Head from 'next/head';

export default function UsersPage() {
  const { data: session, status } = useSession();

  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState({ text: 'Ver', method: 'get' });

  const closeModal = () => setIsModalOpen(false);
  const showModal = () => setIsModalOpen(true);

  function onError(error) {
    console.error(error);
  }

  useEffect(() => {
    if (status === 'authenticated') {
      api.defaults.headers.common.Authorization = `Bearer ${session?.token}`;
      api.get('/users/list')
        .then(response => setUsers(response.data.items))
        .catch(err => console.error(err));
    }

    return () => delete api.defaults.headers.common.Authorization;
  }, [status]);

  useEffect(() => {
    const interceptError = error => console.error(error);
    const interceptRes = (response) => {
      if (response.config.method !== 'get') {
        closeModal();
        api.get('/users/list')
          .then(response => setUsers(response.data.items))
          .catch(err => console.error(err));
      }
      return response;
    }

    let apiInt = api.interceptors.response.use(interceptRes, interceptError);

    return () => api.interceptors.response.eject(apiInt)
  }, [action]);

  const { register, handleSubmit, setValue, getValues, reset, watch } = useForm({
    defaultValues: {
      id: '',
      name: '',
      login: '',
      email: '',
      cpf: '',
      is_blocked: '',
    }
  });

  /* const watchAllFields = watch();
  console.log(watchAllFields); */

  function onSubmit(data) {
    let body = { ...data, profile_id: '1' };
    switch (action.method) {
      case 'post':
        api.post(`/users/`, body);
        break;
      case 'put':
        api.put(`/users/${getValues('id')}`, body);
        break;
      case 'patch':
        api.patch(`/users/${getValues('id')}/toggleBlock`);
        break;
      /* case 'delete':
        api.delete(`/users/${getValues('id')}`, body);
        break; */
    }
  }

  const UserEntry = (props) => (
    <tr>
      <th scope="row">
        <div className="media align-items-center">
          <div className="media-body">
            <a href="#" className="name h6 mb-0 text-sm">{props.name}</a>
            <small className="d-block font-weight-bold">#{props.id.split('-')[0]}</small>
          </div>
        </div>
      </th>
      <td>{new Date(props.registration_date).toLocaleDateString()}</td>
      <td>{props.email}</td>
      <td>{props.cpf}</td>
      <td>
        <Button
          onClick={() => {
            Object.keys(getValues()).forEach(key => setValue(key, props[key]));
            setAction({ text: 'Bloquear/Desbloquear', method: 'patch' });
            showModal();
          }}
          className="block-btn"
          size="xs"
          variant={props.is_blocked ? 'danger' : 'success'}
        >
          {props.is_blocked ? 'Sim' : 'Não'}
        </Button>
      </td>
      <td className="text-right">
        {/* Actions */}
        <div className="actions ml-3">
          <Button
            onClick={() => {
              Object.keys(getValues()).forEach(key => setValue(key, props[key]));
              setAction({ text: 'Editar', method: 'put' });
              showModal();
            }}
            variant=""
            className="action-item mr-2"
            title="Editar"
          >
            <Pencil />
          </Button>
          {/* <Button
            onClick={() => {
              Object.keys(getValues()).forEach(key => setValue(key, props[key]));
              setAction({ text: 'Excluir', method: 'delete' });
              showModal();
            }}
            variant=""
            className="action-item text-danger mr-2"
            title="Excluir"
          >
            <Trash />
          </Button> */}
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <Head>
        <title>Usuários | Administrativo</title>
      </Head>

      <div className="row justify-content-between align-items-center mb-4">
        <div className="col-md-6 d-flex align-items-center justify-content-between justify-content-md-start mb-3 mb-md-0">
          <div className="d-inline-block">
            <h4 className="d-inline-block font-weight-400 mb-0 text-white">Usuários</h4>
          </div>
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-between justify-content-md-end">
          <Button
            onClick={() => {
              reset();
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
              <h6 className="d-inline-block mb-0">Usuários</h6>
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="table-responsive">
          <table className="table align-items-center">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Data de Registro</th>
                <th scope="col">E-mail</th>
                <th scope="col">CPF</th>
                <th scope="col">Bloqueado</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {
                users.map(user => (
                  <UserEntry key={user.id} {...user} />
                ))
              }
            </tbody>
          </table>
        </div>


        {/* Modal */}
        <Modal show={isModalOpen} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{action.text} Usuário</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form id="modalForm" onSubmit={handleSubmit(onSubmit, onError)}>
              {(action.text === 'Editar' || action.text === 'Criar') && (
                <>
                  <Form.Control
                    className="mb-3"
                    placeholder="Nome"
                    {...register('name', { required: true, })}
                  />
                  <Form.Control
                    className="mb-3"
                    placeholder="Login"
                    {...register('login', { required: true, })}
                  />
                  <Form.Control
                    className="mb-3"
                    placeholder="E-mail"
                    {...register('email', { required: true, })}
                  />
                  <Form.Control
                    className="mb-3"
                    placeholder="CPF"
                    {...register('cpf', { required: true, })}
                  />
                  <Form.Control
                    type="hidden"
                    {...register('is_blocked')}
                  />
                </>
              )}
              <Form.Control
                type="hidden"
                {...register('id')}
              />
            </Form>
            {action.method === 'delete' && (
              <h4>Tem certeza que deseja excluir {getValues('name')}?</h4>
            )}
            {action.method === 'patch' && (
              <h4>Tem certeza que deseja {getValues('is_blocked') ? 'desbloquear' : 'bloquear'} {getValues('name')}?</h4>
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
                {getValues('is_blocked') ? 'Desbloquear' : 'Bloquear'}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}