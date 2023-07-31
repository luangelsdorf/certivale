import styles from './SideBar.module.scss';
import Header from './Header';
import Profile from './Profile';
import Nav from './Nav';

export function SideBar({ children }) {
  return (
    <div className="sidenav show" id="sidenav-main">
      {children}
    </div>
  )
}

SideBar.Header = Header;
SideBar.Profile = Profile;
SideBar.Nav = Nav;