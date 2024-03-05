<template>
  <div>
    <div class="mx-auto my-6">
      <img src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg" alt="Vuetify Logo"
           style="max-width: 228px;">
    </div>

    <div class="mx-auto pa-12 pb-8"
         style="box-shadow: 0px 3px 6px #00000029; max-width: 448px; border-radius: 12px;"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Entrar</div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" class="form-control" placeholder="Email" required ref="emailInput">
      </div>

      <div class="form-group">
        <label for="password">Senha</label>
        <input type="password" id="password" v-model="password" class="form-control" placeholder="Sua senha" required ref="passwordInput">
      </div>

      <div class="my-4">
        <a href="/reset-password" class="text-caption text-decoration-none text-blue" target="_blank"
           rel="noopener noreferrer">Esqueci minha senha</a>
      </div>

      <button @click="login" class="btn btn-primary btn-block mb-8" :disabled="!email || !password">Log In</button>

      <div class="text-center">
        <span class="text-caption mr-2">Não tem conta?</span>
        <router-link to="/signup" class="text-blue text-decoration-none">Criar conta</router-link>
      </div>
    </div>
    <nav-bar/>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import authenticateService from "@/services/authenticateService";

const router = useRouter();
const email = ref("");
const password = ref("");
const isAuthenticated = ref(authenticateService.isAuthenticated());

watchEffect(() => {
  isAuthenticated.value = authenticateService.isAuthenticated();
});

async function login (): Promise<void> {
  try {
    const response = await authenticateService.login(email.value, password.value);
    const token: string = response.data.token;
    localStorage.setItem("authToken", token);
    isAuthenticated.value = true;
    await router.push("/");
    window.location.reload(); // TODO: ver melhor forma de atualizar pagina
  } catch (error) {
    console.error("Login failed:", error);
  }
}
</script>
