import type { Request, Response } from "express";
import type { ListItemDataType } from "./data.d";

const courseAvatars = [
  "https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png", // Ant Design Pro 风格
  "https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png",
  "https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png",
  "https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png",
];

// 当前用户信息（老师）
const currentUseDetail = {
  // name: "Teacher Li",
  // avatar:
  //   "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
  // userid: "00000001",
  // email: "li.teacher@school.edu.cn",
  // signature: "Dedicated to teaching and student growth",
  // title: "Senior Lecturer",
  // address: "Zhejiang Hangzhou",
  // group: "School of Computer Science - Department of Software Engineering",
  // tags: [
  //   { key: "0", label: "Introduction to Programming" },
  //   { key: "1", label: "Web Development Fundamentals" },
  //   { key: "2", label: "Database Systems" },
  //   { key: "3", label: "Data Structures and Algorithms" },
  //   { key: "4", label: "Software Engineering Practice" },
  //   { key: "5", label: "Machine Learning Basics" },
  // ],
  // // address: "No. 1 University Town, Xihu District",
  // // phone: "0571-88888888",
};

// 生成课程列表数据
function fakeList(count: number): ListItemDataType[] {
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push({
      id: `class-${i}`,
      className: ["Java 入门", "前端实战", "数据库原理", "Python 数据分析"][
        i % 4
      ],
      studentAmount: Math.floor(Math.random() * 50) + 10, // 10-60 人
      unreadMessages: Math.floor(Math.random() * 10), // 0-9 条
      avatar: courseAvatars[i % courseAvatars.length],
      title: "", // 兼容
    });
  }
  return list;
}

// 获取课程列表
function getFakeList(req: Request, res: Response) {
  const params = req.query as any;
  const count = Number(params.count) * 1 || 5;
  const result = fakeList(count);
  return res.json({
    data: {
      list: result,
    },
  });
}

// 获取当前用户（老师）信息
function getCurrentUser(_req: Request, res: Response) {
  return res.json({
    data: currentUseDetail,
  });
}

export default {
  "GET /api/fake_list_Detail": getFakeList,
  "GET /api/currentUserDetail": getCurrentUser,
};
