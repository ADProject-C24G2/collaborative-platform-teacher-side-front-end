import {
  ContactsOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { GridContent } from "@ant-design/pro-components";
import { useRequest } from "@umijs/max";
import {
  Avatar,
  Card,
  Col,
  Divider,
  Input,
  type InputRef,
  Row,
  Tag,
} from "antd";
import React, { useRef, useState } from "react";
import useStyles from "./Center.style";
import Applications from "./Applications"; // 仅保留 Applications
import type { CurrentUser, TagType } from "./data.d";
import { queryCurrent } from "./service";

// 仅保留 applications Tab
const operationTabList = [
  {
    key: "applications",
    tab: (
      <span>
        Class <span style={{ fontSize: 14 }}></span>
      </span>
    ),
  },
];

// 标签组件（未修改）
const TagList: React.FC<{
  tags: CurrentUser["tags"];
}> = ({ tags }) => {
  const { styles } = useStyles();
  const ref = useRef<InputRef | null>(null);
  const [newTags, setNewTags] = useState<TagType[]>([]);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  const showInput = () => {
    setInputVisible(true);
    setTimeout(() => {
      ref.current?.focus();
    }, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !newTags.some((tag) => tag.label === inputValue)) {
      setNewTags([
        ...newTags,
        { key: `new-${newTags.length}`, label: inputValue },
      ]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  return (
    <div className={styles.tags}>
      <div className={styles.tagsTitle}>Tag</div>
      {[...(tags || []), ...newTags].map((item) => (
        <Tag key={item.key}>{item.label}</Tag>
      ))}
      {inputVisible ? (
        <Input
          ref={ref}
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag onClick={showInput} style={{ borderStyle: "dashed" }}>
          <PlusOutlined />
        </Tag>
      )}
    </div>
  );
};

// 主组件：仅显示应用
const Center: React.FC = () => {
  const { styles } = useStyles();
  const [tabKey] = useState<"applications">("applications"); // 固定为 applications

  const { data: currentUser, loading } = useRequest(queryCurrent);

  // 渲染用户信息
  const renderUserInfo = ({ title, group, address }: Partial<CurrentUser>) => {
    return (
      <div className={styles.detail}>
        <p>
          <ContactsOutlined style={{ marginRight: 8 }} />
          {title}
        </p>
        <p>
          <HomeOutlined style={{ marginRight: 8 }} />
          {group}
        </p>
        <p>{address}</p>
      </div>
    );
  };

  return (
    <GridContent>
      <Row gutter={24}>
        {/* 左侧用户信息 */}
        <Col lg={7} md={24}>
          <Card
            variant="borderless"
            style={{ marginBottom: 24 }}
            loading={loading}
          >
            {!loading && currentUser && (
              <>
                <div className={styles.avatarHolder}>
                  <img alt="" src={currentUser.avatar} />
                  <div className={styles.name}>{currentUser.name}</div>
                  <div>{currentUser.signature}</div>
                </div>
                {renderUserInfo(currentUser)}
                <Divider dashed />
                <TagList tags={currentUser.tags || []} />
                <Divider style={{ marginTop: 16 }} dashed />
              </>
            )}
          </Card>
        </Col>

        {/* 右侧内容：只显示 Applications */}
        <Col lg={17} md={24}>
          <Card
            className={styles.tabsCard}
            variant="borderless"
            tabList={operationTabList}
            activeTabKey={tabKey}
            // 因为只有一个 tab，可以移除 onTabChange 或保留以防未来扩展
            onTabChange={() => {}} // 空函数，避免警告
          >
            <Applications />
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
};

export default Center;
