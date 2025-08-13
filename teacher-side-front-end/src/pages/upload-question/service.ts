import { request } from "@umijs/max";

export async function fakeSubmitForm(params: any) {
  return request("/teacher/class/upload-question", {
    method: "POST",
    data: params,
  });
}
