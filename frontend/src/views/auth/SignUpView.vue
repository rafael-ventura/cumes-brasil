<template>
  <div class="sign-up">
    <h1>Sign Up</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="nome">Nome</label>
        <input type="text" id="nome" v-model="nome" ref="nomeInput" required>
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" ref="emailInput" required>
      </div>
      <div class="form-group">
        <label for="senha">Senha</label>
        <input type="password" id="senha" v-model="senha" ref="senhaInput" required>
      </div>
      <button type="submit">Cadastrar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserService from "@/services/userService";

const userService = UserService;
const router = useRouter();
const nome = ref("");
const email = ref("");
const senha = ref("");

async function register () {
  try {
    await userService.create(nome.value, email.value, senha.value);
    alert('Usuário cadastrado com sucesso!');
    await router.push('/login');
  } catch (error) {
    console.error("Registration failed:", error);
    alert('Erro ao cadastrar usuário: ' + error);
  }
}
</script>
