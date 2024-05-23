<template>
  <q-btn
    flat
    round
    icon="arrow_back"
    class="back-button"
    @click="goBack"
  />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.back-button {
  color: black;
}

.back-button:hover {
  background-color: lightgray;
}
</style>
