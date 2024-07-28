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

defineOptions({
  name: 'LoginPage'
});

const router = useRouter();

const onLogin = async ({
  email,
  senha
}: { email: string, senha: string }) => {
  try {
    const response = await AuthenticateService.login(email, senha);
    console.log(response.data);
    await router.push('/');
  } catch (error: any) {
    console.error(error.message);
  }
};

const goToResetPassword = () => {
  router.push('/auth/reset-password');
};

const goToSignUp = () => {
  router.push('/auth/register');
};
</script>
