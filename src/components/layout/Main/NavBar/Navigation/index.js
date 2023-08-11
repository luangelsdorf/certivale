import Link from 'next/link';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import styles from './Navigation.module.scss';


const NavBarItem = ({ children, title = 'DropMenu', className = '', toggle = 'hover', toggleAs, as, href }) => {
  if (href) {
    return (
      <Link className={className} title={title} href={href}>
        {children}
      </Link>
    );
  } else {
    return (
      <Dropdown as={Nav.Item ?? as} className={`dropdown-animate ${className}`} data-toggle={toggle}>
        <Dropdown.Toggle as={toggleAs}>{title}</Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-left" renderOnMount>
          {/* children && children.map */ false ? (
            children.map((el, index) => (
              <Dropdown.Item key={index}>
                {el}
              </Dropdown.Item>
            ))
          ) : (
            children
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
};

export default function Navigation({ children }) {
  return (
    <Nav className="align-items-lg-center">
      <NavBarItem toggleAs={Nav.Link} title="Agenda">
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Calendário</NavBarItem>
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Criar Evento</NavBarItem>
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Fechar Datas</NavBarItem>
      </NavBarItem>

      <NavBarItem toggleAs={Nav.Link} title="Comercial">
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Painel de Controle</NavBarItem>
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Cliente</NavBarItem>
        <NavBarItem submenu toggleAs={Dropdown.Item} title="Relatórios" className="dropdown-submenu">
          <NavBarItem className="dropdown-item" href="/agenda/dashboard">Renovação</NavBarItem>
          <NavBarItem className="dropdown-item" href="/agenda/dashboard">Bonificação</NavBarItem>
          <NavBarItem className="dropdown-item" href="/agenda/dashboard">Parceiros</NavBarItem>
          <NavBarItem className="dropdown-item" href="/agenda/dashboard">Suporte</NavBarItem>
        </NavBarItem>
        <NavBarItem submenu toggleAs={Dropdown.Item} title="Relacionamento" className="dropdown-submenu">
          <NavBarItem className="dropdown-item" href="/agenda/dashboard">Aniversários</NavBarItem>
          <NavBarItem className="dropdown-item" href="/agenda/dashboard">Datas Comemorativas</NavBarItem>
          <NavBarItem className="dropdown-item" href="/agenda/dashboard">E-mails Promocionais</NavBarItem>
        </NavBarItem>
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Renovação</NavBarItem>
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Captação de Parceiros</NavBarItem>
      </NavBarItem>

      <NavBarItem toggleAs={Nav.Link} title="Financeiro">
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Painel de Controle</NavBarItem>
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Notas Fiscais</NavBarItem>
        <NavBarItem submenu toggleAs={Dropdown.Item} title="Relatórios" className="dropdown-submenu">
          <NavBarItem className="dropdown-item" href="/agenda/dashboard">Bonificações</NavBarItem>
          <NavBarItem className="dropdown-item" href="/agenda/dashboard">Vendas</NavBarItem>
          <NavBarItem className="dropdown-item" href="/agenda/dashboard">Atendimentos</NavBarItem>
          <NavBarItem className="dropdown-item" href="/agenda/dashboard">Fluxo de Caixa</NavBarItem>
        </NavBarItem>
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Gestão de Contas</NavBarItem>
      </NavBarItem>

      <NavBarItem toggleAs={Nav.Link} title="Parceiros">
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Painel de Controle</NavBarItem>
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Lista Completa</NavBarItem>
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Atividade dos Parceiros</NavBarItem>
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Cadastrados do Site</NavBarItem>
      </NavBarItem>

      <NavBarItem toggleAs={Nav.Link} title="Administrativo">
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Filiais</NavBarItem>
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Usuários</NavBarItem>
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Produtos</NavBarItem>
        <NavBarItem className="dropdown-item" href="/agenda/dashboard">Configurações</NavBarItem>
      </NavBarItem>
    </Nav>
  )
}
