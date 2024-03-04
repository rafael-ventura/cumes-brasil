// routes/index.ts

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import userRoutes from "./userRoutes";
import viasRoutes from "./viaRoutes";
import colecaoRoutes from "./colecaoRoutes";
import SignUpView from "@/views/auth/SignUpView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import RedefinirSenhaView from "@/views/auth/RedefinirSenhaView.vue";
import authService from "@/services/authenticateService";

const routes: Array<RouteRecordRaw> = [
  ...userRoutes,
  ...viasRoutes,
  ...colecaoRoutes,
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView
  },
  {
    path: "/login",
    name: "login",
    component: LoginView
  },
  {
    path: "/recover",
    name: "recover",
    component: RedefinirSenhaView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  next();
});

// router.beforeEach((to, from, next) => {
//   if (to.meta.requiresAuth && !authService.isAuthenticated()) {
//     next({ name: "login" });
//   } else {
//     next();
//   }
// });

export default router;
