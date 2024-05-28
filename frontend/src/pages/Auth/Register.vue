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
               required />
      <q-btn flat
             label="Já tem uma conta?"
             @click="goToLogin" />
    </register-form>
    <AuthError :message="errorMessage" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthenticateService from "../../services/AuthenticateService";
import RegisterForm from "components/Auth/RegisterForm.vue";
import AuthError from "components/Auth/AuthError.vue";

defineOptions({
  name: "RegisterPage"
});

const confirmPassword = ref("");
const errorMessage = ref<string | null>(null);
const router = useRouter();

const onSignUp = async ({ nome, email, senha }: { nome: string, email: string, senha: string }) => {
  if (senha !== confirmPassword.value) {
    errorMessage.value = "Senhas não conferem";
    return;
  }

  try {
    const response = await AuthenticateService.register(nome, email, senha);
    console.log(response.data);
    await router.push("/auth/login");
  } catch (error: any) {
    errorMessage.value = "Erro ao cadastrar usuário: " + error.message;
  }
};

const goToLogin = () => {
  router.push("/auth/login");
};
</script>
