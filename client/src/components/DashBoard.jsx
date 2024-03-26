import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getAllGroups, getAllUsers } from "../api";
import Groups from "./Groups";
import Users from "./Users";
import GroupBoard from "./GroupBoard";
import UserBoard from "./UserBoard";

function DashBoard() {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [id, setId] = useState(1);
  const [isViewingGroup, setIsViewingGroup] = useState(true);

  // Fetch all groups and users
  useEffect(() => {
    const fetchData = async () => {
      const groupsRes = await getAllGroups();
      const usersRes = await getAllUsers();
      setGroups(groupsRes.data.data);
      setUsers(usersRes.data.data);
    };
    fetchData();
  }, []);

  const handleGroupClicked = (event) => {
    const groupId = Number(event.target.id);
    setId(groupId);
    setIsViewingGroup(true);
  };

  const handleUserClicked = (event) => {
    const userId = Number(event.target.id);
    setId(userId);
    setIsViewingGroup(false);
  };

  return (
    <Container>
      <Row>
        <Col xs={3}>
          <Groups groups={groups} handleGroupClicked={handleGroupClicked} />
          <br />
          <Users users={users} handleUserClicked={handleUserClicked} />
        </Col>
        <Col>
          {isViewingGroup ? (
            <GroupBoard groupId={id} users={users} />
          ) : (
            <UserBoard userId={id} />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default DashBoard;
