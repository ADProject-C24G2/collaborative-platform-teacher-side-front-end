import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  MobileOutlined,
  HomeOutlined,
  TeamOutlined,
  IdcardOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import {
  LoginForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Helmet, useModel } from "@umijs/max";
import { Alert, App, Tabs } from "antd";
import { createStyles } from "antd-style";
import React, { useState } from "react";
import { flushSync } from "react-dom";
import { Footer } from "@/components";
import { login, register } from "@/services/ant-design-pro/api";
import Settings from "../../../../config/defaultSettings";

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: "8px",
      color: "rgba(0, 0, 0, 0.2)",
      fontSize: "24px",
      verticalAlign: "middle",
      cursor: "pointer",
      transition: "color 0.3s",
      "&:hover": {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: "42px",
      position: "fixed",
      right: 16,
      borderRadius: token.borderRadius,
      ":hover": {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      backgroundColor: token.colorBgContainer,
    },
  };
});

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>("account");
  const { initialState, setInitialState } = useModel("@@initialState");
  const { styles } = useStyles();
  const { message } = App.useApp();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      let msg;
      if (type === "account") {
        // Login
        msg = await login({ ...values, type });
      } else {
        // Register
        msg = await register({ ...values, type });
      }
      if (msg.status === "ok") {
        const defaultSuccessMessage =
          type === "account" ? "Login successful!" : "Registration successful!";
        message.success(defaultSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        window.location.href = urlParams.get("redirect") || "/";
        return;
      }
      console.log(msg);
      // Set user error message if fails
      setUserLoginState(msg);
    } catch (error) {
      const defaultFailureMessage =
        type === "account"
          ? "Login failed, please try again!"
          : "Registration failed, please try again!";
      console.log(error);
      message.error(defaultFailureMessage);
    }
  };

  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          Login Page
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <div
        style={{
          flex: "1",
          padding: "32px 0",
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: "75vw",
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Collaborative Practice Platform"
          submitter={{
            // 自定义提交按钮文字
            searchConfig: {
              submitText: type === "account" ? "Login" : "Register",
            },
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: "account",
                label: "Account Login",
              },
              {
                key: "register",
                label: "Account Register",
              },
            ]}
          />

          {status === "error" && loginType === "account" && (
            <LoginMessage
              content={
                "Incorrect email or password. Please note: Only teachers can log in."
              }
            />
          )}
          {type === "account" && (
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: "large",
                  prefix: <MailOutlined />,
                }}
                placeholder={"E-mail"}
                rules={[
                  {
                    required: true,
                    message: "Please enter your email!",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email address!",
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined />,
                }}
                placeholder={"Password"}
                rules={[
                  {
                    required: true,
                    message: "Please enter your password!",
                  },
                ]}
              />
            </>
          )}

          {status === "error" && loginType === "register" && (
            <LoginMessage content="Registration error" />
          )}
          {type === "register" && (
            <>
              <ProFormText
                name="name"
                fieldProps={{
                  size: "large",
                  prefix: <UserOutlined />,
                }}
                placeholder={"Please enter your name"}
                rules={[
                  {
                    required: true,
                    message: "Please enter your name!",
                  },
                ]}
              />
              <ProFormText
                name="email"
                fieldProps={{
                  size: "large",
                  prefix: <MailOutlined />,
                }}
                placeholder={"Please enter your email"}
                rules={[
                  {
                    required: true,
                    message: "Please enter your email!",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email address!",
                  },
                ]}
              />
              <ProFormText
                name="phone"
                fieldProps={{
                  size: "large",
                  prefix: <MobileOutlined />,
                }}
                placeholder={"Please enter your phone number"}
                rules={[
                  {
                    required: true,
                    message: "Please enter your phone number!",
                  },
                  {
                    pattern: /^\d{10,15}$/,
                    message: "Please enter a valid phone number!",
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined />,
                }}
                placeholder={"Please enter your password"}
                rules={[
                  {
                    required: true,
                    message: "Please enter your password!",
                  },
                ]}
              />
              <ProFormSelect
                name="gender"
                fieldProps={{
                  size: "large",
                }}
                placeholder={"Please select your gender"}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                rules={[
                  {
                    required: true,
                    message: "Please select your gender!",
                  },
                ]}
              />
              <ProFormText
                name="address"
                fieldProps={{
                  size: "large",
                  prefix: <HomeOutlined />,
                }}
                placeholder={"Please enter your address"}
                rules={[
                  {
                    required: true,
                    message: "Please enter your address!",
                  },
                ]}
              />
              <ProFormText
                name="group"
                fieldProps={{
                  size: "large",
                  prefix: <TeamOutlined />,
                }}
                placeholder={"Please enter your group (organization or school)"}
                rules={[
                  {
                    required: true,
                    message: "Please enter your group!",
                  },
                ]}
              />
              <ProFormText
                name="title"
                fieldProps={{
                  size: "large",
                  prefix: <IdcardOutlined />,
                }}
                placeholder={"Please enter your title (e.g., Senior Lecturer)"}
                rules={[
                  {
                    required: true,
                    message: "Please enter your title!",
                  },
                ]}
              />
              <ProFormTextArea
                name="signature"
                fieldProps={{
                  size: "large",
                }}
                placeholder={"Please enter your signature (motivational quote)"}
                rules={[
                  {
                    required: true,
                    message: "Please enter your signature!",
                  },
                ]}
              />
              <ProFormSelect
                name="tags"
                fieldProps={{
                  size: "large",
                  mode: "tags",
                  allowClear: true,
                }}
                placeholder={"Add tags (e.g., love learning)"}
                rules={[
                  {
                    required: true,
                    message: "Please add at least one tag!",
                    type: "array",
                  },
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
