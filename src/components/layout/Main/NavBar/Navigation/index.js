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
        <NavBarItem className="dropdown-item" href="/comercial/dashboard">Painel de Controle</NavBarItem>
        <NavBarItem className="dropdown-item" href="/comercial/clientes">Clientes</NavBarItem>
        <NavBarItem submenu toggleAs={Dropdown.Item} title="Relatórios" className="dropdown-submenu">
          <NavBarItem className="dropdown-item" href="/comercial/relatorios/renovacao">Renovação</NavBarItem>
          <NavBarItem className="dropdown-item" href="/comercial/relatorios/bonificacao">Bonificação</NavBarItem>
          <NavBarItem className="dropdown-item" href="/comercial/relatorios/parceiros">Parceiros</NavBarItem>
          <NavBarItem className="dropdown-item" href="/comercial/relatorios/suporte">Suporte</NavBarItem>
        </NavBarItem>
        <NavBarItem submenu toggleAs={Dropdown.Item} title="Relacionamento" className="dropdown-submenu">
          <NavBarItem className="dropdown-item" href="/comercial/relacionamento/aniversarios">Aniversários</NavBarItem>
          <NavBarItem className="dropdown-item" href="/comercial/relacionamento/datas-comemorativas">Datas Comemorativas</NavBarItem>
          <NavBarItem className="dropdown-item" href="/comercial/relacionamento/emails-promocionais">E-mails Promocionais</NavBarItem>
        </NavBarItem>
        <NavBarItem className="dropdown-item" href="/comercial/renovacao">Renovação</NavBarItem>
        <NavBarItem className="dropdown-item" href="/comercial/captacao-de-parceiros">Captação de Parceiros</NavBarItem>
      </NavBarItem>

      <NavBarItem toggleAs={Nav.Link} title="Financeiro">
        <NavBarItem className="dropdown-item" href="/financeiro/dashboard">Painel de Controle</NavBarItem>
        <NavBarItem className="dropdown-item" href="/financeiro/notas-fiscais">Notas Fiscais</NavBarItem>
        <NavBarItem submenu toggleAs={Dropdown.Item} title="Relatórios" className="dropdown-submenu">
          <NavBarItem className="dropdown-item" href="/financeiro/relatorios/bonificacoes">Bonificações</NavBarItem>
          <NavBarItem className="dropdown-item" href="/financeiro/relatorios/vendas">Vendas</NavBarItem>
          <NavBarItem className="dropdown-item" href="/financeiro/relatorios/atendimentos">Atendimentos</NavBarItem>
          <NavBarItem className="dropdown-item" href="/financeiro/relatorios/fluxo-de-caixa">Fluxo de Caixa</NavBarItem>
        </NavBarItem>
        <NavBarItem className="dropdown-item" href="/financeiro/gestao-de-contas">Gestão de Contas</NavBarItem>
      </NavBarItem>

      <NavBarItem toggleAs={Nav.Link} title="Parceiros">
        <NavBarItem className="dropdown-item" href="/parceiros/dashboard">Painel de Controle</NavBarItem>
        <NavBarItem className="dropdown-item" href="/parceiros/lista">Lista Completa</NavBarItem>
        <NavBarItem className="dropdown-item" href="/parceiros/atividade">Atividade dos Parceiros</NavBarItem>
        <NavBarItem className="dropdown-item" href="/parceiros/cadastro-site">Cadastrados do Site</NavBarItem>
      </NavBarItem>

      <NavBarItem toggleAs={Nav.Link} title="Administrativo">
        <NavBarItem className="dropdown-item" href="/administrativo/filiais">Filiais</NavBarItem>
        <NavBarItem className="dropdown-item" href="/administrativo/usuarios">Usuários</NavBarItem>
        <NavBarItem className="dropdown-item" href="/administrativo/produtos">Produtos</NavBarItem>
        <NavBarItem className="dropdown-item" href="/administrativo/configurações">Configurações</NavBarItem>
      </NavBarItem>
    </Nav>
  )
}
