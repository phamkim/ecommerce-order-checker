import React, { useState, useEffect } from "react";
import { useStores } from "../../stores";
import { observer } from "mobx-react";
import {
    Tabs,
    Form,
    Button,
    DatePicker,
    Row,
    Select,
    Input
} from "antd";
import {
    SearchOutlined,
} from "@ant-design/icons";
import queryString from "query-string";
import { getUser } from "../../API/user.api";
import { TabOrders } from './tabOrders'
import moment from "moment";
const dateFormat = "DD-MM-YYYY";
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select;
const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)
export const TabUsers = observer(() => {
    const { listUsers, listOrders, listStores } = useStores();
    const range = {
        dateFrom: moment(yesterday).format("YYYY-MM-DD"),
        dateTo: moment(today).format("YYYY-MM-DD")
    }
    const [filters, setFilters] = useState(range);
    const [crrKey, setCrrKey] = useState(0);
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log(values)
        const filter = {
            ...filters,
            zipCode: values.zipCode || null,
            store: values.store || null,
            dateFrom:
                values.range != null
                    ? moment(values.range[0]).format("YYYY-MM-DD")
                    : moment(yesterday).format("YYYY-MM-DD"),
            dateTo:
                values.range != null
                    ? moment(values.range[1]).format("YYYY-MM-DD")
                    : moment(today).format("YYYY-MM-DD"),
        };
        const paramsString = queryString.stringify({
            ...filter,
            values,
        });
        console.log(paramsString)
        listOrders.getOrders(paramsString);
    }
    useEffect(() => {
        listUsers.getListUsers('');
        listStores.getStores("status=active");
        return () => {
            listUsers.refreshUsers()
        }
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        getUser("").then((users) => {
            try {
                const paramsString = queryString.stringify({
                    ...filters,
                    buyer: users[crrKey]._id,
                });
                setFilters({
                    ...filters,
                    buyer: users[crrKey]._id,
                })
                listOrders.getOrders(paramsString);
            } catch (error) {
                console.log(error);
            }
        });
        return () => {
            listOrders.refreshOrders()
        }
        // eslint-disable-next-line
    }, []);

    const callback = (key) => {
        try {
            const paramsString = queryString.stringify({
                ...filters,
                buyer: listUsers.users[key]._id,
            });
            setFilters({
                ...filters,
                buyer: listUsers.users[key]._id,
            })
            setCrrKey(key);
            listOrders.getOrders(paramsString);
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div>
            <Tabs onChange={callback} type="card">
                {listUsers.users.map((e, index) => (
                    <TabPane tab={e.nameBuyer} key={index}>

                        <div className="toolbar">
                            <Row justify="start" className="base-list-tool">
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
                                            <Select placeholder="Select Store" allowClear  >
                                                {listStores.stores.length && listStores.stores.length > 0
                                                    ? listStores.stores.map((e, index) =>
                                                        <Option key={index} value={e._id}>
                                                            {e.name}
                                                        </Option>
                                                    )
                                                    : null}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            name="range"
                                            style={{ width: 300, marginRight: 0, paddingRight: 0 }}
                                            initialValue={[moment(yesterday, dateFormat), moment(today, dateFormat)]}
                                        >
                                            <RangePicker
                                                className="base-item" format={dateFormat} />
                                        </Form.Item>
                                        <Form.Item style={{ marginRight: 0, paddingRight: 0 }}>
                                            <Button type="primary" htmlType="submit">
                                                Search
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </div>

                            </Row>
                        </div>

                        <TabOrders rate={e.rate} />
                    </TabPane>
                ))}
            </Tabs>
        </div>
    );
});
