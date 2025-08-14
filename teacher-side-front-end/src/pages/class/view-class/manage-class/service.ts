// src/pages/profile/basic/service.ts

import { request } from "@umijs/max";
// Import updated types
import type { Announcement, Assignment } from "./data.d";

export async function queryAnnouncementList(params: {
  classId?: string;
}): Promise<{
  data: Announcement[];
}> {
  return request("/teacher/class/get-announcement", { params });
}

export async function queryAssignmentStatus(params: {
  classId?: string;
}): Promise<{
  data: Assignment[];
}> {
  return request("/teacher/class/assignment-status", { params });
}

export async function deleteAssignment(params: { assignmentId: string }) {
  // This function sends a POST request to the specified endpoint with the assignmentId.
  // The backend should be configured to handle this request and delete the corresponding assignment.
  return request("/teacher/class/delete-assignment", {
    method: "POST",
    data: params,
  });
}
