import type { Request, Response } from "express";
import type { QuestionDataType } from "./data.d";
import { DefaultOptionType } from "antd/es/select";

// --- Filter Options (Unchanged) ---
export const gradeOptions: DefaultOptionType[] = [
  { value: "grade1", label: "Grade 1" } /* ... */,
];
export const subjectOptions: DefaultOptionType[] = [
  { value: "language-science", label: "Language Science" } /* ... */,
];
export const categoryOptions: DefaultOptionType[] = [
  { value: "analyzing-literature", label: "Analyzing literature" } /* ... */,
];
export const topicOptions: DefaultOptionType[] = [
  { value: "grammar", label: "Grammar" } /* ... */,
];

// --- Generate a larger list of questions for pagination ---
const allQuestions = ((): QuestionDataType[] => {
  const list: QuestionDataType[] = [];
  for (let i = 0; i < 50; i += 1) {
    // Generate 50 questions in total
    const questionId = i + 1;
    list.push({
      id: questionId,
      image:
        i % 2 === 0
          ? `https://placehold.co/400x200/EEE/31343C?text=Question+Image+${questionId}`
          : undefined,
      question: `This is the text for question number ${questionId}. What is the correct answer?`,
      choices: [
        `Choice A for question ${questionId}`,
        `Choice B for question ${questionId}`,
        `Choice C for question ${questionId}`,
        `Choice D for question ${questionId}`,
      ],
      answer: i % 4,
    });
  }
  return list;
})();

// --- API Handler (Updated for pagination) ---
function getQuestionList(req: Request, res: Response) {
  const params = req.body;
  console.log("Received JSON payload for questions:", params);

  const count = params.count || 5;
  const page = params.page || 1;

  const startIndex = (page - 1) * count;
  const endIndex = startIndex + count;

  const paginatedList = allQuestions.slice(startIndex, endIndex);

  return res.json({
    data: {
      list: paginatedList,
    },
  });
}

export default {
  "POST /api/fake_list": getQuestionList,
};
