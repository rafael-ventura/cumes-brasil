<template>
  <v-container class="login">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field label="Email" type="email" v-model="email" required></v-text-field>
              <v-text-field label="Senha" type="password" v-model="senha" required></v-text-field>
              <v-btn type="submit" color="primary">Entrar</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  setup () {
    const email = "email";
    const senha = "senha";
    const login = () => {
      console.log("Login : ", email, senha);
    };

    return {
      email, senha, login
    };
  }
};

</script>
