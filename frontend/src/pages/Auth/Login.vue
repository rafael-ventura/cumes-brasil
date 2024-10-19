<template>
  <q-page class="q-pa-md">
    <login-form
      class="q-gutter-md"
      submit-label="Login"
      @submit="onLogin"
    >
      <q-btn flat class="q-mt-md btn-blue custom-bottom"
             label="Esqueci minha senha!"
             @click="goToResetPassword"/>
    </login-form>
    <q-card class="custom-card q-mt-md">
      <q-card-section>
        <google-login-button />
      </q-card-section>
    </q-card>
    <q-card class="custom-card q-mt-md">
      <q-btn flat class="q-mt-md btn"
             label="Criar Conta"
             @click="goToSignUp"/>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import GoogleLoginButton from 'components/Auth/GoogleLoginButton.vue';
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
// Declaração da propriedade 'google' no objeto 'window'
declare global {
  interface Window {
    google: any;
  }
}
</script>

<style scoped>
.custom-bottom {
  margin-left: 30px;
}
.custom-card {
  margin-inline: auto;
  text-align: center;
  max-width: 400px;
  padding-bottom: 20px;
  border-radius: 4px;
}
</style>
