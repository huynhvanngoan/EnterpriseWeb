import {
  FormOutlined,
  HomeOutlined,
  PhoneOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Card,
  Col,
  Divider,
  Row,
  Spin,
  notification,
  Form,
  Input,
  Button,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import ReactWeather, { useOpenWeather } from "react-open-weather";
import { useHistory } from "react-router-dom";
import userApi from "../../apis/userApi";
import "./profile.css";
import uploadFileApi from "../../apis/uploadFileApi";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [isVisibleModal, setVisibleModal] = useState(false);
  const [file, setUploadFile] = useState();
  const [image, setFile] = useState(null);
  const { data, isLoading, errorMessage } = useOpenWeather({
    key: "03b81b9c18944e6495d890b189357388",
    lat: "16.060094749570567",
    lon: "108.2097695823264",
    lang: "en",
    unit: "metric",
  });
  const handleList = () => {
    (async () => {
      try {
        const response = await userApi.getProfile();
        console.log(response);
        setUserData(response);
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch profile user:" + error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      handleList();
    })();
    window.scrollTo(0, 0);
  }, []);

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      const fileResponse = await fetch(
        "http://localhost:8080/api/file/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const fileData = await fileResponse.json();
      const filePath = fileData.file.path;
      const formatData = {
        email: values.email,
        phone: values.phone,
        name: values.name,
        image: filePath,
      };
      console.log(userData);
      await userApi.update(formatData, userData.id).then((response) => {
        console.log(response);
        if (response === "" || response === undefined) {
          notification.error({
            message: "Notification",
            description: "Update fail",
          });
        } else {
          notification.success({
            message: "Notification",
            description: "Update success",
          });
          setVisibleModal(false);
        }
      });
      handleList();
    } catch (error) {
      throw error;
    }
  };

  const handleChangeImage = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "image") {
        setFile(file);
      }
    }
  };

  return (
    <div>
      <Spin spinning={loading}>
        <div style={{ marginTop: 20, marginLeft: 24 }}>
          <Breadcrumb>
            <Breadcrumb.Item href="">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">
              <FormOutlined />
              <span>Profile</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div>
          <div>
            <Row justify="center">
              <Col
                span="9"
                style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}
              >
                <Card
                  hoverable={true}
                  className="profile-card"
                  style={{ padding: 0, margin: 0 }}
                >
                  <Row justify="center">
                    <img
                      src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
                      style={{
                        width: 150,
                        height: 150,
                        borderRadius: "50%",
                      }}
                    />
                  </Row>
                  <Row justify="center">
                    <Col span="24">
                      <Row justify="center">
                        <strong style={{ fontSize: 18 }}>
                          {userData?.name}
                        </strong>
                      </Row>
                      <Row justify="center">
                        <p style={{ padding: 0, margin: 0, marginBottom: 5 }}>
                          {userData?.email}
                        </p>
                      </Row>
                      <Row justify="center">
                        <p style={{ padding: 0, margin: 0, marginBottom: 0 }}>
                          {userData?.birthday}
                        </p>
                      </Row>
                      <Row justify="center">
                        <p style={{ padding: 0, margin: 0, marginBottom: 5 }}>
                          {userData?.phone}
                        </p>
                      </Row>
                      <Divider style={{ padding: 0, margin: 0 }}></Divider>
                    </Col>
                    <Button
                      type="primary"
                      style={{ marginTop: 15 }}
                      onClick={() => setVisibleModal(true)}
                    >
                      Update Profile
                    </Button>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        <div>
          <Modal
            title="Update Profile"
            visible={isVisibleModal}
            onCancel={() => setVisibleModal(false)}
            footer={null}
          >
            <Form
              initialValues={{
                name: userData?.name,
                email: userData?.email,
                phone: userData?.phone,
              }}
              onFinish={handleFormSubmit}
            >
              <Spin spinning={loading}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter username!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập email!",
                    },
                    {
                      type: "email",
                      message: "Email không hợp lệ!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="image" label="Image">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleChangeImage(e, "image")}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                </Form.Item>
              </Spin>
            </Form>
          </Modal>
        </div>
      </Spin>
    </div>
  );
};

export default Profile;
