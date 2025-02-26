<template>
  <q-page class="fundo-login">
    <div class="logo-container">
      <q-img src="/logo-black.svg" alt="Cumes Brasil" class="logo-tamanho" />
    </div>
    <div class="form-container">
      <q-card class="login-card">
        <form @submit.prevent="onLogin" class="custom-login-form">
          <!-- Campo Email -->
          <div class="custom-input-auth">
            <div class="input-container">
              <q-icon name="mail" class="input-icon" />
              <label for="email" class="input-label">Email</label>
            </div>
            <InputText
              id="email"
              v-model="email"
              :invalid="!email"
              class="custom-input-field"
              placeholder="Digite seu email"
            />
            <small v-if="!email" class="error-message">Campo obrigatório</small>
          </div>

          <!-- Campo Senha -->
          <div class="custom-password-input-auth">
            <div class="input-container">
              <q-icon name="lock" class="input-icon" />
              <label for="senha" class="input-label">Senha</label>
            </div>
            <InputText
              id="senha"
              v-model="senha"
              class="custom-input-field"
              :invalid="!senha || senha.length < 6"
              type="password"
              placeholder="Digite sua senha"
            />
            <small v-if="!senha" class="error-message">Campo obrigatório</small>
            <small v-else-if="senha.length < 6" class="error-message senha-nao-conferem">
              A senha deve conter pelo menos 6 caracteres
            </small>
          </div>

          <!-- Botão de Esqueci a Senha -->
          <q-btn flat label="Esqueci a senha" class="forgot-password-btn" @click="goToResetPassword" />

          <!-- Botões de Ação -->
          <div class="action-buttons">
            <q-btn label="Cadastrar" class="register-btn" @click="goToSignUp" />
            <google-login-button class="google-btn" />
            <q-btn type="submit" icon="arrow_forward" class="login-btn" />
          </div>
        </form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {Notify} from 'quasar'
import {createNotifyConfig} from 'src/utils/utils'
import AuthenticateService from 'src/services/AuthenticateService'
import GoogleLoginButton from 'components/Auth/GoogleLoginButton.vue'
import InputText from 'primevue/inputtext'

defineOptions({
  name: 'LoginPage'
})

const email = ref('')
const senha = ref('')
const router = useRouter()

const onLogin = async () => {
  if (!email.value || !senha.value) {
    Notify.create(createNotifyConfig('negative', 'Preencha todos os campos', 'top'))
    return
  }

  try {
    await AuthenticateService.login(email.value, senha.value)
    Notify.create(createNotifyConfig('positive', 'Login realizado com sucesso', 'top'))
    await router.push('/')
  } catch (error: any) {
    Notify.create(createNotifyConfig('negative', error.message, 'top'))
  }
}

const goToResetPassword = () => {
  router.push('/auth/reset-password')
}

const goToSignUp = () => {
  router.push('/auth/register')
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
@import 'src/css/inputs.scss';

.fundo-login {
  background-image: url('/login2.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 800px) {
    background-image: url('/login.png');
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
  background-color: rgba($background, 0.85);
  padding: 5%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
  margin-top: 20px;
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
  color: $background;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 60px;
  max-height: 60px;
}

</style>
