import { AvatarDropdown, AvatarName, Footer } from "@/components";
// [注释掉] 我们不再需要从后端获取用户，所以可以注释掉这个导入
// import { currentUser as queryCurrentUser } from "@/services/ant-design-pro/api";
import type { Settings as LayoutSettings } from "@ant-design/pro-components";
import type { RunTimeLayoutConfig } from "@umijs/max"; // [修改] 删除了不再需要的 RequestConfig
import { history } from "@umijs/max";
import { ConfigProvider, theme } from "antd";
import type { ThemeConfig } from "antd";
import React, { useEffect, useState } from "react";
import defaultSettings from "../config/defaultSettings";
// [注释掉] 既然不用请求，也就不需要错误处理了
// import { errorConfig } from "./requestErrorConfig";

// React 19 补丁
import "@ant-design/v5-patch-for-react-19";

// 定义主题模式的类型
type ThemeMode = "light" | "dark";

/**
 * 这是一个独立的 React 组件，专门用于处理主题逻辑
 */
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const newThemeMode = e.matches ? "dark" : "light";
      setThemeMode(newThemeMode);
    };
    handleThemeChange(mediaQuery);
    mediaQuery.addEventListener("change", handleThemeChange);
    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  const antdTheme: ThemeConfig = {
    algorithm:
      themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };

  return <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>;
};

export function rootContainer(container: React.ReactNode) {
  return <ThemeWrapper>{container}</ThemeWrapper>;
}

const loginPath = "/user/login";

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  // [新增] 创建一个虚拟的用户信息对象
  const mockUser: API.CurrentUser = {
    name: "Admin (本地模拟)",
    avatar:
      "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
    userid: "00000001",
    email: "ant-design-pro@alipay.com",
    signature: "海纳百川，有容乃大",
    title: "交互专家",
    group: "蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED",
    // 你可以根据需要添加其他字段
  };

  // [修改] 直接返回这个虚拟用户信息，不再需要任何网络请求和判断
  return {
    currentUser: mockUser,
    settings: defaultSettings as Partial<LayoutSettings>,
  };

  /*
  // =======================================================================
  // ====================== 以下是您原来的逻辑，已被注释掉 =====================
  // =======================================================================
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      return msg.data;
    } catch (_error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (
    ![loginPath, "/user/register", "/user/register-result"].includes(
      location.pathname,
    )
  ) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
  */
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  // setInitialState, // [注释掉] 因为是静态数据，不再需要 setInitialState
}) => {
  return {
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => (
        <AvatarDropdown>{avatarChildren}</AvatarDropdown>
      ),
    },
    waterMarkProps: {
      // content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      // [注释掉] 因为 initialState.currentUser 永远存在，所以这里的登录验证逻辑可以安全地移除了
      /*
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
      */
    },
    bgLayoutImgList: [
      {
        src: "https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr",
        left: 85,
        bottom: 100,
        height: "303px",
      },
      {
        src: "https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr",
        bottom: -68,
        right: -45,
        height: "303px",
      },
      {
        src: "https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr",
        bottom: 0,
        left: 0,
        width: "331px",
      },
    ],
    menuHeaderRender: undefined,
    rightContentRender: false,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return <>{children}</>;
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
// export const request: RequestConfig = {
//  baseURL: isDev ? "" : "https://proapi.azurewebsites.net",
//  ...errorConfig,
// };
