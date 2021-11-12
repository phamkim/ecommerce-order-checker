import React from "react";
import { Form, Input, Button, notification } from "antd";
import { useStores } from "../../stores";
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 10, span: 14 },
};
export const FormAddTeam = ({ close }) => {
  const { listTeams } = useStores();
  const onFinish = (values) => {
    listTeams.addTeams(values);
    close()
    notification.open({
      message: 'Notification',
      description:
        'tạo team thành công',
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
        <Form.Item
          label="name team"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your name team!",
            },
          ]}
        >
          <Input placeholder="vd: team A" />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
