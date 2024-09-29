import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL });

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API error:', error.response || error.message);
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
  console.log('Axios boot file loaded with baseURL:', api.defaults.baseURL);
});

export { api };
