/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
  PlusOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";
import {
  BackTop,
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import assetCategoryApi from "../../../apis/academicYearApi";
import facultyApi from "../../../apis/facultyApi";
import userApi from "../../../apis/userApi";
import logApi from "../../../apis/logApi";
import "./facultyManager.css";
const { Option } = Select;
const FacultyManager = () => {
  const [category, setCategory] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [id, setId] = useState();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchMarketingUsers = async () => {
      try {
        const response = await userApi.getByRole("marketing");
        setUsers(response.data); // Cập nhật danh sách người dùng marketing vào state
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch marketing users:", error);
      }
    };

    fetchMarketingUsers();
  }, []);
  const showModal = () => {
    setOpenModalCreate(true);
  };

  const handleOkUser = async (values) => {
    setLoading(true);
    try {
      const academic = {
        name: values.name,
        marketingCoordinator: values.marketingCoordinator,
      };
      return facultyApi.createFaculty(academic).then((response) => {
        if (response.error === "Name already exists.") {
          setLoading(false);
          return notification["error"]({
            message: `Notification`,
            description: "Academic already exists .",
          });
        }

        if (response === undefined) {
          notification["error"]({
            message: `Notification`,
            description: "Create Academic failure",
          });
        } else {
          notification["success"]({
            message: `Notification`,
            description: "Create successful Academic",
          });
          setOpenModalCreate(false);
          handleCategoryList();
        }
      });
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateCategory = async (values) => {
    setLoading(true);
    try {
      const categoryList = {
        name: values.name,
        marketingCoordinator: values.marketingCoordinator,
      };
      return facultyApi.updateFaculty(categoryList, id).then((response) => {
        if (response === undefined) {
          notification["error"]({
            message: `Notification`,
            description: "Update Fail",
          });
        } else {
          notification["success"]({
            message: `Notification`,
            description: "Update success",
          });
          handleCategoryList();
          setOpenModalUpdate(false);
        }
      });
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = (type) => {
    if (type === "create") {
      setOpenModalCreate(false);
    } else {
      setOpenModalUpdate(false);
    }
    console.log("Clicked cancel button");
  };

  const handleCategoryList = async () => {
    try {
      await facultyApi.listFaculty().then((res) => {
        setCategory(res.data);
        setLoading(false);
      });
    } catch (error) {
      console.log("Failed to fetch event list:" + error);
    }
  };

  const handleDeleteFaculty = async (id) => {
    setLoading(true);
    try {
      await facultyApi.deleteFaculty(id).then((response) => {
        if (
          response.message ===
          "Cannot delete the asset because it is referenced in another process or event."
        ) {
          notification["error"]({
            message: `Notification`,
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
          handleCategoryList();
          setLoading(false);
        }
      });
    } catch (error) {
      console.log("Failed to fetch event list:" + error);
    }
  };

  const handleEditCategory = (id) => {
    setOpenModalUpdate(true);
    (async () => {
      try {
        const response = await facultyApi.getById(id);
        setId(id);
        form2.setFieldsValue({
          name: response.data.name,
          marketingCoordinator: response.data.marketingCoordinator,
        });
        console.log(form2);
        setLoading(false);
      } catch (error) {
        throw error;
      }
    })();
  };

  const handleFilter = async (name) => {
    try {
      const res = await assetCategoryApi.searchAssetCategory(name);
      setCategory(res.data);
    } catch (error) {
      console.log("search to fetch category list:" + error);
    }
  };

  const columns = [
    {
      title: "ID",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Marketing Coordinator",
      key: "marketingCoordinatorName",
      dataIndex: "marketingCoordinatorName",
      render: (text) => text,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Row>
            <Button
              size="small"
              icon={<EditOutlined />}
              style={{ width: 150, borderRadius: 15, height: 30 }}
              onClick={() => handleEditCategory(record._id)}
            >
              {"Edit"}
            </Button>
            <div style={{ marginLeft: 10 }}>
              <Popconfirm
                title="Are you sure to delete this faculty?"
                onConfirm={() => handleDeleteFaculty(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  style={{ width: 150, borderRadius: 15, height: 30 }}
                >
                  {"Delete"}
                </Button>
              </Popconfirm>
            </div>
          </Row>
        </div>
      ),
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        await facultyApi.listFaculty().then((res) => {
          console.log(res);
          setCategory(res.data);
          setLoading(false);
        });
      } catch (error) {
        console.log("Failed to fetch category list:" + error);
      }
    })();
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
        <div className="container">
          <div style={{ marginTop: 20 }}>
            <Breadcrumb>
              <Breadcrumb.Item href="">
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item href="">
                <ShoppingOutlined />
                <span>Faculty Manager</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div style={{ marginTop: 20 }}>
            <div id="my__event_container__list">
              <PageHeader subTitle="" style={{ fontSize: 14 }}>
                <Row>
                  <Col span="18">
                    <Input
                      placeholder="Search by name"
                      allowClear
                      onChange={handleFilter}
                      style={{ width: 300 }}
                    />
                  </Col>
                  <Col span="6">
                    <Row justify="end">
                      <Space>
                        <Button
                          onClick={showModal}
                          icon={<PlusOutlined />}
                          style={{ marginLeft: 10 }}
                        >
                          Add Faculty
                        </Button>
                      </Space>
                    </Row>
                  </Col>
                </Row>
              </PageHeader>
            </div>
          </div>

          <div style={{ marginTop: 30 }}>
            <Table
              columns={columns}
              pagination={{ position: ["bottomCenter"] }}
              dataSource={category}
            />
          </div>
        </div>

        <Modal
          title="Add Faculty"
          visible={openModalCreate}
          style={{ top: 100 }}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                handleOkUser(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          onCancel={() => handleCancel("create")}
          okText="Done"
          cancelText="Cancel"
          width={600}
        >
          <Form
            form={form}
            name="eventCreate"
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
              rules={[
                {
                  required: true,
                  message: "Please enter a name!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="marketingCoordinator"
              label="Marketing Coordinator"
              rules={[
                {
                  required: true,
                  message: "Please select a marketing coordinator!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Select placeholder="Select marketing coordinator">
                {users.map((user) => (
                  <Option key={user._id} value={user._id}>
                    {user.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Edit Faculty"
          visible={openModalUpdate}
          style={{ top: 100 }}
          onOk={() => {
            form2
              .validateFields()
              .then((values) => {
                form2.resetFields();
                handleUpdateCategory(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          onCancel={handleCancel}
          okText="Done"
          cancelText="Cancel"
          width={600}
        >
          <Form
            form={form2}
            name="facultyUpdate"
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
              rules={[
                {
                  required: true,
                  message: "Please enter a name!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="marketingCoordinator"
              label="Marketing Coordinator"
              rules={[
                {
                  required: true,
                  message: "Please select a marketing coordinator!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Select
                placeholder="Select marketing coordinator"
                defaultValue={form2.getFieldValue("marketingCoordinator")}
              >
                {users.map((user) => (
                  <Option key={user._id} value={user._id}>
                    {user.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <BackTop style={{ textAlign: "right" }} />
      </Spin>
    </div>
  );
};

export default FacultyManager;
