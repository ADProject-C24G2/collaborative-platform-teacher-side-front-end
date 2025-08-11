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
import React, { useEffect } from "react";
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
    expire_time: any;
    questions_display?: string;
  };
};

const AssignAssignmentForm: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm(); // Read state from the location object once at the component level

  const state = (location.state as LocationState) || {};
  const { classId, selectedQuestions = [], currentValues } = state; // This effect runs when the component loads or when you navigate back with new state

  useEffect(() => {
    console.log("Assignment Form received state:", location.state);

    const valuesToSet: { [key: string]: any } = {};

    // 1. Restore previous form values if they exist
    if (currentValues) {
      valuesToSet.title = currentValues.title;
      if (
        currentValues.expire_time &&
        dayjs(currentValues.expire_time).isValid()
      ) {
        valuesToSet.expire_time = dayjs(currentValues.expire_time);
      }
    }

    // 2. Update the questions display based on the latest selection
    if (selectedQuestions.length > 0) {
      const content = selectedQuestions
        .map((q) => `ID: ${q.questionId}\nQuestion: ${q.question_content}`)
        .join("\n\n---\n\n");
      valuesToSet.questions_display = content;
    } else if (currentValues?.questions_display) {
      valuesToSet.questions_display = currentValues.questions_display;
    } else if (!currentValues) {
      valuesToSet.questions_display = undefined;
    }

    // Apply all changes to the form at once
    if (Object.keys(valuesToSet).length > 0) {
      form.setFieldsValue(valuesToSet);
    }
  }, [location.state, form]); // Dependency on location.state is key

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
    expire_time: dayjs.Dayjs;
  }) => {
    // --- FIX START ---
    // Use the 'selectedQuestions' and 'classId' variables already available in the component's scope
    const questionIds = selectedQuestions.map((q) => q.questionId);
    if (questionIds.length === 0) {
      message.warning("Please select at least one question.");
      return;
    }

    // Convert dayjs object to ISO string for the backend
    const payload = {
      ...values,
      expire_time: values.expire_time.toISOString(),
      classId, // This now correctly refers to the classId from the component's scope
      questionIds,
    };
    run(payload);
    // --- FIX END ---
  }; // This function now saves the current form state before navigating away

  const handleSelectQuestions = () => {
    const currentFormValues = form.getFieldsValue();
    navigate("/class/assignment/assign-assignment", {
      state: {
        classId,
        // Pass the current form values to the selection page
        currentValues: currentFormValues,
      },
    });
  };

  return (
    <PageContainer content="Create a new assignment for your class.">
           {" "}
      <Card bordered={false}>
               {" "}
        <ProForm
          form={form}
          layout="vertical"
          style={{ maxWidth: 800, margin: "auto" }}
          onFinish={onFinish}
          submitter={{
            searchConfig: { submitText: "Submit", resetText: "Reset" },
            submitButtonProps: { loading: loading },
          }}
        >
                   {" "}
          <ProFormText
            name="title"
            label="Assignment Title"
            placeholder="e.g., Chapter 5 Homework"
            rules={[
              { required: true, message: "Please enter the assignment title." },
            ]}
          />
                   {" "}
          <ProFormDateTimePicker
            name="expire_time"
            label="Expire Time"
            placeholder="Select the deadline for this assignment"
            rules={[
              { required: true, message: "Please select an expiration time." },
            ]}
          />
                   {" "}
          <Form.Item label="Selected Questions">
                       {" "}
            <Button type="primary" onClick={handleSelectQuestions}>
                            Select Questions            {" "}
            </Button>
                     {" "}
          </Form.Item>
                   {" "}
          <ProFormTextArea
            name="questions_display"
            label="Question Content"
            placeholder="Question content will appear here after selection."
            disabled
            rows={8}
          />
                 {" "}
        </ProForm>
             {" "}
      </Card>
         {" "}
    </PageContainer>
  );
};

export default AssignAssignmentForm;
