import {
  PageContainer,
  ProForm,
  ProFormInstance,
  ProFormDependency,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormItem,
  ProFormGroup,
} from "@ant-design/pro-components";
import { useRequest } from "@umijs/max";
import { Card, message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { FC } from "react";
import { useRef } from "react";
import { fakeSubmitForm } from "./service";
import useStyles from "./style.style";
import {
  gradeOptions,
  subjectOptions,
  categoryOptions,
  topicOptions,
} from "./QuestionOptions"; // Adjust path

type OptionItem = {
  option: string;
};

const BasicForm: FC = () => {
  const { styles } = useStyles();
  const formRef = useRef<ProFormInstance | null>(null);

  const { run } = useRequest(fakeSubmitForm, {
    manual: true,
    onSuccess: () => {
      message.success("Submitted Successfully!");
    },
  });

  const onFinish = async (values: Record<string, any>) => {
    const processedValues = { ...values };
    if (processedValues.options && Array.isArray(processedValues.options)) {
      processedValues.options = processedValues.options
        .map((item: OptionItem) => item.option)
        .filter(Boolean);
    }
    console.log("Final data to be submitted:", processedValues);
    run(processedValues);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <PageContainer
      breadcrumb={{}}
      content="Form pages are used to collect or verify information from users. Basic forms are common in scenarios with fewer data items.">
      <Card>
        <ProForm
          formRef={formRef}
          layout="vertical"
          onFinish={onFinish}
          submitter={{
            searchConfig: {
              submitText: "Submit",
              resetText: "Reset",
            },
          }}
        >
          {/* Form fields... */}
          <ProForm.Group>
            <ProFormSelect
              name="grade"
              label="Grade"
              options={gradeOptions}
              placeholder="Please select a grade"
              rules={[{ required: true, message: "Please select a grade" }]}
            />
            <ProFormSelect
              name="topic"
              label="Topic"
              options={topicOptions}
              placeholder="Please select a topic"
              rules={[{ required: true, message: "Please select a topic" }]}
            />
          </ProForm.Group>

          <ProForm.Group>
            <ProFormSelect
              name="subject"
              label="Subject"
              options={subjectOptions}
              placeholder="Please select a subject"
              rules={[{ required: true, message: "Please select a subject" }]}
            />
            <ProFormSelect
              name="category"
              label="Category"
              options={categoryOptions}
              placeholder="Please select a category"
              rules={[{ required: true, message: "Please select a category" }]}
            />
          </ProForm.Group>

          <ProFormTextArea
            name="question"
            label="Stem"
            placeholder="Please enter the stem"
            rules={[{ required: true, message: "Please enter the stem" }]}
          />

          <ProFormItem name="image" hidden />

          <ProFormItem label="Image (Optional)">
            <Upload.Dragger
              listType="picture"
              maxCount={1}
              beforeUpload={async (file) => {
                const base64 = await convertFileToBase64(file);
                formRef.current?.setFieldsValue({ image: base64 });
                return false;
              }}
              onRemove={() => {
                formRef.current?.setFieldsValue({ image: undefined });
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single file upload. Strictly prohibit from
                uploading company data or other band files
              </p>
            </Upload.Dragger>
          </ProFormItem>

          <ProFormList
            name="options"
            label="Options List"
            creatorButtonProps={{
              creatorButtonText: "Add an Option",
            }}
            rules={[
              {
                validator: async (_, value) => {
                  if (value && value.length > 0) {
                    return;
                  }
                  throw new Error("Please add at least one option");
                },
              },
            ]}
          >
            {(field) => (
              <ProFormText
                key={field.key}
                name="option"
                placeholder="Please enter the option content"
                rules={[
                  { required: true, message: "Option content cannot be empty" },
                ]}
              />
            )}
          </ProFormList>

          <ProFormDependency name={["options"]}>
            {(values) => {
              const options: OptionItem[] = values.options || [];
              const ansOptions = options
                // [!code focus:start]
                .map((item: OptionItem, idx: number) => ({
                  // The value will be "1", "2", "3", ...
                  value: String(idx + 1),
                  // The label will be "1. ...", "2. ...", ...
                  label: `${idx + 1}. ${item?.option || ""}`,
                }))
                // [!code focus:end]
                .filter(
                  (item: { value: string; label: string }) =>
                    // Adjust filter length since "1. " is 3 characters
                    item.label.trim().length > 2,
                );

              if (ansOptions.length === 0) return null;

              return (
                <ProFormSelect
                  options={ansOptions}
                  name="answer"
                  label="Correct Answer"
                  placeholder="Please select the correct answer"
                  rules={[
                    {
                      required: true,
                      message: "Please select the correct answer",
                    },
                  ]}
                />
              );
            }}
          </ProFormDependency>
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default BasicForm;
