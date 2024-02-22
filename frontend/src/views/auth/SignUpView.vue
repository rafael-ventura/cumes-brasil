<template>
  <div class="sign-up">
    <h1>Sign Up</h1>
    <form>
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

<script>
export default {
  data () {
    return {
      nome: "",
      email: "",
      senha: ""
    };
  }
};
</script>
