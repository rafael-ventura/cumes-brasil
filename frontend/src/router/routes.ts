import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Home.vue')
      },
      {
        path: 'home',
        component: () => import('pages/Home.vue')
      },
      {
        path: 'explorar',
        name: 'explorar',
        component: () => import('pages/ExplorarVias.vue')
      },
      {
        path: 'busca',
        name: 'busca',
        component: () => import('pages/CatalogoVias.vue')
      },
      {
        path: 'vias/:id',
        name: 'ViaDetalhada',
        component: () => import('pages/ViaDetalhada.vue')
      },
      {
        path: 'colecoes',
        component: () => import('pages/Colecoes.vue')
      },
      {
        path: 'colecoes/:id',
        name: 'ColecaoDetalhada',
        component: () => import('pages/ColecaoDetalhada.vue')
      },
      {
        path: 'favoritas',
        component: () => import('pages/Favoritas.vue')
      },
      {
        path: 'escaladas',
        component: () => import('pages/Escaladas.vue')
      },
      {
        path: 'escaladas/:id',
        name: 'EscaladaDetalhada',
        component: () => import('pages/EscaladaDetalhada.vue')
      },
      {
        path: 'perfil',
        redirect: { name: 'PerfilMe' }
      },
      {
        path: 'perfil/me',
        name: 'PerfilMe',
        component: () => import('pages/PerfilPageWrapper.vue')
      },
      {
        path: 'perfil/me/escaladas',
        component: () => import('pages/PerfilMeEscaladasRedirect.vue')
      },
      {
        path: 'perfil/:username/escaladas',
        name: 'PerfilEscaladas',
        component: () => import('pages/PerfilEscaladasLista.vue')
      },
      {
        path: 'perfil/:username',
        name: 'Perfil',
        component: () => import('pages/PerfilPageWrapper.vue')
      },
      {
        path: 'u/:username',
        name: 'PerfilPublico',
        redirect: (to) => ({ path: `/perfil/${to.params.username}` })
      },
      {
        path: 'admin',
        component: () => import('pages/Admin/AdminDashboard.vue')
      },
      {
        path: 'admin/sugestoes',
        component: () => import('pages/Admin/AdminSugestoesImagens.vue')
      },
      {
        path: 'admin/vias',
        component: () => import('pages/Admin/AdminVias.vue')
      },
      {
        path: 'admin/usuarios',
        component: () => import('pages/Admin/AdminUsuarios.vue')
      },
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            component: () => import('pages/Auth/Login.vue')
          },
          {
            path: 'register',
            component: () => import('pages/Auth/Register.vue')
          },
          {
            path: 'reset-password/:userToken?',
            component: () => import('pages/Auth/RedefinirSenha.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
