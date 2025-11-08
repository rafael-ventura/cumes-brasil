const { configure } = require('quasar/wrappers')

/**
 * Arquivo de configuração principal do Quasar
 * - build: define bundler, routerMode, envs
 * - devServer: configura servidor local
 * - framework: plugins do Quasar
 * - pwa: service worker e manifest.json
 */
module.exports = configure(function () {
  return {
    boot: [
      'axios',
      'googleLogin',
      'primevue',
      'errorHandler'
    ],

    css: [
      'app.scss'
    ],

    extras: [
      'roboto-font',
      'material-icons'
    ],

    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node20'
      },
      distDir: 'dist/pwa',
      vueRouterMode: 'history',

      /**
       * Variáveis que ficam disponíveis no front via process.env.*
       * (lembrando: precisam começar com VITE_ para serem expostas ao Vite)
       */
      env: {
        VITE_APP_API_URL: process.env.VITE_APP_API_URL,
        VITE_APP_ASSETS_URL: process.env.VITE_APP_ASSETS_URL
      }
    },

    devServer: {
      open: true,
      overlay: false
    },

    framework: {
      config: {},
      plugins: ['Notify']
    },

    pwa: {
      workboxMode: 'generateSW',
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      manifest: {
        name: 'Cumes Brasil',
        short_name: 'Cumes BR',
        description: 'Catálogo digital de vias de escalada no Brasil',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#2c2c2c',
        theme_color: '#8CB369',
        icons: [
          { src: 'icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-256x256.png', sizes: '256x256', type: 'image/png' },
          { src: 'icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    }
  }
})
