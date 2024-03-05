// colecaoRoutes.ts
import { RouteRecordRaw } from "vue-router";
import ColecoesView from "../views/ColecoesView.vue";
import ColecaoDetalhadaView from "../views/ColecaoDetalhadaView.vue";

const colecaoRoutes: Array<RouteRecordRaw> = [
  {
    path: "/colecoes",
    name: "colecoes",
    component: ColecoesView,
    meta: { requiresAuth: true }
  },
  {
    path: "/colecoes/:id",
    name: "colecaoDetalhada",
    component: ColecaoDetalhadaView,
    meta: { requiresAuth: true }
  }
];

export default colecaoRoutes;
