<template>
  <div class="text-h6">Com Google</div>
  <div id="google-login-btn" class="centered-button"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthenticateService from '../../services/AuthenticateService';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const router = useRouter();

interface GoogleCredentialResponse {
  credential: string;
}

const handleCredentialResponse = async (response: GoogleCredentialResponse) => {
  const googleTokenId = response.credential;
  try {
    await AuthenticateService.authenticateWithGoogle(googleTokenId);
    router.push('/'); // Redireciona para a home após login bem-sucedido
  } catch (error) {
    console.error('Erro ao autenticar com Google:', error);
  }
};

onMounted(() => {
  // Inicializa o Google Identity Services
  window.google.accounts.id.initialize({
    client_id: googleClientId,
    callback: handleCredentialResponse
  });

  // Renderiza o botão do Google
  window.google.accounts.id.renderButton(
    document.getElementById('google-login-btn'),
    { theme: 'filled_black', size: 'large', shape: 'square', text: 'continue_with', logo_alignment: 'center' }
  );
});

</script>
<style scoped lang="scss">
@import "src/css/app.scss";
.centered-button {
  margin-top: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text-h6 {
  color: $secondary;
}
</style>
