<template>
  <div class="google-login-container">
    <!-- Botão customizado para abrir o login do Google -->
    <q-btn :disabled="!isReady" flat class="google-login-btn" @click="login">
      <img src="../../../public/icons/google-2015.svg" alt="Google Logo" class="google-icon" />
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { useTokenClient, type AuthCodeFlowSuccessResponse, type AuthCodeFlowErrorResponse } from "vue3-google-signin";
import { useRouter } from 'vue-router';
import AuthenticateService from '../../services/AuthenticateService';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const router = useRouter();

// Funções de sucesso e erro para o login do Google
const handleOnSuccess = async (response: AuthCodeFlowSuccessResponse) => {
  console.log("Access Token: ", response.access_token);

  try {
    await AuthenticateService.authenticateWithGoogle(response.access_token);
    await router.push('/'); // Redireciona para a home após login bem-sucedido
  } catch (error) {
    console.error('Erro ao autenticar com Google:', error);
  }
};

const handleOnError = (errorResponse: AuthCodeFlowErrorResponse) => {
  console.error("Erro no login com Google: ", errorResponse);
};

// Inicializa o Token Client para o Google Sign-In
const { isReady, login } = useTokenClient({
  client_id: googleClientId,
  onSuccess: handleOnSuccess,
  onError: handleOnError,
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
  background-color: transparent; // Fundo transparente
  border-radius: 999px;          // Estilo arredondado
  color: white;                  // Cor do texto
  cursor: pointer;
}

.google-login-btn img {
  width: 5em;  // Tamanho do logo
  height: 1.2em;
}
</style>
