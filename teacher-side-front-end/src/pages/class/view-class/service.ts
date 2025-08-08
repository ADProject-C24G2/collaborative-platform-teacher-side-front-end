import { request } from "@umijs/max";
import type { CurrentUser, ListItemDataType } from "./data.d";

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
