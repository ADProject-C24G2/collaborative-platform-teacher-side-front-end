import { request } from "@umijs/max";

// Define the type for the payload
interface AssignAssignmentParams {
  classId?: string;
  title: string;
  expire_time: string;
  questionIds: string[];
}

export async function assignAssignment(params: AssignAssignmentParams) {
  return request("/teacher/class/make-assignment", {
    method: "POST",
    data: params,
  });
}
