import { useEffect, useState } from "react";
import moment from "moment";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import {
  getGroupById,
  getTransactionsByGroupId,
  getGroupBalanceByMember,
} from "../api";
import {
  Accordion,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";

function GroupBoard(data) {
  const [groupId, setGroupId] = useState(data.groupId);
  const [group, setGroup] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [groupBalance, setGroupBalance] = useState([]);

  useEffect(() => {
    setGroupId(data.groupId);
  }, [data.groupId]);

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

  useEffect(() => {
    console.log(groupBalance);
  }, [groupBalance]);

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
          {payer} paid ${transaction.totalAmount} <br /> <br />
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
            <Card.Header>{group.name}</Card.Header>
            <Accordion flush>{trxListItem}</Accordion>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header>Balance</Card.Header>
            <ListGroup variant="flush">
              {balanceListItem}
              {/* <ListGroup.Item>John gets back $100</ListGroup.Item>
              <ListGroup.Item>Tom owes $50</ListGroup.Item> */}
            </ListGroup>
          </Card>
          <br />
          <Card>
            <Card.Header>Members in {group.name}</Card.Header>
            <ListGroup variant="flush">{memberListItem}</ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default GroupBoard;