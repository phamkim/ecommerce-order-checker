import { Form, Input, Button, Checkbox } from "antd";
import "./style.css";
import React, { useState } from "react";
import { useStores } from "../stores";
export const Login = () => {
  const { userStore } = useStores();
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handlePassWordChange = (e) => {
    setPassWord(e.target.value);
  };

  const handleIsLoginChange = () => {
    userStore
      .login(userName, passWord)
      .then(() => {
        userStore.refreshAccessToken();
        userStore.refreshId();
 
      })
      .catch(function (error) {
        console.log(error);
      })       
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="container-fluid form-login">
      <h1> Log In</h1>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="userName"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input onChange={(e) => handleUserNameChange(e)} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password onChange={(e) => handlePassWordChange(e)} />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleIsLoginChange}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
