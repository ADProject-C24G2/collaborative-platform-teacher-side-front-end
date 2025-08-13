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

export type Annoumcement = {
  classId: string;
};

export type classStudent = {
  studentId: string;
  studentName: string;
};

export type ListItemDataType = {
  id: string;
  className?: string; // 班级名称
  studentAmount?: number; // 学生数量
  ongoingAssignment?: number; //
  avatar?: string; // 班级图标
  title?: string; // 兼容字段
};
