<template>
  <q-page class="fundo-cadastro">
    <div class="logo-container">
      <q-img src="/logo-black.svg" alt="Cumes Brasil" class="logo-tamanho" />
    </div>
    <div class="form-container">
      <register-form
        title="Cadastrar"
        submit-label="Cadastrar"
        @submit="onSignUp"
      >
        <!-- Campo Confirmar Senha -->
        <div class="custom-input">
          <div class="input-container">
            <q-icon name="lock" class="input-icon" />
            <label for="confirmPassword" class="input-label">Confirmar Senha</label>
          </div>
          <q-input v-model="confirmPassword"
                   id="confirmPassword"
                   type="password"
                   outlined
                   dense
                   color="primary"
                   bg-color="dark"
                   label-color="primary"
                   hide-bottom-space
                   :rules="[ val => !!val || 'Campo obrigatório' ]"
                   class="custom-input-field"
          />
        </div>
        <q-btn flat label="Já tem uma conta?" class="link-login" @click="goToLogin" />
      </register-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthenticateService from '../../services/AuthenticateService';
import RegisterForm from 'components/Auth/RegistroForm.vue';
import { Notify } from 'quasar';
import { createNotifyConfig } from 'src/utils/utils';

defineOptions({
  name: 'RegisterPage'
});

const confirmPassword = ref('');
const router = useRouter();

const onSignUp = async ({ nome, email, senha }: { nome: string, email: string, senha: string }) => {
  if (senha !== confirmPassword.value) {
    Notify.create(createNotifyConfig('negative', 'Senhas não conferem', 'top'));
    return;
  }

  if (senha.length < 4) {
    Notify.create(createNotifyConfig('negative', 'A senha deve conter pelo menos 4 caracteres', 'top'));
    return;
  }

  try {
    await AuthenticateService.register(nome, email, senha);
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
  background-color: rgba($dark, 0.85);
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

.custom-input-field {
  width: 100%;
  background-color: rgba($dark, 0.85);
  border-radius: 5px;
  color: $primary;

  .q-field__control {
    border-color: $primary;
    color: $primary;
  }
}

.link-login {
  color: $primary;
  margin-top: 10px;
}
</style>
