/* eslint-env serviceworker */

// Declaração explícita para evitar erros do TypeScript
declare const self: ServiceWorkerGlobalScope & typeof globalThis & { skipWaiting: () => void };

import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Ativar imediatamente o Service Worker
self.skipWaiting();
clientsClaim();

// Precache dos arquivos gerados pelo Quasar PWA
precacheAndRoute(self.__WB_MANIFEST || []);

// Limpa caches antigos
cleanupOutdatedCaches();

// Cache de imagens
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
      })
    ]
  })
);

// Cache de CSS e JS
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-assets-cache'
  })
);

// Forçar todas as requisições de navegação para carregar `index.html`
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/index.html'), {
    denylist: [/sw\.js$/, /workbox-(.)*\.js$/]
  })
);
