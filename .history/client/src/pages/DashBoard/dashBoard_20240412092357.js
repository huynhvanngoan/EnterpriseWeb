import { DashboardOutlined, HomeOutlined } from "@ant-design/icons";
import {
    BackTop,
    Breadcrumb,
    Card,
    Col,
    Modal,
    Row,
    Spin,
    Tag,
    Typography,
} from "antd";

import {
    BarChart,
    PieChart,
    Pie,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";
import React, { useEffect, useState } from "react";
import dashBoardApi from "../../apis/dashBoardApi";
import articleApi from "../../apis/articleApi";
import logApi from "../../apis/logApi";
import "./dashBoard.css";

const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
];

const DashBoard = () => {
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [totalAcademicYears, setTotalAcademicYears] = useState(0);
    const [totalByFaculty, setTotalFaculties] = useState(0);
    const [totalUser, setTotalUser] = useState(0);
    const [totalAritcle, setTotalAritcle] = useState(0);
    const [totalByStatus, setTotalByStatus] = useState([]);
    const [totalByComment, setTotalByComments] = useState([]);
    const [publicArticles, setPublicArticles] = useState([]);
    const [faculty, setFaculty] = useState();
    const [role, setRole] = useState();
    const [urlStats, setUrlStats] = useState([]);
    const [browerData, setBrowerData] = useState([]);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setRole(user.role);
        setFaculty(user.facultyId);
        const fetchArticles = async () => {
            try {
                const response = await articleApi.getArticlePublic();
                setArticles(response.data);
                setLoading(false);
            } catch (error) {
                console.log("Failed to fetch articles:" + error);
                setLoading(false);
            }
        };
        fetchArticles();
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const facultyId = user.facultyId;
                const [
                    academicResponse,
                    facultyResponse,
                    statusResponse,
                    commentReponse,
                    urlReponse,
                    browerReponse,
                ] = await Promise.all([
                    dashBoardApi.getTotalByAcademic(facultyId),
                    dashBoardApi.getTotalByFaculty(facultyId),
                    dashBoardApi.getTotalByStatus(facultyId),
                    dashBoardApi.getTotalByComment(facultyId),
                    dashBoardApi.getTotalByUrl(),
                    dashBoardApi.getTotalByBrower(),
                ]);
                const academicData = academicResponse.data.map((item) => ({
                    name: item.name,
                    count: item.count,
                }));
                setTotalAcademicYears(academicData);

                const privateData = [
                    { name: "Public", count: facultyResponse.data.public },
                    { name: "Private", count: facultyResponse.data.private },
                ];
                setTotalFaculties(privateData);
                const statusData = [
                    { name: "Pending", count: statusResponse.data.pending },
                    { name: "Approved", count: statusResponse.data.approved },
                    { name: "Rejected", count: statusResponse.data.rejected },
                ];
                setTotalByStatus(statusData);
                const commentData = [
                    {
                        name: "No Comments",
                        count: commentReponse.data.withoutComments,
                    },
                    {
                        name: "Comment",
                        count: commentReponse.data.withComments,
                    },
                ];
                setTotalByComments(commentData);
                const urlData = urlReponse.data.map((item) => ({
                    name: item.name,
                    count: item.count,
                }));
                setUrlStats(urlData);
                const browerData = browerReponse.data.map((item) => ({
                    name: item.name,
                    count: item.count,
                }));
                setBrowerData(browerData);
                console.log(urlData);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setLoading(false);
            }
        };
        fetchData();
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

    console.log("urlStats", urlStats);
    console.log("browerData", browerData);

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
                                <DashboardOutlined />
                                <span>DashBoard</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    {role !== "student" && (
                        <>
                            {role !== "admin" && (
                                <>
                                    <Row gutter={12}>
                                        <Col span={24}>
                                            <h3>
                                                Chart By Academic Year With
                                                Faculty{" "}
                                            </h3>
                                            <ResponsiveContainer
                                                width="100%"
                                                height={300}
                                            >
                                                <BarChart
                                                    data={totalAcademicYears}
                                                    margin={{
                                                        top: 20,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 5,
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar
                                                        dataKey="count"
                                                        fill={COLORS[5]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Col>
                                    </Row>
                                    <Row gutter={12}>
                                        <Col span={24}>
                                            <h3>Chart By Prive With Faculty</h3>
                                            <ResponsiveContainer
                                                width="100%"
                                                height={300}
                                            >
                                                <BarChart
                                                    data={totalByFaculty}
                                                    margin={{
                                                        top: 20,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 5,
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar
                                                        dataKey="count"
                                                        fill={COLORS[3]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Col>
                                    </Row>
                                    <Row gutter={12}>
                                        <Col span={24}>
                                            <h3>
                                                Chart By Status With Faculty
                                            </h3>
                                            <ResponsiveContainer
                                                width="100%"
                                                height={300}
                                            >
                                                <BarChart
                                                    data={totalByStatus}
                                                    margin={{
                                                        top: 20,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 5,
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar
                                                        dataKey="count"
                                                        fill={COLORS[1]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Col>
                                    </Row>
                                    <Row gutter={12}>
                                        <Col span={24}>
                                            <h3>
                                                Chart By Comment With Faculty
                                            </h3>
                                            <ResponsiveContainer
                                                width="100%"
                                                height={300}
                                            >
                                                <BarChart
                                                    data={totalByComment}
                                                    margin={{
                                                        top: 20,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 5,
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar
                                                        dataKey="count"
                                                        fill={COLORS[0]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Col>
                                    </Row>
                                </>
                            )}
                            {role === "admin" && (
                                <>
                                    <Row gutter={12}>
                                        <Col span={24}>
                                            <h3>Chart Url Count</h3>
                                            <ResponsiveContainer
                                                width="100%"
                                                height={300}
                                            >
                                                <PieChart
                                                    width={730}
                                                    height={250}
                                                >
                                                    <Pie
                                                        data={urlStats}
                                                        dataKey="count"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={80}
                                                        label
                                                    >
                                                        {urlStats.map(
                                                            (entry, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={
                                                                        COLORS[
                                                                            index %
                                                                                COLORS.length
                                                                        ]
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Col>
                                    </Row>
                                    <Row gutter={12}>
                                        <Col span={24}>
                                            <h3>Chart Brower Count</h3>
                                            <ResponsiveContainer
                                                width="100%"
                                                height={300}
                                            >
                                                <PieChart
                                                    width={730}
                                                    height={250}
                                                >
                                                    <Pie
                                                        data={browerData}
                                                        dataKey="count"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={80}
                                                        label
                                                    >
                                                        {browerData.map(
                                                            (entry, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={
                                                                        COLORS[
                                                                            index %
                                                                                COLORS.length
                                                                        ]
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </>
                    )}
                    {role === "guest" && (
                        <>
                            <Row>
                                <h1 style={{ marginLeft: 2 }}>
                                    Public Aritcle
                                </h1>
                            </Row>
                            <Row gutter={12}>
                                {articles.map((article) =>
                                    (role === "guest" &&
                                        article.facultyId === faculty) ||
                                    role !== "guest" ? (
                                        <Col
                                            span={6}
                                            key={article._id}
                                            className="text-center"
                                        >
                                            <Card className="card_total">
                                                <div className="card_header">
                                                    <h3>
                                                        TITLE:{" "}
                                                        {article.title.toUpperCase()}
                                                    </h3>
                                                </div>
                                                <div className="card_body mb-5">
                                                    {/* Đây là nơi hiển thị hình ảnh */}
                                                    <img
                                                        src={article.image}
                                                        alt={article.title}
                                                        style={{
                                                            width: "auto",
                                                            height: 150,
                                                        }}
                                                    />
                                                </div>
                                                <div className="card_body">
                                                    {/* Hiển thị nội dung của bài viết */}
                                                    <Typography.Paragraph>
                                                        {article.content}
                                                    </Typography.Paragraph>
                                                </div>
                                                <div>
                                                    Author: {article.author}
                                                </div>
                                            </Card>
                                        </Col>
                                    ) : (
                                        <Col
                                            span={6}
                                            key={article._id}
                                            className="text-center"
                                        >
                                            <Card className="card_total">
                                                <div className="card_header">
                                                    <h3>
                                                        TITLE:{" "}
                                                        {article.title.toUpperCase()}
                                                    </h3>
                                                </div>
                                                <div className="card_body mb-5">
                                                    {/* Đây là nơi hiển thị hình ảnh */}
                                                    <img
                                                        src={article.image}
                                                        alt={article.title}
                                                        style={{
                                                            width: "auto",
                                                            height: 150,
                                                        }}
                                                    />
                                                </div>
                                                <div className="card_body">
                                                    {/* Hiển thị nội dung của bài viết */}
                                                    <Typography.Paragraph>
                                                        {article.content}
                                                    </Typography.Paragraph>
                                                </div>
                                                <div>
                                                    Author: {article.author}
                                                </div>
                                            </Card>
                                        </Col>
                                    )
                                )}
                            </Row>
                        </>
                    )}
                </div>
                <BackTop style={{ textAlign: "right" }} />
            </Spin>
        </div>
    );
};

export default DashBoard;
