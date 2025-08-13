import component from "@/locales/bn-BD/component";

export default [
  {
    path: "/user",
    layout: false,
    routes: [
      {
        name: "login",
        path: "/user/login",
        component: "./user/login",
      },
    ],
  },

  {
    path: "/",
    redirect: "/class/view-class",
  },
  {
    component: "404",
    layout: false,
    path: "./*",
  },

  {
    name: "Upload Question",
    path: "/class/upload-question",
    component: "./upload-question",
  },

  // ✅ 这里是最后一个大对象，前面的对象必须以逗号结尾
  {
    name: "Class",
    path: "/class",
    routes: [
      {
        name: "Create Class",
        path: "create-class",
        component: "./class/create-class",
      },
      {
        name: "Dashboard",
        path: "view-class",
        component: "./class/view-class",
      },
      {
        path: "make-announcement",
        component: "./class/view-class/make-announcement",
      },
      {
        path: "manage-class",
        component: "./class/view-class/manage-class",
      },
      {
        path: "assignment-form",
        component: "./class/view-class/assign-assignment/assignment-form",
      },
      {
        path: "assignment",
        component: "./class/view-class/assign-assignment/select-question",
        routes: [
          {
            path: "assign-assignment",
            component:
              "./class/view-class/assign-assignment/select-question/Component",
          },
        ],
      },
    ],
  }, // ✅ 这里必须加逗号，因为后面还有元素
];
