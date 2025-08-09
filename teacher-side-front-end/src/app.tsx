import {
  AvatarDropdown,
  AvatarName,
  Footer
} from "@/components";
import { currentUser as queryCurrentUser } from "@/services/ant-design-pro/api";
import type { Settings as LayoutSettings } from "@ant-design/pro-components";
import type { RequestConfig, RunTimeLayoutConfig } from "@umijs/max";
import { history } from "@umijs/max";
import { ConfigProvider, theme } from 'antd';
import type { ThemeConfig } from 'antd';
import React, { useEffect, useState } from "react";
import defaultSettings from "../config/defaultSettings";
import { errorConfig } from "./requestErrorConfig";

// React 19 补丁
import "@ant-design/v5-patch-for-react-19";

// 定义主题模式的类型
type ThemeMode = 'light' | 'dark';

/**
 * 这是一个独立的 React 组件，专门用于处理主题逻辑
 * 1. 使用 useState 管理当前是 'light' 还是 'dark'
 * 2. 使用 useEffect 监听操作系统的颜色模式变化
 * 3. 使用 antd 的 ConfigProvider 将主题应用到整个应用
 */
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  useEffect(() => {
    // 监测系统主题的 API
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 根据系统设置，更新我们的主题状态
    const handleThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const newThemeMode = e.matches ? 'dark' : 'light';
      setThemeMode(newThemeMode);
    };

    // 页面加载时，立即获取一次当前系统主题
    handleThemeChange(mediaQuery);

    // 添加监听器，当系统主题变化时，实时更新
    mediaQuery.addEventListener('change', handleThemeChange);

    // 组件销毁时，移除监听器
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  // 根据当前主题模式，配置 antd 的 theme
  const antdTheme: ThemeConfig = {
    algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };

  // 使用 ConfigProvider 包裹应用，使其所有子组件都应用上我们配置的主题
  return (
    <ConfigProvider theme={antdTheme}>
      {children}
    </ConfigProvider>
  );
};


/**
 * `rootContainer` 是 Umi 提供的运行时 API
 * 它允许我们用一个组件包裹整个应用的最外层
 * 我们在这里使用它，来让 `ThemeWrapper` 生效
 */
export function rootContainer(container: React.ReactNode) {
  return <ThemeWrapper>{container}</ThemeWrapper>;
}

// =======================================================================
// ========================== END: 新增的主题切换逻辑 =====================
// =======================================================================


// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 你原来的代码都原封不动地保留在下面 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

const isDev = process.env.NODE_ENV === "development";
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
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
                                              initialState,
                                              setInitialState,
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
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
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
      return (
        <>
          {children}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  baseURL: isDev ? "" : "https://proapi.azurewebsites.net",
  ...errorConfig,
};
