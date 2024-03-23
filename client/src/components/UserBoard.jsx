import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { getUserBalance, getUserById } from "../api";

function UserBoard(data) {
  const [userId, setUserId] = useState(data.userId);
  const [user, setUser] = useState({});
  const [userBalance, setUserBalance] = useState([]);
  useEffect(() => {
    setUserId(data.userId);
  }, [data.userId]);

  useEffect(() => {
    const fetchData = async () => {
      const userBalanceRes = await getUserBalance(userId);
      const userRes = await getUserById(userId);
      setUserBalance(userBalanceRes.data.data);
      setUser(userRes.data.data);
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    console.log(userBalance);
  }, [userBalance]);

  const balanceListItem = userBalance.map((balance) =>
    balance.role === "creditor" ? (
      <ListGroup.Item key={balance.userId}>
        You owe {balance.userName} ${balance.balance}
      </ListGroup.Item>
    ) : (
      <ListGroup.Item key={balance.userId}>
        {balance.userName} owes you ${balance.balance}
      </ListGroup.Item>
    )
  );

  return (
    <Card>
      <Card.Header>{user.name}</Card.Header>
      <ListGroup variant="flush">{balanceListItem}</ListGroup>
    </Card>
  );
}

export default UserBoard;
