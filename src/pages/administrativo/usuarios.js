import Plus from '@icons/plus.svg';
import Pencil from '@icons/pencil.svg';
import Trash from '@icons/trash.svg';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import fetchAPI from '@/utils/fetchAPI';

const PageTitle = () => (
  <div className="row justify-content-between align-items-center">
    <div className="col-md-6 d-flex align-items-center justify-content-between justify-content-md-start mb-3 mb-md-0">
      <div className="d-inline-block">
        <h4 className="d-inline-block font-weight-400 mb-0 text-white">Usuários</h4>
      </div>
    </div>
    <div className="col-md-6 d-flex align-items-center justify-content-between justify-content-md-end">
      <a href="#" className="btn btn-sm btn-white btn-icon-only rounded-circle">
        <Plus style={{ height: 'inherit' }} />
      </a>
    </div>
  </div>
);

export default function UsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAPI('/users/list', 'GET', session.token)
        .then(response => response?.json())
        .then(response => {
          if (response) setUsers(response.items);
        })
        .catch(err => console.error(err));
    }
  }, [status]);

  const UserEntry = ({ id = '1001', name = 'João da Silva', registration_date = '01/01/2010', email = 'email@email.com', cpf = '00000000000', is_blocked = false }) => (
    <tr>
      <th scope="row">
        <div className="media align-items-center">
          <div className="media-body">
            <a href="#" className="name h6 mb-0 text-sm">{name}</a>
            <small className="d-block font-weight-bold">#{id.split('-')[0]}</small>
          </div>
        </div>
      </th>
      <td>{new Date(registration_date).toLocaleDateString()}</td>
      <td>{email}</td>
      <td>{cpf}</td>
      <td>{is_blocked ? 'Sim' : 'Não'}</td>
      <td className="text-right">
        {/* Actions */}
        <div className="actions ml-3">
          <a href="#" className="action-item mr-2" title="Editar">
            <Pencil />
          </a>
          <a href="#" className="action-item text-danger mr-2" title="Excluir">
            <Trash />
          </a>
        </div>
      </td>
    </tr>
  );

  return (
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
              <th scope="col">Criado em</th>
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
    </div>

  )
}

UsersPage.Title = <PageTitle />;