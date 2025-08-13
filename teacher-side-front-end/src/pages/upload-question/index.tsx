import {
  PageContainer,
  ProForm,
  ProFormDependency,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormItem,
} from "@ant-design/pro-components";
import { useRequest } from "@umijs/max";
import { Card, message, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { FC } from "react";
import { fakeSubmitForm } from "./service";
import useStyles from "./style.style";
import {
  gradeOptions,
  subjectOptions,
  categoryOptions,
  topicOptions,
} from "./QuestionOptions"; // Adjust path as needed

const BasicForm: FC<Record<string, any>> = () => {
  const { styles } = useStyles();
  const { run } = useRequest(fakeSubmitForm, {
    manual: true,
    onSuccess: () => {
      message.success("提交成功");
    },
  });
  const onFinish = async (values: Record<string, any>) => {
    run(values);
  };

  return (
    <PageContainer content="Please enter the details for uploading a question.">
      <Card variant="borderless">
        <ProForm
          hideRequiredMark
          style={{
            margin: "auto",
            marginTop: 8,
            maxWidth: 600,
          }}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
        >
          <ProFormItem
            name="image"
            label="Question Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            rules={[
              {
                required: false,
                message: "Please upload an image if needed",
              },
            ]}
          >
            <Upload
              name="files"
              listType="picture"
              accept="image/*"
              action="/upload.do" // Replace with your actual upload endpoint
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </ProFormItem>

          <ProFormTextArea
            label="Question Stem"
            width="xl"
            name="stem"
            rules={[
              {
                required: true,
                message: "Please enter the question stem",
              },
            ]}
            placeholder="Enter the question text"
          />

          <ProFormList
            name="options"
            label="Options"
            min={2}
            creatorButtonProps={{
              creatorButtonText: "Add Option",
            }}
            initialValue={["", "", "", ""]}
          >
            {(field, index) => (
              <ProFormText
                label={`Option ${String.fromCharCode(65 + index)}`}
                name={[field.name]}
                key={field.key}
                rules={[
                  {
                    required: true,
                    message: "Please enter the option",
                  },
                ]}
                placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
              />
            )}
          </ProFormList>

          <ProFormDependency name={["options"]}>
            {({ options }) => {
              const ansOptions =
                options?.map((_: string, idx: number) => ({
                  value: String.fromCharCode(65 + idx),
                  label: String.fromCharCode(65 + idx),
                })) || [];
              return (
                <ProFormSelect
                  width="md"
                  name="answer"
                  label="Correct Answer"
                  rules={[
                    {
                      required: true,
                      message: "Please select the correct answer",
                    },
                  ]}
                  options={ansOptions}
                />
              );
            }}
          </ProFormDependency>

          <ProFormTextArea
            label="Solution"
            width="xl"
            name="solution"
            rules={[
              {
                required: true,
                message: "Please enter the solution",
              },
            ]}
            placeholder="Enter the answer explanation"
          />

          <ProFormSelect
            width="md"
            name="grade"
            label="Grade"
            rules={[
              {
                required: true,
                message: "Please select the grade",
              },
            ]}
            options={gradeOptions}
          />

          <ProFormSelect
            width="md"
            name="subject"
            label="Subject"
            rules={[
              {
                required: true,
                message: "Please select the subject",
              },
            ]}
            options={subjectOptions}
          />

          <ProFormSelect
            width="md"
            name="category"
            label="Category"
            rules={[
              {
                required: true,
                message: "Please select the category",
              },
            ]}
            options={categoryOptions}
          />

          <ProFormSelect
            width="md"
            name="topic"
            label="Topic"
            rules={[
              {
                required: true,
                message: "Please select the topic",
              },
            ]}
            options={topicOptions}
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};
export default BasicForm;
