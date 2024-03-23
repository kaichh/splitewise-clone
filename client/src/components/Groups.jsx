// import { useState } from "react";
import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

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
    <Card>
      <Card.Header>Groups</Card.Header>
      <ListGroup variant="flush">{groupNames}</ListGroup>
    </Card>
  );
}

export default Groups;
