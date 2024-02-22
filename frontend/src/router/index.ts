import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignUpView from "../views/auth/SignUpView.vue";
import LoginView from "../views/auth/LoginView.vue";
import RedefinirSenhaView from "../views/auth/RedefinirSenhaView.vue";
import ViasView from "../views/ViasView.vue";
import ViaDetalhadaView from "../views/ViaDetalhadaView.vue";
import ColecoesView from "../views/ColecoesView.vue";
import ColecaoDetalhadaView from "../views/ColecaoDetalhadaView.vue";
import PerfilUsuarioView from "../views/PerfilUsuarioView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView
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
  },
  {
    path: "/vias",
    name: "vias",
    component: ViasView
  },
  {
    path: "/vias/:id",
    name: "viaDetalhada",
    component: ViaDetalhadaView
  },
  {
    path: "/colecoes",
    name: "colecoes",
    component: ColecoesView
  },
  {
    path: "/colecoes/:id",
    name: "colecaoDetalhada",
    component: ColecaoDetalhadaView
  },
  {
    path: "/perfil",
    name: "perfil",
    component: PerfilUsuarioView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
