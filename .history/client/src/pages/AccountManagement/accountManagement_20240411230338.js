import {
  CheckCircleOutlined,
  CopyOutlined,
  HomeOutlined,
  PlusOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";
import {
  BackTop,
  Breadcrumb,
  Button,
  Modal,
  Form,
  Card,
  Col,
  Input,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  notification,
  message,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import userApi from "../../apis/userApi";
import "./accountManagement.css";
import axiosClient from "../../apis/axiosClient";
import facultyApi from "../../apis/facultyApi";
import academicApi from "../../apis/academicApi";
import logApi from "../../apis/logApi";
const { Option } = Select;

const AccountManagement = () => {
  const [faculties, setFaculties] = useState([]);
  const [academics, setAcademics] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedInput, setSelectedInput] = useState();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [isFieldsFilled, setIsFieldsFilled] = useState({
    role: false,
    faculty: false,
    academic: false,
  });
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [id, setId] = useState();
  const handleUpdate = async (values) => {
    try {
      const user = {
        name: values.name,
        email: values.email,
        role: values.role,
        facultyId: values.faculty,
        academicId: values.academic,
      };
      return userApi.update(user, id).then((response) => {
        if (response === undefined) {
          notification["error"]({
            message: `Notification`,
            description: "Update failed",
          });
        } else {
          notification["success"]({
            message: `Notification`,
            description: "Update succes",
          });
          handleListUser();
          setEditModalVisible(false);
        }
      });
    } catch (error) {
      console.error("Failed to fetch faculties:", error);
    }
    console.log("Updating user:", values);
    setUpdateModalVisible(false);
  };

  useEffect(() => {
    // Fetch list of faculties when component mounts
    const fetchFaculties = async () => {
      try {
        const response = await facultyApi.listFaculty();
        setFaculties(response.data);
      } catch (error) {
        console.error("Failed to fetch faculties:", error);
      }
    };
    fetchFaculties();
    // Fetch list of academics when component mounts
    const fetchAcademics = async () => {
      try {
        const response = await academicApi.listAcademic();
        setAcademics(response.data);
      } catch (error) {
        console.error("Failed to fetch academics:", error);
      }
    };
    fetchAcademics();
  }, []);
  const history = useHistory();

  const titleCase = (str) => {
    var splitStr = str?.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(" ");
  };
  const handleDelete = async (userId) => {
    setLoading(true);
    try {
      await userApi.deleteUser(userId).then((response) => {
        if (
          response.message ===
          "Cannot delete the asset because it is referenced in another process or event."
        ) {
          notification["error"]({
            message: `Thông báo`,
            description:
              "Cannot be deleted because it is already in use in another event or process.",
          });
          setLoading(false);
          return;
        }
        if (response === undefined) {
          notification["error"]({
            message: `Notification`,
            description: "Failed",
          });
          setLoading(false);
        } else {
          notification["success"]({
            message: `Notification`,
            description: "Delete Successfully",
          });
          handleListUser();
          setLoading(false);
        }
      });
    } catch (error) {
      console.log("Failed to fetch event list:" + error);
    }
    console.log("Deleting user:", userId);
  };

  const handleEditUser = (id) => {
    (async () => {
      try {
        const response = await userApi.getById(id);
        form2.setFieldsValue({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          faculty: response.data.facultyId,
          academic: response.data.academicId,
        });
        setId(id);
        console.log(form2);
        setLoading(false);
      } catch (error) {
        throw error;
      }
    })();
    setEditModalVisible(true);
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "index",
      render: (value, item, index) => (page - 1) * 10 + (index + 1),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space size="middle">
          {text == null || text == undefined ? (
            ""
          ) : (
            <p style={{ margin: 0 }}>{titleCase(text)}</p>
          )}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "12%",
      render: (text, record) => (
        <Space size="middle">
          {text === "admin" ? (
            <Tag
              color="blue"
              key={text}
              style={{ width: 100, textAlign: "center" }}
              icon={<CopyOutlined />}
            >
              Admin
            </Tag>
          ) : text === "student" ? (
            <Tag
              color="green"
              key={text}
              style={{ width: 100, textAlign: "center" }}
              icon={<CheckCircleOutlined />}
            >
              Student
            </Tag>
          ) : text === "marketing" ? (
            <Tag
              color="green"
              key={text}
              style={{ width: 100, textAlign: "center" }}
              icon={<CheckCircleOutlined />}
            >
              Coordinator
            </Tag>
          ) : text === "department" ? (
            <Tag
              color="green"
              key={text}
              style={{ width: 100, textAlign: "center" }}
              icon={<CheckCircleOutlined />}
            >
              Manager
            </Tag>
          ) : text === "guest" ? (
            <Tag
              color="green"
              key={text}
              style={{ width: 100, textAlign: "center" }}
              icon={<CheckCircleOutlined />}
            >
              Guest
            </Tag>
          ) : null}
        </Space>
      ),
    },

    {
      title: "Faculty",
      dataIndex: "facultyId",
      key: "facultyId",
      render: (text, record) => {
          const faculty = faculties.find((faculty) => faculty._id === text);
          // Kiểm tra nếu vai trò là "admin" hoặc "guest" thì không hiển thị trường "Faculty"
          if (record.role === "admin" || record.role === "guest" || record.role === "department") {
              return null;
          } else {
              return (
                  <Space size="middle">
                      {faculty ? (
                          <Tag
                              color="blue"
                              key={faculty._id}
                              style={{ width: "auto", textAlign: "center" }}
                          >
                              {faculty.name}
                          </Tag>
                      ) : null}
                  </Space>
              );
          }
      },
    },

    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          {record.role != "admin" ? (
            <>
              <Button onClick={() => handleEditUser(record._id)}>Update</Button>
              <Popconfirm
                title="Are you sure delete this user?"
                onConfirm={() => handleDelete(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            </>
          ) : null}
        </Space>
      ),
    },
  ];

  const handleListUser = async () => {
    try {
      const response = await userApi.listUserByAdmin({ page, limit: 10 });
      console.log(response);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch event list:" + error);
    }
  };

  const handleFilterEmail = async (email) => {
    try {
      const response = await userApi.searchUser(email);
      setUser(response.data);
    } catch (error) {
      console.log("search to fetch user list:" + error);
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditModalVisible(false);
  };

  const accountCreate = async (values) => {
    try {
      const formatData = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        facultyId: values.faculty,
      };
      console.log(formatData);
      await axiosClient.post("/auth/create", formatData).then((response) => {
        console.log(response);
        if (response.status === 400) {
          return message.error("Tài khoản đã tổn tại");
        } else if (
          response.message === "Validation failed: Email has already been taken"
        ) {
          message.error("Email has already been taken");
        } else if (
          response.message === "Validation failed: Phone has already been taken"
        ) {
          message.error("Validation failed: Phone has already been taken");
        } else if (response === undefined) {
          notification["error"]({
            message: `Notification`,
            description: "Account creation failed",
          });
        } else {
          notification["success"]({
            message: `Notification`,
            description: "Successfully created account",
          });
          setIsFieldsFilled({
            role: false,
            faculty: false,
            academic: false,
          });
          form.resetFields();
          handleList();
          history.push("/account-management");
        }
      });

      setIsModalVisible(false);
    } catch (error) {
      throw error;
    }
    setTimeout(function () {
      setLoading(false);
    }, 1000);
  };

  const CancelCreateRecruitment = () => {
    setIsFieldsFilled({
      role: false,
      faculty: false,
      academic: false,
    });
    form.resetFields();
    history.push("/account-management");
  };

  const handleList = () => {
    (async () => {
      try {
        const response = await userApi.listUserByAdmin({
          page: 1,
          limit: 1000,
        });
        console.log(response);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch user list:" + error);
      }
    })();
  };

  useEffect(() => {
    handleList();
    window.scrollTo(0, 0);
    const userAgent = navigator.userAgent;
    const logData = async () => {
      try {
        const isChrome = /Chrome/.test(userAgent);
        const isEdge = /Edge/.test(userAgent);
        const isFirefox = /Firefox/.test(userAgent);
        const isSafari = /Safari/.test(userAgent) && !isChrome; // Exclude Chrome-based Safari
        const isOpera = /Opera/.test(userAgent);
        let brower_user;
        if (isChrome) {
          brower_user = "Chrome";
        } else if (isEdge) {
          brower_user = "Edge";
        } else if (isFirefox) {
          brower_user = "Firefox";
          console.log("User is likely using Firefox");
        } else if (isSafari) {
          brower_user = "Safari";
          console.log("User is likely using Safari");
        } else if (isOpera) {
          brower_user = "Opera";
          console.log("User is likely using Opera");
        } else {
          console.log("Browser could not be identified");
        }
        const data = {
          url: window.location.href.replace("http://localhost:3000/", ""),
          browser: brower_user,
        };
        const response = await logApi.pushLog(data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    logData();
  }, []);
  return (
    <div>
      <Spin spinning={loading}>
        <div style={{ marginTop: 20, marginLeft: 24 }}>
          <Breadcrumb>
            <Breadcrumb.Item href="">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">
              <UserOutlined />
              <span>Account Management</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div id="account">
          <div id="account_container">
            <PageHeader
              subTitle=""
              style={{ fontSize: 14, paddingTop: 20, paddingBottom: 20 }}
            >
              <Row>
                <Col span="12">
                  <Input
                    placeholder="Search by email"
                    allowClear
                    style={{ width: 300 }}
                    onChange={handleFilterEmail}
                    value={selectedInput}
                  />
                </Col>
                <Col span="12">
                  <Row justify="end">
                    <Button
                      style={{ marginLeft: 10 }}
                      icon={<PlusOutlined />}
                      size="middle"
                      onClick={showModal}
                    >
                      {"Add Account"}
                    </Button>
                  </Row>
                </Col>
              </Row>
            </PageHeader>
          </div>
        </div>
        <div style={{ marginTop: 20, marginRight: 5 }}>
          <div id="account">
            <div id="account_container">
              <Card title="User Manager" bordered={false}>
                <Table
                  columns={columns}
                  dataSource={user}
                  // pagination={{ position: ["bottomCenter"] }}
                />
              </Card>
            </div>
          </div>
        </div>
        <Modal
          title="Add Account"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={form}
            onFinish={accountCreate}
            name="accountCreate"
            layout="vertical"
            initialValues={{
              residence: ["zhejiang", "hangzhou", "xihu"],
              prefix: "86",
            }}
            scrollToFirstError
          >
            <Form.Item
              name="name"
              label="Name"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please enter a name!",
                },
                { max: 100, message: "Name maximum 100 characters" },
                { min: 5, message: "Name at least 5 characters" },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Tên" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              hasFeedback
              rules={[
                {
                  type: "email",
                  message: "Invalid email!",
                },
                {
                  required: true,
                  message: "Please enter email!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please enter password!",
                },
                { max: 20, message: "Password maximum 20 characters" },
                { min: 6, message: "Password must be at least 5 characters" },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="role"
              label="Role"
              hasFeedback
              rules={[
                {
                  required: !isFieldsFilled.role,
                  message: "Pick role!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Select
                placeholder="Pick role"
                onChange={() =>
                  setIsFieldsFilled({ ...isFieldsFilled, role: true })
                }
              >
                <Option value="admin">Admin</Option>
                <Option value="department">Manager</Option>
                <Option value="marketing">Coordinator</Option>
                <Option value="student">Student</Option>
                <Option value="guest">Guest</Option>
              </Select>
            </Form.Item>
            
            <Form.Item>
              <Button
                style={{
                  background: "#FF8000",
                  color: "#FFFFFF",
                  float: "right",
                  marginTop: 20,
                  marginLeft: 8,
                }}
                htmlType="submit"
              >
                Done
              </Button>
              <Button
                style={{
                  background: "#FF8000",
                  color: "#FFFFFF",
                  float: "right",
                  marginTop: 20,
                }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Edit User"
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
        >
          {/* Form chỉnh sửa thông tin người dùng */}
          <Form
            form={form2}
            onFinish={handleUpdate} // Sử dụng hàm handleUpdate để xử lý cập nhật thông tin người dùng
            name="editUserForm"
            layout="vertical"
            onOk={() => {
              form2
                .validateFields()
                .then((values) => {
                  form2.resetFields();
                  handleUpdate(values);
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                });
            }}
            scrollToFirstError
          >
            <Form.Item
              name="name"
              label="Name"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please enter a name!",
                },
                { max: 100, message: "Name maximum 100 characters" },
                { min: 5, message: "Name at least 5 characters" },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Tên" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              hasFeedback
              rules={[
                {
                  type: "email",
                  message: "Invalid email!",
                },
                {
                  required: true,
                  message: "Please enter email!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="role"
              label="Role"
              hasFeedback
              rules={[
                {
                  required: !isFieldsFilled.role,
                  message: "Pick role!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Select
                placeholder="Pick role"
                onChange={() =>
                  setIsFieldsFilled({ ...isFieldsFilled, role: true })
                }
              >
                <Option value="admin">Admin</Option>
                <Option value="department">Manager</Option>
                <Option value="marketing">Coordinator</Option>
                <Option value="student">Student</Option>
                <Option value="guest">Guest</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="faculty"
              label="Faculty"
              rules={[
                {
                  required: !isFieldsFilled.faculty,
                  message: "Pick a faculty!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Select
                placeholder="Pick faculty"
                onChange={() =>
                  setIsFieldsFilled({ ...isFieldsFilled, faculty: true })
                }
              >
                {/* Render options for faculties */}
                {faculties.map((faculty) => (
                  <Option key={faculty._id} value={faculty._id}>
                    {faculty.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="academic"
              label="Academic"
              rules={[
                {
                  required: !isFieldsFilled.academic,
                  message: "Pick a Academic!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Select
                placeholder="Pick Academic"
                onChange={() =>
                  setIsFieldsFilled({ ...isFieldsFilled, academic: true })
                }
              >
                {/* Render options for faculties */}
                {academics.map((academic) => (
                  <Option key={academic._id} value={academic._id}>
                    {academic.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                style={{
                  background: "#FF8000",
                  color: "#FFFFFF",
                  float: "right",
                  marginTop: 20,
                  marginLeft: 8,
                }}
                htmlType="submit"
              >
                Done
              </Button>
              <Button
                style={{
                  background: "#FF8000",
                  color: "#FFFFFF",
                  float: "right",
                  marginTop: 20,
                }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <BackTop style={{ textAlign: "right" }} />
      </Spin>
    </div>
  );
};

export default AccountManagement;
