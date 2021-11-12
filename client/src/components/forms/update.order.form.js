import React, { useEffect } from "react";
import { Form, Input, Button, InputNumber, DatePicker, Select, notification } from "antd";
import moment from "moment";
import { useStores } from "../../stores";
import { observer } from "mobx-react";
import { convertUTCDateToLocalDate } from "../../conf";
const { Option } = Select;
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 10, span: 14 },
};
export const FormUpdateOrder = observer(({ values, close }) => {
  const [form] = Form.useForm();
  const oldTotalPrice = values.amount * parseFloat(values.price);
  const store = values.store;
  const team = values.team;
  const { listOrders, listStores, userStore } = useStores();
  const dateFormat = "YYYY/MM/DD";
  useEffect(() => {
    form.setFieldsValue({
      _id: values._id,
      zipCode: values.zipCode,
      trackingUSP: values.trackingUSP,
      orderZipCode: values.orderZipCode,
      amount: values.amount,
      price: values.price,
      dateOrder: moment(convertUTCDateToLocalDate(values.dateOrder), dateFormat),
      dateDeli: moment(convertUTCDateToLocalDate(values.dateDeli), dateFormat),
      note: values.note,
      realPrice: values.realPrice,
      state: values.state,
      dateCreate: values.dateCreate
    });
    console.log(values)
    // eslint-disable-next-line
  }, [values]);

  const onFinish = (values) => {
    var totalPrice = values.amount * parseFloat(values.price);
    console.log(oldTotalPrice);
    console.log(totalPrice);
    const today = new Date();
    var date = convertUTCDateToLocalDate(today);
    var crdate = convertUTCDateToLocalDate(values.dateCreate);
    close()
    listOrders.updateOrders(values).then((result) => {
      if (result == "ok") {
        if (date == crdate) {
          listStores.updateLimitDay(store, team, totalPrice, oldTotalPrice);
        }
        console.log(values)
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
      }
    });


  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    listStores.getStores("status=active");
  }, [listStores]);
  return (
    <div className="Base-Page">
      <Form
        {...layout}
        form={form}
        className="base-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item name="_id" hidden>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="dateCreate" hidden>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          name="state"
          label="trạng thái"
          rules={[{ required: true, message: "Please choose state!" }]}
        >
          <Select placeholder="Select state" allowClear style={{ width: 181.6 }}>
            <Option value='0'>đang xử lý</Option>
            <Option value='1' hidden={userStore.role != 4 ? true : false}>yêu cầu hủy đơn</Option>
            <Option value='2' hidden={(userStore.role == 4 || values.state != '1') ? true : false}>xác nhận hủy</Option>
            <Option value='3' hidden={userStore.role != 4 ? true : false}>đơn hàng trả lại</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="ZipCode"
          name="zipCode"
          rules={[{ required: true, message: "Please in put zipCode!" }]}
          hidden={userStore.role == 4 ? true : false}
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
          rules={[{ required: true, message: "Please in put date order!" }]}
          hidden={userStore.role == 4 ? true : false}
        >
          <DatePicker format={dateFormat} />
        </Form.Item>
        <Form.Item
          label="date deli"
          name="dateDeli"
          rules={[{ required: true, message: "Please in put date deli!" }]}
          hidden={userStore.role == 4 ? true : false}
        >
          <DatePicker format={dateFormat} />
        </Form.Item>
        <Form.Item
          label="order + zipCode"
          name="orderZipCode"
          rules={[
            { required: true, message: "Please in put order + zipCode!" },
          ]}
          hidden={userStore.role == 4 ? true : false}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="amount"
          name="amount"
          rules={[{ required: true, message: "Please in put amount!" }]}
          hidden={userStore.role == 4 ? true : false}
        >
          <InputNumber min={1} max={99999999999999} />
        </Form.Item>

        <Form.Item
          label="price"
          name="price"
          rules={[{ required: true, message: "Please in put price!" }]}
          hidden={userStore.role == 4 ? true : false}
        >
          <InputNumber min={1} max={99999999999999} />
        </Form.Item>
        {
          userStore.role == 3 || userStore.role == 4 ? <Form.Item
            label="real price"
            name="realPrice"
          >
            <InputNumber min={1} max={99999999999999} />
          </Form.Item> : null
        }
        <Form.Item
          label="note"
          name="note"
        >
          <Input.TextArea />
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
