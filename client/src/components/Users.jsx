import ListGroup from "react-bootstrap/ListGroup";
import Accordion from "react-bootstrap/Accordion";

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
    <Accordion>
      <Accordion.Item>
        <Accordion.Header>Users</Accordion.Header>
        <Accordion.Body>
          <ListGroup variant="flush">{userNames}</ListGroup>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default Users;
