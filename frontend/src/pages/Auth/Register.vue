<template>
  <q-page class="fundo-cadastro">
    <div class="logo-container">
      <q-img src="/logo-black.svg" alt="Cumes Brasil" class="logo-tamanho" />
    </div>
    <div class="form-container">
      <q-card class="my-card">
        <q-card-section class="card-header">
          <div class="card-title">
            <q-icon name="person_add" size="28px" class="title-icon" />
            <span>Cadastro</span>
          </div>
        </q-card-section>

        <q-card-section class="card-body">
          <q-form @submit.prevent="onSignUp" class="edit-form">
            <!-- Campo Nome -->
            <div class="form-field">
              <label class="field-label">Nome *</label>
              <q-input
                id="nome"
                v-model="nome"
                type="text"
                placeholder="Digite seu nome"
                :rules="[ val => !!val || 'Campo obrigatório' ]"
                outlined
                dense
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>

            <!-- Campo Email -->
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

            <!-- Campo Senha -->
            <div class="form-field">
              <label class="field-label">Senha *</label>
              <q-input
                id="senha"
                v-model="senha"
                type="password"
                placeholder="Digite sua senha"
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

            <!-- Campo Confirmar Senha -->
            <div class="form-field">
              <label class="field-label">Confirmar Senha *</label>
              <q-input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                :rules="[
                  val => !!val || 'Campo obrigatório',
                  val => val === senha || 'Senhas não conferem'
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

            <!-- Botões de Ação -->
            <div class="form-actions">
              <q-btn 
                flat 
                label="Já tem uma conta?" 
                class="btn-secondary-custom" 
                @click="goToLogin"
                no-caps
              />
              <q-btn 
                type="submit" 
                label="Cadastrar" 
                class="btn-primary-custom"
                :loading="loading"
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
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {Notify} from 'quasar'
import {createNotifyConfig} from 'src/utils/utils'
import AuthenticateService from 'src/services/AuthenticateService'

defineOptions({
  name: 'RegisterPage'
})

const nome = ref('')
const email = ref('')
const senha = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const router = useRouter()

const onSignUp = async () => {
  if (!nome.value || !email.value || !senha.value || !confirmPassword.value) {
    Notify.create(createNotifyConfig('negative', 'Preencha todos os campos', 'top'))
    return
  }

  if (senha.value.length < 6) {
    Notify.create(createNotifyConfig('negative', 'A senha deve conter pelo menos 6 caracteres', 'top'))
    return
  }

  if (senha.value !== confirmPassword.value) {
    Notify.create(createNotifyConfig('negative', 'Senhas não conferem', 'top'))
    return
  }

  loading.value = true

  try {
    await AuthenticateService.register(nome.value, email.value, senha.value)
    Notify.create(createNotifyConfig('positive', 'Cadastro realizado com sucesso! Faça login para continuar.', 'top'))
    await router.push('/auth/login')
  } catch (error: any) {
    Notify.create(createNotifyConfig('negative', error.message || 'Erro ao realizar cadastro', 'top'))
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/auth/login')
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.fundo-cadastro {
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

.btn-secondary-custom {
  background: transparent !important;
  color: $cumes-01 !important;
  border: 2px solid $cumes-01 !important;
  padding: 12px 24px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;

  &:hover {
    background: rgba($cumes-01, 0.1) !important;
  }
}
</style>
