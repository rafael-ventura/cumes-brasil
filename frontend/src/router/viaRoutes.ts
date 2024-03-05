// viaRoutes.ts
import { RouteRecordRaw } from "vue-router";
import ViasView from "../views/ViasView.vue";
import ViaDetalhadaView from "../views/ViaDetalhadaView.vue";
import ViasView2 from "../views/ViasView2.vue";

const viasRoutes: Array<RouteRecordRaw> = [
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
    path: "/vias2",
    name: "vias2",
    component: ViasView2
  }
];

export default viasRoutes;
