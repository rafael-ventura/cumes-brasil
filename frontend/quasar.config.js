/* eslint-env node */

const { configure } = require('quasar/wrappers');
const { VitePWA } = require('vite-plugin-pwa');

module.exports = configure(function (/* ctx */) {
  return {
    boot: ['axios', 'googleLogin'],
    css: ['app.scss'],

    extras: [
      'roboto-font',
      'material-icons'
    ],

    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node20'
      },
      base: '/',
      publicPath: '/',
      distDir: 'dist/pwa',
      vueRouterMode: 'history',

      vitePlugins: [
        ['vite-plugin-checker', {
          vueTsc: { tsconfigPath: 'tsconfig.vue-tsc.json' },
          eslint: { lintCommand: 'eslint "./**/*.{js,ts,mjs,cjs,vue}"' }
        }, { server: false }],

        // 🔥 Gera o PWA e os ícones automaticamente
        VitePWA({
          registerType: 'autoUpdate',
          workbox: {
            cleanupOutdatedCaches: true
          },
          manifest: {
            name: 'Cumes Brasil - App',
            short_name: 'Cumes Brasil',
            description: 'Aplicativo de acervo de Vias de Escalada do Brasil',
            display: 'standalone',
            orientation: 'portrait',
            background_color: '#2c2c2c',
            theme_color: '#027be3',
            icons: [
              {
                src: '/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          }
        })
      ]
    },

    devServer: {
      open: true,
      overlay: false
    },

    framework: {
      plugins: ['Notify']
    },

    animations: [],

    ssr: {
      pwa: true,
      prodPort: 3000,
      middlewares: ['render']
    },

    pwa: {
      workboxMode: 'generateSW',
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false
    }
  };
});
