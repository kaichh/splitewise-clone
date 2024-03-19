import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

function MainBoard() {
  return (
    <Card>
      <Card.Header>MainBoard</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>Costco</ListGroup.Item>
        <ListGroup.Item>Mcdoanalds</ListGroup.Item>
        <ListGroup.Item>Gas</ListGroup.Item>
      </ListGroup>
    </Card>
  );
}

export default MainBoard;
