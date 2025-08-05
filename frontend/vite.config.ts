import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: 'src/css/quasar.variables.scss'
    })
  ],
  define: {
    'import.meta.env.VITE_APP_API_URL': JSON.stringify('http://localhost:8080/api'),
    'import.meta.env.VITE_APP_SERVER_IP': JSON.stringify('http://localhost:8080'),
  },
  server: {
    port: 9200,
    host: true
  }
});
