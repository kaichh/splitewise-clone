import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Groups from "./Groups";
import Users from "./Users";
import Balance from "./Balance";
import MainBoard from "./MainBoard";

function DashBoard() {
  return (
    <Container>
      <Row>
        <Col>
          <Groups />
          <br />
          <Users />
        </Col>
        <Col xs={7}>
          <MainBoard />
        </Col>
        <Col>
          <Balance />
        </Col>
      </Row>
    </Container>
  );
}

export default DashBoard;
