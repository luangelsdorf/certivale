import styles from './SideBar.module.scss';
import Header from './Header';
import Profile from './Profile';
import Nav from './Nav';
import { useEffect } from 'react';

export function SideBar({ children }) {

  useEffect(() => {
    let showSideBar = localStorage.getItem('cvSidenavShow');
    if (showSideBar === null || showSideBar === 'true') {
      document.querySelector('#sidenav-main').classList.add('show');
    }
  }, []);

  return (
    <div className="sidenav" id="sidenav-main">
      {children}
    </div>
  )
}

SideBar.Header = Header;
SideBar.Profile = Profile;
SideBar.Nav = Nav;