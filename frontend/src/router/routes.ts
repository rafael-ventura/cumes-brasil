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
        path: 'busca',
        component: () => import('pages/Busca.vue')
      },
      {
        path: 'vias/:id',
        component: () => import('pages/ViaDetalhada.vue')
      },
      {
        path: 'colecoes',
        component: () => import('pages/ColecoesBusca.vue')
      },
      {
        path: 'colecoes/:id',
        name: 'ColecaoDetalhada',
        component: () => import('pages/ColecaoDetalhada.vue')
      },
      {
        path: 'perfil',
        component: () => import('pages/Perfil.vue')
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
            path: 'reset-password',
            component: () => import('pages/Auth/RedefinirSenha.vue')
          }
        ]
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
