import { boot } from 'quasar/wrappers';
import { App } from 'vue';
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';

export default boot(({ app }: { app: App }) => {
  app.use(PrimeVue);
});
