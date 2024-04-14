/* eslint-disable no-unused-vars */
import {
    AuditOutlined,
    DashboardOutlined,
    ShoppingOutlined,
    UserOutlined,
    ContainerOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./sidebar.css";

const { Sider } = Layout;

function Sidebar({ isSidebarCollapsed, setIsSidebarCollapsed }) {
    const history = useHistory();
    const location = useLocation();
    const [user, setUser] = useState([]);

    const menuSidebarAdmin = [
        {
            key: "name-page",
            title: "Admin Page",
        },
        {
            key: "dash-board",
            title: "Dashboards",
            link: "/dash-board",
            icon: <DashboardOutlined />,
        },
        {
            key: "account-management",
            title: "Account Management",
            link: "/account-management",
            icon: <UserOutlined />,
        },
        {
            key: "asset-list",
            title: "Academic Year",
            link: "/acdemicyear",
            icon: <ShoppingOutlined />,
        },
        {
            key: "faculty",
            title: "Faculty Manager",
            link: "/faculty",
            icon: <ContainerOutlined />,
        },
    ];

    const menuSidebarMarketing = [
        {
            key: "name-page",
            title: "Coordinator Page",
        },
        {
            key: "dash-board",
            title: "Dashboards",
            link: "/dash-board",
            icon: <DashboardOutlined />,
        },
        {
            key: "notifications",
            title: "Ariticle Manager",
            link: "/article",
            icon: <AuditOutlined />,
        },
    ];

    const menuSidebarUser = [
        {
            key: "name-page",
            title: "Student Page",
        },
        {
            key: "article-manager",
            title: "Article Manager Student",
            link: "/article-student",
            icon: <ContainerOutlined />,
        },
    ];

    const menuSidebarDepartment = [
        {
            key: "name-page",
            title: "Manager Page",
        },
        {
            key: "dash-board",
            title: "Dashboards",
            link: "/dash-board",
            icon: <DashboardOutlined />,
        },
        {
            key: "notifications",
            title: "Ariticle Manager",
            link: "/article",
            icon: <AuditOutlined />,
        },
    ];
    const menuSidebarGuest = [
        {
            key: "name-page",
            title: "Guest Page",
        },
        {
            key: "dash-board",
            title: "Dashboards",
            link: "/dash-board",
            icon: <DashboardOutlined />,
        },
    ];

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
    }, []);

    const navigate = (link, key) => {
        history.push(link);
    };

    useEffect(() => {});

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };
    return (
        <Sider
            width={isSidebarCollapsed ? 80 : 230}
            style={{
                position: "fixed",
                top: 60,
                height: "calc(100% - 60px)",
                left: 0,
                padding: 0,
                zIndex: 1,
                marginTop: 0,
                boxShadow: " 0 1px 4px -1px rgb(0 0 0 / 15%)",
                overflowY: "auto",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
            }}
            collapsed={isSidebarCollapsed}
        >
            <Menu
                mode="inline"
                selectedKeys={location.pathname.split("/")}
                defaultOpenKeys={["account"]}
                style={{
                    height: "100%",
                    borderRight: 0,
                    backgroundColor: "#FFFFFF",
                    flexGrow: 1,
                }}
                theme="light"
            >
                {user.role === "student"
                    ? menuSidebarUser.map((map) => (
                          <Menu.Item
                              onClick={() => navigate(map.link, map.key)}
                              key={map.key}
                              icon={map.icon}
                              className="customeClass"
                          >
                              {map.title}
                          </Menu.Item>
                      ))
                    : user.role === "admin"
                    ? menuSidebarAdmin.map((map) => (
                          <Menu.Item
                              onClick={() => navigate(map.link, map.key)}
                              key={map.key}
                              icon={map.icon}
                              className="customeClass"
                          >
                              {map.title}
                          </Menu.Item>
                      ))
                    : user.role === "marketing"
                    ? menuSidebarMarketing.map((map) => (
                          <Menu.Item
                              onClick={() => navigate(map.link, map.key)}
                              key={map.key}
                              icon={map.icon}
                              className="customeClass"
                          >
                              {map.title}
                          </Menu.Item>
                      ))
                    : user.role === "department"
                    ? menuSidebarDepartment.map((map) => (
                          <Menu.Item
                              onClick={() => navigate(map.link, map.key)}
                              key={map.key}
                              icon={map.icon}
                              className="customeClass"
                          >
                              {map.title}
                          </Menu.Item>
                      ))
                    : user.role === "guest"
                    ? menuSidebarGuest.map((map) => (
                          <Menu.Item
                              onClick={() => navigate(map.link, map.key)}
                              key={map.key}
                              icon={map.icon}
                              className="customeClass"
                          >
                              {map.title}
                          </Menu.Item>
                      ))
                    : null}
            </Menu>

        </Sider>
    );
}

export default Sidebar;
