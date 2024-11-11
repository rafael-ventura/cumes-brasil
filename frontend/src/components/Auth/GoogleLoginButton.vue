<template>
  <div class="google-login-container">
    <!-- Botão customizado para abrir o login do Google -->
    <q-btn flat class="google-login-btn" @click="onGoogleLogin">
      <img src="../../../public/icons/google-2015.svg" alt="Google Logo" class="google-icon" />
    </q-btn>
  </div>
</template>

<script setup lang="ts">
// Declaração de tipo para `window.google`
declare global {
  interface Window {
    google?: any;
  }
}

import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthenticateService from '../../services/AuthenticateService';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '176876358344-1ukvkcsaoafq28cib1235cksn3nv7sm2.apps.googleusercontent.com';
const router = useRouter();

interface GoogleCredentialResponse {
  credential: string;
}

const handleCredentialResponse = async (response: GoogleCredentialResponse) => {
  const googleTokenId = response.credential;
  try {
    await AuthenticateService.authenticateWithGoogle(googleTokenId);
    await router.push('/'); // Redireciona para a home após login bem-sucedido
  } catch (error) {
    console.error('Erro ao autenticar com Google:', error);
  }
};

const onGoogleLogin = () => {
  if (window.google) {
    // Inicializa e ativa o prompt de login do Google manualmente
    window.google.accounts.id.prompt();
  } else {
    console.error('Google API not loaded');
  }
};

onMounted(() => {
  if (window.google) {
    // Inicializa o Google Identity Services
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleCredentialResponse
    });
  } else {
    console.error('Google API not loaded');
  }
});
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.google-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.google-login-btn {
  display: flex;
  align-items: center;
}

.google-icon {
  width: 5em;
  height: 5em;
}
</style>
