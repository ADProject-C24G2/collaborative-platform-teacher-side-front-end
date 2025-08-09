import { request } from "@umijs/max";
import type { CurrentUser, ListItemDataType, classStudent } from "./data.d";

export async function queryCurrent(): Promise<{ data: CurrentUser }> {
  return request("/teacher/class/currentUserDetail");
}

export async function queryFakeList(params: {
  count: number;
}): Promise<{ data: { list: ListItemDataType[] } }> {
  return request("/teacher/class/class-list", {
    params,
  });
}

export async function fakeSubmitForm(params: any) {
  return request("/teacher/class/make-announcement", {
    method: "POST",
    data: params,
  });
}

export async function fetchStudentList(
  classId: string,
): Promise<{ data: classStudent[] }> {
  return request("/teacher/class/getStudents", {
    method: "GET",
    params: { classId },
  });
}
