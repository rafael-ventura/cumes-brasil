<template>
  <q-page>
    <div class="titulo-pagina">Minhas Escaladas</div>

    <!-- Sub-navbar -->
    <SubNavbar />

    <!-- Lista de Escaladas -->
    <q-list>
      <EscaladaCard
        v-for="escalada in escaladas"
        :key="escalada.id"
        :escalada="escalada"
      />
    </q-list>
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
.page-padding {
  padding: 16px;
}

.titulo-pagina {
  font-size: 40px;
  text-align: center;
  color: var(--q-primary);
  margin-bottom: 16px;
}
</style>
