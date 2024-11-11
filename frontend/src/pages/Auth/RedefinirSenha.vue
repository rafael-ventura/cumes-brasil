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
        <q-card-section>
          <q-form @submit.prevent="onGeneratePasswordToken" class="custom-redefinir-form">

            <!-- Campo Email -->
            <div class="custom-input">
              <div class="input-container">
                <q-icon name="mail" class="input-icon" />
                <label for="email" class="input-label">Email</label>
              </div>
              <q-input v-model="email"
                       id="email"
                       type="email"
                       dense
                       color="primary"
                       bg-color="dark"
                       label-color="primary"
                       hide-bottom-space
                       :rules="[ val => !!val || 'Campo obrigatório' ]"
                       class="custom-input-field"
                       :input-style="{ color: '#fcbd7b'}"
              />
            </div>

            <!-- Botão de redefinir senha -->
            <q-btn type="submit"
                   label="Redefinir Senha"
                   color="primary"
                   class="register-btn q-mt-md"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AuthenticateService from '../../services/AuthenticateService';
import { ref } from 'vue';
import { createNotifyConfig } from 'src/utils/utils';
import { Notify } from 'quasar';

const email = ref('');

defineOptions({
  name: 'ResetPasswordPage'
});

const onGeneratePasswordToken = async () => {
  try {
    const response = await AuthenticateService.generateUserResetPassword(email.value);
    Notify.create(createNotifyConfig('positive', response.data.message, 'top'));
  } catch (error: any) {
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
  background-color: rgba($dark, 0.85);
  border-radius: 10px;
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
  width: 100%;
  background-color: #fcbd7b;
  color: $primary;
  border-radius: 15px;
  padding: 10px;
  max-width: 160px;
}
</style>
