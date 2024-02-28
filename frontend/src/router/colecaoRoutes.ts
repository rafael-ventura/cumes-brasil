// authRoutes.ts
import { RouteRecordRaw } from "vue-router";
import ColecoesView from "../views/ColecoesView.vue";
import ColecaoDetalhadaView from "../views/ColecaoDetalhadaView.vue";

const colecaoRoutes: Array<RouteRecordRaw> = [
  {
    path: "/colecoes",
    name: "colecoes",
    component: ColecoesView
  },
  {
    path: "/colecoes/:id",
    name: "colecaoDetalhada",
    component: ColecaoDetalhadaView
  }
];

export default colecaoRoutes;
