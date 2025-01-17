<template>
  <q-page class="fundo-cadastro">
    <div class="logo-container">
      <h1 class="logo-text">
        <q-img src="/logo-black.svg" alt="Cumes Brasil" class="logo-tamanho" />
      </h1>
    </div>
    <div class="form-container">
      <q-card class="login-card">
        <q-card-section>
          <q-form @submit.prevent="onSignUp" class="custom-cadastro-form">
            <!-- Campo Nome -->
            <div class="custom-input">
              <div class="input-container">
                <q-icon name="person" class="input-icon" />
                <label for="nome" class="input-label">Nome</label>
              </div>
              <q-input
                id="nome"
                v-model="nome"
                type="text"
                debounce="300"
                outlined
                color="primary"
                label-color="primary"
                rounded
                :rules="[val => !!val || 'Campo obrigatório']"
                :input-style="{ color: '$primary', borderRadius: '15px' }"
              />
            </div>

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

            <!-- Campo Confirmar Senha -->
            <div class="custom-input">
              <div class="input-container">
                <q-icon name="lock" class="input-icon" />
                <label for="confirmPassword" class="input-label">Confirmar Senha</label>
              </div>
              <q-input
                v-model="confirmPassword"
                id="confirmPassword"
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

            <div class="action-buttons">
              <q-btn flat label="Já tem uma conta?" class="link-login" @click="goToLogin" />
              <q-btn type="submit" label="Cadastrar" class="register-btn" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthenticateService from '../../services/AuthenticateService';
import { Notify } from 'quasar';
import { createNotifyConfig } from 'src/utils/utils';

defineOptions({
  name: 'RegisterPage'
});

const nome = ref('');
const email = ref('');
const senha = ref('');
const confirmPassword = ref('');
const router = useRouter();

const onSignUp = async () => {
  if (senha.value !== confirmPassword.value) {
    Notify.create(createNotifyConfig('negative', 'Senhas não conferem', 'top'));
    return;
  }

  if (senha.value.length < 4) {
    Notify.create(createNotifyConfig('negative', 'A senha deve conter pelo menos 4 caracteres', 'top'));
    return;
  }

  try {
    await AuthenticateService.register(nome.value, email.value, senha.value);
    await router.push('/auth/login');
    Notify.create(createNotifyConfig('positive', 'Cadastro realizado com sucesso', 'top'));
  } catch (error: any) {
    Notify.create(createNotifyConfig('negative', error.message, 'top'));
  }
};

const goToLogin = () => {
  router.push('/auth/login');
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.fundo-cadastro {
  background-image: url('/login2.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0;

  @media (max-width: 800px) {
    background-image: url('/login.png');
  }
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.logo-text {
  font-size: 2.5em; /* Ajusta o tamanho para parecer com um título */
  text-align: center;
  color: $primary;
  display: flex;
  justify-content: center;
}

.logo-tamanho {
  width: 70%;
  max-width: 200px;
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
  background-color: rgba($background, 0.85);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 20px;
}

.register-btn {
  width: 28%;
  height: 4vh;
  font-size: 0.85em;
  color: $primary;
  border: 1px solid $primary;
  border-radius: 15px;
  max-width: 160px;
  max-height: 60px;
}

.link-login {
  color: $primary;
  text-decoration: underline;
  text-align: left;
  font-size: 0.85em;
}

:deep(.q-field__control) {
  height: 3em;
}
</style>
