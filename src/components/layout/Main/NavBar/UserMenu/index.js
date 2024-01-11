import { Button, Dropdown, ListGroup, Nav } from 'react-bootstrap';
import styles from './UserMenu.module.scss';
import Bars from '@icons/bars.svg';
import Search from '@icons/magnifying-glass.svg';
import Bell from '@icons/bell.svg';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

export default function UserMenu({ content }) {
  const notifications = [
    {
      name: 'Alex Michael',
      profile: 'AM',
      text: 'Um texto de exemplo para demonstrar o contexto deste cartão.',
      time: '2 hrs ago',
      color: 'warning',
    },
    {
      name: 'Sandra Wayne',
      profile: 'SM',
      text: 'Um texto de exemplo para demonstrar o contexto deste cartão.',
      time: '3 hrs ago',
      color: 'dark',
    },
    {
      name: 'Jason Miller',
      profile: 'JM',
      text: 'Um texto de exemplo para demonstrar o contexto deste cartão.',
      time: '3 hrs ago',
      color: 'success',
    },
    {
      name: 'Mike Thomson',
      profile: 'MT',
      text: 'Um texto de exemplo para demonstrar o contexto deste cartão.',
      time: '4 hrs ago',
      color: 'info',
    },
    {
      name: 'Richard Nixon',
      profile: 'RN',
      text: 'Um texto de exemplo para demonstrar o contexto deste cartão.',
      time: '5 hrs ago',
      color: 'danger',
    },
  ];

  const { data: session } = useSession();

  const shouldShowSidebar = () => !(localStorage.getItem('cvSidenavShow') === 'true') ?? true;

  const NotificationCard = ({ n }) => (
    <div className="d-flex align-items-center">
      <div>
        <span className={`avatar bg-${n.color} text-white rounded-circle`}>{n.profile}</span>
      </div>
      <div className="flex-fill ml-3">
        <div className="h6 text-sm mb-0">{n.name} <small className="float-right text-muted">{n.time}</small></div>
        <p className="text-sm lh-140 mb-0">
          {n.text}
        </p>
      </div>
    </div>
  );

  return (
    <Nav className="ml-lg-auto align-items-center d-none d-lg-flex">
      <Nav.Item>
        <Button variant="" as={Nav.Link} className="nav-link-icon sidenav-toggler" onClick={() => {
          let show = shouldShowSidebar();
          localStorage.setItem('cvSidenavShow', show);
          show ? document.querySelector('#sidenav-main').classList.add('show') : document.querySelector('#sidenav-main').classList.remove('show');
        }}>
          <Bars />
        </Button>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link className="nav-link-icon" data-action="omnisearch-open" data-target="#omnisearch">
          <Search />
        </Nav.Link>
      </Nav.Item>

      <Dropdown className="dropdown-animate" as={Nav.Item}>
        <Dropdown.Toggle as={Nav.Link} bsPrefix="nav-link-icon">
          <Bell />
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-right dropdown-menu-lg p-0">
          <div className="py-3 px-3">
            <h5 className="h6 mb-0">Notificações</h5>
          </div>
          <ListGroup variant="flush">
            {
              notifications.map((n, index) => (
                <ListGroup.Item href="#" as={Link} key={index} className="list-group-item-action">
                  <NotificationCard n={n} />
                </ListGroup.Item>
              ))
            }
          </ListGroup>
          <div className="py-3 text-center">
            <Link href="#" className="link">Ver todas as notificações</Link>
          </div>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown className="dropdown-animate" as={Nav.Item}>
        <Dropdown.Toggle as={Nav.Link} bsPrefix="a">
          <div className="media media-pill align-items-center">
            <span className="avatar rounded-circle">
              <Image fill alt="Foto de perfil" src="/images/user.jpg" />
            </span>
            <div className="ml-2 d-none d-lg-block">
              <span className="mb-0 text-sm">{(session?.user?.name ?? session?.user?.nome)?.split(' ')[0]}</span>
            </div>
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-right dropdown-menu-sm">
          <Dropdown.Item href="#" as={Link}>Perfil</Dropdown.Item>
          <Dropdown.Item href="#" as={Link}>Configurações</Dropdown.Item>
          <Dropdown.Item href="#" as={Link}>Atividade</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#" onClick={signOut} as={'button'}>Sair</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Nav>
  )
}
