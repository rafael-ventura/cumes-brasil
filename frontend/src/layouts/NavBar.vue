<template>
  <q-footer elevated class="bg-primary text-white">
    <q-toolbar class="q-pa-md justify-around">
      <q-btn flat round size="lg" icon="home" @click="goTo('/')"/>
      <q-btn flat round size="lg" icon="search" @click="goTo('/busca')"/>
      <q-btn flat round size="lg" icon="style" @click="goTo('/colecoes')"/>
      <q-btn flat round size="lg" icon="account_circle" @click="goTo('/perfil')"/>
      <q-btn flat round size="lg" :icon="isDarkMode ? 'brightness_7' : 'brightness_4'" @click="toggleDarkMode"/>
    </q-toolbar>
  </q-footer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Dark } from "quasar";

const router = useRouter();
const isDarkMode = ref(Dark.isActive);

const goTo = (path: string) => {
  router.push(path);
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  Dark.set(isDarkMode.value);
};
</script>

<style scoped>
.q-toolbar {
  justify-content: space-around;
}

.q-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
