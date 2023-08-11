import { Container, Navbar } from "react-bootstrap";
import Navigation from "./Navigation";
import UserMenu from "./UserMenu";

export function NavBar({ children }) {
  return (
    <>
      <Navbar expand="lg" variant="dark" bg="dark" className="navbar-border">
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="navbar-collapse-fade">{children}</Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

NavBar.Navigation = Navigation;
NavBar.UserMenu = UserMenu;