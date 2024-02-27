<template>
  <div>
    <v-card align="center" justify="center" max-width="3000">
      <v-card-title>Perfil do Usuario</v-card-title>
      <br>
      <v-card align="center">
        <v-avatar size="150" class="mx-auto" color="grey">
          <v-img
            src="https://cdn.vuetifyjs.com/images/john.jpg"
            alt="John"
          ></v-img>
        </v-avatar>
        <br>
      </v-card>
      <v-card-text>
        Nome: {{ nome }}<br>
        <v-divider inset></v-divider>
        Email: {{ email }}<br>
        <v-divider inset></v-divider>
        Data de Nascimento: {{ dataNascimento }}<br>
        <v-divider inset></v-divider>
        Descrição: {{ descricao }}<br>
        <v-divider inset></v-divider>
        Clubes: {{ clubes }}<br>
        <v-divider inset></v-divider>
        Vias Escaladas: {{ viasEscaladas }}<br>
        <v-divider inset></v-divider>
      </v-card-text>
    </v-card>
  </div>
</template>
<script lang="ts">
export default {
  data () {
    return {
      nome: "Nome do Usuario",
      email: "email@email.com",
      dataNascimento: "01/01/2000",
      descricao: "Descrição do usuario",
      clubes: "Clube 1, Clube 2, Clube 3",
      viasEscaladas: "13 vias"
    };
  }
};
</script>
```
