<template>
  <q-page class="fundo-cadastro">
    <div class="logo-container">
      <q-img src="/logo-black.svg" alt="Cumes Brasil" class="logo-tamanho" />
    </div>
    <div class="form-container">
      <q-card class="login-card">
        <q-card-section>
          <form @submit.prevent="onSignUp" class="custom-cadastro-form">
            <!-- Campo Nome -->
            <div class="custom-input-auth">
              <div class="input-container">
                <q-icon name="person" class="input-icon"/>
                <label for="nome" class="input-label">Nome</label>
              </div>
              <InputText
                id="nome"
                v-model="nome"
                class="custom-input-field"
                :class="{ 'p-invalid': !nome }"
                placeholder="Digite seu nome"
              />
              <small v-if="!nome" class="error-message">Campo obrigatório</small>
            </div>

            <!-- Campo Email -->
            <div class="custom-input-auth">
              <div class="input-container">
                <q-icon name="mail" class="input-icon"/>
                <label for="email" class="input-label">Email</label>
              </div>
              <InputText
                id="email"
                v-model="email"
                class="custom-input-field"
                :class="{ 'p-invalid': !email }"
                placeholder="Digite seu email"
              />
              <small v-if="!email" class="error-message">Campo obrigatório</small>
            </div>

            <!-- Campo Senha -->
            <div class="custom-password-input-auth">
              <div class="input-container">
                <q-icon name="lock" class="input-icon"/>
                <label for="senha" class="input-label">Senha</label>
              </div>
              <Password
                id="senha"
                v-model="senha"
                class="custom-input-field"
                :class="{ 'p-invalid': !senha || senha.length < 4 }"
                placeholder="Digite sua senha"
                :feedback="false"
              />
              <small v-if="!senha" class="error-message">Campo obrigatório</small>
              <small v-else-if="senha.length < 4" class="error-message senha-nao-conferem">
                A senha deve conter pelo menos 4 caracteres
              </small>
            </div>

            <!-- Campo Confirmar Senha -->
            <div class="custom-password-input-auth">
              <div class="input-container">
                <q-icon name="lock" class="input-icon"/>
                <label for="confirmPassword" class="input-label">Confirmar Senha</label>
              </div>
              <Password
                id="confirmPassword"
                v-model="confirmPassword"
                class="custom-input-field"
                :class="{
                  'p-invalid': confirmPassword !== senha && confirmPassword.length > 0,
                  'p-valid': confirmPassword === senha && confirmPassword.length > 0
                }"
                placeholder="Confirme sua senha"
                :feedback="false"
              />
              <small v-if="confirmPassword !== senha && confirmPassword.length > 0" class="error-message senha-nao-conferem">
                Senhas não conferem
              </small>
            </div>
          </form>

          <div class="action-buttons">
            <q-btn flat label="Já tem uma conta?" class="link-login" @click="goToLogin"/>
            <q-btn type="submit" label="Cadastrar" class="register-btn"/>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { createNotifyConfig } from 'src/utils/utils'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

defineOptions({
  name: 'RegisterPage'
})

const nome = ref('')
const email = ref('')
const senha = ref('')
const confirmPassword = ref('')
const router = useRouter()

const onSignUp = async () => {
  if (!nome.value || !email.value || !senha.value || !confirmPassword.value) {
    Notify.create(createNotifyConfig('negative', 'Preencha todos os campos', 'top'))
    return
  }

  if (senha.value.length < 4) {
    Notify.create(createNotifyConfig('negative', 'A senha deve conter pelo menos 4 caracteres', 'top'))
    return
  }

  if (senha.value !== confirmPassword.value) {
    Notify.create(createNotifyConfig('negative', 'Senhas não conferem', 'top'))
    return
  }

  try {
    Notify.create(createNotifyConfig('positive', 'Cadastro realizado com sucesso', 'top'))
    await router.push('/auth/login')
  } catch (error: any) {
    Notify.create(createNotifyConfig('negative', error.message, 'top'))
  }
}

const goToLogin = () => {
  router.push('/auth/login')
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
@import 'src/css/inputs.scss';

.fundo-cadastro {
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

small.error-message.senha-nao-conferem {
  color: red !important;
  padding-left: 0.8em;
  font-size: 0.92em;
}

small.error-message {
  color: red !important;
  padding-left: 0.8em;
  font-size: 0.92em;
}
</style>
