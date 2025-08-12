import { CheckOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useRequest } from "@umijs/max";
import { Button, Card, Col, FloatButton, Form, Radio, Row, Space, Spin, Typography, theme } from "antd";
import type { FC } from "react";
import React, { useEffect, useRef, useState } from "react";

import { useVirtualizer } from '@tanstack/react-virtual';

import { categoryOptions, gradeOptions, subjectOptions, topicOptions } from "./_mock";
import StandardFormRow from "./StandardFormRow";
import TagSelect from "./TagSelect";
import type { QuestionDataType, Params } from "./data.d";
import { queryFakeList } from "./service";

const { Text } = Typography;
const FormItem = Form.Item;
const pageSize = 10;
const estimateSize = () => 270;

type SelectedQuestion = {
  questionId: string;
  question_content: string;
};

type LocationState = {
  classId?: string;
  selectedQuestions?: SelectedQuestion[];
  currentValues?: any;
};

const Applications: FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const state = (location.state as LocationState) || {};
  const {
    classId,
    currentValues,
    selectedQuestions: initialSelected = [],
  } = state;

  const [formValues, setFormValues] = useState<Omit<Params, "count">>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());

  const [selectedQuestions, setSelectedQuestions] = useState<Map<number, SelectedQuestion>>(
    () => new Map(initialSelected.map((q) => [Number(q.questionId), q]))
  );

  const { data, loading, loadMore, loadingMore, noMore } = useRequest(
    (d?: { list: QuestionDataType[] }) => {
      const currentList = d?.list || [];
      const currentPage = Math.ceil(currentList.length / pageSize) + 1;
      return queryFakeList({ ...formValues, count: pageSize, page: currentPage, token: "123" });
    },
    {
      loadMore: true,
      refreshDeps: [formValues],
      formatResult: (res) => res.data,
      isNoMore: (d) => !d || !d.list || d.list.length < pageSize,
    }
  );

  const list = data?.list || [];
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: list.length,
    getScrollElement: () => parentRef.current,
    estimateSize: estimateSize,
    overscan: 5,
    measureElement: (element) => element.getBoundingClientRect().height,
  });

  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    if (!virtualItems || virtualItems.length === 0) return;
    const lastItem = virtualItems[virtualItems.length - 1];
    if (lastItem.index >= list.length - 1 - 3 && !loadingMore && !noMore) {
      loadMore();
    }
  }, [rowVirtualizer.getVirtualItems(), list.length, loadingMore, noMore, loadMore]);

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

  const handleConfirmSelection = () => {
    const questionsToReturn = Array.from(selectedQuestions.values());
    navigate("/class/assignment-form", {
      state: { classId, selectedQuestions: questionsToReturn, currentValues },
    });
  };

  const toggleAnswer = (id: number) => {
    setRevealedAnswers((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const listContent = (
    <>
      {loading && list.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}><Spin size="large" /></div>
      ) : (
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = list[virtualRow.index];
            const isRevealed = revealedAnswers.has(item.id);
            const isSelected = selectedQuestions.has(item.id);

            return (
              <div
                key={item.id}
                ref={rowVirtualizer.measureElement}
                data-index={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                  paddingBottom: '24px',
                }}
              >
                <Card>
                  <Row gutter={[24, 16]} align="top">
                    {item.image && (
                      <Col xs={24} sm={8} md={6}>
                        <img src={`data:image/png;base64,${item.image}`} alt={`Question ${item.id}`} style={{ width: "100%", borderRadius: "8px" }} loading="lazy" />
                      </Col>
                    )}
                    <Col xs={24} sm={item.image ? 16 : 24} md={item.image ? 18 : 24}>
                      <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Text style={{ fontSize: "16px" }} strong>{item.question}</Text>
                        <Radio.Group value={isRevealed ? item.answer : undefined} style={{ width: "100%" }}>
                          <Space direction="vertical" style={{ width: "100%" }}>
                            {item.choices.map((choice, index) => (
                              <Radio key={index} value={index} disabled>
                                {isRevealed && index === item.answer ? (
                                  <Text type="success" strong>{choice}</Text>
                                ) : (
                                  <Text>{choice}</Text>
                                )}
                              </Radio>
                            ))}
                          </Space>
                        </Radio.Group>
                      </Space>
                    </Col>
                  </Row>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderTop: `1px solid ${token.colorBorderSecondary}`, marginTop: '24px', paddingTop: '16px' }}>
                    <Space size="middle">
                      <Button key="reveal" onClick={() => toggleAnswer(item.id)}>
                        {isRevealed ? "Hide Answer" : "Show Answer"}
                      </Button>
                      {isSelected ? (
                        <Button key="remove" danger onClick={() => handleSelectionChange(item, false)}>Remove</Button>
                      ) : (
                        <Button key="add" type="primary" onClick={() => handleSelectionChange(item, true)}>Add</Button>
                      )}
                    </Space>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}
      {(loadingMore) && <div style={{ textAlign: 'center', padding: '16px' }}><Spin /> <span style={{ marginLeft: 8 }}>Loading...</span></div>}
      {noMore && list.length > 0 && <div style={{ textAlign: 'center', padding: '16px', color: '#888' }}><span>This concludes the list.</span></div>}
    </>
  );

  return (
    <div
      ref={parentRef}
      style={{
        height: '80vh',
        overflow: 'auto',
        position: 'relative',
        padding: '24px',
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card bordered={false}>
            <Form
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
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <StandardFormRow title="GRADE" block><FormItem name="grade"><TagSelect expandable>{gradeOptions.map(o => <TagSelect.Option value={o.value!} key={o.value}>{o.label}</TagSelect.Option>)}</TagSelect></FormItem></StandardFormRow>
                <StandardFormRow title="SUBJECT" block><FormItem name="subject"><TagSelect expandable>{subjectOptions.map(o => <TagSelect.Option value={o.value!} key={o.value}>{o.label}</TagSelect.Option>)}</TagSelect></FormItem></StandardFormRow>
                <StandardFormRow title="CATEGORY" block><FormItem name="category"><TagSelect expandable>{categoryOptions.map(o => <TagSelect.Option value={o.value!} key={o.value}>{o.label}</TagSelect.Option>)}</TagSelect></FormItem></StandardFormRow>
                <StandardFormRow title="TOPIC" block><FormItem name="topic"><TagSelect expandable>{topicOptions.map(o => <TagSelect.Option value={o.value!} key={o.value}>{o.label}</TagSelect.Option>)}</TagSelect></FormItem></StandardFormRow>
              </Space>
            </Form>
          </Card>
        {listContent}
      </Space>

      <FloatButton.Group shape="circle" style={{ right: 48, bottom: 40 }}>
        <FloatButton icon={<CheckOutlined />} type="primary" tooltip={`Confirm Selection (${selectedQuestions.size} selected)`} onClick={handleConfirmSelection} badge={{ count: selectedQuestions.size, color: 'blue' }} />
        <FloatButton.BackTop visibilityHeight={400} target={() => parentRef.current || window} />
      </FloatButton.Group>
    </div>
  );
};

export default Applications;
