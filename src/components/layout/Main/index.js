import { SideBar } from "./SideBar";
import { NavBar } from "./NavBar";

export default function MainLayout({ children }) {
  return (
    <div className="container-fluid container-application">
      <SideBar>
        <SideBar.Header />
        <SideBar.Profile />
        <SideBar.Nav />
      </SideBar>
      <div className="main-content position-relative">
        <NavBar />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  )
}
