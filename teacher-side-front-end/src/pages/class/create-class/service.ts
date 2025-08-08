// src/services/form.ts 或 ./service.ts
import { request } from "@umijs/max";

export async function fakeSubmitForm(params: any) {
  return request("/teacher/class/create", {
    method: "POST",
    data: params,
  });
}
