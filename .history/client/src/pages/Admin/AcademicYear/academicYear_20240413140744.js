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
    Space,
    Spin,
    Table,
    notification,
    DatePicker,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import academicApi from "../../../apis/academicApi";

import "./academicYear.css";
import logApi from "../../../apis/logApi";
const AcademicYear = () => {
    const [category, setCategory] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();

    // const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const { name, closureDate, finalClosureDate } = values;
            // Kiểm tra xem finalClosureDate có sau closureDate không
            if (finalClosureDate.isAfter(closureDate)) {
                const academic = {
                    name,
                    closureDate: closureDate.format("YYYY-MM-DD"),
                    finalClosureDate: finalClosureDate.format("YYYY-MM-DD"),
                };
                return academicApi.createAcademic(academic).then((response) => {
                    if (response.error === "Name is available.") {
                        setLoading(false);
                        return notification["error"]({
                            message: `Notification`,
                            description: "Academic already exists.",
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
                        handleAcademicList();
                    }
                });
            } else {
                setLoading(false);
                notification["error"]({
                    message: `Notification`,
                    description:
                        "Final Closure Date must be after Closure Date.",
                });
            }
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };
    

    const handleUpdateAcademic = async (values) => {
        setLoading(true);
        try {
            const { name, closureDate, finalClosureDate } = values;
           
            if (finalClosureDate.isAfter(closureDate)) {
                const academic = {
                    name,
                    closureDate: closureDate.format("YYYY-MM-DD"),
                    finalClosureDate: finalClosureDate.format("YYYY-MM-DD"),
                };
                return academicApi.updateAcademy(academic).then((response) => {
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
                        handleAcademicList();
                        setOpenModalUpdate(false);
                    }
                });
            } else {
                setLoading(false);
                notification["error"]({
                    message: `Notification`,
                    description:
                        "Final Closure Date must be after Closure Date.",
                });
            }
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

    const handleAcademicList = async () => {
        try {
            await academicApi.listAcademic().then((res) => {
                setCategory(res.data);
                setLoading(false);
            });
        } catch (error) {
            console.log("Failed to fetch event list:" + error);
        }
    };

    const handleDeleteAcademic = async (id) => {
        setLoading(true);
        try {
            await academicApi.deleteAcademic(id).then((response) => {
                if (
                    response.message ===
                    "Cannot delete the asset because it is referenced in another process or event."
                ) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            "Không thể xóa vì nó đã được sử dụng trong một sự kiện hoặc quá trình khác.",
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
                    handleAcademicList();
                    setLoading(false);
                }
            });
        } catch (error) {
            console.log("Failed to fetch event list:" + error);
        }
    };

    const handleEditAcademic = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await academicApi.getById(id);
                setId(id);
                form2.setFieldsValue({
                    name: response.data.name,
                    closureDate: moment(response.data.closureDate),
                    finalClosureDate: moment(response.data.finalClosureDate),
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
            const res = await academicApi.searchAssetCategory(name);
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
            title: "Closure Date",
            key: "closureDate",
            dataIndex: "closureDate",
            render: (text) => moment(text).format("YYYY-MM-DD"),
        },
        {
            title: "Final Closure Date",
            key: "finalClosureDate",
            dataIndex: "finalClosureDate",
            render: (text) => moment(text).format("YYYY-MM-DD"),
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
                            onClick={() => handleEditAcademic(record._id)}
                        >
                            {"Edit"}
                        </Button>
                        <div style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Are you sure to delete this academic?"
                                onConfirm={() =>
                                    handleDeleteAcademic(record._id)
                                }
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{
                                        width: 150,
                                        borderRadius: 15,
                                        height: 30,
                                    }}
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
                await academicApi.listAcademic().then((res) => {
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
                    url: window.location.href.replace(
                        "http://localhost:3000/",
                        ""
                    ),
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
                                <span>Academic Year</span>
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
                                                    Add Academic Year
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
                    title="Add Academic Year"
                    visible={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form.validateFields()
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
                            name="closureDate"
                            label="Closure Date"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please select the final closure date!",
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker
                                showTime
                                placeholder="Select date and time"
                                format="YYYY-MM-DD"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="finalClosureDate"
                            label="Final Closure Date"
                            rules={[
                                {
                                    required: true,
                                    message: "Select date and time",
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker
                                showTime
                                placeholder="Select date and time"
                                format="YYYY-MM-DD"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Edit Academic Year"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateAcademic(values);
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
                                    message:
                                        "Please input the academic year name!",
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Name" />
                        </Form.Item>
                        <Form.Item
                            name="closureDate"
                            label="Closure Date"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select the closure date!",
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker
                                showTime
                                placeholder="Select closure date"
                                format="YYYY-MM-DD"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="finalClosureDate"
                            label="Final Closure Date"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please select the final closure date!",
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker
                                showTime
                                placeholder="Select final closure date"
                                format="YYYY-MM-DD"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: "right" }} />
            </Spin>
        </div>
    );
};

export default AcademicYear;
