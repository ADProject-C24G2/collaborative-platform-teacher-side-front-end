import {
  PageContainer,
  ProForm,
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { InputNumber } from "antd";
import { useRequest } from "@umijs/max";
import { Card, message } from "antd";
import type { FC } from "react";
import { fakeSubmitForm } from "./service";
import useStyles from "./style.style";

const BasicForm: FC<Record<string, any>> = () => {
  const { styles } = useStyles();
  const { run } = useRequest(fakeSubmitForm, {
    manual: true,
    onSuccess: () => {
      message.success("Success in creation");
    },
  });
  const onFinish = async (values: Record<string, any>) => {
    console.log("✅ 开始提交表单");
    run(values);
  };
  return (
    <PageContainer content="Please enter the details for creating a class.">
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
          initialValues={{
            public: "1",
          }}
          onFinish={onFinish}
        >
          <ProFormText
            width="md"
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter the class name",
              },
            ]}
            placeholder="Give the class a name"
          />
          <ProFormDateRangePicker
            label="Beginning and ending dates"
            width="md"
            name="date"
            rules={[
              {
                required: true,
                message: "Please select the start and end dates.",
              },
            ]}
            placeholder={["Start date", "Date closed"]}
          />
          <ProFormTextArea
            label="Class Description"
            width="xl"
            name="description"
            rules={[
              {
                required: true,
                message: "Please provide the target description.",
              },
            ]}
            placeholder="Please provide your class description."
          />

          <ProFormDigit
            label={<span>Max Students</span>}
            name="maxMembers"
            placeholder="Please enter"
            min={0}
            max={100}
            width="xs"
            rules={[{ required: true, message: "Please enter a number." }]}
          />

          <ProFormRadio.Group
            options={[
              {
                value: "byLink",
                label: "Access by Link",
              },
              {
                value: "byName",
                label: "Access by Name",
              },
            ]}
            label="Joining the class method"
            help=""
            name="accessType"
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};
export default BasicForm;
