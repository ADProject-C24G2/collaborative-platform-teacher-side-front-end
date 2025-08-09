// src/pages/profile/basic/data.d.ts

export type Announcement = {
  title: string;
  createTime: string;
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
  student_id: string;
  student_name: string;
  whether_finish: 0 | 1; // 0: Finished, 1: In Progress
  accuracy: string;
  finish_time: string;
};

// A single assignment and all its submissions
export type Assignment = {
  assignment_name: string;
  submissions: Submission[];
};
