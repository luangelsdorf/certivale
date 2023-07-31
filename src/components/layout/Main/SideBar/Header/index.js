import styles from './Header.module.scss';
import Link from 'next/link';
import Logo from 'public/images/logo-primary.svg';

export default function Header({ content }) {
  return (
    <div className="sidenav-header d-flex align-items-center">
      <Link href="/">
        <Logo width="130" height="auto" className="navbar-brand-img" />
      </Link>
      <div className="ml-auto">
        <div className="sidenav-toggler sidenav-toggler-dark d-md-none" data-action="sidenav-unpin" data-target="#sidenav-main">
          <div className="sidenav-toggler-inner">
            <i className="sidenav-toggler-line bg-white"></i>
            <i className="sidenav-toggler-line bg-white"></i>
            <i className="sidenav-toggler-line bg-white"></i>
          </div>
        </div>
      </div>
    </div>
  )
}
