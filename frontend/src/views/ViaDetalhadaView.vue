<template>
  <div class="via-detalhada">
    <h1>Via de Escalada</h1>
    <!--TODO: melhorar visual    -->
    <div class="via-detalhada-info">
      <p>Nome: {{ via.nome }}</p>
      <p>Local: {{ via.local }}</p>
      <p>Grau: {{ via.grau }}</p>
      <p>Descrição: {{ via.descricao }}</p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const via = ref(null);
const router = useRouter();
const route = useRoute();

const loadViaDetails = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/vias/${route.params.id}`);
    via.value = response.data;
  } catch (error) {
    console.error('Erro ao obter detalhes da via:', error);
  }
};

onMounted(async () => {
  if (!via.value) {
    await loadViaDetails();
  }
});
</script>
