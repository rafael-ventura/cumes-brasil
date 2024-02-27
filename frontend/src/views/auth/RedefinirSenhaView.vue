<template>
  <div class="password-recovery">
    <h1>Recuperação de Senha</h1>
    <div class="password-recovery-form">
      <form @submit.prevent="recoverPassword">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <button type="submit">Recuperar Senha</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: ""
    };
  },
  methods: {
    recoverPassword () {
      console.log("Recuperar senha");
    }
  }
};

</script>
