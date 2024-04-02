import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import vuetify from "./plugins/vuetify";
import axios from "./plugins/axios";
import './assets/styles.scss';

const app = createApp(App);

app.config.globalProperties.$http = axios;

app.use(router).use(vuetify).mount("#app");
