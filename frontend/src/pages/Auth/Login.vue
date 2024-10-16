<template>
  <q-page class="q-pa-md">
    <login-form
      title="Login"
      submit-label="Login"
      @submit="onLogin"
    >
      <q-btn flat
             label="Forgot Password?"
             @click="goToResetPassword"/>
      <q-btn flat
             label="Sign Up"
             @click="goToSignUp"/>
    </login-form>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
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
</script>
