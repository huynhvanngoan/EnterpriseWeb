/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
import {
    DeleteOutlined,
    EditOutlined,
    CopyOutlined,
    HomeOutlined,
    PlusOutlined,
    CheckCircleOutlined,
    ShoppingOutlined,
    EyeOutlined,
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
    Image,
    Row,
    Space,
    Spin,
    Tag,
    Table,
    notification,
    DatePicker,
    Checkbox,
    Select,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import assetCategoryApi from "../../apis/academicYearApi";
import academicApi from "../../apis/academicApi";
import articleApi from "../../apis/articleApi";
import "./articleStudent.css";
import ariticle from "../../apis/articleApi";
import commentApi from "../../apis/commentApi";
import FileSaver from "file-saver";
import logApi from "../../apis/logApi";
import ModalTerms from "../../components/ModalTerms/ModalTerms";
import styled from "styled-components";
const { Option } = Select;
const ArticleManagerStudent = () => {
    const [category, setCategory] = useState([]);
    const [openModalCreate, setopenModalCreate] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [isFieldsFilled, setIsFieldsFilled] = useState({
        academic: false,
    });
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState();
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [editArticleData, setEditArticleData] = useState(null);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [academics, setAcademics] = useState([]);
    const history = useHistory();
    const [fileFormatError, setFileFormatError] = useState(false);
    const [showExample, setShowExample] = useState(false);
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [articleDetail, setArticleDetail] = useState(null);
    const [agreeTermsModalVisible, setAgreeTermsModalVisible] = useState(false);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(true);
    const [academicFinal, setAcademicFinal] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const handlePageChange = (page) => {
        setCurrentPage(page); // Cập nhật currentPage khi chuyển trang
    };
    const handleAgreeTermsChange = (e) => {
        setIsCheckboxChecked(e.target.checked);
        if (e.target.checked) {
            setAgreeTermsModalVisible(true); // Open ModalTerms when checkbox is checked
        }
    };

    const showModal = () => {
        setopenModalCreate(true);
    };

    const fetchArticleDetail = async (articleId) => {
        try {
            const response = await articleApi.getById(articleId);
            setArticleDetail(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Failed to fetch article detail:", error);
        }
    };

    const handleOpenDetailModal = async (articleId) => {
        await fetchArticleDetail(articleId);
        setCommentModalVisible(true);
    };

    const handleSendComment = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const values = await form.validateFields();
            const comment = {
                userId: user._id,
                articleId: articleDetail._id,
                description: values.comment,
            };
            const submitDate = moment(articleDetail.submitDate);
            const currentDate = moment();
            const daysDiff = currentDate.diff(submitDate, "days");
            if (daysDiff > 14) {
                // Nếu khoảng cách lớn hơn 14 ngày, không gửi request và thông báo cho người dùng
                notification.warning({
                    message: "Notification",
                    description:
                        "Cannot send comment for articles submitted more than 14 days ago.",
                });
                setLoading(false);
                return;
            }
            const response = await commentApi.create(comment);
            if (response) {
                notification.success({
                    message: "Notification",
                    description: "Comment sent successfully",
                });
                form.resetFields();
                setArticleDetail(null);
            }
        } catch (error) {
            console.error("Failed to send comment:", error);
            notification.error({
                message: "Error",
                description: "Failed to send comment",
            });
        }
        setLoading(false);
    };

    const formatDate = (submitDate) => {
        const date = new Date(submitDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDate = `${day < 10 ? "0" + day : day}/${
            month < 10 ? "0" + month : month
        }/${year}`;
        return formattedDate;
    };

    const handleDownloadArticle = async (articleId) => {
        try {
            window.open(
                `http://localhost:8080/api/article/downloadbyid/${articleId}`
            );
        } catch (error) {
            console.error("Failed to download article:", error);
            notification.error({
                message: "Error",
                description: "Failed to download article",
            });
        }
    };

    const showEditModal = (id) => {
        setOpenModalEdit(true);
        (async () => {
            try {
                const response = await articleApi.getById(id);
                setId(id);
                form2.setFieldsValue({
                    title: response.data.title,
                    content: response.data.content,
                });
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    };

    const handleEditOk = async (values) => {
        // Kiểm tra xem file có hợp lệ không
        if (file && fileFormatError) {
            notification.error({
                message: "Error",
                description: "Please select a valid file format.",
            });
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            // Cập nhật tệp tin tài liệu
            let filePath;
            if (file && !fileFormatError) {
                const formData = new FormData();
                formData.append("file", file);
                const fileResponse = await fetch(
                    "http://localhost:8080/api/file/upload",
                    {
                        method: "POST",
                        body: formData,
                    }
                );
                const fileData = await fileResponse.json();
                filePath = fileData.file.path;
                notification.success({
                    message: "Notification",
                    description: "Document file updated successfully",
                });
            }

            // Cập nhật hình ảnh
            let imagePath;
            if (image && !fileFormatError) {
                const formData2 = new FormData();
                formData2.append("file", image);
                const fileResponse2 = await fetch(
                    "http://localhost:8080/api/file/upload",
                    {
                        method: "POST",
                        body: formData2,
                    }
                );
                const imageData = await fileResponse2.json();
                imagePath = `http://localhost:8080/${imageData.file.path}`;
                notification.success({
                    message: "Notification",
                    description: "Image file updated successfully",
                });
            }

            // Cập nhật cả tệp tin tài liệu và hình ảnh
            const updatedArticle = {
                ...editArticleData,
                title: values.title,
                content: values.content,
                file: filePath,
                image: imagePath,
            };
            await articleApi.updateArticle(updatedArticle, id);

            // Hiển thị thông báo thành công
            notification.success({
                message: "Notification",
                description: "Article updated successfully",
            });
            setOpenModalEdit(false);
            setShouldFetch(true);
        } catch (error) {
            console.error("Failed to update article:", error);
            notification.error({
                message: "Error",
                description: "Failed to update article",
            });
        } finally {
            setLoading(false);
        }
    };
    const handleOkUser = async (values) => {
        if (!isCheckboxChecked) {
            notification.error({
                message: "Error",
                description: "Please agree to the terms and conditions.",
            });
            return;
        }
        if (file && fileFormatError) {
            notification.error({
                message: "Error",
                description: "Please select a valid file format.",
            });
            setIsCheckboxChecked(false);
            return;
        }
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const formData = new FormData();
            formData.append("file", file);
            const fileResponse = await fetch(
                "http://localhost:8080/api/file/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );
            const fileData = await fileResponse.json();

            if (fileData && fileData.file && fileData.file.path) {
                const filePath = fileData.file.path;

                const formData2 = new FormData();
                formData2.append("file", image);
                const fileResponse2 = await fetch(
                    "http://localhost:8080/api/file/upload",
                    {
                        method: "POST",
                        body: formData2,
                    }
                );
                const imageData = await fileResponse2.json();

                if (imageData && imageData.file && imageData.file.path) {
                    const imagePath =
                        `http://localhost:8080/` + imageData.file.path;
                    const article = {
                        title: values.title,
                        content: values.content,
                        userId: user._id,
                        academicyearId: values.academic,
                        image: imagePath,
                        file: filePath,
                    };

                    await articleApi.createArticle(article).then((response) => {
                        if (response === undefined) {
                            notification["error"]({
                                message: `Notification`,
                                description: "Create Academic failure",
                            });
                            form.validateFields
                        } else {
                            notification["success"]({
                                message: `Notification`,
                                description: "Article submit successful",
                            });
                            setFile(null);
                            setImage(null);
                            setopenModalCreate(false);
                            setShouldFetch(true);
                            setIsCheckboxChecked(false);
                        }
                    });
                } else {
                    notification["error"]({
                        message: "Error",
                        description: "Failed to upload image",
                    });
                    setIsCheckboxChecked(false);
                }
            } else {
                notification["error"]({
                    message: "Error",
                    description: "Failed to upload file",
                });
                setIsCheckboxChecked(false);
            }
        } catch (error) {
            console.error("Failed to create article:", error);
            notification.error({
                message: "Error",
                description: "Failed to create article",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (type) => {
        if (type === "create") {
            setopenModalCreate(false);
        } else {
            setOpenModalEdit(false);
        }
        console.log("Clicked cancel button");
    };

    const handleCategoryList = async () => {
        setShouldFetch(true);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            await articleApi.getArticleByUserId(user._id).then((res) => {
                setCategory(res.data);
                setLoading(false);
            });
        } catch (error) {
            console.log("Failed to fetch event list:" + error);
        }
    };

    const handleDeleteArticle = async (id) => {
        setLoading(true);
        try {
            await articleApi.deleteArticle(id).then((response) => {
                if (
                    response.message ===
                    "Cannot delete the asset because it is referenced in another process or event."
                ) {
                    notification["error"]({
                        message: `Notifation`,
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
                    setShouldFetch(true);
                    setLoading(false);
                }
            });
        } catch (error) {
            console.log("Failed to fetch event list:" + error);
        }
    };

    const handleFilter = async (name) => {
        try {
            const res = await articleApi.searchArticle(name);
            setCategory(res.data);
        } catch (error) {
            console.log("search to fetch category list:" + error);
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            let validFormats = [];
            if (type === "image") {
                validFormats = ["image/jpeg", "image/png"];
            } else if (type === "file") {
                validFormats = [
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ];
            }

            if (validFormats.includes(file.type)) {
                setFileFormatError(false);
                if (type === "image") {
                    setImage(file);
                } else if (type === "file") {
                    setFile(file);
                }
            } else {
                setFileFormatError(true);
                notification.error({
                    message: "Error",
                    description:
                        type === "image"
                            ? "Please select a valid image file (.jpg, .png)."
                            : "Please select a .doc file.",
                });
            }
        }
    };
    console.log("check Academic Year", academics);
    const columns = [
        {
            title: "ID",
            key: "index",
            render: (text, record, index) =>
                (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Images",
            dataIndex: "image",
            key: "image",
            render: (text) => (
                <img
                    style={{ width: "150px", height: "150px" }}
                    src={text}
                ></img>
            ),
        },
        {
            title: "Content",
            dataIndex: "content",
            key: "content",
        },
        {
            title: "Submit Date",
            key: "closureDate",
            dataIndex: "submitDate",
            render: (text) => moment(text).format("YYYY-MM-DD"),
        },
        {
            title: "Comment",
            dataIndex: "comments",
            key: "comments",
            render: (text) => text,
        },
        {
            title: "Is Public",
            key: "isPublic",
            dataIndex: "isPublic",
            render: (text) => (
                <Space size="middle">
                    {text === true ? (
                        <Tag
                            color="green"
                            key={text}
                            style={{ width: 100, textAlign: "center" }}
                            icon={<CopyOutlined />}
                        >
                            Public
                        </Tag>
                    ) : (
                        <Tag
                            color="blue"
                            key={text}
                            style={{ width: 100, textAlign: "center" }}
                            icon={<CopyOutlined />}
                        >
                            Private
                        </Tag>
                    )}
                </Space>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => {
                const currentAcademic = academics.find(
                    (academic) => academic._id === record.academicyearId
                );
                const isFinalClosureDatePassed =
                    currentAcademic &&
                    new Date(currentAcademic.finalClosureDate) < Date.now();
                return (
                    <div>
                        <Row>
                            <div style={{ marginLeft: 10 }}>
                                <Button
                                    size="small"
                                    icon={<EyeOutlined />}
                                    style={{
                                        width: 150,
                                        borderRadius: 15,
                                        height: 30,
                                        marginBottom: 15,
                                    }}
                                    onClick={() =>
                                        handleOpenDetailModal(record._id)
                                    }
                                >
                                    {"Detail"}
                                </Button>

                                {!isFinalClosureDatePassed && (
                                    <>
                                        <Button
                                            onClick={() =>
                                                showEditModal(record._id)
                                            }
                                            icon={<EditOutlined />}
                                            style={{
                                                width: 150,
                                                borderRadius: 15,
                                                height: 30,
                                                marginBottom: 15,
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Popconfirm
                                            title="Are you sure to delete this article?"
                                            onConfirm={() =>
                                                handleDeleteArticle(record._id)
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
                                    </>
                                )}
                            </div>
                        </Row>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        if (shouldFetch) {
            (async () => {
                try {
                    const user = JSON.parse(localStorage.getItem("user"));
                    console.log(user._id);
                    await articleApi
                        .getArticleByUserId(user._id)
                        .then((res) => {
                            console.log(res);
                            setCategory(res.data);
                            console.log(category);
                            setLoading(false);
                        });
                } catch (error) {
                    console.log("Failed to fetch category list:" + error);
                }
            })();
            setShouldFetch(false);
        }

        const fetchAcademics = async () => {
            try {
                const response = await academicApi.listAcademic();
                setAcademics(response.data);
                const filteredAcademics = response.data.filter(
                    (academic) =>
                        new Date(academic.finalClosureDate) >= Date.now()
                );
                setAcademicFinal(filteredAcademics);
            } catch (error) {
                console.error("Failed to fetch academics:", error);
            }
        };

        fetchAcademics();
        const userAgent = navigator.userAgent;
        const logData = async () => {
            try {
                const isEdge = /Edg\//.test(userAgent); // Check for Edge (version 79 or later)
                const isChrome = /Chrome/.test(userAgent);
                const isFirefox = /Firefox/.test(userAgent);
                const isSafari = /Safari/.test(userAgent) && !isChrome; // Exclude Chrome-based Safari
                const isOpera = /Opera/.test(userAgent);
                let brower_user;
                if (isEdge) {
                    brower_user = "Microsoft Edge";
                } else if (isChrome) {
                    brower_user = "Chrome";
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
            } catch (error) {
                console.error(error);
            }
        };
        logData();
    }, [category, shouldFetch]);
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
                                <span>Article Student</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader subTitle="" style={{ fontSize: 14 }}>
                                <Row>
                                    <Col
                                        span="12"
                                        style={{ alignItems: "center" }}
                                    >
                                        <Space>
                                            <Button
                                                onClick={showModal}
                                                icon={<PlusOutlined />}
                                                style={{ marginLeft: 10 }}
                                            >
                                                Add Ariticle
                                            </Button>
                                        </Space>
                                    </Col>
                                </Row>
                            </PageHeader>
                        </div>
                    </div>
                    <div style={{ marginTop: 30 }}>
                        <StyledTable
                            columns={columns}
                            pagination={{
                                position: ["bottomCenter"],
                                onChange: handlePageChange,
                            }}
                            dataSource={category}
                        />
                    </div>
                </div>
                <Modal
                    title="Add Article"
                    visible={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form.validateFields()
                            .then((values) => {
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
                            name="title"
                            label="Title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a Title!",
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Title" />
                        </Form.Item>
                        <Form.Item
                            name="content"
                            label="Content"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a Content!",
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Content" />
                        </Form.Item>
                        <Form.Item
                            name="file"
                            label="File"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a Content!",
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input
                                type="file"
                                placeholder="File"
                                onChange={(e) => handleFileChange(e, "file")}
                            />
                        </Form.Item>
                        <Form.Item
                            name="image"
                            label="Image"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a Content!",
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input
                                type="file"
                                placeholder="Image"
                                onChange={(e) => handleFileChange(e, "image")}
                            />
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
                                    setIsFieldsFilled({
                                        ...isFieldsFilled,
                                        academic: true,
                                    })
                                }
                            >
                                {/* Render options for faculties */}
                                {academicFinal.map((academic) => (
                                    <Option
                                        key={academic._id}
                                        value={academic._id}
                                    >
                                        {academic.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 10 }}>
                            <Checkbox
                                checked={isCheckboxChecked}
                                onChange={handleAgreeTermsChange}
                            >
                                I agree to the terms and conditions
                            </Checkbox>
                        </Form.Item>

                        <ModalTerms
                            visible={agreeTermsModalVisible}
                            onOk={() => {
                                setAgreeTermsModalVisible(false);
                                setIsCheckboxChecked(true); // Checkbox is checked when ModalTerms OK button is clicked
                            }}
                            onCancel={() => {
                                setAgreeTermsModalVisible(false);
                                setIsCheckboxChecked(false);
                            }}
                        />
                    </Form>
                </Modal>
                <Modal
                    title="Edit Article"
                    visible={openModalEdit} // Sử dụng openModalEdit để điều khiển việc hiển thị
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleEditOk(values);
                            })
                            .catch((info) => {
                                console.log("Validate Failed:", info);
                            });
                    }}
                    onCancel={() => handleCancel("edit")}
                    okText="Done"
                    cancelText="Cancel"
                    width={600}
                >
                    {/* Form để chỉnh sửa thông tin bài viết */}
                    <Form
                        form={form2}
                        name="articleEdit"
                        layout="vertical"
                        initialValues={editArticleData}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a Title!",
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Title" />
                        </Form.Item>
                        <Form.Item
                            name="content"
                            label="Content"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a Content!",
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Content" />
                        </Form.Item>
                        <Form.Item
                            name="file"
                            label="File"
                            rules={[
                                {
                                    required: false,
                                    message: "Please select a File!",
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input
                                type="file"
                                placeholder="File"
                                onChange={(e) => handleFileChange(e, "file")}
                            />
                        </Form.Item>
                        <Form.Item
                            name="image"
                            label="Image"
                            rules={[
                                {
                                    required: false,
                                    message: "Please select an Image!",
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input
                                type="file"
                                placeholder="Image"
                                onChange={(e) => handleFileChange(e, "image")}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    bodyStyle={{
                        overflowY: "auto",
                        overflowX: "hidden",
                        maxHeight: "calc(100vh - 300px)",
                    }}
                    title="View Detail Article"
                    visible={!!articleDetail}
                    onCancel={() => setArticleDetail(null)}
                    footer={[]}
                >
                    {articleDetail && (
                        <div>
                            <h3>Title: {articleDetail.title}</h3>
                            <h3>Content: {articleDetail.content}</h3>
                            <h3>Author: {articleDetail.userId.name}</h3>
                            <h3>
                                Submited date:{" "}
                                {formatDate(articleDetail.submitDate)}
                            </h3>
                            <h3>Image:</h3>
                            <Image src={articleDetail.image} />
                            <Button
                                key="download"
                                onClick={() =>
                                    handleDownloadArticle(articleDetail._id)
                                }
                            >
                                Download
                            </Button>
                            <h3>Comments:</h3>
                            <div>
                                {articleDetail.comments &&
                                    articleDetail.comments.map(
                                        (comment, index) => (
                                            <div key={index}>
                                                <p>
                                                    <strong>
                                                        {comment.userName} (
                                                        {moment(
                                                            comment.date
                                                        ).format(
                                                            "YYYY-MM-DD HH:mm:ss"
                                                        )}
                                                        ):
                                                    </strong>{" "}
                                                    {comment.description}
                                                </p>
                                            </div>
                                        )
                                    )}
                            </div>
                            <Form
                                form={form}
                                name="commentForm"
                                // name="eventCreate"
                                layout="vertical"
                                initialValues={{
                                    residence: ["zhejiang", "hangzhou", "xihu"],
                                    prefix: "86",
                                }}
                                scrollToFirstError
                            >
                                <Row gutter={16}>
                                    <Col span={18}>
                                        <Form.Item
                                            name="comment"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter a name!",
                                                },
                                            ]}
                                            style={{
                                                marginBottom: 10,
                                                display: "inline-block",
                                                width: "calc(100% - 100px)",
                                            }}
                                        >
                                            <Input placeholder="Enter comment this" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <input
                                            type="hidden"
                                            name="articleId"
                                            value={articleDetail._id}
                                        />
                                        <Button onClick={handleSendComment}>
                                            Send
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    )}
                </Modal>
                <BackTop style={{ textAlign: "right" }} />
            </Spin>
        </div>
    );
};
// Thêm vào cuối file
const StyledTable = styled(Table)`
    @media (max-width: 1200px) {
        .ant-table-thead > tr > th,
        .ant-table-tbody > tr > td {
            padding: 8px;
            font-size: 14px;
        }
    }

    @media (max-width: 992px) {
        .ant-table-thead > tr > th,
        .ant-table-tbody > tr > td {
            padding: 6px;
            font-size: 12px;
        }
    }

    @media (max-width: 768px) {
        .ant-table-thead > tr > th,
        .ant-table-tbody > tr > td {
            padding: 4px;
            font-size: 10px;
        }

        .ant-table-cell-ellipsis {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    @media (max-width: 576px) {
        .ant-table-thead > tr > th,
        .ant-table-tbody > tr > td {
            padding: 2px;
            font-size: 8px;
        }

        .ant-table-cell-ellipsis {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
`;
export default ArticleManagerStudent;
