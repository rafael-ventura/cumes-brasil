<template>
  <div>
    <v-img class="mx-auto my-6" max-width="228"
           src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg" />

    <v-card class="mx-auto pa-12 pb-8"
            elevation="8"
            max-width="448"
            rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Entrar</div>

      <v-text-field
        density="compact"
        placeholder="Email"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        @input="maskEmail"
        v-model="email"
        required
      >
      </v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Senha

        <a
          class="text-caption text-decoration-none text-blue"
          href="/reset-password"
          rel="noopener noreferrer"
          target="_blank"

        >
          Esqueci minha senha
        </a>
      </div>

      <v-text-field
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Sua senha"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
        v-model="password"
        required
      >
      </v-text-field>

      <v-btn
        block
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        @click="login"
        :disabled="!email || !password"
      >
        Log In
      </v-btn>

      <v-card-text class="text-center">
        <span class="text-caption mr-2">Não tem conta?</span>
        <router-link to="/signup" class="text-blue text-decoration-none">Criar conta</router-link>
      </v-card-text>
    </v-card>
    <nav-bar/>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import axios from "axios";

const router = useRouter();
const visible = false;
let email = '';
let password = '';

async function login() {
  try {
    const response = await axios.post('http://localhost:3000/login', {
      email,
      password
    });
    const token = response.data.token;
    // Armazenar o token no armazenamento local
    localStorage.setItem('token', token);
    // Redirecionar para a próxima página
    await router.push('/dashboard');
  } catch (error) {
    //TODO: notify pro usuário
    console.error('Login failed:', error);
  }
}

// Máscara de email
async function maskEmail(event) {
  // Lógica para mascarar o campo de email
  const emailInput = event.target.value;
  email = emailInput.replace(/./g, '*');
}
</script>
