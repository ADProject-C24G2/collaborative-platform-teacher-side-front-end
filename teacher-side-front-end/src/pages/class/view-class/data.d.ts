export interface TagType {
  key: string;
  label: string;
}

export type CurrentUser = {
  name: string;
  avatar: string;
  userid: string;
  notice: NoticeType[];
  email: string;
  signature: string;
  title: string;
  group: string;
  tags: TagType[];
  address: string;
};

export type ListItemDataType = {
  id: string;
  className?: string; // 班级名称
  studentAmount?: number; // 学生数量
  unreadMessages?: number; // 未读消息数
  avatar?: string; // 班级图标
  title?: string; // 兼容字段
};
