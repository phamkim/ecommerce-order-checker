import React from "react";
import { Form, InputNumber, Input, Button, Select, Space, notification } from "antd";
import { useStores } from "../../stores";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
export const FormAddStore = ({ close }) => {
  const { listStores, listTeams, userStore } = useStores();
  const onFinish = (values) => {
    console.log(values)
    listStores.addStores(values);
    close()
    notification.open({
      message: 'Notification',
      description:
        'tạo store thành công',
      onClick: () => {
        console.log('Notification Clicked!');
      },
      duration: 1.5
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="Base-Page">
      <Form
        {...layout}
        className="base-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item hidden name="userId" initialValue={userStore.id}>
          <Input />
        </Form.Item>
        <Form.Item label="name store" name="name" rules={[
          { required: true, message: "Missing name store" },
        ]}>
          <Input placeholder="vd: team A" />
        </Form.Item>
        <Form.Item label="limit day" name="limitDay" rules={[
          { required: true, message: "Missing limit day" },
        ]}>
          <InputNumber min={1} placeholder="vd: 1500" />
        </Form.Item>
        <Form.Item label="link" name="link" rules={[
          { required: true, message: "Missing link" },
        ]}>
          <Input placeholder="www.google.com" />
        </Form.Item>

        <div className="add-team-box">
          <Form.List name="listTeams" >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space
                    key={key}
                    style={{ marginLeft: 15 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      label="team"
                      name={[name, "team"]}
                      fieldKey={[fieldKey, "team"]}
                      rules={[{ required: true, message: "Missing team" }]}
                      style={{ width: 200 }}
                    >
                      <Select placeholder="Select team" allowClear style={{ width: 130 }}>
                        {listTeams.teams.map((e, index) => (
                          <Option key={index} value={e._id}>
                            {e.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="limit"
                      name={[name, "teamLimit"]}
                      fieldKey={[fieldKey, "teamLimit"]}
                      rules={[
                        { required: true, message: "Missing team limit" },
                      ]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="done"
                      name={[name, "done"]}
                      fieldKey={[fieldKey, "done"]}
                      hidden
                    >
                      <InputNumber />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item className="btn-add">
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Team
                  </Button>
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
