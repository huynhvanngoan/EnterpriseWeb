/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  DeleteOutlined,
  EditOutlined,
  CopyOutlined,
  HomeOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ShoppingOutlined,
  DownloadOutlined,
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
  Row,
  Space,
  Spin,
  Tag,
  Table,
  notification,
  Image,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import assetCategoryApi from "../../../apis/academicYearApi";
import academicApi from "../../../apis/academicApi";
import articleApi from "../../../apis/articleApi";
import commentApi from "../../../apis/commentApi";
import logApi from "../../../apis/logApi";
import "./ariticleManager.css";
import FileSaver from "file-saver";
import { Chrome } from "react-feather";
import { browserLocalPersistence } from "firebase/auth";

const ArticleManager = () => {
    const [category, setCategory] = useState([]);
    const [openModalComment, setOpenModalComment] = useState(false);
    const [commentArticleId, setCommentArticleId] = useState(null);
    const [selectedArticleId, setSelectedArticleId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [articleDetail, setArticleDetail] = useState(null);
    const [commentContent, setCommentContent] = useState("");
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const history = useHistory();

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
    const handleCommentChange = (e) => {
        setCommentContent(e.target.value);
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
    const handleCloseCommentModal = () => {
        setCommentModalVisible(false);
    };
    const showModal = (articleId) => {
        setCommentArticleId(articleId);
        setOpenModalComment(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem("user"));

            console.log(user);
            const comment = {
                userId: user._id,
                articleId: commentArticleId,
                description: values.comment,
            };
            return commentApi.create(comment).then((response) => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Notification`,
                        description: "Create Academic failure",
                    });
                } else {
                    notification["success"]({
                        message: `Notification`,
                        description: "Comment successful",
                    });
                    setOpenModalComment(false);
                    handleCategoryList();
                }
            });
        } catch (error) {
            throw error;
        }
    };

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalComment(false);
        } else {
            setOpenModalComment(false);
        }
        console.log("Clicked cancel button");
    };

    const handleCategoryList = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.role === "marketing") {
            // Call the API to get articles by faculty ID
            articleApi
                .getArticleByFaculty(user.facultyId)
                .then((res) => {
                    setCategory(res.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log("Failed to fetch articles:", error);
                    setLoading(false);
                });
        } else if (user && user.role === "department") {
            // Call the API to get all articles
            articleApi
                .getArticleApproved()
                .then((res) => {
                    setCategory(res.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log("Failed to fetch articles:", error);
                    setLoading(false);
                });
        }
    };

    const handleDeleteAcademic = async (id) => {
        setLoading(true);
        try {
            await articleApi.deleteArticle(id).then((response) => {
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
                    handleCategoryList();
                    setLoading(false);
                }
            });
        } catch (error) {
            console.log("Failed to fetch event list:" + error);
        }
    };

    const handleFilter = async (name) => {
        try {
            const res = await assetCategoryApi.searchAssetCategory(name);
            setCategory(res.data);
        } catch (error) {
            console.log("search to fetch category list:" + error);
        }
    };
    const handleRowClick = (record) => {
        setSelectedArticleId(record._id);
    };
    const handleMakePublic = async (id) => {
        try {
            await articleApi.updateArticle({ isPublic: true }, id);
            notification.success({
                message: "Notification",
                description: "Article is now public",
            });
            handleCategoryList(); // Cập nhật danh sách bài viết sau khi cập nhật trạng thái
        } catch (error) {
            console.log("Failed to make article public:", error);
            notification.error({
                message: "Notification",
                description: "Failed to make article public",
            });
        }
    };
    const isDepartment = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user && user.role === "department";
    };
    const isMarketing = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user && user.role === "marketing";
    };
    const isMarketingOrStudent = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user && (user.role === "student" || user.role === "marketing");
    };
    const handleApproveOrReject = async (id, status) => {
        try {
            const response = await articleApi.updateArticle({ status }, id);
            if (response) {
                notification.success({
                    message: "Notification",
                    description: "Article status updated successfully",
                });
                handleCategoryList(); // Cập nhật danh sách bài viết sau khi cập nhật trạng thái
            } else {
                notification.error({
                    message: "Notification",
                    description: "Failed to update article status",
                });
            }
        } catch (error) {
            console.log("Failed to update article status:", error);
            notification.error({
                message: "Notification",
                description: "Failed to update article status",
            });
        }
    };
    const handleDownloadAll = async () => {
        try {
            window.open(`http://localhost:8080/api/article/download/all`);
        } catch (error) {
            console.error("Failed to download all articles:", error);
            notification.error({
                message: "Error",
                description: "Failed to download all articles",
            });
        }
    };

    // Function to handle downloading a single article
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
    const formatDate = (submitDate) => {
        // Chuyển đổi submitDate thành đối tượng Date
        const date = new Date(submitDate);

        // Lấy ngày, tháng, năm từ đối tượng Date
        const day = date.getDate();
        const month = date.getMonth() + 1; // Lưu ý: tháng trong JavaScript bắt đầu từ 0
        const year = date.getFullYear();

        // Định dạng lại thành dd/mm/yyyy
        const formattedDate = `${day < 10 ? "0" + day : day}/${
            month < 10 ? "0" + month : month
        }/${year}`;

        return formattedDate;
    };
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
                // eslint-disable-next-line jsx-a11y/alt-text
                <img
                    style={{ width: "150px", height: "150px" }}
                    src={text}
                ></img>
            ),
        },
        {
            title: "Author",
            dataIndex: "author",
            key: "author",
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
            title: "Is Public",
            key: "isPublic",
            dataIndex: "isPublic",
            render: (text) => (
                <Space size="middle">
                    {text == true ? (
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
            title: "Status",
            key: "status",
            dataIndex: "status",
            render: (text) => (
                <Space size="middle">
                    {text === "pending" ? (
                        <Tag
                            color="yellow"
                            key={text}
                            style={{ width: 100, textAlign: "center" }}
                            icon={<CopyOutlined />}
                        >
                            Pending
                        </Tag>
                    ) : text === "approved" ? (
                        <Tag
                            color="green"
                            key={text}
                            style={{ width: 100, textAlign: "center" }}
                            icon={<CopyOutlined />}
                        >
                            Approved
                        </Tag>
                    ) : text === "rejected" ? (
                        <Tag
                            color="red"
                            key={text}
                            style={{ width: 100, textAlign: "center" }}
                            icon={<CopyOutlined />}
                        >
                            Rejected
                        </Tag>
                    ) : null}
                </Space>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <div>
                    <Row>
                        {record.status === "pending" && isMarketing() && (
                            <React.Fragment>
                                <Popconfirm
                                    title="Are you sure to approve this article?"
                                    onConfirm={() =>
                                        handleApproveOrReject(
                                            record._id,
                                            "approved"
                                        )
                                    }
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        size="small"
                                        icon={<CheckCircleOutlined />}
                                        style={{
                                            width: 150,
                                            borderRadius: 15,
                                            height: 30,
                                            marginBottom: 15,
                                        }}
                                    >
                                        {"Approve"}
                                    </Button>
                                </Popconfirm>
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{
                                        width: 150,
                                        borderRadius: 15,
                                        height: 30,
                                        marginBottom: 15,
                                    }}
                                    onClick={() =>
                                        handleApproveOrReject(
                                            record._id,
                                            "rejected"
                                        )
                                    }
                                >
                                    {"Reject"}
                                </Button>
                            </React.Fragment>
                        )}
                        {!record.isPublic && isDepartment() && (
                            <Popconfirm
                                title="Are you sure to public this article?"
                                onConfirm={() => handleMakePublic(record._id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    size="small"
                                    icon={<CheckCircleOutlined />}
                                    style={{
                                        width: 150,
                                        borderRadius: 15,
                                        height: 30,
                                        marginBottom: 15,
                                    }}
                                >
                                    {"Public"}
                                </Button>
                            </Popconfirm>
                        )}
                        {isMarketingOrStudent() && (
                            <React.Fragment>
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
                            </React.Fragment>
                        )}
                        {isDepartment() && (
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                style={{
                                    width: 150,
                                    borderRadius: 15,
                                    height: 30,
                                    marginBottom: 15,
                                }}
                                onClick={() =>
                                    handleDownloadArticle(record._id)
                                }
                            >
                                Download
                            </Button>
                        )}
                        {/* <Popconfirm
              title="Are you sure to delete this academic?"
              onConfirm={() => handleDeleteAcademic(record._id)}
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
            </Popconfirm> */}
                    </Row>
                </div>
            ),
        },
    ];

    useEffect(() => {
        // Check if the user is marketing
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.role === "marketing") {
            // Call the API to get articles by faculty ID
            articleApi
                .getArticleByFaculty(user.facultyId)
                .then((res) => {
                    setCategory(res.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log("Failed to fetch articles:", error);
                    setLoading(false);
                });
        } else if (user && user.role === "department") {
            // Call the API to get all articles
            articleApi
                .getArticleApproved()
                .then((res) => {
                    setCategory(res.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log("Failed to fetch articles:", error);
                    setLoading(false);
                });
        }
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
                                <span>Aritcle Manager</span>
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
                                </Row>
                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        {isDepartment() && (
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                style={{ marginBottom: 16 }}
                                onClick={handleDownloadAll}
                            >
                                Download All
                            </Button>
                        )}
                        <Table
                            columns={columns}
                            pagination={{ position: ["bottomCenter"] }}
                            dataSource={category}
                            rowKey="_id"
                            onRow={(record) => ({
                                onClick: () => handleRowClick(record), // chỉ lưu id của bài viết đã chọn
                            })}
                        />
                    </div>
                </div>
                {/* <Modal
          title="Comments Article"
          visible={openModalComment}
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
              name="comment"
              label="Comment"
              rules={[
                {
                  required: true,
                  message: "Please enter a name!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Comment" />
            </Form.Item>
            <input type="hidden" name="articleId" value={commentArticleId} />
          </Form>
        </Modal> */}
                <Modal
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

export default ArticleManager;
