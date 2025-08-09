import { GithubOutlined } from "@ant-design/icons";
import { DefaultFooter } from "@ant-design/pro-components";
import React from "react";

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: "none",
      }}
      copyright="Powered by C24 Group2"
      links={[
        {
          key: "github",
          title: <GithubOutlined />,
          href: "https://github.com/ADProject-C24G2/collaborative-platform-teacher-side-front-end.git",
          blankTarget: true,
        },
        {
          key: "collaborative-platform-teacher-side-front-end",
          title: "collaborative-platform-teacher-side-front-end",
          href: "https://github.com/ADProject-C24G2/collaborative-platform-teacher-side-front-end.git",
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
