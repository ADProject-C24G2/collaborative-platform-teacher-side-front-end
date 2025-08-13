// src/pages/profile/basic/data.d.ts

export type Announcement = {
  title: string;
  createTime: number[];
  recipientType: "all" | "specific";
  students?: {
    studentId: string;
    studentName: string;
  }[];
  content: string;
};

// A single student's submission record
export type Submission = {
  key: string; // Unique key for React
  studentId: string;
  studentName: string;
  whetherFinish: 0 | 1; // 0: Finished, 1: In Progress
  accuracy: string;
  finishTime: string;
};

// A single assignment and all its submissions
export type Assignment = {
  assignmentName: string;
  submissions: Submission[];
};
