import React, { useEffect } from "react";
import { Form, Input, Button, Select, InputNumber, DatePicker, notification } from "antd";
import { useStores } from "../../stores";
import { observer } from "mobx-react";
import { getStore } from "../../API/store.api";
import { convertUTCDateToLocalDate } from "../../conf";
const { Option } = Select;
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 10, span: 14 },
};
export const FormAddOrder = observer(({ close }) => {
  const { listStores, listOrders, userStore } = useStores();
  const [form] = Form.useForm();
  const onFinish = (values) => {
    var totalPrice = values.amount * parseFloat(values.price);
    var ok = false;
    var _dateOrder = convertUTCDateToLocalDate(values.dateOrder);
    var _dateDeli = convertUTCDateToLocalDate(values.dateDeli);
    const newValues = {
      ...values,
      dateOrder: _dateOrder,
      dateDeli: _dateDeli
    }
    console.log(newValues)
    getStore(newValues.store)
      .then((store) => {
        let listTeams = store.listTeams;
        try {
          if (listTeams) {
            listTeams.forEach(element => {
              console.log(element)
              if (element.team === userStore.team) {
                ok = true;
              }
            });
          }
        } catch (error) {
          console.log(error);
        }
      })
      .catch((err) => {
        console.log(err);
      }).finally(() => {
        if (ok) {
          listOrders
            .addOrders(newValues)
            .then((result) => {
              if (result == "ok") {
                listStores.updateLimitDay(newValues.store, userStore.team, totalPrice, 0);
                close();
                notification.open({
                  message: 'Notification',
                  description:
                    'tạo đơn hàng thành công',
                  onClick: () => {
                    console.log('Notification Clicked!');
                  },
                  duration: 1.5
                });
              } else {
                notification.open({
                  message: 'Notification',
                  description:
                    'đơn hàng này đã tồn tại',
                  onClick: () => {
                    console.log('Notification Clicked!');
                  },
                  duration: 1.5
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          notification.open({
            message: 'Notification',
            description:
              'tạo đơn hàng thất bại',
            onClick: () => {
              console.log('Notification Clicked!');
            },
            duration: 1.5
          });
        }
      });

  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    listStores.getStores("status=active");
    form.setFieldsValue({
      team: userStore.team,
    });
    // eslint-disable-next-line
  }, [listStores, userStore]);

  return (
    <div className="Base-Page">
      <Form
        {...layout}
        form={form}
        className="base-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="ZipCode"
          name="zipCode"
          rules={[{ required: true, message: "Please in put zipCode!" }]}
        >
          <Input placeholder="vd: kim2k" />
        </Form.Item>
        {userStore.role != 1 ? (
          <Form.Item
            label="tracking ups"
            name="trackingUSP"
          >
            <Input />
          </Form.Item>
        ) : null}
        <Form.Item
          label="date order"
          name="dateOrder"
          rules={[{ required: true, message: "Please check date order!" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="date deli"
          name="dateDeli"
          rules={[{ required: true, message: "Please check date deli!" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="order + zipCode"
          name="orderZipCode"
          rules={[
            { required: true, message: "Please in put order + zipCode!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="amount"
          name="amount"
          rules={[{ required: true, message: "Please in put amount!" }]}
        >
          <InputNumber min={1} max={99999999999999} />
        </Form.Item>
        <Form.Item
          label="price"
          name="price"
          rules={[{ required: true, message: "Please in put price!" }]}
        >
          <InputNumber min={1} max={99999999999999} />
        </Form.Item>
        <Form.Item
          name="store"
          label="store"
          rules={[{ required: true, message: "Please choose team!" }]}
        >
          <Select placeholder="Select Store" allowClear  >
            {listStores.stores.length && listStores.stores.length > 0
              ? listStores.stores.map((e, index) =>
                e.listTeams && e.listTeams.length > 0
                  ? e.listTeams.map((e1, index1) =>
                    e1.team === userStore.team ? (
                      <Option key={index1 + index} value={e._id} style={{ color: parseInt(e1.done || 0) > parseInt(e1.teamLimit) ? "red" : 'black' }}>
                        {e.name}--{parseInt(e1.teamLimit) - parseInt(e1.done || 0)}
                      </Option>
                    ) : null
                  )
                  : null
              )
              : null}
          </Select>
        </Form.Item>
        <Form.Item label="team" name="team" hidden>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});
