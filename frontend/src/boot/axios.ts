import { boot } from "quasar/wrappers";
import axios from "axios";
/// @ts-ignore
const api = axios.create({ baseURL: process.env.API_BASE_URL });

api.interceptors.response.use(
  response => response,
  error => {
    console.error("API error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
  console.log("Axios boot file loaded with baseURL:", api.defaults.baseURL);
});

export { api };
