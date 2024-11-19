import { boot } from 'quasar/wrappers';
import vue3GoogleLogin from 'vue3-google-login';

// Obtenha o Google Client ID do Vite
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Adicione uma tipagem explícita ao plugin
export default boot(({ app }) => {
  (vue3GoogleLogin as any).install(app, {
    clientId: googleClientId, // Passe o clientId para o plugin
  });
});
