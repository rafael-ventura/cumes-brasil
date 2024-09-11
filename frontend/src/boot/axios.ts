import { boot } from 'quasar/wrappers';
import axios from 'axios';

// Base URL ajustada para o IP público ou DNS da instância EC2
const api = axios.create({ baseURL: 'http://18.212.219.139:8080/api' });

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
