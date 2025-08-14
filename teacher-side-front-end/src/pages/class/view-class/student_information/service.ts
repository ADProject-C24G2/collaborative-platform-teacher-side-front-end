// src/pages/profile/basic/service.ts

import { request } from "@umijs/max";
// Make sure to import both Student and the new ApiResponse type
import type { ApiResponse, Student } from "./data.d";

/**
 * @description: Fetches a list of all students for a specific class.
 * GET /api/students
 * @param params Contains the classId.
 */
export async function getStudents(params: { classId: number | string }) {
  // ✅ FIX: Use the correct ApiResponse type here.
  // It now correctly states that the response will have a 'code' and 'data' property.
  return request<ApiResponse<Student[]>>(
    "/teacher/class/get-students-information",
    {
      method: "GET",
      params,
    },
  );
}

// ... your updateStudentStatus function remains the same
export async function updateStudentStatus(data: {
  id: number;
  status: 0 | 1;
  classId: number | string | undefined;
}) {
  return request("/teacher/class/delete-student", {
    method: "POST",
    data,
  });
}
