import React, { useState, useEffect } from 'react';
import "./resetPassword.css";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Divider, Alert,notification } from 'antd';
import backgroundLogin from "../../assets/image/background-login.png";
import { useParams } from "react-router-dom";
import axiosClient from '../../apis/axiosClient';

const ResetPassword = () => {

    // eslint-disable-next-line no-unused-vars
    const [isLogin, setLogin] = useState(false);

    let history = useHistory();
    let { id } = useParams();

    const onFinish = async (values) => {
        const resetPassWord = {
                token: id,
                newPassword: values.password 
        }
        axiosClient.post("/auth/reset-password", resetPassWord)
            .then(function (response) {
                if (response === undefined) {
                    notification["success"]({
                        message: `Notification`,
                        description:
                            'Password updated faild',

                    });
                }
                else {
                    notification["success"]({
                        message: `Notification`,
                        description:
                            'Password uploaded successfully',

                    });
                    history.push("/login");
                }
            })
            .catch(error => {
                console.log("password error" + error)
            });
    }
    useEffect(() => {

    }, [])

    return (
        <div className="imageBackground">
            <div id="formContainer" >
                <div id="form-Login">
                    <div className="formContentLeft"
                    >
                        <img className="formImg" src={backgroundLogin} alt='spaceship' />
                    </div>
                    <Form
                        style={{ width: 340, marginBottom: 8 }}
                        name="normal_login"
                        className="loginform"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item style={{ marginBottom: 3, marginTop: 65 }}>
                            <Divider style={{ marginBottom: 5, fontSize: 19 }} orientation="center">COMP1640</Divider>
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 16, textAlign: "center" }}>
                            <p className="text">Change password</p>
                        </Form.Item>
                        <>
                            {isLogin === true ?
                                <Form.Item style={{ marginBottom: 16 }}>
                                    <Alert
                                        message="Error changing password"
                                        type="error"
                                        showIcon
                                    />

                                </Form.Item>
                                : ""}
                        </>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Enter your password!',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Re-enter your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject(new Error('Password isn`t matching!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Re-enter password" />
                        </Form.Item>

                        <Form.Item style={{ width: '100%', marginTop: 20 }}>
                            <Button className="button" type="primary" htmlType="submit"  >
                                SUBMIT
                        </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;



