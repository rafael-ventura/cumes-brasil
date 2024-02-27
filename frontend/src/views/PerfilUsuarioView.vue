<template>
  <div>
    <v-card>
      <v-card-title>Perfil do Usuario</v-card-title>
      <v-card-subtitle>Informações do Usuario</v-card-subtitle>
      <br>
      <v-card>
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
        Email: {{ email }}<br>
        Data de Nascimento: {{ dataNascimento }}<br>
        Descrição: {{ descricao }}<br>
        Clubes: {{ clubes }}<br>
        Vias Escaladas: {{ viasEscaladas }}<br>
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
