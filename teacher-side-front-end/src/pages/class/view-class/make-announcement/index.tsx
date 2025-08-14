import {
  PageContainer,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormDependency,
} from "@ant-design/pro-components";
import { Card, message } from "antd";
import type { FC } from "react";
import { useLocation } from "@umijs/max";
import { fakeSubmitForm, fetchStudentList } from "../service";
import { useRequest, useNavigate } from "@umijs/max";

const AnnouncementForm: FC<Record<string, any>> = () => {
  interface LocationState {
    classId?: string;
    className?: string
  }
  const navigate = useNavigate();

  // 1. Receive the passed classId
  const location = useLocation();
  const state = location.state as LocationState;
  const classId = state?.classId || "Unknown";
  const className = state?.className || "Unknown";
  if (classId == "Unknown"){
    navigate("/class/view-class", {replace: true})
  }

  // Mock student list (in a real project, this should be fetched from a backend API)

  const {
    data: studentList = [], // 初始化为空数组
    loading: studentListLoading,
    error,
  } = useRequest(() => fetchStudentList(classId), {
    // 依赖 classId，当 classId 变化时重新请求
    refreshDeps: [classId],
    onError: (err) => {
      message.error(`Failed to load student list: ${err.message}`);
    },
  });

  const { run } = useRequest(fakeSubmitForm, {
    manual: true,
    onSuccess: () => {
      navigate("/class/view-class")
    }
  });

  const onFinish = async (values: Record<string, any>) => {
    console.log("开始提交表单");
    // 4. Send with classId
    const submitData = {
      ...values,
      classId,
    };
    await run(submitData);
  };

  const handleReset = () => {
    // Reset the form
    window.location.reload();
  };

  return (
    <PageContainer
      title={`Make Announcement - ${className}`}
      onBack={() => navigate("/class/view-class")}
      content="Please fill in the announcement content and select the recipients."
    >
      <Card variant="borderless">
        <ProForm
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            recipientType: "all", // Default to all students
          }}
        >
          {/* 2.1 Title */}
          <ProFormText
            width="xl"
            label="Title"
            name="title"
            placeholder="Please enter the announcement title"
            rules={[{ required: true, message: "Please enter a title" }]}
          />

          {/* 2.2 Recipient Selection */}
          <ProFormRadio.Group
            name="recipientType"
            label="Send to"
            options={[
              { value: "all", label: "All Students" },
              { value: "specific", label: "Specific Students" },
            ]}
            rules={[
              { required: true, message: "Please select a recipient type" },
            ]}
          />

          {/* Show the selection box when "Specific Students" is selected */}
          <ProFormDependency name={["recipientType"]}>
            {({ recipientType }) => {
              return recipientType === "specific" ? (
                <ProFormSelect
                  name="specificRecipients"
                  label="Please select students"
                  mode="multiple"
                  options={studentList}
                  placeholder="Please select students to send to"
                  rules={[
                    { required: true, message: "Please select students" },
                  ]}
                  fieldProps={{
                    fieldNames: { label: "studentName", value: "studentId" },
                  }}
                />
              ) : null;
            }}
          </ProFormDependency>

          {/* 2.3 Content */}
          <ProFormTextArea
            label="Content"
            name="content"
            placeholder="Please enter the detailed content of the announcement"
            rules={[{ required: true, message: "Please enter content" }]}
            fieldProps={{
              rows: 6,
            }}
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default AnnouncementForm;
