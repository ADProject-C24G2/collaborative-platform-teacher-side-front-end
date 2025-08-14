import {
  CopyOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useRequest } from "@umijs/max";
import { Avatar, Card, Dropdown, List, Tooltip, message } from "antd";
import React from "react";
import type { ListItemDataType } from "../data.d";
import { queryFakeList } from "../service";
import useStyles from "./index.style";
import { useNavigate } from "@umijs/max";

export function formatWan(val: number) {
  const v = val;
  if (!v || Number.isNaN(v)) return "";
  return val > 10000 ? `${Math.floor(val / 10000)}万` : val;
}

const Applications: React.FC = () => {
  const { styles: stylesApplications } = useStyles();

  const { data: listData } = useRequest(() => {
    return queryFakeList({
      count: 30,
    });
  });
  const navigate = useNavigate();

  const CardInfo: React.FC<{
    classSize: React.ReactNode;
    ongoingAssignment: React.ReactNode;
  }> = ({ classSize, ongoingAssignment }) => (
    <div className={stylesApplications.cardInfo}>
      <div>
        <p>Class Size</p>
        <p>{classSize}</p>
      </div>
      <div>
        <p>Ongoing Assignment</p>
        <p>{ongoingAssignment}</p>
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
                position: "relative",
              },
            }}
            actions={[
              <Tooltip key="manage" title="Manage Class">
                <EditOutlined
                  onClick={() => {
                    navigate("/class/manage-class", {
                      state: { classId: item.id, className: item.className },
                    });
                  }}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>,
              <Tooltip key="homework" title="Assign Assignment">
                <PlusOutlined
                  onClick={() => {
                    navigate("/class/assignment-form", {
                      state: { classId: item.id, className: item.className },
                    });
                  }}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>,
              <Tooltip key="announcement" title="Make Announcement">
                <SendOutlined
                  onClick={() => {
                    navigate("/class/make-announcement", {
                      state: { classId: item.id, className: item.className },
                    });
                  }}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>,
            ]}
          >
            {/* ✅ 修改部分开始 */}
            {item.token && (
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 1,
                  // 使用 flex 布局对齐文字和图标
                  display: "flex",
                  alignItems: "center",
                  gap: "6px", // 控制文字和图标的间距
                  color: "rgba(0, 0, 0, 0.45)", // 统一设置颜色
                  fontSize: "14px", // 统一设置字体大小
                }}
              >
                {/* 添加 'token' 文字提示 */}
                <span>token</span>
                <Tooltip title="Copy Class Token">
                  <CopyOutlined
                    style={{ cursor: "pointer", fontSize: "16px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(item.token);
                      message.success("Token copied!");
                    }}
                  />
                </Tooltip>
              </div>
            )}
            {/* ✅ 修改部分结束 */}

            <Card.Meta
              title={item.className || item.title}
            />
            <div>
              <CardInfo
                classSize={item.studentAmount ?? 0}
                ongoingAssignment={item.ongoingAssignment ?? 0}
              />
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default Applications;
