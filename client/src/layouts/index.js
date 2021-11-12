import { Layout, Menu } from "antd";
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { MyRoute } from "../route";
import { MyHeader } from "./header";
import {
  AppstoreOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import "./style.css";
import { useStores } from "../stores";
import { observer } from "mobx-react";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      window.sessionStorage.getItem("accessToken") ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export const MyLayout = observer(() => {
  const { userStore } = useStores();
  useEffect(() => {
    userStore.getMyProfile();
  }, [userStore]);
  return (
    <Router>
      {
        userStore.role ? <Layout>
          <Sider
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
            }}
          >
            <Link to="/">
              <div className="logo"></div>
            </Link>
            <Menu theme="dark" mode="inline">
              {userStore.role != 1 && userStore.role != 4 ? (
                <Menu.Item key="1" icon={<UserOutlined />}>
                  <Link to="/users">Users</Link>
                </Menu.Item>
              ) : null}
              <Menu.Item key="2" icon={<AppstoreOutlined />}>
                <Link to="/stores">Stores</Link>
              </Menu.Item>
              <Menu.Item key="3" icon={<ShopOutlined />}>
                <Link to="/orders">Orders</Link>
              </Menu.Item>
              {userStore.role == 3 ? (
                <Menu.Item key="4" icon={<TeamOutlined />}>
                  <Link to="/teams">Teams</Link>
                </Menu.Item>
              ) : null}
              {userStore.role != 1 && userStore.role != 4 ?
                <SubMenu key="sub1" icon={<BarChartOutlined />} title="statistic">
                  <Menu.Item key="5"><Link to="/statistic-teams">Teams</Link></Menu.Item>
                  <Menu.Item key="6"><Link to="/statistic-users">users</Link></Menu.Item>
                  <Menu.Item key="7"><Link to="/statistic-stores">stores</Link></Menu.Item>
                </SubMenu> : null}
            </Menu>
          </Sider>
          <Layout className="site-layout" style={{ marginLeft: 200 }}>
            <Header className="site-layout-background" style={{ padding: 0 }}>
              <MyHeader />
            </Header>
            <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
              <div
                className="site-layout-background"
                style={{ padding: 24, textAlign: "center" }}
              >
                <Switch>
                  {MyRoute.map((e, index) => (
                    <PrivateRoute
                      key={index}
                      path={e.path}
                      exact
                      component={e.component}
                    />
                  ))}
                </Switch>
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Web Design ©2021 Created by kim
            </Footer>
          </Layout>
        </Layout> : null
      }

    </Router>

  );
});
