import { PageContainer } from "@ant-design/pro-components";
import { history, Outlet, useLocation, useMatch } from "@umijs/max";
import { Input } from "antd";
import type { FC } from "react";
import { useState } from "react";

type SearchProps = {
  children?: React.ReactNode;
};

const Search: FC<SearchProps> = () => {
  const location = useLocation();
  const match = useMatch(location.pathname);
  // 2. 创建一个 state 来存储已提交的搜索值
  const [submittedSearch, setSubmittedSearch] = useState<string>('');

  const handleTabChange = (key: string) => {
    const url =
      match?.pathname === "/"
        ? ""
        : match?.pathname.substring(0, match.pathname.lastIndexOf("/"));
    switch (key) {
      case "articles":
        history.push(`${url}/assign-assignment`);
        break;
      default:
        break;
    }
  };

  // 3. 实现 handleFormSubmit 函数，更新 state
  const handleFormSubmit = (value: string) => {
    setSubmittedSearch(value.trim());
  };

  const getTabKey = () => {
    const tabKey = location.pathname.substring(
      location.pathname.lastIndexOf("/") + 1,
    );
    if (tabKey && tabKey !== "/") {
      return tabKey;
    }
    return "articles";
  };

  return (
    <PageContainer
      content={
        <div style={{ textAlign: "center" }}>
          <Input.Search
            placeholder="Find any Question"
            enterButton="Search"
            size="large"
            onSearch={handleFormSubmit}
            style={{ maxWidth: 522, width: "100%" }}
          />
        </div>
      }
      tabActiveKey={getTabKey()}
      onTabChange={handleTabChange}
      className="flex-fill-layout"
    >
      {/* 4. 通过 Outlet 的 context 属性将 state 传递给子路由 */}
      <Outlet context={{ submittedSearch }} />
    </PageContainer>
  );
};

export default Search;
