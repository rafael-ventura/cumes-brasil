<template>
  <q-page class="escaladas-page">
    <!-- Título da página -->
    <div class="titulo-pagina">Minhas Escaladas</div>

    <Busca
      ref="searchEntityRef"
      entity="escalada"
      @select="goToEscaladaDetalhada"
      @update-results="updateSearchResults"
      :hideHeader="true"
      :enableSortOptions="[{ field: 'data', label: 'Data' }]"
    >
      <template #subHeader>
        <SubNavbar />
      </template>
      <template #filters="{ filters }">
        <BuscaFiltros :entity="'escalada'" :filters="filters" :enabledFilters="['searchQuery']" @applyFilters="applyFilters" unifiedSearchLabel="Buscar Escalada" />
      </template>
    </Busca>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SubNavbar from 'src/layouts/SubNavbar.vue';
import Busca from 'components/Busca/Busca.vue';
import BuscaFiltros from 'components/Busca/BuscaFiltros.vue';
import { Escalada } from 'src/models/Escalada';
import AuthenticateService from 'src/services/AuthenticateService';
import { useRouter } from 'vue-router';

const router = useRouter();
const escaladas = ref<Escalada[]>([]);
const searchEntityRef = ref();

onMounted(async () => {
  if (!AuthenticateService.isAuthenticated()) {
    await router.push('/auth/login');
  }
  /* try {
    const response = await EscaladaService.getEscaladasByUsuario();
    if (Array.isArray(response) && response.length > 0) {
      escaladas.value = response;
    } else {
      console.warn('Nenhuma escalada encontrada ou resposta inválida');
    }
  } catch (error) {
    console.error('Erro ao buscar escaladas:', error);
  } */
});

// Funções para gerenciar filtros e navegação
const applyFilters = (filters: any) => {
  if (searchEntityRef.value && searchEntityRef.value.handleApplyFilters) {
    searchEntityRef.value.handleApplyFilters(filters);
  }
};

const updateSearchResults = (results: any[]) => {
  escaladas.value = results;
};

const goToEscaladaDetalhada = (escalada: Escalada) => {
  // Lógica para navegar para a tela detalhada da escalada
  console.log('Selecionada:', escalada);
};

defineOptions({
  name: 'EscaladasPage'
});
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
.escaladas-page {
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
  padding-top: 4%;
}

.titulo-pagina {
  font-size: 40px;
  text-align: center;
  color: var(--q-primary);
}

.escalada-card img {
  width: 100%;
  height: auto;
  padding: 0; /* Remove padding da imagem */
  margin: 0; /* Remove margin da imagem */
  border: 0; /* Remove borda da imagem */
  border-top-left-radius: 10px; /* Borda arredondada superior esquerda */
  border-top-right-radius: 10px; /* Borda arredondada superior direita */
  object-fit: cover; /* Garante que a imagem se ajuste corretamente ao espaço */
}
</style>
