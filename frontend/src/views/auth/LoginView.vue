// views/auth/LoginView.vue

<template>
  <div>
    <div class="mx-auto my-6">
      <img
        src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
        alt="Vuetify Logo"
        style="max-width: 228px"
      />
    </div>

    <div
      class="mx-auto pa-12 pb-8"
      style="
        box-shadow: 0px 3px 6px #00000029;
        max-width: 448px;
        border-radius: 12px;
      "
    >
      <div class="text-subtitle-1 text-medium-emphasis">Entrar</div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="form-control"
          placeholder="Email"
          required
          ref="emailInput"
        />
      </div>

      <div class="form-group">
        <label for="password">Senha</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
          placeholder="Sua senha"
          required
          ref="passwordInput"
        />
      </div>

      <div class="my-4">
        <a
          href="/reset-password"
          class="text-caption text-decoration-none text-blue"
          target="_blank"
          rel="noopener noreferrer"
          >Esqueci minha senha</a
        >
      </div>

      <button
        @click="login"
        class="btn btn-primary btn-block mb-8"
        :disabled="!email || !password"
      >
        Log In
      </button>
      <v-btn id="gSignIn" color="white" class="mt-3">
        <v-icon left>mdi-google</v-icon>
        Login com Google
      </v-btn>
      <div class="text-center">
        <span class="text-caption mr-2">Não tem conta?</span>
        <router-link to="/signup" class="text-blue text-decoration-none"
          >Criar conta</router-link
        >
      </div>
    </div>
    <nav-bar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import { useRouter } from "vue-router";
import authenticateService from "../../services/authenticateService";

const router = useRouter();
const email = ref("");
const password = ref("");
const isAuthenticated = ref(authenticateService.isAuthenticated());

// Função de callback para lidar com a resposta do Google
interface GoogleResponse {
  credential: string;
}

function handleCredentialResponse (response: GoogleResponse) {
  const idToken = response.credential;
  loginWithGoogle(idToken); // Chama loginWithGoogle passando o idToken
  // Envie o idToken para o seu backend para validação e início de sessão
}

onMounted(() => {
  window.google.accounts.id.initialize({
    client_id: "35450661704-ab1ap5gj3to0tv7mafech2k9mohsbhrl.apps.googleusercontent.com", // Substitua pelo seu Client ID real
    callback: handleCredentialResponse
  });

  window.google.accounts.id.renderButton(
    document.getElementById("gSignIn"),
    { theme: "outline", size: "medium" }
  );
});

watchEffect(() => {
  isAuthenticated.value = authenticateService.isAuthenticated();
});

async function loginWithGoogle (idToken: string) {
  try {
    const response = await authenticateService.authenticateWithGoogle(idToken);
    const token = response.data;
    localStorage.setItem("authToken", token.token);
    isAuthenticated.value = true;
    await router.push("/");
  } catch (error) {
    console.error("Erro ao autenticar com o Google: ", error);
  }
}

async function login (): Promise<void> {
  try {
    const response = await authenticateService.login(email.value, password.value);
    const token = response.data.token;
    localStorage.setItem("authToken", token.token);
    isAuthenticated.value = true;
    await router.push("/");
  } catch (error) {
    console.error("Login failed:", error);
  }
}

</script>
