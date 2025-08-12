import {
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useRequest } from "@umijs/max";
import { Avatar, Card, Dropdown, List, Tooltip } from "antd";
import React from "react";
import type { ListItemDataType } from "../data.d";
import { queryFakeList } from "../service";
import useStyles from "./index.style";
import { useNavigate } from "@umijs/max"; // ✅ 导入

// 可以删除或保留（如果不用于万级数据）
export function formatWan(val: number) {
  const v = val;
  if (!v || Number.isNaN(v)) return "";
  return val > 10000 ? `${Math.floor(val / 10000)}万` : val;
}

const Applications: React.FC = () => {
  const { styles: stylesApplications } = useStyles();

  // 获取班级列表数据
  const { data: listData } = useRequest(() => {
    return queryFakeList({
      count: 30,
    });
  });
  const navigate = useNavigate();

  // 卡片底部信息组件
  const CardInfo: React.FC<{
    classSize: React.ReactNode;
    unreadMessages: React.ReactNode;
  }> = ({ classSize, unreadMessages }) => (
    <div className={stylesApplications.cardInfo}>
      <div>
        <p>Class Size</p>
        <p>{classSize}</p>
      </div>
      <div>
        <p>Unread Messages</p>
        <p>{unreadMessages}</p>
      </div>
    </div>
  );

  return (
    <List<ListItemDataType>
      rowKey="id"
      className={stylesApplications.filterCardList}
      grid={{
        gutter: 24,
        xxl: 3,
        xl: 2,
        lg: 2,
        md: 2,
        sm: 2,
        xs: 1,
      }}
      dataSource={listData?.list || []}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <Card
            hoverable
            styles={{
              body: {
                paddingBottom: 20,
              },
            }}
            actions={[
              <Tooltip key="manage" title="Manage Class">
                <EditOutlined
                  onClick={() => {
                    // 使用 navigate 跳转
                    navigate("/class/manage-class", {
                      state: { classId: item.id },
                    });
                  }}
                  // 可选：添加 style 让图标可点击
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>,
              <Tooltip key="homework" title="Assign Assignment">
                <PlusOutlined
                  onClick={() => {
                    // 使用 navigate 跳转
                    navigate("/class/assignment-form", {
                      state: { classId: item.id },
                    });
                  }}
                  // 可选：添加 style 让图标可点击
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>,
              <Tooltip key="announcement" title="Make Announcement">
                <SendOutlined
                  onClick={() => {
                    // 使用 navigate 跳转
                    navigate("/class/make-announcement", {
                      state: { classId: item.id },
                    });
                  }}
                  // 可选：添加 style 让图标可点击
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>,
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: "View Details",
                    },
                    {
                      key: "2",
                      label: "Export Student List",
                    },
                  ],
                }}
                key="more"
              >
                <EllipsisOutlined />
              </Dropdown>,
            ]}
          >
            {/* 卡片头部：班级名称 + 图标 */}
            <Card.Meta
              avatar={<Avatar size="small" src={item.avatar} />}
              title={item.className || item.title} // 兼容性：优先用 className
            />
            {/* 卡片底部：班级人数和未读消息 */}
            <div>
              <CardInfo
                classSize={item.studentAmount ?? 0}
                unreadMessages={item.unreadMessages ?? 0}
              />
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default Applications;
