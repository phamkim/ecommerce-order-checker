import React, { useState, useEffect } from "react";
import { useStores } from "../../stores";
import { observer } from "mobx-react";
import { Form, DatePicker, Button } from "antd";
import queryString from "query-string";
import moment from "moment";
import { TabOrders } from "./tabOrders";
const dateFormat = "DD-MM-YYYY";
const { RangePicker } = DatePicker;
const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)

export const Buyer = observer(() => {
  const { listUsers, listStores, userStore, listOrders } = useStores();
  const [filters, setFilters] = useState({
    dateFrom: moment(yesterday).format("YYYY-MM-DD"),
    dateTo: moment(today).format("YYYY-MM-DD")
  });
  const [form] = Form.useForm();
  useEffect(() => {
    listUsers.getListUsers("");
    listStores.getStores("");
    return () => {
      listUsers.refreshUsers()
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const paramsString = queryString.stringify({
      ...filters,
      buyer: userStore.id,
    });
    listOrders.getOrders(paramsString);
    console.log(listOrders.orders)
    // eslint-disable-next-line
  }, [filters]);

  const onFinish = (values) => {
    setFilters({
      dateFrom:
        values.range != null
          ? moment(values.range[0]).format("YYYY-MM-DD")
          : null,
      dateTo:
        values.range != null
          ? moment(values.range[1]).format("YYYY-MM-DD")
          : null,
    });
  };

  return (
    <div className="Base-Page ">
      <Form className="buyer-form-date" form={form} layout="inline" onFinish={onFinish}>
        <Form.Item
          className="form-item1"
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
      <TabOrders rate={userStore.rate} />
    </div>
  );
});
