import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { createUser } from "../api";

const AddUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const handleClose = () => setShowModal(false);

  const handleSubmit = async () => {
    if (!userName || !userEmail) {
      alert("Name and email are required");
      return;
    }
    const response = await createUser({ name: userName, email: userEmail });
    // console.log(response);

    setUserName("");
    setUserEmail("");
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
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="groupName">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="groupDescription">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="text"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
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

export default AddUser;
