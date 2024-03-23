// import { useState } from "react";
import { Accordion, Card, ListGroup } from "react-bootstrap";

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
        <Accordion.Header>Groups</Accordion.Header>
        <Accordion.Body>
          <ListGroup variant="flush">{groupNames}</ListGroup>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default Groups;
