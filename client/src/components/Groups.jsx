import { Accordion, Container, Row, Col, ListGroup } from "react-bootstrap";
import AddGroup from "./AddGroup";

function Groups({ groups, handleGroupClicked }) {
  const groupNames = groups.map((group) => (
    <ListGroup.Item
      key={group.id}
      id={group.id}
      action
      onClick={handleGroupClicked}
    >
      {group.name}
    </ListGroup.Item>
  ));

  return (
    <Accordion>
      <Accordion.Item>
        <Accordion.Header>
          <Container fluid>
            <Row>
              <Col>
                <h5>Groups</h5>
              </Col>
              <Col size="sm" style={{ textAlign: "right" }}>
                <AddGroup />
              </Col>
            </Row>
          </Container>
        </Accordion.Header>

        <Accordion.Body>
          <ListGroup variant="flush">{groupNames}</ListGroup>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default Groups;
