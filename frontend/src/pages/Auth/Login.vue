<template>
  <q-page class="fundo-login" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <!-- Logo -->
    <div class="logo-container">
      <q-img src="/assets/logo.png" alt="Cumes Brasil" class="logo-tamanho" />
    </div>

    <!-- Formulário de Login -->
    <div class="form-container">
      <q-card class="login-card">
        <q-form @submit.prevent="onLogin" class="custom-login-form">
          <!-- Campo Email -->
          <div class="custom-input">
            <q-icon name="mail" class="input-icon" />
            <label for="email" class="input-label">Email</label>
            <q-input
              id="email"
              v-model="email"
              type="email"
              outlined
              dense
              :rules="[val => !!val || 'Campo obrigatório']"
              class="custom-input-field"
            />
          </div>

          <!-- Campo Senha -->
          <div class="custom-input">
            <q-icon name="lock" class="input-icon" />
            <label for="senha" class="input-label">Senha</label>
            <q-input
              id="senha"
              v-model="senha"
              type="password"
              outlined
              dense
              :rules="[val => !!val || 'Campo obrigatório']"
              class="custom-input-field"
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
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-tamanho {
  width: 310px;
}

.form-container {
  width: 100%;
  max-width: 390px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-card {
  width: 100%;
  background-color: rgba($dark, 0.85);
  padding: 20px;
  border-radius: 10px;
}

.custom-input {
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.input-label {
  font-size: 16px;
  color: $primary;
  margin-bottom: 4px;
  padding-left: 35px; /* Espaçamento para o ícone */
}

.input-icon {
  color: $primary;
  font-size: 20px;
}

.custom-input-field {
  width: 315px;
  height: 49px;
  background-color: $dark; /* Fundo escuro */
  border-radius: 5px;
  .q-field__control {
    border: 1px solid $primary;
  }
}

.forgot-password-btn {
  text-align: left;
  color: #ffffff;
  font-size: 14px;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
}

.register-btn {
  width: 113px;
  height: 31px;
  font-size: 14px;
  color: $primary;
  border: 1px solid $primary;
  border-radius: 15px;
}

.google-btn {
  width: 113px;
  height: 31px;
}

.login-btn {
  width: 45px;
  height: 45px;
  background-color: $primary;
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
