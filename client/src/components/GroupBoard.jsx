import { useEffect, useState } from "react";
import moment from "moment";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import {
  getGroupById,
  getTransactionsByGroupId,
  getGroupBalanceByMember,
  deleteTransaction,
} from "../api";
import {
  Accordion,
  CloseButton,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import AddMember from "./AddMember";
import AddUpdateTransaction from "./AddUpdateTransaction";

function GroupBoard(data) {
  const [groupId, setGroupId] = useState(data.groupId);
  const [group, setGroup] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [groupBalance, setGroupBalance] = useState([]);
  const [users, setUsers] = useState(data.users);

  useEffect(() => {
    setGroupId(data.groupId);
  }, [data.groupId]);

  useEffect(() => {
    setUsers(data.users);
  }, [data.users]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch group data
      const groupRes = await getGroupById(groupId);
      setGroup(groupRes.data.data);

      // Fetch transaction data
      const trxRes = await getTransactionsByGroupId(groupId);
      setTransactions(trxRes.data.data);
    };
    fetchData();
  }, [groupId]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch balance data by member
      const userBalances = [];
      for (let i = 0; i < group.members.length; i++) {
        const userBalanceRes = await getGroupBalanceByMember(
          groupId,
          group.members[i].userId
        );

        userBalances.push({
          userId: group.members[i].userId,
          userName: group.members[i].userName,
          balance: userBalanceRes.data.data,
        });
      }
      setGroupBalance(userBalances);
    };
    fetchData();
  }, [group]);

  const handleDeleteTrx = async (event) => {
    const trxId = event.target.value;
    const response = await deleteTransaction(trxId);
    // console.log(response);
    const trxRes = await getTransactionsByGroupId(groupId);
    setTransactions(trxRes.data.data);
  };

  // Manage Transaction data
  const trxListItem = transactions.map((transaction) => {
    const date = moment(transaction.createTime).format("MM/DD");
    const payer = transaction.payer;
    const trxId = transaction.transactionId;

    const debtInfo = transaction.debts.map((debt) => (
      <ListGroup.Item key={debt.debtor}>
        {debt.debtor} owes ${debt.amount}
      </ListGroup.Item>
    ));

    return (
      <Accordion.Item key={trxId} eventKey={trxId}>
        <Accordion.Header>
          <Container>
            <Row>
              <Col>{date}</Col>
              <Col> {transaction.description}</Col>
              <Col>
                {payer} paid ${transaction.totalAmount}
              </Col>
            </Row>
          </Container>
        </Accordion.Header>
        <Accordion.Body>
          <Container>
            <Row>
              <Col xs={8}>
                <h5>
                  {payer} paid ${transaction.totalAmount}
                </h5>
              </Col>
              <Col>
                <AddUpdateTransaction
                  members={group.members}
                  groupId={groupId}
                  addMode={false}
                  trxId={trxId}
                />
                <CloseButton
                  variant={"red"}
                  value={trxId}
                  onClick={handleDeleteTrx}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                {transaction.notes.map((note) => (
                  <>
                    <>{note}</>
                    <br />
                  </>
                ))}
              </Col>
            </Row>
          </Container>
          <br /> <br />
          <ListGroup variant="flush">{debtInfo}</ListGroup>
        </Accordion.Body>
      </Accordion.Item>
    );
  });

  // Manage Member data
  const memberListItem = group.members?.map((member) => (
    <ListGroup.Item key={member.userId}>{member.userName}</ListGroup.Item>
  ));

  // Manage Balance data
  const balanceListItem = groupBalance.map((userBalance) => {
    let balanceSum = 0;
    const tooltipLists = [];
    userBalance.balance.forEach((balance) => {
      balanceSum =
        balance.role === "debtor"
          ? balanceSum + balance.balance
          : balanceSum - balance.balance;
      if (balance.balance !== 0) {
        tooltipLists.push(
          balance.role === "debtor" ? (
            <div>
              gets back ${balance.balance} from {balance.userName}
            </div>
          ) : (
            <div>
              owes ${balance.balance} to {balance.userName}
            </div>
          )
        );
      }
    });
    if (balanceSum > 0) {
      return (
        <OverlayTrigger
          key={"overlay-trigger-" + userBalance.userId}
          placement="left"
          overlay={
            <Popover id={`popover-positioned-${userBalance.userId}`}>
              <Popover.Header as="h3">{userBalance.userName}</Popover.Header>
              <Popover.Body>{tooltipLists}</Popover.Body>
            </Popover>
          }
        >
          <ListGroup.Item key={`balance-list-${userBalance.userId}`} action>
            {userBalance.userName} gets back ${balanceSum}
          </ListGroup.Item>
        </OverlayTrigger>
      );
    } else if (balanceSum < 0) {
      return (
        <OverlayTrigger
          key={"overlay-trigger-" + userBalance.userId}
          placement="left"
          overlay={
            <Popover id={`popover-positioned-${userBalance.userId}`}>
              <Popover.Header as="h3">{userBalance.userName}</Popover.Header>
              <Popover.Body>{tooltipLists}</Popover.Body>
            </Popover>
          }
        >
          <ListGroup.Item key={`balance-list-${userBalance.userId}`} action>
            {userBalance.userName} owes ${balanceSum * -1}
          </ListGroup.Item>
        </OverlayTrigger>
      );
    } else {
      return (
        <OverlayTrigger
          key={"overlay-trigger-" + userBalance.userId}
          placement="left"
          overlay={
            <Popover id={`popover-positioned-${userBalance.userId}`}>
              <Popover.Header as="h3">{userBalance.userName}</Popover.Header>
              <Popover.Body>You are all set!</Popover.Body>
            </Popover>
          }
        >
          <ListGroup.Item key={`balance-list-${userBalance.userId}`} action>
            You owe {userBalance.userName} ${balanceSum * -1}
          </ListGroup.Item>
        </OverlayTrigger>
      );
    }
  });

  return (
    <Container>
      <Row>
        <Col xs={8}>
          <Card>
            <Card.Header>
              <h2>{group.name}</h2>
              {group.members && (
                <AddUpdateTransaction
                  members={group.members}
                  groupId={groupId}
                  addMode={true}
                />
              )}
            </Card.Header>
            <Accordion flush>{trxListItem}</Accordion>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header>
              <h5>Balance</h5>
            </Card.Header>
            <ListGroup variant="flush">{balanceListItem}</ListGroup>
          </Card>
          <br />
          <Card>
            <Card.Header>
              <div style={{ display: "flex" }}>
                <div>
                  <h5>Members in {group.name}</h5>
                </div>
                <div>
                  <AddMember
                    users={users}
                    members={group.members}
                    groupId={groupId}
                  />
                </div>
              </div>
            </Card.Header>
            <ListGroup variant="flush">{memberListItem}</ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default GroupBoard;
