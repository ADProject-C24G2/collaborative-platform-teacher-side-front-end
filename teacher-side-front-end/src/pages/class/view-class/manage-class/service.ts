// src/pages/profile/basic/service.ts

import { request } from "@umijs/max";
// Import updated types
import type { Announcement, Assignment } from "./data.d";

export async function queryAnnouncementList(params: {
  classId?: string;
}): Promise<{
  data: Announcement[];
}> {
  return request("/api/announcement/list", { params });
}

export async function queryAssignmentStatus(params: {
  classId?: string;
}): Promise<{
  data: Assignment[];
}> {
  return request("/api/assignment/status", { params });
}
