import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

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
    <Card>
      <Card.Header>Users</Card.Header>
      <ListGroup variant="flush">{userNames}</ListGroup>
    </Card>
  );
}

export default Users;
