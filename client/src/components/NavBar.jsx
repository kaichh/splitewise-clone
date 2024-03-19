import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import splitwiseLogo from "../images/splitwise.svg";

function NavBar() {
  return (
    <Navbar className="bg-body-tertiary" sticky="top">
      <Container>
        <Navbar.Brand href="#home">
          <a href="#">
            <img src={splitwiseLogo} />
          </a>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">KC</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
