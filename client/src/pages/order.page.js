
import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Button,
  Drawer,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Card,
  Statistic,
  Table,
  Tooltip,
  notification
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FormAddOrder } from "../components/forms/add.order.form";
import { FormUpdateOrder } from "../components/forms/update.order.form";
import { useStores } from "../stores/index";
import { observer } from "mobx-react";
import queryString from "query-string";
import moment from "moment";
import { convertUTCDateToLocalDate1, convertUTCDateToLocalDate } from "../conf";
const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";
const { Option } = Select;
const today = new Date();
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)
export const OrderPage = observer(() => {
  const { listOrders, userStore, listUsers, listStores } = useStores();
  const [filters, setFilters] = useState({
    buyer: (userStore.role != 3 && userStore.role != 4) ? userStore.id : '',
    dateFrom: moment(yesterday).format("YYYY-MM-DD"),
    dateTo: moment(today).format("YYYY-MM-DD"),
    state: 0
  });
  const [form] = Form.useForm();
  const [visibleFormAdd, setVisibleFormAdd] = useState(false);
  const [visibleFormUpdate, setVisibleFormUpdate] = useState(false);
  const [dataOrder, setDataOrder] = useState([]);
  const [visibleDeleteModel, setVisibleDeleteModel] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showFormAddDrawer = () => {
    setVisibleFormAdd(true);
  };
  const onFormAddClose = () => {
    const paramsString = queryString.stringify({
      ...filters
    });
    listOrders.getOrders(paramsString);
    setVisibleFormAdd(false);
  };
  const showFormUpdateDrawer = () => {
    setVisibleFormUpdate(true);
  };
  const onFormUpdateClose = () => {
    const paramsString = queryString.stringify({
      ...filters
    });
    listOrders.getOrders(paramsString);
    listOrders.getOrders(paramsString);
    setVisibleFormUpdate(false);
  };


  const showModal = () => {
    setVisibleDeleteModel(true);
  };

  const myloop = (i) => {
    setTimeout(() => {
      try {
        var data = listOrders.orders[selectedRowKeys[i]]
        listOrders.deleteOrders(data._id)
        var oldTotalPrice = data.amount * parseFloat(data.price);
        const today = new Date();
        var date = convertUTCDateToLocalDate(today);
        var crdate = convertUTCDateToLocalDate(data.dateCreate);
        if (date == crdate)
          listStores.updateLimitDay(data.store, data.team, 0, oldTotalPrice);
      } catch (error) {
        console.log(error)
      }
      i++
      if (i < selectedRowKeys.length) {
        myloop(i)
      }
      else {
        console.log("kt")
        const paramsString = queryString.stringify({
          ...filters
        });
        listOrders.getOrders(paramsString);
        listOrders.getOrders(paramsString);
        setConfirmLoading(false);
        setVisibleDeleteModel(false);
        notification.open({
          message: 'Notification',
          description: 'xóa các đơn hàng thành công',
          onClick: () => {
            console.log('Notification Clicked!');
          },
          duration: 1
        });
        setSelectedRowKeys([])
      }
    }, 2000);

  }

  const handleOk = () => {
    setConfirmLoading(true);
    var i = 0;
    try {
      myloop(i)
    } catch (error) {
      console.log(error)
    }

  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisibleDeleteModel(false);
  };

  const onFinish = (values) => {
    console.log(values)
    setFilters({
      ...filters,
      zipCode: values.zipCode || null,
      store: values.store || null,
      buyer: ((values.store == null && (userStore.role != 3 && userStore.role != 4)) || userStore.role == 1) ? userStore.id : '',
      dateFrom:
        values.range != null
          ? moment(values.range[0]).format("YYYY-MM-DD")
          : moment(yesterday).format("YYYY-MM-DD"),
      dateTo:
        values.range != null
          ? moment(values.range[1]).format("YYYY-MM-DD")
          : moment(today).format("YYYY-MM-DD"),
      state: values.state
    });
  };

  useEffect(() => {
    const paramsString = queryString.stringify(filters);
    listOrders.getOrders(paramsString);
    listUsers.getListUsers("");
    listStores.getStores("status=active");
    console.log(paramsString)
    return () => {
      listUsers.refreshUsers();
      listOrders.refreshOrders();
    }
  }, [listOrders, filters, listUsers]);

  const handleUpdateUSP = (newOrder) => {
    const paramsString = queryString.stringify(filters);
    console.log(newOrder);
    listOrders.updateOrders(newOrder).then((result) => {
      if (result == "ok") {
        notification.open({
          message: 'Notification',
          description:
            'cập nhật đơn hàng thành công',
          onClick: () => {
            console.log('Notification Clicked!');
          },
          duration: 1.5
        });
      } else {
        notification.open({
          message: 'Notification',
          description:
            'trùng tracking ups hoặc orderZipcode',
          onClick: () => {
            console.log('Notification Clicked!');
          },
          duration: 1.5
        });
        listOrders.refreshOrders();
        listOrders.getOrders(paramsString);
      }
    });;
  }

  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: 'edit',
      key: 'edit',
      width: 70,
      render: record =>
        (record.buyer === userStore.id ||
          userStore.role != 1) ? (
          <EditOutlined
            key="1"
            onClick={() => {
              setDataOrder(record);
              showFormUpdateDrawer();
            }}
          />
        ) : null
    },
    {
      title: 'zipCode',
      dataIndex: 'zipCode',
      key: 'zipCode'
    },
    {
      title: 'trackingUPS',
      key: 'trackingUSP',
      render: (record) => userStore.role != 1 ? <ChangeUSP order={record} onSubmit={handleUpdateUSP} /> : record.trackingUSP
    },
    {
      title: 'dateOrder',
      dataIndex: 'dateOrder',
      key: 'dateOrder',
      render: dateOrder => convertUTCDateToLocalDate1(dateOrder)
    },
    {
      title: 'dateDeli',
      dataIndex: 'dateDeli',
      key: 'dateDeli',
      render: dateDeli => convertUTCDateToLocalDate1(dateDeli)
    },
    {
      title: 'buyer',
      dataIndex: 'buyer',
      key: 'buyer',
      render: buyer => listUsers.users.map(e => e._id == buyer ? e.nameBuyer : null),
    },
    {
      title: 'orderZipCode',
      dataIndex: 'orderZipCode',
      key: 'orderZipCode'
    },
    {
      title: 'số lượng',
      dataIndex: 'amount',
      key: 'amount'
    },
    {
      title: 'giá tiền',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'đơn giá',
      key: 'totalPrice',
      render: (record) => record.price * record.amount
    },
    {
      title: 'thực thu',
      key: 'realPrice',
      dataIndex: 'realPrice',
    },
    {
      title: 'note',
      dataIndex: 'note',
      key: 'note',
      ellipsis: {
        showTitle: false,
      },
      render: note => (
        <Tooltip placement="topLeft" title={note}>
          {note}
        </Tooltip>
      ),
    },
  ];

  let data = [];
  var i = 0;
  listOrders.orders.forEach(element => {
    data.push({ ...element, key: i, })
    i++;
  });

  return (
    <div className="Base-Page">

      <div className="toolbar">
        <Row justify="start" className="base-list-tool">
          {userStore.role != 4 ? <Button
            className="base-item"
            type="primary"
            onClick={showFormAddDrawer}
          >
            <PlusOutlined />
          </Button> : null}
          {selectedRowKeys.length > 0 ? (
            <Button
              className="base-item"
              type="primary"
              onClick={showModal}
              style={{ backgroundColor: "red", border: "none" }}
            >
              <DeleteOutlined />
            </Button>
          ) : null}

          <div className="search-bar">
            <Form form={form} layout="inline" onFinish={onFinish}>
              <Form.Item
                name="zipCode"
                style={{ width: 200, marginRight: 0, paddingRight: 0 }}
              >
                <Input
                  className="base-item"
                  prefix={<SearchOutlined className="site-form-item-icon" />}
                  placeholder="zipCode"
                />
              </Form.Item>
              <Form.Item name="store">
                {(userStore.role != 3) ? <Select placeholder="Select Store" allowClear  >
                  {listStores.stores.length && listStores.stores.length > 0
                    ? listStores.stores.map((e, index) =>
                      e.listTeams && e.listTeams.length > 0
                        ? e.listTeams.map((e1, index1) =>
                          e1.team === userStore.team || userStore.id == e.userId ? (
                            <Option key={index1} value={e._id}>
                              {e.name}
                            </Option>
                          ) : null
                        )
                        : null
                    )
                    : null}
                </Select> : <Select placeholder="Select Store" allowClear  >
                  {listStores.stores.length && listStores.stores.length > 0
                    ? listStores.stores.map((e, index) =>
                      <Option key={index} value={e._id}>
                        {e.name}
                      </Option>
                    )
                    : null}
                </Select>}
              </Form.Item>
              <Form.Item
                name="state"
                hidden={userStore.role == 4 ? true : false}
                initialValue='0'
              >
                <Select placeholder="Select state" allowClear>
                  <Option value='0'>đang xử lý</Option>
                  <Option value='1'>yêu cầu hủy đơn</Option>
                  <Option value='2'>đơn đã hủy</Option>
                  <Option value='3'>đơn hàng trả lại</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="range"
                style={{ width: 300, marginRight: 0, paddingRight: 0 }}
                initialValue={[moment(yesterday, dateFormat), moment(today, dateFormat)]}
              >
                <RangePicker className="base-item" format={dateFormat} />
              </Form.Item>
              <Form.Item style={{ marginRight: 0, paddingRight: 0 }}>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
              </Form.Item>

            </Form>
          </div>

        </Row>
        <div className="base-list1"> <Card>
          <Statistic title="Tổng số đơn" value={listOrders.count || 0} />
        </Card>
          <Card>
            <Statistic title="Tổng tiền đơn" value={parseFloat(listOrders.totalPrice || 0).toFixed(2)} />
          </Card>
          <Card>
            <Statistic title="Tổng tiền thực thu" value={parseFloat(listOrders.realPrice || 0).toFixed(2)} />
          </Card>
          {/* {userStore.role == 1 ? <Card>
            <Statistic title="Tổng tiền lương" value={parseFloat(listOrders.realPrice * userStore.rate).toFixed(2) || 0} />
          </Card> : null} */}
        </div>
      </div>
      <div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          scroll={{ x: 1500, y: 700 }}
        />
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
        <FormAddOrder close={onFormAddClose} />
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
        <FormUpdateOrder values={dataOrder} close={onFormUpdateClose} />
      </Drawer>

      <Modal
        title="Warning"
        visible={visibleDeleteModel}
        confirmLoading={confirmLoading}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>you want to delete?</p>
      </Modal>
    </div>
  );
});


const ChangeUSP = ({ order, onSubmit }) => {
  const [inputTxt, setInputTxt] = useState(order.trackingUSP)
  const typingTimeOutRef = useRef(null)
  const handleInputChange = (e) => {
    setInputTxt(e.target.value)
    const newInputTxt = e.target.value
    if (typingTimeOutRef.current) {
      clearTimeout(typingTimeOutRef.current)
    }
    typingTimeOutRef.current = setTimeout(() => {
      const newOrder = {
        ...order,
        trackingUSP: newInputTxt
      }
      onSubmit(newOrder)
    }, 1000)

  }
  return <Input
    value={inputTxt}
    defaultValue={order.trackingUSP}
    onChange={handleInputChange}
    className="edit-input"
  />
}