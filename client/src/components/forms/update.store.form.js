import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  Space,
  notification,
} from "antd";
import { useStores } from "../../stores";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};
export const FormUpdateStore = ({ values, close }) => {
  const { listTeams, listStores, userStore } = useStores();
  const [limitDay, setLimitDay] = useState(0);
  const [form] = Form.useForm();
  useEffect(() => {
    setLimitDay(values.limitDay);
    form.setFieldsValue({
      id: values._id,
      name: values.name,
      link: values.link,
      limitDay: values.limitDay,
      listTeams: values.listTeams,
      status: values.status,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const onFinish = (values) => {
    const listTeams = form.getFieldValue("listTeams");
    var count = 0;
    try {
      listTeams.forEach((element) => {
        count += parseInt(element.teamLimit);
      });
    } catch (error) {
      console.log(error);
    }
    console.log(values);
    if (count <= limitDay) {
      listStores.updateStores(values);
      close();
      notification.open({
        message: "Notification",
        description: "cập nhật store thành công",
        onClick: () => {
          console.log("Notification Clicked!");
        },
        duration: 1.5,
      });
    } else {
      notification.open({
        message: "Notification",
        description: "tổng các team limit phải nhỏ hơn hoặc bằng limit day",
        onClick: () => {
          console.log("Notification Clicked!");
        },
        duration: 1.5,
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="Base-Page">
      <Form
        {...layout}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="id" name="id" hidden>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          label="name store"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input  name store!",
            },
          ]}
        >
          <Input placeholder="vd: team A" />
        </Form.Item>
        <Form.Item
          name="status"
          label="status"
          rules={[{ required: true, message: "Please choose status!" }]}
          hidden={userStore.role == 3 || userStore.role == 4 ? false : true}
          initialValue="active"
        >
          <Select placeholder="Select status" allowClear>
            <Option value="active">active</Option>
            <Option value="deactive">deactive</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="limit day"
          name="limitDay"
          rules={[
            {
              required: true,
              message: "Please input limit day!",
            },
          ]}
        >
          <InputNumber min={1} placeholder="vd: 1500" />
        </Form.Item>
        <Form.Item
          label="link"
          name="link"
          rules={[
            {
              required: true,
              message: "Please input link!",
            },
          ]}
        >
          <Input placeholder="www.google.com" />
        </Form.Item>
        <div>
          <Form.List name="listTeams">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space key={key} style={{ marginLeft: 90 }} align="baseline">
                    <Form.Item
                      {...restField}
                      label="team"
                      name={[name, "team"]}
                      fieldKey={[fieldKey, "team"]}
                      rules={[{ required: true, message: "Missing team" }]}
                      style={{ width: 200 }}
                    >
                      <Select
                        placeholder="Select team"
                        allowClear
                        style={{ width: 140 }}
                      >
                        {listTeams.teams.length > 0
                          ? listTeams.teams.map((e, index) => (
                              <Option key={index} value={e._id}>
                                {e.name}
                              </Option>
                            ))
                          : null}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="limit"
                      name={[name, "teamLimit"]}
                      fieldKey={[fieldKey, "teamLimit"]}
                      rules={[
                        { required: true, message: "Missing team limit day" },
                      ]}
                      style={{ width: 180 }}
                    >
                      <InputNumber
                        min={1}
                        max={limitDay}
                        style={{ width: 120 }}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="done"
                      name={[name, "done"]}
                      fieldKey={[fieldKey, "done"]}
                      style={{ width: 150 }}
                      initialValue={0}
                    >
                      <InputNumber min={0} style={{ width: 100 }} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item className="btn-add">
                  {limitDay > 0 ? (
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{ marginLeft: 82 }}
                    >
                      Add Team
                    </Button>
                  ) : null}
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
