import { Container, Row, Col, ListGroup, Accordion } from "react-bootstrap";
import AddUser from "./AddUser";
import styled from "styled-components";

function Users({ users, handleUserClicked }) {
  const userNames = users.map((user) => (
    <ListGroup.Item
      key={user.id}
      id={user.id}
      action
      onClick={handleUserClicked}
    >
      {user.name}
    </ListGroup.Item>
  ));
  return (
    <StyledAccordion>
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>
            <Container fluid>
              <Row>
                <Col>
                  <h5>Users</h5>
                </Col>
                <Col size="sm" style={{ textAlign: "right" }}>
                  <AddUser />
                </Col>
              </Row>
            </Container>
          </Accordion.Header>
          <Accordion.Body>
            <ListGroup variant="flush">{userNames}</ListGroup>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </StyledAccordion>
  );
}
const StyledAccordion = styled(Accordion)`
  .accordion-button {
    background-color: #f8f8f8;
  }
`;

export default Users;
