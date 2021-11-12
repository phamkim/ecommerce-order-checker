import React, { useState, useEffect } from "react";
import { useStores } from "../../stores";
import { observer } from "mobx-react";
import {
    Tabs,
    Form,
    Button,
    DatePicker,
    Select,
    Row,
    Input
} from "antd";
import {
    SearchOutlined,
} from "@ant-design/icons";
import queryString from "query-string";
import moment from "moment";
import { getStores } from "../../API/store.api";
import { TabOrders } from './tabOrders'
const dateFormat = "DD-MM-YYYY";
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select;
const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)

export const TabStores = observer(() => {
    const { listStores, listOrders, listUsers, listTeams, userStore } = useStores();
    const [crrKey, setCrrKey] = useState(0);
    const [filters, setFilters] = useState({
        dateFrom: moment(yesterday).format("YYYY-MM-DD"),
        dateTo: moment(today).format("YYYY-MM-DD")
    });
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log(values)
        const filter = {
            ...filters,
            zipCode: values.zipCode || null,
            team: values.team || null,
            buyer: values.buyer || null,
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
        listStores.getStores('status=active')
        getStores('status=active').then((stores) => {
            try {
                const paramsString = queryString.stringify({
                    ...filters,
                    store: stores[crrKey]._id,
                });
                setFilters({
                    ...filters,
                    store: stores[crrKey]._id,
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
                store: listStores.stores[key]._id,
            });
            setFilters({
                ...filters,
                store: listStores.stores[key]._id,
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
                {listStores.stores.map((e, index) => (userStore.role == 4 && userStore.id == e.userId) || userStore.role != 4 ? (
                    <TabPane tab={e.name} key={index} >
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
                                        <Form.Item name="buyer" hidden={userStore.role == 4 ? true : false}>
                                            <Select placeholder="Select User" allowClear  >
                                                {listUsers.users.length && listUsers.users.length > 0
                                                    ? listUsers.users.map((e, index) =>
                                                        <Option key={index} value={e._id}>
                                                            {e.nameBuyer}
                                                        </Option>
                                                    )
                                                    : null}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="team">
                                            <Select placeholder="Select Team" allowClear  >
                                                {listTeams.teams.length && listTeams.teams.length > 0
                                                    ? listTeams.teams.map((e, index) =>
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
                        </div>

                        <TabOrders />
                    </TabPane>
                ) : null
                )}
            </Tabs>
        </div>
    );
});
