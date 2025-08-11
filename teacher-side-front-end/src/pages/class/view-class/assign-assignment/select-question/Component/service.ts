import { request } from "@umijs/max";
import type { Params, QuestionDataType } from "./data.d";

export async function queryFakeList(
  params: Params,
): Promise<{ data: { list: QuestionDataType[] } }> {
  return request("/api/fake_list", {
    method: "POST",
    data: params,
  });
}
