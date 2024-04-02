<template>
  <v-app-bar scroll-behavior="hide" scroll-threshold="230">
    <v-app-bar-title>
      Cumes Brasil
    </v-app-bar-title>
  </v-app-bar>
</template>

<script>

export default {
  name: "AppBar",
  components: {
  }
};
</script>
<style lang="scss">
@import "@/assets/styles";
body .v-app-bar.v-toolbar {
  background-color: map-get($colors, "secondary");
  color: map-get($colors, "text-light");
}
</style>
