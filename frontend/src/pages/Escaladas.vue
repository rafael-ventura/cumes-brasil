<template>
  <q-page class="escaladas-page">
    <div class="titulo-pagina">Minhas Escaladas</div>

    <!-- Sub-navbar -->
    <SubNavbar />

    <!-- Lista de Escaladas -->
    <div class="escaladas-container">
      <EscaladaCard
        v-for="escalada in escaladas"
        :key="escalada.id"
        :escalada="escalada"
        class="escalada-card"
      />
    </div>
  </q-page>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EscaladaCard from 'src/components/Escalada/EscaladaCard.vue';
import SubNavbar from 'src/layouts/SubNavbar.vue';
import { Escalada } from 'src/models/Escalada';
import EscaladaService from 'src/services/EscaladaService';

const escaladas = ref<Escalada[]>([]);

onMounted(async () => {
  try {
    const response = await EscaladaService.getEscaladas();
    if (Array.isArray(response) && response.length > 0) {
      escaladas.value = response;
    } else {
      console.warn('Nenhuma escalada encontrada ou resposta inválida');
    }
  } catch (error) {
    console.error('Erro ao buscar escaladas:', error);
  }
});

defineOptions({
  name: 'EscaladasPage'
});
</script>

<style scoped>
.escaladas-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
}

.escaladas-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  box-sizing: border-box;
  padding-top: 4%
}

.titulo-pagina {
  font-size: 40px;
  text-align: center;
  color: var(--q-primary);
}

.escalada-card {
  width: 100%;
  max-width: 800px; /* Limita a largura máxima para legibilidade */
  margin-bottom: 16px;
  border: 1px solid var(--q-primary);
  border-radius: 8px;
  padding: 16px;
  box-sizing: border-box;
}
</style>
