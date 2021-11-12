import React, { useState, useEffect } from "react";
import {
  Drawer,
  Row,
  Col,
  Avatar,
  Badge,
  Button,
  Descriptions,
  Divider,
} from "antd";
import {
  Link,
} from "react-router-dom";
import { observer } from "mobx-react";
import { useStores } from "../../stores";
import "./style.css";
import { checkRole } from '../../conf';
export const MyHeader = observer(() => {
  const { userStore, listTeams } = useStores();
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  const handleLogout = () => {
    userStore.logout();
  };
  useEffect(() => {
    listTeams.getTeams("");
  }, [listTeams]);
  useEffect(() => {
    userStore.getMyProfile();
  }, [userStore]);
  return (
    <Row justify="end" align="middle">
      <Col>
        <div className="profile">
          <Badge>
            <Avatar size={40} className="avt" onClick={showDrawer}>
              {userStore.nameBuyer}
            </Avatar>
          </Badge>
          <Drawer
            key="profile"
            placement="right"
            closable={true}
            onClose={onClose}
            visible={visible}
            width={700}
          >
            <div className="profile-card">
              <Avatar size={80} className="profile-card-avt avt">
                {userStore.userName}
              </Avatar>
              <Divider />
              <Descriptions title="User Info" bordered layout="vertical">
                <Descriptions.Item label="user name" key="1">
                  {userStore.userName}
                </Descriptions.Item>
                <Descriptions.Item label="full name" key="2">
                  {userStore.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="name buyer" key="3">
                  {userStore.nameBuyer}
                </Descriptions.Item>
                <Descriptions.Item label="role" key="4">
                  {checkRole(userStore.role)}
                </Descriptions.Item>
                {listTeams.teams && listTeams.teams.length > 0
                  ? listTeams.teams.map((e, index) =>
                    e._id === userStore.team ? (
                      <Descriptions.Item label="team" key={index}>
                        {e.name}
                      </Descriptions.Item>
                    ) : null
                  )
                  : null}
              </Descriptions>
              <Divider />
              <Button
                className="profile-card-btn"
                type="primary"
                ghost
                onClick={handleLogout}
              >
                <Link to="/">Log out</Link>
              </Button>
            </div>
          </Drawer>
        </div>
      </Col>
    </Row>
  );
});
