<template>
  <div class="google-login-container">
    <q-btn flat class="google-login-btn" @click="loginWithGoogle">
      <img src="../../../public/icons/google-2015.svg" alt="Google Logo" class="google-icon" />
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { googleAuthCodeLogin } from 'vue3-google-login';
import { useRouter } from 'vue-router';
import AuthenticateService from 'src/services/AuthenticateService';
import { Notify } from 'quasar';
import { createNotifyConfig } from 'src/utils/utils';

const router = useRouter();

const loginWithGoogle = async () => {
  try {
    const response = await googleAuthCodeLogin();
    await AuthenticateService.authenticateWithGoogle(response.code);

    Notify.create(createNotifyConfig('positive', 'Login realizado com sucesso', 'top'));
    await router.push('/');
  } catch (error: any) {
    Notify.create(createNotifyConfig('negative', error.message, 'top'));
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
  background-color: transparent;
  border-radius: 999px;
  color: white;
  cursor: pointer;
}

.google-login-btn img {
  width: 5em;
  height: 1.2em;
}
</style>
