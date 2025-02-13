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
