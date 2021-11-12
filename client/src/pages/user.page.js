import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Button,
  Drawer,
  Modal,
  Empty,
  Tag,
  Select,
  Form,
  notification
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { FormAddUser } from "../components/forms/add.user.form";
import { FormUpdateUser } from "../components/forms/update.user.form";
import { observer } from "mobx-react";
import { useStores } from "../stores";
import { checkRole } from "../conf";
import queryString from "query-string";
const { Option } = Select;
export const UserPage = observer(() => {
  const { listUsers, listTeams, userStore } = useStores();
  const [onEdit, setEdit] = useState(false);
  const [onDelete, setDelete] = useState(false);
  const [visibleFormAdd, setVisibleFormAdd] = useState(false);
  const [visibleFormUpdate, setVisibleFormUpdate] = useState(false);
  const [dataUser, setDataUser] = useState([]);
  const [visibleDeleteModel, setVisibleDeleteModel] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [filters, setFilters] = useState({
    team: userStore.role != 3 ? userStore.team : '',
  });
  const [form] = Form.useForm();
  const showFormAddDrawer = () => {
    setVisibleFormAdd(true);
  };
  const onFormAddClose = () => {
    const paramsString = queryString.stringify(filters);
    listUsers.getListUsers(paramsString);
    listUsers.getListUsers(paramsString);
    setVisibleFormAdd(false);
  };
  const showFormUpdateDrawer = () => {
    setVisibleFormUpdate(true);
  };
  const onFormUpdateClose = () => {
    const paramsString = queryString.stringify(filters);
    listUsers.getListUsers(paramsString);
    listUsers.getListUsers(paramsString);
    setVisibleFormUpdate(false);
  };
  const handleEditClick = () => {
    setEdit(!onEdit);
  };
  const handleDeleteClick = () => {
    setDelete(!onDelete);
  };

  const showModal = () => {
    setVisibleDeleteModel(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setVisibleDeleteModel(false);
      setConfirmLoading(false);
      try {
        listUsers.deleteUsers(dataUser._id);
      } catch (error) {
        console.log(error)
      }
      const paramsString = queryString.stringify(filters);
      listUsers.getListUsers(paramsString);
      listUsers.getListUsers(paramsString);
      notification.open({
        message: 'Notification',
        description: 'xóa user thành công',
        onClick: () => {
          console.log('Notification Clicked!');
        },
        duration: 1
      });
    }, 1000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisibleDeleteModel(false);
  };

  const onFinish = (values) => {
    setFilters({
      ...filters,
      team: values.team,
    });
  };

  useEffect(() => {
    if (userStore.role != 3) {
      form.setFieldsValue({
        team: userStore.team
      })
    }
  }, []);

  useEffect(() => {
    const paramsString = queryString.stringify(filters);
    listUsers.getListUsers(paramsString);
    listTeams.getTeams("");
  }, [listTeams, filters, listUsers]);

  return (
    <div className="Base-Page">
      <div className="toolbar">
        <Row justify="start" className="base-list-tool">
          <Button type="primary" onClick={showFormAddDrawer}>
            <PlusOutlined />
          </Button>
          <Button
            type="primary"
            onClick={handleEditClick}
            style={onEdit ? {} : { backgroundColor: "GrayText" }}
          >
            <EditOutlined />
          </Button>
          <Button
            type="primary"
            onClick={handleDeleteClick}
            style={onDelete ? {} : { backgroundColor: "GrayText" }}
          >
            <DeleteOutlined />
          </Button>
          {
            userStore.role == 3 ?
              <div className="search-bar">
                <Form form={form} layout="inline" onFinish={onFinish}>
                  <Form.Item name="team">
                    <Select placeholder="Select team" allowClear>
                      {listTeams.teams && listTeams.teams.length > 0
                        ? listTeams.teams.map((e, index) => (
                          <Option key={index} value={e._id}>
                            {e.name}
                          </Option>
                        ))
                        : null}
                    </Select>
                  </Form.Item>
                  <Form.Item style={{ marginRight: 0, paddingRight: 0 }}>
                    <Button type="primary" htmlType="submit">
                      Search
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              : null
          }
        </Row>
      </div>
      <Drawer
        title="Form Create"
        className="base-drawer-form"
        placement="right"
        closable={true}
        width={600}
        onClose={onFormAddClose}
        visible={visibleFormAdd}
      >
        <FormAddUser close={onFormAddClose} />
      </Drawer>
      <Drawer
        title="Form Update"
        className="base-drawer-form"
        placement="right"
        closable={true}
        width={600}
        onClose={onFormUpdateClose}
        visible={visibleFormUpdate}
      >
        <FormUpdateUser values={dataUser} close={onFormUpdateClose} />
      </Drawer>
      <Modal
        title="Warning"
        visible={visibleDeleteModel}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>you want to delete?</p>
      </Modal>
      {listUsers.users && listUsers.users.length > 0 ? (
        <div>
          <div className="base-list">
            {listUsers.users.map((item, index) => {
              return (
                <Card
                  key={index}
                  className="base-card"
                  hoverable={true}
                  size="small"
                  title={item.nameBuyer}
                  style={{ minWidth: 200 }}
                  extra={[
                    onEdit &&
                      userStore.id !== item._id &&
                      (userStore.role > item.role || item.role == 4) &&
                      (userStore.team === item.team || userStore.role == 3) ? (
                      <EditOutlined
                        key="1"
                        onClick={() => {
                          setDataUser(item);
                          showFormUpdateDrawer();
                        }}
                      />
                    ) : null,
                    onDelete &&
                      userStore.id !== item._id &&
                      (userStore.role > item.role || item.role == 4) &&
                      (userStore.team === item.team || userStore.role == 3) ? (
                      <DeleteOutlined
                        key="2"
                        onClick={() => {
                          setDataUser(item);
                          showModal();
                        }}
                      />
                    ) : null,
                  ]}
                >
                  <p>
                    <span className="title">user name:</span> {item.userName}
                  </p>
                  <p>
                    <span className="title">full name:</span> {item.fullName}
                  </p>
                  <p>
                    <span className="title">rate:</span> {item.rate}
                  </p>
                  <p>
                    <span className="title">role:</span>
                    <Tag color="success">{checkRole(item.role)}</Tag>
                  </p>
                  {listTeams.teams.map((e, index) =>
                    e._id === item.team ? (
                      <p key={index}>
                        <span className="title">team:</span>{" "}
                        <Tag color="processing">{e.name}</Tag>
                      </p>
                    ) : null
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
});
