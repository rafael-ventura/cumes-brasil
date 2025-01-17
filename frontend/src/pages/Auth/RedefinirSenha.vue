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
        <q-card-section v-if="token" >
          <q-form @submit.prevent="onResetPassword">
            <div class="custom-input">
              <div class="input-container">
                <q-icon name="lock" class="input-icon" />
                <label for="senha" class="input-label">Senha</label>
              </div>
              <q-input
                id="senha"
                v-model="password"
                type="password"
                debounce="300"
                outlined
                rounded
                color="primary"
                label-color="primary"
                hide-bottom-space
                :rules="[ val => !!val || 'Campo obrigatório' ]"
                :input-style="{ color: '$primary', borderRadius: '15px' }"
              />
            </div>
            <div class="custom-input">
              <div class="input-container">
                <q-icon name="lock" class="input-icon" />
                <label for="confirmarSenha" class="input-label">Confirmar Senha</label>
              </div>
              <q-input
                id="confirmarSenha"
                v-model="passwordRepeated"
                type="password"
                debounce="300"
                outlined
                rounded
                color="primary"
                label-color="primary"
                hide-bottom-space
                :rules="[ val => !!val || 'Campo obrigatório' ]"
                :input-style="{ color: '$primary', borderRadius: '15px' }"
              />
            </div>
            <q-btn
              type="submit"
              label="Redefinir Senha"
              class="register-btn"
            />
          </q-form>
        </q-card-section>
        <q-card-section v-if="token.length === 0">
          <q-form @submit.prevent="onGeneratePasswordToken" class="custom-redefinir-form">

            <!-- Campo Email -->
            <div class="custom-input">
              <div class="input-container">
                <q-icon name="mail" class="input-icon" />
                <label for="email" class="input-label">Email</label>
              </div>
              <q-input
                v-model="email"
                id="email"
                type="email"
                debounce="300"
                outlined
                rounded
                color="primary"
                label-color="primary"
                hide-bottom-space
                :rules="[ val => !!val || 'Campo obrigatório' ]"
                :input-style="{ color: '$primary', borderRadius: '15px' }"
              />
            </div>

            <!-- Botão de redefinir senha -->
            <q-btn
              type="submit"
              label="Enviar Email"
              class="register-btn"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AuthenticateService from '../../services/AuthenticateService';
import { ref, onMounted } from 'vue';
import { createNotifyConfig } from 'src/utils/utils';
import { Notify } from 'quasar';
import { useRoute, useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const passwordRepeated = ref('');
const token = ref('');
const route = useRoute();
const router = useRouter();

defineOptions({
  name: 'ResetPasswordPage'
});

onMounted(async () => {
  token.value = route.params.userToken?.toString() || '';
});

const onGeneratePasswordToken = async () => {
  try {
    const response = await AuthenticateService.generateUserResetPassword(email.value);
    Notify.create(createNotifyConfig('positive', response.data.message, 'top'));
  } catch (error: any) {
    Notify.create(createNotifyConfig('negative', error.message, 'top'));
  }
};

const onResetPassword = async () => {
  try {
    if (password.value.length < 4) {
      Notify.create(createNotifyConfig('negative', 'A senha deve conter pelo menos 4 caracteres', 'top'));
      return;
    }
    if (password.value !== passwordRepeated.value) {
      Notify.create(createNotifyConfig('negative', 'Senhas não conferem', 'top'));
      return;
    }
    const response = await AuthenticateService.resetPassword(password.value, passwordRepeated.value, token.value);
    Notify.create(createNotifyConfig('positive', response.data.message, 'top'));
    router.push('/auth/login');
  } catch (error: any) {
    console.error('Erro ao redefinir senha:', error.message);
    Notify.create(createNotifyConfig('negative', error.message, 'top'));
  }
};

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

.q-btn {
  display: flex;
  justify-content: right;
}
</style>
