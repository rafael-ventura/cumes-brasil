<template>
  <q-page class="q-pa-md">
    <register-form
      title="Cadastrar"
      submit-label="Cadastrar"
      @submit="onSignUp"
    >
      <q-input v-model="confirmPassword"
               label="Confirmar Senha"
               type="password"
               lazy-rules
               :rules="[ val => !!val || 'Campo obrigatório' ]"
      />
      <q-btn flat
             label="Já tem uma conta?"
             @click="goToLogin" />
    </register-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthenticateService from '../../services/AuthenticateService';
import RegisterForm from 'components/Auth/RegistroForm.vue';
import { Notify } from 'quasar';

defineOptions({
  name: 'RegisterPage'
});

const confirmPassword = ref('');
const router = useRouter();

const onSignUp = async ({ nome, email, senha }: { nome: string, email: string, senha: string }) => {
  if (senha !== confirmPassword.value) {
    Notify.create({
      type: 'negative',
      message: 'Senhas não conferem',
      position: 'center',
      timeout: 3000
    });
    return;
  }

  if (senha.length < 4) {
    Notify.create({
      type: 'negative',
      message: 'A senha deve conter pelo menos 4 caracteres',
      position: 'center',
      timeout: 3000
    });
    return;
  }

  try {
    await AuthenticateService.register(nome, email, senha);
    await router.push('/auth/login');
    Notify.create({
      type: 'positive',
      message: 'Cadastro realizado com sucesso!',
      position: 'center',
      timeout: 3000
    });
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: '' + error.message,
      position: 'center',
      timeout: 3000
    });
  }
};

const goToLogin = () => {
  router.push('/auth/login');
};
</script>
