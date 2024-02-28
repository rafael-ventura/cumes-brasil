import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import userRoutes from "./userRoutes";
import viasRoutes from "./viaRoutes";
import colecaoRoutes from "./colecaoRoutes";

const routes: Array<RouteRecordRaw> = [
  ...userRoutes,
  ...viasRoutes,
  ...colecaoRoutes,
  {
    path: "/",
    name: "home",
    component: HomeView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
