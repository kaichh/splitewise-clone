import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { createGroup } from "../api";

const AddGroup = () => {
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");

  const handleClose = () => setShowModal(false);

  const handleSubmit = async () => {
    if (!groupName) {
      alert("Group name is required");
      return;
    }

    const response = await createGroup({ name: groupName });
    // console.log(response);

    setGroupName("");
    setShowModal(false);
  };

  return (
    <>
      <Button
        variant="outline-secondary"
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        +add
      </Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="groupName">
              <Form.Label>My group shall be called...</Form.Label>
              <Form.Control
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddGroup;
