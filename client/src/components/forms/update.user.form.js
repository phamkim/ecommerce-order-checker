import React, { useEffect } from "react";
import { Form, Input, Button, Select, notification } from "antd";
import { observer } from "mobx-react";
import { useStores } from "../../stores";
const { Option } = Select;
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 10, span: 14 },
};
export const FormUpdateUser = observer(({ values, close }) => {
  const { listUsers, listTeams, userStore } = useStores();
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      id: values._id,
      userName: values.userName,
      passWord: values.passWord,
      nameBuyer: values.nameBuyer,
      fullName: values.fullName,
      role: parseInt(values.role),
      team: values.team,
      rate: values.rate,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const onFinish = (values) => {
    listUsers.updateUsers(values);
    close();
    notification.open({
      message: 'Notification',
      description:
        'cập nhật user thành công',
      onClick: () => {
        console.log('Notification Clicked!');
      },
      duration: 1.5
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    listTeams.getTeams("");
  }, [listTeams]);

  return (
    <div className="Base-Page">
      <Form
        {...layout}
        className="base-form"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="id" name="id" hidden>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          label="user name"
          name="userName"
          rules={[
            {
              required: true,
              message: "Please input  user name!",
            },
          ]}
        >
          <Input placeholder="vd: UserA" />
        </Form.Item>
        {userStore.role == 3 ? (
          <Form.Item
            label="passWord"
            name="passWord"
            rules={[
              {
                required: true,
                message: "Please input passWord!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        ) : null}

        <Form.Item
          label="name buyer"
          name="nameBuyer"
          rules={[
            {
              required: true,
              message: "Please input name buyer!",
            },
          ]}
        >
          <Input placeholder="vd: PK" />
        </Form.Item>
        <Form.Item
          label="fullName"
          name="fullName"
          rules={[
            {
              required: true,
              message: "Please input full name!",
            },
          ]}
        >
          <Input placeholder="vd: nguyen van A" />
        </Form.Item>
        <Form.Item
          label="rate"
          name="rate"
          rules={[{ required: true, message: "Please input rate!" }]}
        >
          <Input placeholder="vd: 2" />
        </Form.Item>
        <Form.Item
          name="role"
          label="role"
          rules={[{ required: true, message: "Please choose role!" }]}
        >
          <Select placeholder="Select role" allowClear>
            {userStore.role == 3 ? <Option value={4}>admin shop</Option> : null}
            <Option value={1}>buyer</Option>
            {userStore.role > 2 ? < Option value={2}>boss</Option> : null}
            {userStore.role > 3 ? <Option value={3}>admin</Option> : null}
          </Select>
        </Form.Item>
        <Form.Item
          name="team"
          label="team"
          hidden={userStore.role == 3 ? false : true}
        >
          <Select placeholder="Select team" allowClear>
            {listTeams.teams.length > 0
              ? listTeams.teams.map((e, index) => (
                <Option key={index} value={e._id}>
                  {e.name}
                </Option>
              ))
              : null}
          </Select>
        </Form.Item>

        <Form.Item label="orders" name="orders" style={{ display: "none" }}>
          <Input disabled />
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
