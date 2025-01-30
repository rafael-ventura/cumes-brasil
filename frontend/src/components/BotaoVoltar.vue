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
  console.log('Botão de voltar clicado'); // Log para verificar o clique
  router.back();
};
</script>

<style scoped lang="scss">
.q-btn.btn-back {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6); /* Fundo semi-transparente */
  color: white;
  z-index: 1000; /* Garante que o botão fica acima de outros elementos */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-radius: 50%; /* Torna o botão redondo */
  opacity: 0.9; /* Dá visibilidade sem ser chamativo */
  pointer-events: auto; /* Garante que o botão captura cliques */
}
</style>
