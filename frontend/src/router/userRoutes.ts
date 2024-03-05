// userRoutes.ts
import { RouteRecordRaw } from "vue-router";
import SignUpView from "../views/auth/SignUpView.vue";
import LoginView from "../views/auth/LoginView.vue";
import RedefinirSenhaView from "../views/auth/RedefinirSenhaView.vue";
import PerfilUsuarioView from "../views/PerfilUsuarioView.vue";

const userRoutes: Array<RouteRecordRaw> = [
  {
    path: "/perfil",
    name: "perfil",
    component: PerfilUsuarioView,
    meta: { requiresAuth: true }
  }
];

export default userRoutes;
