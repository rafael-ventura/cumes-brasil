<template>
  <div class="sign-up">
    <h1>Sign Up</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="nome">Nome</label>
        <input type="text" id="nome" v-model="nome" required>
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="senha">Senha</label>
        <input type="password" id="senha" v-model="senha" required>
      </div>
      <button type="submit">Cadastrar</button>
    </form>
  </div>
</template>

<script setup>
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const nome = "";
const email = "";
const senha = "";

async function register () {
  try {
    const response = await axios.post("http://localhost:3000/register", {
      nome,
      email,
      senha
    });
    console.log("User registered:", response.data);
    await router.push("/login");
  } catch (error) {
    console.error("Registration failed:", error);
  }
}
</script>
