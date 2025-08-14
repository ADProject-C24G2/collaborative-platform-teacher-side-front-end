// src/pages/profile/basic/data.d.ts

/**
 * @description: Represents a single student record.
 */
export type Student = {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  status: 0 | 1;
};

export interface ApiResponse<T> {
  code: number;
  msg: string | null;
  data: T;
}
