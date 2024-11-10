<template>
  <div class="google-login-container">
    <q-btn flat class="google-login-btn" @click="handleGoogleLogin">
      <img src="../../../public/icons/google-2015.svg" alt="Google Logo" class="google-icon" />
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const handleGoogleLogin = () => {
  // Lógica de autenticação do Google
  console.log('Google Login');
  router.push('/'); // Ajuste com lógica de redirecionamento real após autenticação
};
</script>

<style scoped lang="scss">
@import "src/css/app.scss"; // Importa variáveis e estilos principais

.google-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.google-login-btn {
  width: 28vw;
  height: 5vh;
  border: 1px solid $primary;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  color: $primary;
}

.google-icon {
  width: 5em;
  height: 5em;
}
</style>
