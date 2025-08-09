import type { ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { useRequest } from "@umijs/max";
import { Card } from "antd";
import type { FC } from "react";
import React from "react";
import useStyles from "./style.style";
// 假设你有一个获取公告历史的服务
// import { queryAnnouncementHistory } from "./service";

// 定义公告历史记录的数据类型
interface AnnouncementHistoryItem {
  id: string; // 假设有一个唯一ID
  title: string;
  createTime: string; // ISO 字符串格式
  recipientType: "all" | "specific";
  specificRecipients?: { studentId: string; studentName: string }[]; // 当 recipientType 是 'specific' 时
  content: string;
}

// 模拟数据函数 (实际项目中应替换为调用服务)
const queryAnnouncementHistory = async (): Promise<{
  data: AnnouncementHistoryItem[];
}> => {
  // 模拟异步请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            id: "1",
            title: "Welcome to the New Semester!",
            createTime: "2023-09-01T08:00:00Z",
            recipientType: "all",
            content:
              "Dear students, welcome back for another exciting semester. Please check the syllabus for updates.",
          },
          {
            id: "2",
            title: "Midterm Exam Schedule",
            createTime: "2023-10-15T14:30:00Z",
            recipientType: "specific",
            specificRecipients: [
              { studentId: "1", studentName: "Alice Johnson" },
              { studentId: "3", studentName: "Charlie Brown" },
            ],
            content:
              "The midterm exams will be held from Nov 6th to Nov 10th. Please confirm your schedule.",
          },
          {
            id: "3",
            title: "Project Submission Deadline",
            createTime: "2023-11-20T10:15:00Z",
            recipientType: "all",
            content:
              "Reminder: The final project is due by Dec 15th, 11:59 PM. Late submissions will incur penalties.",
          },
          {
            id: "4",
            title: "Office Hours Update",
            createTime: "2023-12-05T16:45:00Z",
            recipientType: "specific",
            specificRecipients: [
              { studentId: "2", studentName: "Bob Smith" },
              { studentId: "4", studentName: "Diana Prince" },
              { studentId: "5", studentName: "Ethan Hunt" },
            ],
            content:
              "My office hours for next week are moved to Wednesday 2-4 PM due to a conference.",
          },
        ],
      });
    }, 500); // 模拟网络延迟
  });
};

const Basic: FC = () => {
  const { styles } = useStyles();

  // 使用 useRequest 获取公告历史数据
  const { data, loading } = useRequest(() => {
    return queryAnnouncementHistory();
  });

  // 定义表格列
  const announcementColumns: ProColumns<AnnouncementHistoryItem>[] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true, // 如果标题太长，显示省略号
    },
    {
      title: "Send Time",
      dataIndex: "createTime",
      key: "createTime",
      valueType: "dateTime", // 自动格式化日期时间
      sorter: (a, b) =>
        new Date(a.createTime).getTime() - new Date(b.createTime).getTime(), // 可排序
    },
    {
      title: "Recipients",
      dataIndex: "recipientType",
      key: "recipientType",
      render: (_, record) => {
        if (record.recipientType === "all") {
          return <span>All Students</span>;
        } else if (
          record.recipientType === "specific" &&
          record.specificRecipients
        ) {
          // 显示指定学生的姓名列表
          const names = record.specificRecipients
            .map((s) => s.studentName)
            .join(", ");
          return <span>{names || "N/A"}</span>;
        }
        return <span>Unknown</span>;
      },
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      ellipsis: true, // 如果内容太长，显示省略号
    },
  ];

  return (
    <PageContainer>
      <Card variant="borderless">
        {/* 1. 标题改为 Send Announcement */}
        <div className={styles.title}>Send Announcement</div>

        {/* 显示公告历史记录的表格 */}
        <ProTable<AnnouncementHistoryItem>
          style={{
            marginBottom: 24,
          }}
          pagination={{
            pageSize: 5, // 设置每页显示5条
          }}
          search={false} // 如果不需要搜索框，可以关闭
          loading={loading}
          options={false} // 隐藏表格右上角的选项按钮
          toolBarRender={false} // 隐藏工具栏
          dataSource={data?.data || []} // 使用获取到的数据
          columns={announcementColumns}
          rowKey="id" // 使用唯一ID作为行键
        />
      </Card>
    </PageContainer>
  );
};

export default Basic;
