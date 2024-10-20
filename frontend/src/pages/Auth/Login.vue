<template>
  <q-page class="q-pa-md fundo-login">
    <!-- Container do logo -->
    <div class="logo-container">
      <q-img src="../../assets/logo.png" alt="Cumes Brasil" class="logo-tamanho"/>
    </div>
    <!-- Container do conteúdo inferior -->
    <div v-if="!showLoginDialog" class="bottom-container">
      <!-- Botão para abrir o pop-up de login -->
      <q-card class="custom-login">
        <q-card class="custom-card">
          <q-btn flat class="btn" label="Login" @click="openLoginDialog" />
        </q-card>
        <!-- Google Login -->
        <q-card class="custom-card">
          <q-card-section>
            <google-login-button />
          </q-card-section>
        </q-card>
        <!-- Criar Conta -->
        <q-card class="custom-card">
          <q-btn flat class="btn"
                 label="Criar Conta"
                 @click="goToSignUp"/>
        </q-card>
      </q-card>
    </div>
    <!-- Pop-up de login com o LoginForm -->
    <q-dialog v-model="showLoginDialog" transition-show="slide-up" transition-hide="slide-down" @hide="showBottomContainer">
      <login-form submit-label="Login" @submit="onLogin">
        <q-btn flat class="q-mt-md btn-blue custom-bottom"
               label="Esqueci minha senha!"
               @click="goToResetPassword"/>
      </login-form>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import GoogleLoginButton from 'components/Auth/GoogleLoginButton.vue';
import AuthenticateService from '../../services/AuthenticateService';
import LoginForm from 'components/Auth/LoginForm.vue';
import { Notify } from 'quasar';

defineOptions({
  name: 'LoginPage'
});

const router = useRouter();
const showLoginDialog = ref(false); // Controla a exibição do pop-up de login

const openLoginDialog = () => {
  showLoginDialog.value = true; // Abre o diálogo de login
};

const showBottomContainer = () => {
  showLoginDialog.value = false; // Fecha o diálogo e mostra o bottom-container novamente
};

const onLogin = async ({
  email,
  senha
}: { email: string, senha: string }) => {
  try {
    await AuthenticateService.login(email, senha);
    await router.push('/');
    showLoginDialog.value = false; // Fecha o pop-up após login bem-sucedido
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
// Declaração da propriedade 'google' no objeto 'window'
declare global {
  interface Window {
    google: any;
  }
}
</script>

<style scoped lang="scss">
.fundo-login {
  background-image: url('../../assets/image.jpg'); /* Substitua pelo caminho da sua imagem */
  background-size: cover; /* Cobre toda a área sem distorcer */
  background-position: center; /* Mantém a imagem centralizada */
  background-repeat: no-repeat; /* Evita repetição da imagem */
  min-height: 100vh; /* Garante que o fundo cubra toda a altura da tela */
  display: flex;
  flex-direction: column; /* Alinha os elementos em coluna */
  justify-content: space-between; /* Espaça o conteúdo entre o topo e a parte inferior */
  align-items: center;
  padding: 20px; /* Adiciona espaçamento nas bordas */
}
/* Container do logo na parte superior */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 0;
}
.custom-login {
  max-width: 420px;
  margin-inline: auto;
  background-color: rgba(0, 0, 0, 0.42);
  padding: 8px 10px;
}
.custom-bottom {
  margin-right: 30px;
}
.custom-card {
  margin-inline: auto;
  text-align: center;
  max-width: 400px;
  margin: 10px 0;
  padding: 10px;
  border-radius: 10px !important;
  background-color: rgba(255, 255, 255, 0.09);
}
.login-card {
  max-width: 400px;
  margin: auto;
}
.logo-tamanho{
  width: 310px;
  margin: 0 auto;
  display: flex;
}
</style>
