import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

function Users() {
  return (
    <Card>
      <Card.Header>Users</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>Cras justo odio</ListGroup.Item>
        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
      </ListGroup>
    </Card>
  );
}

export default Users;
