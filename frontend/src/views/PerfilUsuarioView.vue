<template>
  <div>
    <v-card align="center" justify="center" max-width="3000" v-if="perfil">
      <v-card-title>Perfil do Usuario</v-card-title>
      <br />
      <v-card align="center">
        <v-avatar size="150" class="mx-auto" color="grey">
          <v-img
            src="https://cdn.vuetifyjs.com/images/john.jpg"
            alt="John"
          ></v-img>
        </v-avatar>
        <br />
      </v-card>
      <v-card-text>
        Nome: {{ perfil.nome }}<br />
        <v-divider inset></v-divider>
        Email: {{ perfil.email }}<br />
        <v-divider inset></v-divider>
        <!-- Removido a linha abaixo, pois a propriedade 'viasEscaladas' não está presente na resposta -->
        <!-- Vias Escaladas: {{ perfil.viasEscaladas }}<br /> -->
        <!-- <v-divider inset></v-divider> -->
      </v-card-text>
    </v-card>
    <div v-else>
      <p>Você precisa estar autenticado para acessar esta página.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import userService from "../services/userService";

export default defineComponent({
  setup () {
    const perfil = ref(null); // Use ref para criar uma referência reativa

    onMounted(async () => {
      try {
        const response = await userService.getPerfil();
        perfil.value = response; // Use .value para acessar ou modificar o valor de uma ref
      } catch (error) {
        console.error("Erro ao buscar o perfil do usuário:", error);
      }
    });

    return { perfil }; // Retorne perfil do setup para que ele possa ser usado no template
  }
});
</script>
