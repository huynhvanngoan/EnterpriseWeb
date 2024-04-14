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
useEffect(() => {
        if (shouldFetch) {
            (async () => {
                try {
                    const user = JSON.parse(localStorage.getItem("user"));
                    console.log(user._id);
                    await articleApi.getArticleByUserId(user._id).then((res) => {
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
                    (academic) => new Date(academic.finalClosureDate) >= Date.now()
                );
                setAcademics(filteredAcademics);
            } catch (error) {
                console.error("Failed to fetch academics:", error);
            }
        };
        fetchAcademics();

    const columns = [
        {
            title: "ID",
            key: "index",
            render: (text, record, index) => index + 1,
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
                <img style={{ width: "150px", height: "150px" }} src={text}></img>
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
            render: (text, record) => (
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
                                onClick={() => handleOpenDetailModal(record._id)}
                            >
                                {"Detail"}
                            </Button>
                            {!isFinalClosureBeforeNow(record.finalClosureDate) && ( // Kiểm tra nếu finalClosureDate không trước thời điểm hiện tại
                                <>
                                    <Button
                                        onClick={() => showEditModal(record._id)}
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
                                        onConfirm={() => handleDeleteArticle(record._id)}
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
            ),
        },
    ];

    useEffect(() => {
        (async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                console.log(user._id);
                await articleApi.getArticleByUserId(user._id).then((res) => {
                    console.log(res);
                    setCategory(res.data);
                    console.log(category);
                    setLoading(false);
                });
            } catch (error) {
                console.log("Failed to fetch category list:" + error);
            }
        })();
        const fetchAcademics = async () => {
            try {
                const response = await academicApi.listAcademic();
                setAcademics(response.data);
                const filteredAcademics = response.data.filter(
                    (academic) =>
                        new Date(academic.finalClosureDate) >= Date.now()
                );
                setAcademics(filteredAcademics);
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
    }, [category]);
    console.log("academic Year", academics);
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
                                                    Add Ariticle
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
                    title="Add Article"
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
                                {academics.map((academic) => (
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

export default ArticleManagerStudent;
