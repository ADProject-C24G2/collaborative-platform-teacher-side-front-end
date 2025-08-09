import type { Request, Response } from "express";

// Mock data for announcements
const announcements = [
  {
    title: "Holiday Notice: May Day Break",
    createTime: "2025-04-30 10:00:00",
    recipientType: "all",
    content:
      "As per the national holiday schedule, the school will be closed for May Day from May 1st to May 5th.",
  },
  {
    title: "CS Department: Final Thesis Defense Schedule",
    createTime: "2025-04-28 15:30:00",
    recipientType: "specific",
    students: [{ studentId: "S001", studentName: "John Doe" }],
    content:
      "The final thesis defense is scheduled for May 15th, 9:00 AM, at the main auditorium.",
  },
];

// Mock data for assignment statuses
const assignmentStatus = [
  {
    assignment_name: "Mathematics: Chapter 1 Homework",
    submissions: [
      {
        key: "math-001",
        student_id: "S001",
        student_name: "John Doe",
        whether_finish: 0,
        accuracy: "95%",
        finish_time: "2025-08-09 10:20:00",
      },
      {
        key: "math-002",
        student_id: "S002",
        student_name: "Jane Smith",
        whether_finish: 0,
        accuracy: "88%",
        finish_time: "2025-08-09 11:30:00",
      },
      {
        key: "math-003",
        student_id: "S003",
        student_name: "Peter Jones",
        whether_finish: 1,
        accuracy: "-",
        finish_time: "-",
      },
      {
        key: "math-004",
        student_id: "S004",
        student_name: "Mary Williams",
        whether_finish: 0,
        accuracy: "100%",
        finish_time: "2025-08-08 20:00:00",
      },
    ],
  },
  {
    assignment_name: "History Essay: The Significance of the Silk Road",
    submissions: [
      {
        key: "hist-001",
        student_id: "S001",
        student_name: "John Doe",
        whether_finish: 1,
        accuracy: "-",
        finish_time: "-",
      },
      {
        key: "hist-002",
        student_id: "S002",
        student_name: "Jane Smith",
        whether_finish: 0,
        accuracy: "A+",
        finish_time: "2025-08-10 01:15:00",
      },
      {
        key: "hist-005",
        student_id: "S005",
        student_name: "David Brown",
        whether_finish: 0,
        accuracy: "A",
        finish_time: "2025-08-09 23:45:00",
      },
    ],
  },
];

// --- API Handlers ---
function getAnnouncementList(_: Request, res: Response) {
  return res.json({
    data: announcements,
  });
}

function getAssignmentStatus(_: Request, res: Response) {
  return res.json({
    data: assignmentStatus,
  });
}

export default {
  "GET /api/announcement/list": getAnnouncementList,
  "GET /api/assignment/status": getAssignmentStatus,
};
