<template>
  <v-bottom-navigation bg-color="secondary" v-model="value" grow>
    <v-btn router to="/">
      <v-icon>mdi-home-account</v-icon>
      Home
    </v-btn>

    <v-btn router to="/vias">
      <v-icon>mdi-carabiner</v-icon>
      Vias
    </v-btn>

    <v-btn router to="/colecoes">
      <v-icon>mdi-bookmark-multiple</v-icon>
      Colecoes
    </v-btn>

    <v-btn router to="/perfil">
      <v-icon>mdi-account</v-icon>
      Perfil
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  data: () => ({ value: 1 })
};
</script>

<style scoped>
</style>
