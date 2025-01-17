<template>
  <q-page class="fundo-login">
    <!-- Logo -->
    <!-- Formulário de Login -->
    <div class="logo-container">
      <q-img src="/logo-black.svg" alt="Cumes Brasil" class="logo-tamanho" />
    </div>
    <div class="form-container">
      <q-card class="login-card">
        <q-form @submit.prevent="onLogin" class="custom-login-form">
          <!-- Campo Email -->
          <div class="custom-input">
            <div class="input-container">
              <q-icon name="mail" class="input-icon" />
              <label for="email" class="input-label">Email</label>
            </div>
            <q-input
              id="email"
              v-model="email"
              type="email"
              debounce="300"
              outlined
              color="primary"
              label-color="primary"
              rounded
              :rules="[val => !!val || 'Campo obrigatório']"
              :input-style="{ color: '$primary' }"
            />
          </div>

          <!-- Campo Senha -->
          <div class="custom-input">
            <div class="input-container">
              <q-icon name="lock" class="input-icon" />
              <label for="senha" class="input-label">Senha</label>
            </div>
            <q-input
              id="senha"
              v-model="senha"
              type="password"
              debounce="300"
              outlined
              color="primary"
              label-color="primary"
              rounded
              :rules="[val => !!val || 'Campo obrigatório']"
              :input-style="{ color: '$primary' }"
            />
          </div>

          <!-- Botão de Esqueci a Senha -->
          <q-btn flat label="Esqueci a senha" class="forgot-password-btn" @click="goToResetPassword" />

          <!-- Botões de Ação (Cadastrar, Google e Login) -->
          <div class="action-buttons">
            <q-btn label="Cadastrar" class="register-btn" @click="goToSignUp" />
            <google-login-button class="google-btn" />
            <q-btn type="submit" icon="arrow_forward" class="login-btn" />
          </div>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthenticateService from 'src/services/AuthenticateService';
import ImagemService from '../../services/ImagemService';
import GoogleLoginButton from 'components/Auth/GoogleLoginButton.vue';
import { Notify } from 'quasar';
import { createNotifyConfig } from 'src/utils/utils';
import { Imagem } from 'src/models/Imagem';

defineOptions({
  name: 'LoginPage'
});

const email = ref('');
const senha = ref('');
const backgroundImage = ref('');
const router = useRouter();

const onLogin = async () => {
  try {
    await AuthenticateService.login(email.value, senha.value);
    Notify.create(createNotifyConfig('positive', 'Login realizado com sucesso', 'top'));
    await router.push('/');
  } catch (error: any) {
    Notify.create(createNotifyConfig('negative', error.message, 'top'));
  }
};

const goToResetPassword = () => {
  router.push('/auth/reset-password');
};

const goToSignUp = () => {
  router.push('/auth/register');
};

onMounted(async () => {
  try {
    const image: Imagem = await ImagemService.getImageById(1);
    backgroundImage.value = ImagemService.getFullImageUrl(image.url);
  } catch (error) {
    console.error('Erro ao carregar a imagem de fundo:', error);
  }
});
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.fundo-login {
  background-image: url('/login2.jpg'); /* Imagem de fundo grande */
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  /* Altera a imagem de fundo para telas com 800px ou menos */
  @media (max-width: 800px) {
    background-image: url('/login.png'); /* Imagem de fundo pequena */
  }
}

.form-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-card {
  width: 100%;
  background-color: rgba($dark, 0.85);
  padding: 5%;
  border-radius: 10px;
}

.custom-input {
  width: 100%;
  margin-bottom: 16px;
}

.input-container {
  display: flex;
  align-items: center;
}

.input-label {
  font-size: 1em;
  color: $primary;
  margin-left: 0.5em;
}

.input-icon {
  color: $primary;
  font-size: 1.2em;
}

.forgot-password-btn {
  text-align: left;
  color: $primary;
  font-size: 0.85em;
  text-decoration: underline;
  margin-bottom: 10px;
  margin-left: -1%;

  @media (max-width: 800px) {
    margin-left: -3%;
  }

  @media (max-width: 425px) {
    margin-left: -5%;
  }
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.register-btn,
.google-btn {
  width: 28%;
  height: 4vh;
  font-size: 0.85em;
  color: $primary;
  border: 1px solid $primary;
  border-radius: 15px;
  max-width: 160px;
  max-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-btn {
  width: 8vw;
  height: 8vw;
  background-color: $primary;
  color: $dark;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 60px;
  max-height: 60px;
}
:deep(.q-field__control) {
  height: 3em;
}

</style>
