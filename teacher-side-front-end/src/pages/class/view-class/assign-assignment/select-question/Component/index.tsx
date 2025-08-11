// select.tsx (no changes needed)
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useRequest } from "@umijs/max";
import {
  Button,
  Card,
  Checkbox,
  Col,
  FloatButton,
  Form,
  List,
  Radio,
  Row,
  Space,
} from "antd";
import type { FC } from "react";
import React, { useMemo, useState } from "react";
import {
  categoryOptions,
  gradeOptions,
  subjectOptions,
  topicOptions,
} from "./_mock";
import StandardFormRow from "./StandardFormRow";
import TagSelect from "./TagSelect";
import type { QuestionDataType, Params } from "./data.d";
import { queryFakeList } from "./service";
import useStyles from "./style.style";

const FormItem = Form.Item;
const pageSize = 5;

type SelectedQuestion = {
  questionId: string;
  question_content: string;
};

type LocationState = {
  classId?: string;
  selectedQuestions?: SelectedQuestion[];
  currentValues?: any;
};

const Articles: FC = () => {
  const [form] = Form.useForm();
  const { styles } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};
  const {
    classId,
    currentValues,
    selectedQuestions: initialSelected = [],
  } = state;

  const [formValues, setFormValues] = useState<Omit<Params, "count">>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(
    new Set(),
  );
  const [selectedQuestions, setSelectedQuestions] = useState<
    Map<number, SelectedQuestion>
  >(() => new Map(initialSelected.map((q) => [Number(q.questionId), q])));

  const { data, loading, loadMore, loadingMore } = useRequest(
    (d?: { list: QuestionDataType[] }) => {
      const currentList = d?.list || [];
      const currentPage = Math.ceil(currentList.length / pageSize) + 1;
      return queryFakeList({
        ...formValues,
        count: pageSize,
        page: currentPage,
        token: "123",
      });
    },
    {
      loadMore: true,
      refreshDeps: [formValues],
      formatResult: (res) => res.data,
      isNoMore: (d) => (d ? d.list.length >= 50 : false),
    },
  );

  const list = data?.list || [];
  const noMoreData = useMemo(
    () => (data ? data.list.length >= 50 : false),
    [data],
  );

  const handleSelectionChange = (item: QuestionDataType, checked: boolean) => {
    setSelectedQuestions((prev) => {
      const newMap = new Map(prev);
      if (checked) {
        newMap.set(item.id, {
          questionId: String(item.id),
          question_content: item.question,
        });
      } else {
        newMap.delete(item.id);
      }
      return newMap;
    });
  };

  // This function now correctly passes the preserved form values back
  // In your Question Selection Page (Articles/index.tsx)

  const handleConfirmSelection = () => {
    const questionsToReturn = Array.from(selectedQuestions.values());

    // IMPORTANT: Replace '/class/assignment-form' with the actual route if different
    // for the AssignAssignmentForm component.
    navigate("/class/assignment-form", {
      state: {
        classId,
        selectedQuestions: questionsToReturn,
        currentValues,
      },
    });
  };

  const toggleAnswer = (id: number) => {
    setRevealedAnswers((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const loadMoreDom = !noMoreData && (
    <div style={{ textAlign: "center", marginTop: 24 }}>
      {" "}
      <Button onClick={loadMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
        {" "}
        {loadingMore ? (
          <span>
            <LoadingOutlined /> Loading...
          </span>
        ) : (
          "Load More"
        )}{" "}
      </Button>{" "}
    </div>
  );

  return (
    <>
      <FloatButton
        icon={<CheckOutlined />}
        type="primary"
        tooltip={`Confirm Selection (${selectedQuestions.size} selected)`}
        onClick={handleConfirmSelection}
      />{" "}
      <Card bordered={false}>
        {" "}
        <Form
          layout="inline"
          form={form}
          onValuesChange={(_, allValues) => {
            const filteredValues = Object.fromEntries(
              Object.entries(allValues).filter(
                ([, value]) => Array.isArray(value) && value.length > 0,
              ),
            );
            setFormValues(filteredValues);
          }}
        >
          <StandardFormRow title="GRADE" block style={{ paddingBottom: 11 }}>
            <FormItem name="grade">
              <TagSelect expandable>
                {gradeOptions.map((o) => (
                  <TagSelect.Option value={o.value!} key={o.value}>
                    {o.label}
                  </TagSelect.Option>
                ))}
              </TagSelect>
            </FormItem>
          </StandardFormRow>
          <StandardFormRow title="SUBJECT" block style={{ paddingBottom: 11 }}>
            <FormItem name="subject">
              <TagSelect expandable>
                {subjectOptions.map((o) => (
                  <TagSelect.Option value={o.value!} key={o.value}>
                    {o.label}
                  </TagSelect.Option>
                ))}
              </TagSelect>
            </FormItem>
          </StandardFormRow>
          <StandardFormRow title="CATEGORY" block style={{ paddingBottom: 11 }}>
            <FormItem name="category">
              <TagSelect expandable>
                {categoryOptions.map((o) => (
                  <TagSelect.Option value={o.value!} key={o.value}>
                    {o.label}
                  </TagSelect.Option>
                ))}
              </TagSelect>
            </FormItem>
          </StandardFormRow>
          <StandardFormRow title="TOPIC" block style={{ paddingBottom: 11 }}>
            <FormItem name="topic">
              <TagSelect expandable>
                {topicOptions.map((o) => (
                  <TagSelect.Option value={o.value!} key={o.value}>
                    {o.label}
                  </TagSelect.Option>
                ))}
              </TagSelect>
            </FormItem>
          </StandardFormRow>{" "}
        </Form>{" "}
      </Card>{" "}
      <Card
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: "8px 32px 32px 32px" }}
      >
        {" "}
        <List<QuestionDataType>
          size="large"
          loading={loading && list.length === 0}
          rowKey="id"
          itemLayout="vertical"
          loadMore={loadMoreDom}
          dataSource={list}
          renderItem={(item) => {
            const isRevealed = revealedAnswers.has(item.id);
            return (
              <List.Item
                key={item.id}
                actions={[
                  <Button
                    key="reveal"
                    type="primary"
                    onClick={() => toggleAnswer(item.id)}
                  >
                    {isRevealed ? "Hide Answer" : "Show Answer"}
                  </Button>,
                ]}
                extra={
                  <Checkbox
                    checked={selectedQuestions.has(item.id)}
                    onChange={(e) =>
                      handleSelectionChange(item, e.target.checked)
                    }
                  />
                }
              >
                <Row gutter={24}>
                  {item.image && (
                    <Col xs={24} sm={8} md={6}>
                      <img
                        // 使用模板字符串（反引号 ``）来拼接出完整的 Data URL
                        src={`data:image/png;base64,${item.image}`}
                        alt={`Question ${item.id}`}
                        style={{ maxWidth: "100%", borderRadius: "8px" }}
                      />
                    </Col>
                  )}
                  <Col
                    xs={24}
                    sm={item.image ? 16 : 24}
                    md={item.image ? 18 : 24}
                  >
                    <p
                      style={{
                        fontWeight: 500,
                        fontSize: "16px",
                        marginBottom: "16px",
                      }}
                    >
                      {item.question}
                    </p>
                    <Radio.Group
                      value={isRevealed ? item.answer : undefined}
                      style={{ width: "100%" }}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        {item.choices.map((choice, index) => (
                          <Radio key={index} value={index} disabled>
                            <span
                              style={{
                                color:
                                  isRevealed && index === item.answer
                                    ? "#52c41a"
                                    : "inherit",
                                fontWeight:
                                  isRevealed && index === item.answer
                                    ? "bold"
                                    : "normal",
                              }}
                            >
                              {choice}
                            </span>
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  </Col>
                </Row>
              </List.Item>
            );
          }}
        />{" "}
      </Card>{" "}
    </>
  );
};

export default Articles;
