import type { ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { useLocation, useNavigate, useRequest } from "@umijs/max";
import { Badge, Card, Descriptions, Divider, Spin } from "antd";
import type { FC } from "react";
import React from "react";
// Import updated types and services
import type { Announcement, Assignment, Submission } from "./data.d";
import { queryAnnouncementList, queryAssignmentStatus } from "./service";
import useStyles from "./style.style";

// --- Assignment table columns definition (in English) ---
const assignmentColumns: ProColumns<Submission>[] = [
  {
    title: "Student ID",
    dataIndex: "studentId",
    key: "studentId",
  },
  {
    title: "Student Name",
    dataIndex: "studentName",
    key: "studentName",
    copyable: true,
  },
  {
    title: "Status",
    dataIndex: "whetherFinish",
    key: "whetherFinish",
    render: (_, record) => {
      if (record.whetherFinish === 0) {
        return <Badge status="success" text="Finished" />;
      }
      return <Badge status="processing" text="In Progress" />;
    },
  },
  {
    title: "Accuracy",
    dataIndex: "accuracy",
    key: "accuracy",
  },
  {
    title: "Finish Time",
    dataIndex: "finishTime",
    key: "finishTime",
  },
];

const Basic: FC = () => {
  const { styles } = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const classId = (location.state as { classId?: string })?.classId;

  // Fetch announcement data, passing classId
  const { data: announcementData, loading: announcementLoading } = useRequest(
    () => queryAnnouncementList({ classId }),
    {
      refreshDeps: [classId], // Refetch when classId changes
      formatResult: (res) => res?.data,
    },
  );

  // Fetch assignment status data, passing classId
  const { data: assignmentData, loading: assignmentLoadingStatus } = useRequest(
    () => queryAssignmentStatus({ classId }),
    {
      refreshDeps: [classId], // Refetch when classId changes
      formatResult: (res) => res?.data,
    },
  );

  return (
    // Add onBack prop to enable the back button
    <PageContainer onBack={() => navigate(-1)}>
           {" "}
      <Card variant="borderless">
        {/* --- Announcement Module --- */}       {" "}
        <div className={styles.title}>Announcements</div>       {" "}
        <Spin spinning={announcementLoading}>
                   {" "}
          {announcementData?.map((item: Announcement, index: number) => (
            <Card
              key={index}
              type="inner"
              title={item.title}
              style={{ marginBottom: 24 }}
              extra={`Sent Time: ${item.createTime}`}
            >
                           {" "}
              <Descriptions column={1}>
                               {" "}
                <Descriptions.Item
                  label="Recipients"
                  contentStyle={{ wordBreak: "break-word" }}
                >
                                   {" "}
                  {item.recipientType === "specific"
                    ? item.students
                        ?.map((student) => student.studentName)
                        .join(", ")
                    : "All"}
                                 {" "}
                </Descriptions.Item>
                               {" "}
                <Descriptions.Item
                  label="Content"
                  contentStyle={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {item.content}
                </Descriptions.Item>
                             {" "}
              </Descriptions>
                         {" "}
            </Card>
          ))}
                 {" "}
        </Spin>
        {/* --- Assignment Status Module --- */}
        <Divider style={{ marginBottom: 32 }} />
        <Spin spinning={assignmentLoadingStatus}>
          {assignmentData?.map((assignment: Assignment, index: number) => (
            <div key={index}>
              <div className={styles.title}>{assignment.assignmentName}</div>
              <ProTable
                style={{ marginBottom: 24 }}
                pagination={false}
                search={false}
                options={false}
                toolBarRender={false}
                dataSource={assignment.submissions}
                columns={assignmentColumns}
                rowKey="key"
              />
            </div>
          ))}
        </Spin>
             {" "}
      </Card>
         {" "}
    </PageContainer>
  );
};

export default Basic;
