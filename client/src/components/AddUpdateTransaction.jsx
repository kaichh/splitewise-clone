import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { createTransaction, updateTransaction } from "../api";
import styled from "styled-components";

const AddUpdateTransaction = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [addMode, setAddMode] = useState(true); // true: add, false: update
  const [description, setDescription] = useState();
  const [payer, setPayer] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [debtors, setDebtors] = useState([]);
  const [note, setNote] = useState("");
  const [members, setMembers] = useState([]);
  const [groupId, setGroupId] = useState(props.groupId);
  const [trxId, setTrxId] = useState();

  useEffect(() => {
    setAddMode(props.addMode);
  }, [props.addMode]);

  useEffect(() => {
    if (!addMode) {
      setTrxId(props.trxId);
    }
  }, [addMode, props.trxId]);

  useEffect(() => {
    setMembers(props.members);
  }, [props.members]);

  useEffect(() => {
    setGroupId(props.groupId);
  }, [props.groupId]);

  const handleClose = () => setShowModal(false);

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // Validate sum of debtors shares equals total amount
    const debtorsShares = debtors.reduce(
      (acc, debtor) => acc + parseFloat(debtor.amount),
      0
    );
    if (debtorsShares !== parseFloat(totalAmount)) {
      alert("Sum of debtor's shares must be equal to total amount!");
      return;
    }

    const requestBody = {
      groupId: groupId,
      payerId: payer,
      amount: totalAmount,
      description: description,
      debts: debtors,
      note: note,
    };
    console.log(requestBody);

    if (addMode) {
      const response = await createTransaction(requestBody);
      console.log(response);
    } else {
      // Update transaction
      const response = await updateTransaction(trxId, requestBody);
      console.log(response);
    }

    // Reset the form
    setDescription("");
    setPayer(-1);
    setTotalAmount();
    setDebtors([]);
    setNote("");

    // Close the modal
    setShowModal(false);
  };

  const payerOptions = [];
  for (let i = 0; i < members.length; i++) {
    payerOptions.push(
      <option key={members[i].userId} value={members[i].userId}>
        {members[i].userName}
      </option>
    );
  }

  const debtorsOptions = [];
  for (let i = 0; i < members.length; i++) {
    debtorsOptions.push(
      <Form.Group
        key={`debtor-${members[i].userId}`}
        controlId={`debtor-${members[i].userId}`}
      >
        <Form.Label>{members[i].userName}</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter share"
          onChange={(e) => {
            const newShare = Number(e.target.value);
            const existingDebtor = debtors.find(
              (debtor) => debtor.debtorId === members[i].userId
            );
            if (existingDebtor) {
              existingDebtor.amount = newShare;
            } else {
              setDebtors([
                ...debtors,
                { debtorId: members[i].userId, amount: newShare },
              ]);
            }
          }}
        />
      </Form.Group>
    );
  }

  return (
    <>
      {addMode ? (
        <CustomButton
          size="sm"
          variant="primary"
          onClick={() => setShowModal(true)}
        >
          Add an Expense
        </CustomButton>
      ) : (
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => setShowModal(true)}
        >
          update
        </Button>
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          {addMode ? (
            <Modal.Title>Add Expense</Modal.Title>
          ) : (
            <Modal.Title>Update Expense</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="totalAmount">
              <Form.Label>Total Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter total amount"
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
              />
            </Form.Group>
            <Form.Group controlId="payer">
              <Form.Label>Paid by</Form.Label>
              <Form.Control
                as="select"
                value={payer}
                onChange={(e) => setPayer(Number(e.target.value))}
              >
                <option value="">Select payer</option>
                {payerOptions}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="note">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter notes"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Form.Group>
            <br />
            <br />
            <>Split Options</>
            <br />
            {debtorsOptions}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const CustomButton = styled(Button)`
  font-weight: bold;
  color: white;
  border-color: #e86437;
  background-color: #e86437;

  &:hover {
    color: white;
    border-color: #e24b18;
    background-color: #e24b18;
  }
`;

export default AddUpdateTransaction;
