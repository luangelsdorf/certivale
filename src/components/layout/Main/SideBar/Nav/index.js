import styles from './Nav.module.scss';
import CalendarDay from '@icons/calendar-day.svg';
import Store from '@icons/store.svg';
import CircleDollar from '@icons/circle-dollar.svg';
import Handshake from '@icons/handshake.svg';
import Landmark from '@icons/landmark.svg';
import BookUser from '@icons/book-user.svg';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Nav({ content }) {
  const links = [
    {
      name: 'Agenda',
      href: '/agenda/dashboard',
      Icon: CalendarDay,
    },
    {
      name: 'Comercial',
      href: '/comercial/dashboard',
      Icon: Store,
    },
    {
      name: 'Financeiro',
      href: '/financeiro/dashboard',
      Icon: CircleDollar,
    },
    {
      name: 'Parceiros',
      href: '/parceiros/dashboard',
      Icon: Handshake,
    },
    {
      name: 'Administrativo',
      href: '/administrativo/dashboard',
      Icon: Landmark,
    },
    {
      name: 'Diário',
      href: '/diario/dashboard',
      Icon: BookUser,
    },
  ]

  const router = useRouter();

  return (
    <div className="nav-application clearfix">
      {
        links.map(({ href, name, Icon }, index) => (
          <Link href={href} className={`btn btn-square text-sm ${router.route.includes(name.toLocaleLowerCase()) ? 'active' : ''}`} key={index}>
            <span className="btn-inner--icon d-block">
              <Icon className="fs-2x" />
            </span>
            <span className="d-block pt-2">{name}</span>
          </Link>
        ))
      }
    </div>
  )
}
