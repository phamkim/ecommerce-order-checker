import React, { useState, useEffect } from "react";
import { Card, Row, Button, Drawer, Modal, Empty, Tag ,notification} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { FormAddTeam } from "../components/forms/add.team.form";
import { FormUpdateTeam } from "../components/forms/update.team.form";
import { useStores } from "../stores/index";
import { observer } from "mobx-react";

export const TeamPage = observer(() => {
  const { listTeams, userStore, listUsers } = useStores();
  const [onEdit, setEdit] = useState(false);
  const [onDelete, setDelete] = useState(false);
  const [visibleFormAdd, setVisibleFormAdd] = useState(false);
  const [visibleFormUpdate, setVisibleFormUpdate] = useState(false);
  const [dataTeam, setDataTeam] = useState([]);
  const [visibleDeleteModel, setVisibleDeleteModel] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showFormAddDrawer = () => {
    setVisibleFormAdd(true);
  };
  const onFormAddClose = () => {
    listTeams.getTeams("");
    setVisibleFormAdd(false);
  };
  const showFormUpdateDrawer = () => {
    setVisibleFormUpdate(true);
  };
  const onFormUpdateClose = () => {
    listTeams.getTeams("");
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
      listTeams.deleteTeams(dataTeam._id);
      listTeams.getTeams("");
      notification.open({
        message: 'Notification',
        description: 'xóa team thành công',
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

  useEffect(() => {
    listTeams.getTeams("");
    listUsers.getListUsers("");
  }, [listTeams, listUsers]);

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
        </Row>
      </div>

      {listTeams.teams && listTeams.teams.length > 0 ? (
        <div>
          <div className="base-list">
            {listTeams.teams.map((item, index) => {
              return (
                <Card
                  key={index}
                  className="base-card"
                  hoverable={true}
                  size="small"
                  title={"team: " + item.name}
                  style={{ minWidth: 200 }}
                  extra={[
                    onEdit && (userStore.team === item._id || userStore.role == 3) ? (
                      <EditOutlined
                        key="1"
                        onClick={() => {
                          setDataTeam(item);
                          showFormUpdateDrawer();
                        }}
                      />
                    ) : null,
                    onDelete && (userStore.team === item._id || userStore.role == 3) ? (
                      <DeleteOutlined
                        key="2"
                        onClick={() => {
                          setDataTeam(item);
                          showModal();
                        }}
                      />
                    ) : null,
                  ]}
                >
                  <div className="tag-box">
                    {listUsers.users && listUsers.users.length > 0
                      ? listUsers.users.map((e, index) =>
                        e.team === item._id ? <Tag key={index} color="processing"> {e.nameBuyer}  </Tag> : null
                      )
                      : null}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : <Empty />}

      <Drawer
        title="Form Create"
        className="base-drawer-form"
        placement="right"
        closable={true}
        width={600}
        onClose={onFormAddClose}
        visible={visibleFormAdd}
      >
        <FormAddTeam close={onFormAddClose} />
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
        <FormUpdateTeam values={dataTeam} close={onFormUpdateClose} />
      </Drawer>

      <Modal
        title="Warning"
        visible={visibleDeleteModel}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>you  want to delete?</p>
      </Modal>
    </div>
  );
});
