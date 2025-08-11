// form.tsx (updated)
import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { useLocation, useNavigate, useRequest } from "@umijs/max";
import { Button, Card, Form, message } from "antd";
import dayjs from "dayjs"; // Import dayjs to handle date conversion
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { assignAssignment } from "./service";

// Defines the structure for a question passed via route state
type Question = {
  questionId: string;
  question_content: string;
};

// Defines the structure of the state passed between routes
type LocationState = {
  classId?: string;
  selectedQuestions?: Question[];
  currentValues?: {
    title: string;
    expire_time?: string; // Stored as ISO string
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
    console.log("Assignment Form received state:", location.state);

    const valuesToSet: { [key: string]: any } = {};

    // 1. Restore previous form values if they exist
    if (currentValues) {
      valuesToSet.title = currentValues.title;
      if (currentValues.expire_time) {
        const expireTime = dayjs(currentValues.expire_time);
        if (expireTime.isValid()) {
          valuesToSet.expire_time = expireTime;
        }
      }
    }

    // 2. Update selected questions and display if provided in state (from selection page)
    let questionsForDisplay = selectedQuestions;
    if (state.selectedQuestions) {
      questionsForDisplay = state.selectedQuestions;
      setSelectedQuestions(state.selectedQuestions);
    }

    // 3. Update the questions display based on the current selected questions
    const content = questionsForDisplay
      .map((q) => `ID: ${q.questionId}\nQuestion: ${q.question_content}`)
      .join("\n\n---\n\n");
    valuesToSet.questions_display = content || "";

    // Apply all changes to the form at once
    if (Object.keys(valuesToSet).length > 0) {
      form.setFieldsValue(valuesToSet);
    }
  }, [location.state, form]); // Dependencies: location.state, form

  const { run, loading } = useRequest(assignAssignment, {
    manual: true,
    onSuccess: () => {
      message.success("Assignment assigned successfully!");
      navigate(-1 as any);
    },
    onError: () => {
      message.error("Failed to assign assignment.");
    },
  });

  const onFinish = async (values: {
    title: string;
    expire_time: any; // It's safer to use 'any' or a union type here
  }) => {
    // --- Time Validation Logic ---
    const expireTime = dayjs(values.expire_time);
    const now = dayjs();

    // Check if the selected time is before the current time
    if (expireTime.isBefore(now)) {
      message.error(
        "The deadline cannot be earlier than the current time. Please select a future time.。",
      );
      return; // Stop the function if validation fails
    }
    // --- End of Validation Logic ---

    const questionIds = selectedQuestions.map((q) => q.questionId);
    if (questionIds.length === 0) {
      message.warning("Please select at least one question.");
      return;
    }
    if (!classId) {
      message.error("Class ID is missing.");
      return;
    } // Convert the dayjs object to an ISO string for the backend

    const payload = {
      ...values,
      expire_time: expireTime.toISOString(), // Use the existing dayjs object
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
        selectedQuestions, // Preserve current selected questions
        currentValues: preservedValues,
      },
    });
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
            <Button type="primary" onClick={handleSelectQuestions}>
              Select Questions
            </Button>
          </Form.Item>
          <ProFormTextArea
            name="questions_display"
            label="Question Content"
            placeholder="Question content will appear here after selection."
            disabled
            rows={8}
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default AssignAssignmentForm;
