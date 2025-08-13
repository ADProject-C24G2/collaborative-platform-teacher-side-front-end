import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormText,
} from "@ant-design/pro-components";
import { useLocation, useNavigate, useRequest } from "@umijs/max";
import { Button, Card, Form, List, message, Popconfirm, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { assignAssignment } from "./service";

type Question = {
  questionId: string;
  question_content: string;
};

type LocationState = {
  classId?: string;
  selectedQuestions?: Question[];
  currentValues?: {
    title: string;
    expire_time?: string;
  };
};

const AssignAssignmentForm: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const state = (location.state as LocationState) || {};
  const { classId, currentValues } = state;

  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>(
    state.selectedQuestions || [],
  );

  useEffect(() => {
    const valuesToSet: { [key: string]: any } = {};

    if (currentValues) {
      valuesToSet.title = currentValues.title;
      if (currentValues.expire_time) {
        const expireTime = dayjs(currentValues.expire_time);
        if (expireTime.isValid()) {
          valuesToSet.expire_time = expireTime;
        }
      }
    }

    if (state.selectedQuestions) {
      setSelectedQuestions(state.selectedQuestions);
    }

    if (Object.keys(valuesToSet).length > 0) {
      form.setFieldsValue(valuesToSet);
    }
  }, [location.state, form]);

  const { run, loading } = useRequest(assignAssignment, {
    manual: true,
    onSuccess: () => {
      message.success("Assignment assigned successfully!");
      navigate("/class/view-class");
    },
    onError: () => {
      message.error("Failed to assign assignment.");
    },
  });

  const onFinish = async (values: {
    title: string;
    expire_time: any;
  }) => {
    const expireTime = dayjs(values.expire_time);
    const now = dayjs();

    if (expireTime.isBefore(now)) {
      message.error(
        "The deadline cannot be earlier than the current time. Please select a future time.",
      );
      return;
    }

    const questionIds = selectedQuestions.map((q) => q.questionId);
    if (questionIds.length === 0) {
      message.warning("Please select at least one question.");
      return;
    }
    if (!classId) {
      message.error("Class ID is missing.");
      return;
    }

    const payload = {
      ...values,
      expire_time: expireTime.toISOString(),
      classId,
      questionIds,
    };
    run(payload);
  };

  const handleSelectQuestions = () => {
    const currentFormValues = form.getFieldsValue();
    const preservedValues = {
      title: currentFormValues.title,
      expire_time:
        currentFormValues.expire_time &&
        dayjs.isDayjs(currentFormValues.expire_time)
          ? currentFormValues.expire_time.toISOString()
          : undefined,
    };
    navigate("/class/assignment/assign-assignment", {
      state: {
        classId,
        selectedQuestions,
        currentValues: preservedValues,
      },
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    setSelectedQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q.questionId !== questionId)
    );
    message.success("Question removed.");
  };

  return (
    <PageContainer content="Create a new assignment for your class.">
      <Card bordered={false}>
        <ProForm
          form={form}
          layout="vertical"
          style={{ maxWidth: 800, margin: "auto" }}
          onFinish={onFinish}
          submitter={{
            searchConfig: { submitText: "Submit", resetText: "Reset" },
            submitButtonProps: { loading: loading },
            resetButtonProps: {
              onClick: () => {
                form.resetFields();
                setSelectedQuestions([]);
              },
            },
          }}
        >
          <ProFormText
            name="title"
            label="Assignment Title"
            placeholder="e.g., Chapter 5 Homework"
            rules={[
              { required: true, message: "Please enter the assignment title." },
            ]}
          />
          <ProFormDateTimePicker
            name="expire_time"
            label="Expire Time"
            placeholder="Select the deadline for this assignment"
            rules={[
              { required: true, message: "Please select an expiration time." },
            ]}
          />

          <Form.Item label="Selected Questions">
            <Button type="primary" onClick={handleSelectQuestions} style={{ marginBottom: 16 }}>
              {selectedQuestions.length > 0 ? 'Select More / Modify' : 'Select Questions'}
            </Button>

            <List
              bordered
              itemLayout="horizontal"
              dataSource={selectedQuestions}
              locale={{ emptyText: 'No questions have been selected yet.' }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Popconfirm
                      title="Are you sure you want to remove this question?"
                      onConfirm={() => handleDeleteQuestion(item.questionId)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  ]}
                >
                  <List.Item.Meta
                    title={`ID: ${item.questionId}`}
                    description={
                      <Typography.Paragraph
                        ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
                        style={{ margin: 0 }}
                      >
                        {item.question_content}
                      </Typography.Paragraph>
                    }
                  />
                </List.Item>
              )}
            />
          </Form.Item>
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default AssignAssignmentForm;
