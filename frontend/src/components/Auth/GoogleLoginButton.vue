<template>
  <div class="google-login-container">
    <!-- Botão customizado para abrir o login do Google -->
    <q-btn flat class="google-login-btn" @click="loginWithGoogle">
      <img src="../../../public/icons/google-2015.svg" alt="Google Logo" class="google-icon" />
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { googleAuthCodeLogin } from 'vue3-google-login';
import { useRouter } from 'vue-router';
import AuthenticateService from 'src/services/AuthenticateService';

const router = useRouter();

const loginWithGoogle = async () => {
  try {
    // Realiza o login com Google e obtém o código de autorização
    const response = await googleAuthCodeLogin();
    console.log('Authorization Code:', response.code);

    // Envia o código para o backend para autenticação
    await AuthenticateService.authenticateWithGoogle(response.code);

    // Redireciona após o login bem-sucedido
    await router.push('/');
  } catch (error) {
    console.error('Erro ao fazer login com Google:', error);
  }
};
</script>

<style scoped lang="scss">
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
  width: 5em;
  height: 1.2em;
}
</style>
