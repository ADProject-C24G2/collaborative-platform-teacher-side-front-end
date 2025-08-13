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
