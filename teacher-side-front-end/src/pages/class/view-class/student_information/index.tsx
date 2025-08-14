// src/pages/profile/basic/index.tsx

import { getStudents, updateStudentStatus } from "./service";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { useLocation, useNavigate } from "@umijs/max";
import { Button, message, Popconfirm } from "antd";
import type { FC } from "react";
import React, { useRef, useState } from "react";
import type { Student } from "./data.d";

interface LocationState {
  classId?: number | string;
  className?: string;
}

const StudentListPage: FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [dataSource, setDataSource] = useState<Student[]>([]);

  const location = useLocation();
  const navigate = useNavigate();
  const classId = (location.state as LocationState)?.classId;
  const className = (location.state as LocationState)?.className;
  if (classId == "Unknown"){
    navigate("/class/view-class", { replace: true })
  }

  // This function correctly removes a student from the list on a successful POST.
  const handleStatusChange = async (studentId: number, newStatus: 0 | 1) => {
    if (!classId) {
      message.error("Class ID is not available.");
      return;
    }
    setUpdatingId(studentId);
    try {
      await updateStudentStatus({
        id: studentId,
        classId,
        status: newStatus,
      });
      message.success("Action successful!");
      setDataSource((currentData) =>
        currentData.filter((student) => student.id !== studentId),
      );
    } catch (error) {
      console.error("Update status error:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const columns: ProColumns<Student>[] = [
    // ... your column definitions remain unchanged ...
    {
      title: "Student ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      search: false,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      copyable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      copyable: true,
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      search: false,
      render: () => "******",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      copyable: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      search: false,
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: [
        { text: "Normal", value: 1 },
        { text: "Banned", value: 0 },
      ],
      onFilter: true,
      valueEnum: {
        1: { text: "Normal", status: "Success" },
        0: { text: "Banned", status: "Error" },
      },
    },
    {
      title: "Action",
      key: "action",
      valueType: "option",
      width: 150,
      render: (_, record: Student) => {
        const isNormal = record.status === 1;
        const newStatus = isNormal ? 0 : 1;
        const buttonText = isNormal ? "Ban" : "Unban";
        const confirmTitle = `Are you sure you want to ${
          isNormal ? "ban" : "unban"
        } this student?`;

        return (
          <Popconfirm
            title={confirmTitle}
            onConfirm={() => handleStatusChange(record.id, newStatus)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger={isNormal}
              loading={updatingId === record.id}
            >
              {buttonText}
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <PageContainer
    title={`Student List - ${className || 'Unknown'}`}
    content="View and manage the students in your class."
    onBack={() => navigate("/class/view-class")}
    >
      <ProTable<Student>
        headerTitle="Student Information"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: "auto" }}
        params={{ classId }}
        // FIX: The request function now transforms the API response
        request={async (params) => {
          if (!params.classId) {
            setDataSource([]);
            return { success: true, data: [] };
          }

          // 1. Get the raw response from your API
          const response = await getStudents({ classId: params.classId });
          const isSuccess = response && response.code === 1;

          // 2. Update the local state for the "disappear on ban" feature
          if (isSuccess) {
            setDataSource(response.data || []);
          } else {
            setDataSource([]);
          }

          // 3. Return the data in the format ProTable expects
          return {
            data: isSuccess ? response.data : [],
            success: isSuccess,
            total: isSuccess ? response.data.length : 0,
          };
        }}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
    </PageContainer>
  );
};

export default StudentListPage;
