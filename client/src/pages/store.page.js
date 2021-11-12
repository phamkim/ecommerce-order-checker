import React, { useState, useEffect } from "react";
import { Card, Row, Button, Drawer, Modal, Empty, Divider, notification, Form, Select, Badge } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { FormAddStore } from "../components/forms/add.store.form";
import { FormUpdateStore } from "../components/forms/update.store.form";
import { useStores } from "../stores/index";
import { observer } from "mobx-react";
import queryString from "query-string";
import ListOrders from "../stores/listOrders.store";
const { Option } = Select;
export const StorePage = observer(() => {
  const { listStores, userStore, listTeams} = useStores();
  const [onEdit, setEdit] = useState(false);
  const [onDelete, setDelete] = useState(false);
  const [visibleFormAdd, setVisibleFormAdd] = useState(false);
  const [visibleFormUpdate, setVisibleFormUpdate] = useState(false);
  const [dataStore, setDataStore] = useState([]);
  const [visibleDeleteModel, setVisibleDeleteModel] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'active'
  });
  const [form] = Form.useForm();

  const onFinish = (values) => {
    setFilters({
      status: values.status
    })
  }

  const showFormAddDrawer = () => {
    setVisibleFormAdd(true);
  };
  const onFormAddClose = () => {
    const paramsString = queryString.stringify({
      ...filters
    });
    listStores.getStores(paramsString);
    listStores.getStores(paramsString);
    setVisibleFormAdd(false);
  };
  const showFormUpdateDrawer = () => {
    setVisibleFormUpdate(true);
  };
  const onFormUpdateClose = () => {
    const paramsString = queryString.stringify({
      ...filters
    });
    listStores.getStores(paramsString);
    listStores.getStores(paramsString);
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
      listStores.deleteStores(dataStore._id);
      const paramsString = queryString.stringify({
        ...filters
      });
      listStores.getStores(paramsString);
      listStores.getStores(paramsString);
      notification.open({
        message: 'Notification',
        description: 'xóa store thành công',
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

  const checkStore = (listTeams) => {
    var result = false;
    listTeams.forEach(element => {
      if (element.team === userStore.team) {
        result = true
      }
    });
    if (userStore.role == 3) {
      result = true
    }
    return result
  }

  const updateClick = (store) => {
    const newStore = {
      id: store._id,
      name: store.name,
      link: store.link,
      limitDay: store.limitDay,
      status: store.status,
      listTeams: store.listTeams,
      click: store.click ? store.click + 1 : 1
    };
    console.log(newStore);
    listStores.updateStores(newStore);
    const paramsString = queryString.stringify({
      ...filters
    });
    listStores.getStores(paramsString);
    listStores.getStores(paramsString);
  }


  useEffect(() => {
    const paramsString = queryString.stringify({
      ...filters
    });
    listStores.getStores(paramsString);

  }, [listStores, filters]);

  return (
    <div className="Base-Page">
      <div className="toolbar">
        {userStore.role != 1 ? (
          <Row justify="start" className="base-list-tool">
            <Button type="primary" hidden={(userStore.role == 3 || userStore.role == 4) ? false : true} onClick={showFormAddDrawer}>
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
              hidden={filters.status == 'deactive' ? false : true}
              type="primary"
              onClick={handleDeleteClick}
              style={onDelete ? {} : { backgroundColor: "GrayText" }}
            >
              <DeleteOutlined />
            </Button>

            <div className="search-bar">
              <Form form={form} layout="inline" onFinish={onFinish} hidden={userStore.role == 2 ? true : false}>
                <Form.Item
                  name="status"
                  initialValue='active'
                >
                  <Select placeholder="Select state" allowClear>
                    <Option value='active'>active</Option>
                    <Option value='deactive'>deactive</Option>
                  </Select>
                </Form.Item>
                <Form.Item style={{ marginRight: 0, paddingRight: 0 }}>
                  <Button type="primary" htmlType="submit">
                    Search
                  </Button>
                </Form.Item>
              </Form>
            </div>


          </Row>
        ) : null}

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
        <FormAddStore close={onFormAddClose} />
      </Drawer>

      <Drawer
        title="Form Update"
        className="base-drawer-form"
        placement="right"
        closable={true}
        width={800}
        onClose={onFormUpdateClose}
        visible={visibleFormUpdate}
      >
        <FormUpdateStore values={dataStore} close={onFormUpdateClose} />
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
      {listStores.stores && listStores.stores.length > 0 ? (
        <div className="base-list">
          {listStores.stores.map((item, index) => {
            return (
              <Card
                hidden={userStore.role == 4 ? userStore.id != item.userId : !checkStore(item.listTeams)}
                key={index}
                className="base-card"
                hoverable={true}
                size="small"
                title={
                  < a href={item.link} target="_blank" rel="noopener noreferrer" onClick={() => {
                    updateClick(item)
                    console.log('text', item.link)
                    var textField = document.createElement('textarea')
                    textField.innerText = item.link
                    document.body.appendChild(textField)
                    textField.select()
                    document.execCommand('copy')
                    textField.remove()
                  }}>
                    {item.name}
                  </a>
                }
                style={{ minWidth: 200 }}
                extra={[
                  <Badge
                    key='3'
                    className="site-badge-count-109"
                    count={item.click || 0}
                    style={{ backgroundColor: '#52c41a' }}
                  />,
                  onEdit && (checkStore(item.listTeams) || userStore.role == 3 || userStore.role == 4) ? (
                    <EditOutlined
                      key="1"
                      onClick={() => {
                        setDataStore(item);
                        showFormUpdateDrawer();
                      }}
                    />
                  ) : null,
                  onDelete && (checkStore(item.listTeams) || userStore.role == 3) ? (
                    <DeleteOutlined
                      key="2"
                      hidden={filters.status == 'active' ? true : false}
                      onClick={() => {
                        setDataStore(item);
                        showModal();
                      }}
                    />
                  ) : null,
                ]}
              >
                <div className='row'>
                  <div className="col text-right">
                    <span className="title">limit day:</span>
                  </div>
                  <div className='col text-left'><CheckLimit1 className="value" listTeams={item.listTeams} limit={item.limitDay} /></div>
                </div>
                <Divider />
                {item.listTeams && item.listTeams.length > 0
                  ? item.listTeams.map((e, index) => (
                    <div className='row' key={index} >
                      <div className="col text-right"> <span className="title">{listTeams.teams.map((i) =>
                        i._id === e.team ? i.name : ""
                      )}:</span></div>
                      <div className='col text-left'> <CheckLimit className="value" done={e.done} teamLimit={e.teamLimit} limit={item.limitDay} /></div>
                    </div>
                  ))
                  : null}
              </Card>
            );
          })}
        </div >
      ) : <Empty />
      }
    </div >
  );
});


const CheckLimit = ({ done, teamLimit, limit }) => {
  return <span style={{ color: done > teamLimit ? "red" : 'black' }}>
    {parseInt(done || 0) + "/" + limit}
  </span>
}

const CheckLimit1 = ({ listTeams, limit }) => {
  var done = 0;
  listTeams.forEach(element => {
    done += parseInt(element.done || 0)
  });

  return <span style={{ color: done > limit ? "red" : 'black' }}>
    {done + "/" + limit}
  </span>
}
