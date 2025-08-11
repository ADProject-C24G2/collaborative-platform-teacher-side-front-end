import type { Request, Response } from "express";
import type { QuestionDataType } from "./data.d";
import { DefaultOptionType } from "antd/es/select";

// --- Filter Options (Unchanged) ---
export const gradeOptions: DefaultOptionType[] = [
  { value: "grade1", label: "Grade 1" },
  { value: "grade2", label: "Grade 2" },
  { value: "grade3", label: "Grade 3" },
  { value: "grade4", label: "Grade 4" },
  { value: "grade5", label: "Grade 5" },
  { value: "grade6", label: "Grade 6" },
  { value: "grade7", label: "Grade 7" },
  { value: "grade8", label: "Grade 8" },
  { value: "grade9", label: "Grade 9" },
  { value: "grade10", label: "Grade 10" },
  { value: "grade11", label: "Grade 11" },
  { value: "grade12", label: "Grade 12" },
];

// 2. 学科选项 (Subject Options)
// Values contain spaces, as per the source data format.
export const subjectOptions: DefaultOptionType[] = [
  { value: "language science", label: "Language Science" },
  { value: "natural science", label: "Natural Science" },
  { value: "social science", label: "Social Science" },
];

// 3. 类别选项 (Category Options)
// Values are derived from labels, converted to lowercase with spaces preserved.
export const categoryOptions: DefaultOptionType[] = [
  // 科学类
  { value: "adaptations", label: "Adaptations" },
  { value: "anatomy and physiology", label: "Anatomy and physiology" },
  { value: "astronomy", label: "Astronomy" },
  { value: "atoms and molecules", label: "Atoms and molecules" },
  { value: "cells", label: "Cells" },
  { value: "chemical reactions", label: "Chemical reactions" },
  { value: "climate change", label: "Climate change" },
  { value: "electricity", label: "Electricity" },
  { value: "force and motion", label: "Force and motion" },
  { value: "genes to traits", label: "Genes to traits" },
  { value: "photosynthesis", label: "Photosynthesis" },
  { value: "rocks and minerals", label: "Rocks and minerals" },
  { value: "water cycle", label: "Water cycle" },
  { value: "weather and climate", label: "Weather and climate" },
  // 历史与社会类
  { value: "age of exploration", label: "Age of Exploration" },
  { value: "colonial america", label: "Colonial America" },
  { value: "early china", label: "Early China" },
  { value: "early modern europe", label: "Early Modern Europe" },
  { value: "islamic empires", label: "Islamic empires" },
  { value: "the american revolution", label: "The American Revolution" },
  { value: "the civil war", label: "The Civil War" },
  { value: "the silk road", label: "The Silk Road" },
  { value: "world religions", label: "World religions" },
  // 语言与阅读类
  { value: "author's purpose", label: "Author's purpose" },
  { value: "comprehension strategies", label: "Comprehension strategies" },
  { value: "context clues", label: "Context clues" },
  { value: "literary devices", label: "Literary devices" },
  { value: "poetry elements", label: "Poetry elements" },
  { value: "pronouns", label: "Pronouns" },
  { value: "rhyming", label: "Rhyming" },
  { value: "text structure", label: "Text structure" },
  // 写作与技巧类
  { value: "editing and revising", label: "Editing and revising" },
  { value: "opinion writing", label: "Opinion writing" },
  { value: "persuasive strategies", label: "Persuasive strategies" },
  { value: "verb tense", label: "Verb tense" },
  { value: "word usage and nuance", label: "Word usage and nuance" },
];

// 4. 主题选项 (Topic Options)
// Values are used exactly as provided, some with hyphens and some without.
export const topicOptions: DefaultOptionType[] = [
  { value: "capitalization", label: "Capitalization" },
  { value: "chemistry", label: "Chemistry" },
  { value: "civics", label: "Civics" },
  { value: "culture", label: "Culture" },
  { value: "economics", label: "Economics" },
  { value: "earth-science", label: "Earth Science" },
  { value: "figurative-language", label: "Figurative Language" },
  { value: "global-studies", label: "Global Studies" },
  { value: "grammar", label: "Grammar" },
  { value: "literacy-in-science", label: "Literacy in Science" },
  { value: "phonological-awareness", label: "Phonological Awareness" },
  { value: "physics", label: "Physics" },
  { value: "pronouns", label: "Pronouns" },
  { value: "punctuation", label: "Punctuation" },
  { value: "reading-comprehension", label: "Reading Comprehension" },
  { value: "reference-skills", label: "Reference Skills" },
  {
    value: "science-and-engineering-practices",
    label: "Science and Engineering Practices",
  },
  { value: "units-and-measurement", label: "Units and Measurement" },
  { value: "us-history", label: "US History" },
  { value: "verbs", label: "Verbs" },
  { value: "vocabulary", label: "Vocabulary" },
  { value: "word-study", label: "Word Study" },
  { value: "world-history", label: "World History" },
  { value: "writing-strategies", label: "Writing Strategies" },
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
