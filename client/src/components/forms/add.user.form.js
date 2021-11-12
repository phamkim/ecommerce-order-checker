import React, { useEffect } from "react";
import { Form, Input, Button, Select, InputNumber, notification } from "antd";
import { useStores } from "../../stores";
import { observer } from "mobx-react";
const { Option } = Select;
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 10, span: 14 },
};

export const FormAddUser = observer(({ close }) => {
  const { listTeams, listUsers, userStore } = useStores();
  const onFinish = (values) => {
    console.log(values)
    listUsers.addUsers(values);
    close()
    notification.open({
      message: 'Notification',
      description:
        'tạo user thành công',
      onClick: () => {
        console.log('Notification Clicked!');
      },
      duration: 1.5
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const getNameTeam = (id) => {
    var name = '';
    listTeams.teams.forEach(e => {
      if (e._id === id) {
        name = e.name;
      }
    })
    return name;
  }
  useEffect(() => {
    listTeams.getTeams("");
  }, [listTeams]);

  return (
    <div className="Base-Page">
      <Form
        {...layout}
        className="base-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="userName"
          name="userName"
          rules={[{ required: true, message: "Please in put user name!" }]}
        >
          <Input placeholder="vd: kim2k" />
        </Form.Item>
        <Form.Item
          label="passWord"
          name="passWord"
          rules={[{ required: true, message: "Please in put password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="nameBuyer"
          name="nameBuyer"
          rules={[{ required: true, message: "Please in put name buyer!" }]}
        >
          <Input placeholder="vd: PK" />
        </Form.Item>
        <Form.Item
          label="fullName"
          name="fullName"
          rules={[{ required: true, message: "Please input full name!" }]}
        >
          <Input placeholder="vd: nguyen van A" />
        </Form.Item>
        <Form.Item
          label="rate"
          name="rate"
          rules={[{ required: true, message: "Please input rate!" }]}
        >
          <InputNumber placeholder="vd: 2" />
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
          name="team1"
          label="team"
        >
          {
            userStore.role == 3 ? <Select placeholder="Select team" allowClear>
              {listTeams.teams.map((e, index) => (
                <Option key={index} value={e._id}>
                  {e.name}
                </Option>
              ))}
            </Select> : <Select placeholder="Select team" allowClear>
              <Option value={userStore.team}>
                {getNameTeam(userStore.team)}
              </Option>
            </Select>
          }
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
