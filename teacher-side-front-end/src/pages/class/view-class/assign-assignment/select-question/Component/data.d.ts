// src/pages/list/search/articles/data.d.ts

// Defines the filter parameters sent to the API
export interface Params {
  count: number;
  page?: number; // Added for pagination
  keyword?: string;
  grade?: string[];
  subject?: string[];
  category?: string[];
  topic?: string[];
  token?: string;
}

// Defines the structure for a single question object
export interface QuestionDataType {
  id: number;
  image?: string;
  question: string;
  choices: string[];
  answer: number;
}
