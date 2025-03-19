<template>
  <q-page class="fundo-redefinir-senha">
    <div class="logo-container">
      <q-img src="/logo-black.svg" alt="Cumes Brasil" class="logo-tamanho" />
    </div>
    <div class="form-container">
      <q-card class="reset-password-card">
        <q-card-section>
          <div class="text-h6 titulo-redefinir-senha">Redefinir Senha</div>
        </q-card-section>

        <q-card-section v-if="token">
          <form @submit.prevent="onResetPassword">
            <div class="custom-input-auth">
              <div class="input-container">
                <q-icon name="lock" class="input-icon" />
                <label for="senha" class="input-label">Senha</label>
              </div>
              <InputText
                id="senha"
                v-model="password"
                :class="{ 'p-invalid': password.length < 6 }"
                placeholder="Digite sua nova senha"
                :feedback="false"
              />
              <small v-if="password.length < 6" class="error-message">
                A senha deve conter pelo menos 6 caracteres
              </small>
            </div>

            <div class="custom-input-auth">
              <div class="input-container">
                <q-icon name="lock" class="input-icon" />
                <label for="confirmarSenha" class="input-label">Confirmar Senha</label>
              </div>
              <InputText
                id="confirmarSenha"
                v-model="passwordRepeated"
                :class="{ 'p-invalid': passwordRepeated !== password }"
                placeholder="Confirme sua senha"
              />
              <small v-if="passwordRepeated !== password" class="error-message senha-nao-conferem">
                Senhas não conferem
              </small>
            </div>

            <div class="action-buttons">
              <BotaoVoltar class="btn-back"/>
              <q-btn type="submit" label="Redefinir Senha" class="register-btn"/>
            </div>
          </form>
        </q-card-section>

        <q-card-section v-else>
          <form @submit.prevent="onGeneratePasswordToken">
            <div class="custom-input-auth">
              <div class="input-container">
                <q-icon name="mail" class="input-icon" />
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

            <div class="action-buttons">
              <BotaoVoltar class="btn-back"/>
              <q-btn type="submit" label="Redefinir" class="register-btn"/>
            </div>
          </form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AuthenticateService from '../../services/AuthenticateService'
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {createNotifyConfig} from 'src/utils/utils'
import {Notify} from 'quasar'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import BotaoVoltar from "components/BotaoVoltar.vue";

defineOptions({
  name: 'ResetPasswordPage'
})

const email = ref('')
const password = ref('')
const passwordRepeated = ref('')
const token = ref('')
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  token.value = route.params.userToken?.toString() || ''
})

const onGeneratePasswordToken = async () => {
  try {
    console.log("email... calling", email.value)
    const response = await AuthenticateService.generateUserResetPassword(email.value)
    Notify.create(createNotifyConfig('positive', response.data.message, 'top'))
  } catch (error: any) {
    Notify.create(createNotifyConfig('negative', error.message, 'top'))
  }
}

const onResetPassword = async () => {
  if (password.value.length < 6) {
    Notify.create(createNotifyConfig('negative', 'A senha deve conter pelo menos 6 caracteres', 'top'))
    return
  }
  if (password.value !== passwordRepeated.value) {
    Notify.create(createNotifyConfig('negative', 'Senhas não conferem', 'top'))
    return
  }

  try {
    const response = await AuthenticateService.resetPassword(password.value, passwordRepeated.value, token.value)
    Notify.create(createNotifyConfig('positive', response.data.message, 'top'))
    await router.push('/auth/login')
  } catch (error: any) {
    Notify.create(createNotifyConfig('negative', error.message, 'top'))
  }
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
@import 'src/css/inputs.scss';

.fundo-redefinir-senha {
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

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
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

.reset-password-card {
  width: 100%;
  background-color: rgba($background, 0.85);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.titulo-redefinir-senha {
  font-size: 1.5rem;
  text-align: center;
  color: $primary;
  margin-bottom: 20px;
}

.custom-input-auth {
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

.btn-back {
  margin-left: 0.5rem;
}

.register-btn {
  max-width: 160px;
  height: 40px;
  text-align: center;
  font-size: 0.95em;
  color: $primary;
  border: 1px solid $primary;
  border-radius: 15px;
}
</style>
