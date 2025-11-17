<template>
  <q-page class="fundo-redefinir-senha">
    <div class="logo-container">
      <q-img src="/logo-black.svg" alt="Cumes Brasil" class="logo-tamanho" />
    </div>
    <div class="form-container">
      <q-card class="my-card">
        <q-card-section class="card-header">
          <div class="card-title">
            <q-icon name="lock_reset" size="28px" class="title-icon" />
            <span>Redefinir Senha</span>
          </div>
        </q-card-section>

        <q-card-section v-if="token" class="card-body">
          <q-form @submit.prevent="onResetPassword" class="edit-form">
            <div class="form-field">
              <label class="field-label">Nova Senha *</label>
              <q-input
                id="senha"
                v-model="password"
                type="password"
                placeholder="Digite sua nova senha"
                :rules="[
                  val => !!val || 'Campo obrigatório',
                  val => val.length >= 6 || 'A senha deve conter pelo menos 6 caracteres'
                ]"
                outlined
                dense
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </div>

            <div class="form-field">
              <label class="field-label">Confirmar Senha *</label>
              <q-input
                id="confirmarSenha"
                v-model="passwordRepeated"
                type="password"
                placeholder="Confirme sua senha"
                :rules="[
                  val => !!val || 'Campo obrigatório',
                  val => val === password || 'Senhas não conferem'
                ]"
                outlined
                dense
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </div>

            <div class="form-actions">
              <BotaoVoltar class="btn-back"/>
              <q-btn 
                type="submit" 
                label="Redefinir Senha" 
                class="btn-primary-custom"
                no-caps
              />
            </div>
          </q-form>
        </q-card-section>

        <q-card-section v-else class="card-body">
          <q-form @submit.prevent="onGeneratePasswordToken" class="edit-form">
            <div class="form-field">
              <label class="field-label">Email *</label>
              <q-input
                id="email"
                v-model="email"
                type="email"
                placeholder="Digite seu email"
                :rules="[ val => !!val || 'Campo obrigatório' ]"
                outlined
                dense
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="mail" />
                </template>
              </q-input>
            </div>

            <div class="form-actions">
              <BotaoVoltar class="btn-back"/>
              <q-btn 
                type="submit" 
                label="Redefinir" 
                class="btn-primary-custom"
                no-caps
              />
            </div>
          </q-form>
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

.fundo-redefinir-senha {
  background-image: url('/login2.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;

  @media (max-width: 800px) {
    background-image: url('/login.png');
  }
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.logo-tamanho {
  width: 70%;
  max-width: 200px;
}

.form-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.my-card {
  min-width: 320px;
  max-width: 500px;
  width: 100%;
  border-radius: 16px;
  margin: auto;
  background-color: $background;
  border: 2px solid $cumes-01;
  box-shadow: 0 8px 32px $box-shadow-dark;
  overflow: hidden;
  
  @media (min-width: 768px) {
    width: 500px;
    max-width: 500px;
  }
  
  @media (min-width: 1024px) {
    width: 500px;
    max-width: 500px;
  }
}

// Header do Card
.card-header {
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 8%) 100%);
  padding: 24px 32px;
  border-bottom: 3px solid $cumes-03;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 800;
  color: $offwhite;
  text-shadow: 0 2px 4px $text-shadow-default;

  .title-icon {
    color: $cumes-04;
  }
}

// Body do Card
.card-body {
  padding: 32px;

  @media (max-width: 600px) {
    padding: 24px 20px;
  }
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

// Form Fields
.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 13px;
  font-weight: 700;
  color: $cumes-04;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

// Custom Input Styling
.custom-input {
  :deep(.q-field__control) {
    background-color: $offwhite;
    border-radius: 8px;
    padding: 0 !important;
    
    &::before {
      border-color: $cumes-01;
      border-width: 2px;
    }
  }

  :deep(.q-field__native) {
    color: $background;
    font-size: 15px;
    font-weight: 500;
    padding: 10px 14px !important;
  }

  :deep(input) {
    padding: 10px 14px !important;
  }

  :deep(input::placeholder) {
    color: rgba($background, 0.5);
  }

  :deep(.q-field__prepend) {
    padding-left: 12px;
    color: $cumes-01;
  }

  &:deep(.q-field--focused) {
    .q-field__control::before {
      border-color: $cumes-03;
      border-width: 2px;
    }
  }

  &:deep(.q-field--error) {
    .q-field__control::before {
      border-color: $error-color;
    }
  }
}

// Form Actions
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding-top: 20px;
  border-top: 1px solid rgba($cumes-03, 0.2);
}

.btn-back {
  margin-left: 0;
}

// Custom Primary Button
.btn-primary-custom {
  background: $cumes-01 !important;
  color: $offwhite !important;
  padding: 12px 32px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px $box-shadow-medium !important;

  &:hover {
    background: darken($cumes-01, 10%) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 16px $box-shadow-strong !important;
  }

  &:active {
    transform: translateY(0) !important;
  }
}
</style>
