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
      title={"Select Questions"}
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
      <Outlet context={{ submittedSearch }} />
    </PageContainer>
  );
};

export default Search;
