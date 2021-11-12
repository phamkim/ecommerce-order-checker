import React, { useEffect } from "react";
import { Form, Input, Button, notification } from "antd";
import { useStores } from "../../stores";
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 10, span: 14 },
};
export const FormUpdateTeam = ({ values, close }) => {
  const { listTeams } = useStores();
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      id: values._id,
      name: values.name,
      teamLimitDay: values.teamLimitDay,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const onFinish = (values) => {
    listTeams.updateTeams(values);
    close()
    notification.open({
      message: 'Notification',
      description:
        'cập nhật team thành công',
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
        form={form}
      >
        <Form.Item label="id" name="id" hidden>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          label="name team"
          name="name"
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
