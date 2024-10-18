<template>
  <q-page class="q-pa-md">
    <login-form
      class="q-gutter-md"
      title="Login"
      submit-label="Login"
      @submit="onLogin"
    >
      <q-btn flat class="q-mt-md btn custom-bottom"
             label="Forgot Password?"
             @click="goToResetPassword"/>
      <q-btn flat class="q-mt-md btn custom-bottom"
             label="Sign Up"
             @click="goToSignUp"/>
      <q-btn flat class="q-mt-md btn custom-bottom"
             @click="onGoogleLogin">
        <q-icon name="g_mobiledata" class="large-icon" />
        <span class="btn-label">Login com Google</span>
      </q-btn>
    </login-form>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import AuthenticateService from '../../services/AuthenticateService';
import LoginForm from 'components/Auth/LoginForm.vue';
import { Notify } from 'quasar';

defineOptions({
  name: 'LoginPage'
});

const router = useRouter();

const onLogin = async ({
  email,
  senha
}: { email: string, senha: string }) => {
  try {
    await AuthenticateService.login(email, senha);
    await router.push('/');
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: '' + error.message,
      position: 'center',
      timeout: 3000
    });
  }
};

const goToResetPassword = () => {
  router.push('/auth/reset-password');
};

const goToSignUp = () => {
  router.push('/auth/register');
};

const onGoogleLogin = async () => {
  try {
    // Verifica se o SDK foi carregado e se o cliente OAuth está inicializado
    const auth2 = await window.gapi.auth2.getAuthInstance();
    if (!auth2) {
      throw new Error('Google Auth2 não inicializado corretamente.');
    }
    // Solicita que o usuário faça login com a conta Google
    const googleUser = await auth2.signIn();
    // Obtém o token ID do Google
    const idToken = googleUser.getAuthResponse().id_token;
    // Envia o token para o back-end
    await AuthenticateService.authenticateWithGoogle(idToken);
    // Se autenticado com sucesso, navegue para a página principal
    await router.push('/');
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: 'Erro ao autenticar com Google: ' + error.message,
      position: 'center',
      timeout: 3000
    });
  }
};

// Carregar o SDK do Google quando o componente for montado
onMounted(() => {
  loadGoogleSDK();
});

const loadGoogleSDK = () => {
  // Verifica se o SDK já foi carregado
  if (!window.gapi) {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.onload = () => {
      window.gapi.load('auth2', async () => {
        try {
          const clientId = '176876358344-1ukvkcsaoafq28cib1235cksn3nv7sm2.apps.googleusercontent.com';
          console.log('Client ID:', clientId); // Verifica se o client_id está correto

          // Inicialize o Auth2 corretamente e espere sua inicialização
          await window.gapi.auth2.init({
            client_id: clientId
          });
          console.log('Google Auth2 inicializado com sucesso.');
        } catch (error) {
          console.error('Erro ao inicializar Google Auth2:', error);
          console.log('Detalhes do erro:', error);
        }
      });
    };
    document.body.appendChild(script);
  }
};

// Declaração da propriedade 'gapi' no objeto 'window'
declare global {
  interface Window {
    gapi: any;
  }
}
</script>
<style scoped>
.custom-bottom {
  margin-right: 10px;
}
.large-icon {
  font-size: 42px; /* Ajuste o tamanho conforme necessário */
}
</style>
