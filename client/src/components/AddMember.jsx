import { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { addMemberToGroup } from "../api";

const AddMember = (props) => {
  const [users, setUsers] = useState(props.users);
  const [showModal, setShowModal] = useState(false);
  const [newMemberId, setNewMemberId] = useState(-1);
  const [members, setMembers] = useState(props.members);
  const [groupId, setGroupId] = useState(props.groupId);

  useEffect(() => {
    setUsers(props.users);
  }, [props.users]);

  useEffect(() => {
    setMembers(props.members);
  }, [props.members]);

  useEffect(() => {
    setGroupId(props.groupId);
  }, [props.groupId]);

  const handleClose = () => setShowModal(false);

  const handleSubmit = async () => {
    if (newMemberId === -1) {
      alert("Please select a user");
      return;
    }
    const response = await addMemberToGroup(groupId, {
      userId: newMemberId,
    });
    console.log(response);

    setNewMemberId(-1);
    setShowModal(false);
  };
  const userOptions = [];
  for (let i = 0; i < users.length; i++) {
    if (members.find((member) => member.userId === users[i].id)) {
      continue;
    }
    userOptions.push(
      <option key={users[i].id} value={users[i].id}>
        {users[i].name} ({users[i].email})
      </option>
    );
  }

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
          <Modal.Title>Add Member to Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="newMember">
              <Form.Control
                as="select"
                value={newMemberId}
                onChange={(e) => setNewMemberId(e.target.value)}
              >
                <option value={-1}>Select User</option>
                {userOptions}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddMember;
