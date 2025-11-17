<template>
  <q-btn
    round
    icon="arrow_back"
    size="0.8rem"
    class="btn-back"
    @click="goBack"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  console.log('Botão de voltar clicado');
  router.back();
};
</script>

<style scoped lang="scss">
.q-btn.btn-back {
  background-color: rgba(0, 0, 0, 0.6);
  color: #8CB369;
  z-index: 999; // Abaixo da TopBar (z-index: 1000)
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  opacity: 0.9;
  pointer-events: auto;
}

</style>
