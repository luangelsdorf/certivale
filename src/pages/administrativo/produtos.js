import Plus from '@icons/plus.svg';
import Pencil from '@icons/pencil.svg';
import Trash from '@icons/trash.svg';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Col, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import api from 'services/axios';
import Head from 'next/head';
import { getExcerpt } from '@/utils/helpers';
import { maskMoney } from '@/utils/mask';

export default function ProductsPage() {
  const { data: session, status } = useSession();

  const [products, setProducts] = useState([]);
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
      api.get('/products/list')
        .then(response => setProducts(response.data.items))
        .catch(err => console.error(err));
    }

    return () => delete api.defaults.headers.common.Authorization;
  }, [status]);

  useEffect(() => {
    const interceptError = error => console.error(error);
    const interceptRes = (response) => {
      if (response.config.method !== 'get') {
        closeModal();
        api.get('/products/list')
          .then(response => setProducts(response.data.items))
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
      description: '',
      expiration: '',
      price: '',
      blocked: '',
    }
  });

  /* const watchAllFields = watch();
  console.log(watchAllFields); */

  function onSubmit(data) {
    let body = {
      ...data,
      price: parseFloat(data.price.replace(/\D/g, '')) / 100, /* converte o preço para int/float */
    };
    switch (action.method) {
      case 'post':
        api.post(`/products/`, body);
        break;
      case 'put':
        api.put(`/products/${getValues('id')}`, body);
        break;
      case 'patch':
        api.patch(`/products/${getValues('id')}/toggleBlock`);
        break;
      case 'delete':
        api.delete(`/products/${getValues('id')}`, body);
        break;
    }
  }

  const ProductEntry = (props) => {
    return (
      <tr>
        <th scope="row">
          <div className="media align-items-center">
            <div className="media-body">
              <a href="#" className="name h4 mb-0 text-sm">{props.name}</a>
              <small className="d-block font-weight-bold">#{props.id.toString().split('-')[0]}</small>
            </div>
          </div>
        </th>
        <td title={props.description}>{getExcerpt(props.description)}</td>
        <td>{props.expiration}</td>
        <td>{props.price}</td>
        <td>
          <Button
            onClick={() => {
              reset(props, { keepDefaultValues: true });
              setAction({ text: 'Bloquear/Desbloquear', method: 'patch' });
              showModal();
            }}
            className="block-btn"
            size="xs"
            variant={props.blocked ? 'danger' : 'success'}
          >
            {props.blocked ? 'Sim' : 'Não'}
          </Button>
        </td>
        <td className="text-right">
          {/* Actions */}
          <div className="actions ml-3">
            <Button
              onClick={() => {
                reset(props, { keepDefaultValues: true });
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
                Object.keys(getValues()).forEach(key => setValue(key, props[key]));
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
  };

  return (
    <>
      <Head>
        <title>Produtos | Administrativo</title>
      </Head>

      <div className="row justify-content-between align-items-center mb-4">
        <div className="col-md-6 d-flex align-items-center justify-content-between justify-content-md-start mb-3 mb-md-0">
          <div className="d-inline-block">
            <h4 className="d-inline-block font-weight-400 mb-0 text-white">Produtos</h4>
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
              <h6 className="d-inline-block mb-0">Produtos</h6>
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="table-responsive">
          <table className="table align-items-center">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Descrição</th>
                <th scope="col">Prazo (dias)</th>
                <th scope="col">Preço</th>
                <th scope="col">Bloqueado</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {
                products.map(product => (
                  <ProductEntry key={product.id} {...product} />
                ))
              }
            </tbody>
          </table>
        </div>


        {/* Modal */}
        <Modal show={isModalOpen} onHide={closeModal} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{action.text} Produto</Modal.Title>
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
                    placeholder="Descrição"
                    {...register('description', { required: true, })}
                  />
                  <Form.Control
                    type="number"
                    className="mb-3"
                    placeholder="Prazo"
                    {...register('expiration', { required: true, })}
                  />
                  <Form.Control
                    className="mb-3"
                    placeholder="Preço"
                    {...register('price', { required: true, onChange: e => setValue(e.target.name, maskMoney(e.target.value)) })}
                  />
                  <Form.Control
                    type="hidden"
                    {...register('blocked')}
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
              <h4>Tem certeza que deseja {getValues('blocked') ? 'desbloquear' : 'bloquear'} {getValues('name')}?</h4>
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
                {getValues('blocked') ? 'Desbloquear' : 'Bloquear'}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}