<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ColecaoService from 'src/services/ColecaoService';
import AddViaModal from 'components/Colecao/AddViaModal.vue';
import Busca from 'components/Busca/Busca.vue';
import BuscaFiltros from 'components/Busca/BuscaFiltros.vue';
import SubNavbar from 'layouts/SubNavbar.vue';

defineOptions({
  name: 'FavoritasPage'
});

// Router para navegação
const router = useRouter();

// Referência para o componente de busca
const searchEntityRef = ref();

// Dados da coleção de favoritas
const colecaoId = ref<number | null>(null);

// Controle de modais
const isAddViaModalOpen = ref(false);

// Obtenha o ID do usuário de forma reativa
const usuarioId = computed(() => window.localStorage.getItem('usuarioId') || null);

// Função para buscar a coleção de favoritas
async function fetchFavoritasColecao () {
  if (!usuarioId.value) {
    console.error('Usuário não logado.');
    router.push('/auth/login');
    return;
  }

  try {
    const colecao = await ColecaoService.getColecaoFavoritos();
    if (colecao?.id) {
      colecaoId.value = colecao.id; // Atualiza o filtro
    } else {
      console.warn('Nenhuma coleção de favoritas encontrada.');
      colecaoId.value = null;
    }
  } catch (error) {
    console.error('Erro ao buscar coleção de favoritas:', error);
    router.push('/colecoes'); // Redireciona caso falhe
  }
}

// Executa ao montar o componente
onMounted(async () => {
  await fetchFavoritasColecao();
});

// Funções auxiliares
const applyFilters = (filters: any) => {
  searchEntityRef.value?.handleApplyFilters(filters);
};

const goToViaDetalhada = (via: any) => {
  router.push(`/vias/${via.id}`);
};

const openAddViaModal = () => {
  isAddViaModalOpen.value = true;
};

const viaAdded = () => {
  searchEntityRef.value?.handleApplyFilters({ page: 1 });
};
</script>

<template>
  <q-page class="favoritas-page">
    <!-- Título da página -->
    <div class="titulo-pagina">Vias Favoritas</div>

    <!-- Componente de Busca -->
    <Busca
      ref="searchEntityRef"
      entity="via"
      :enableSortOptions="[{ field: 'nome', label: 'Nome' }]"
      :staticFilters="{ colecaoId: colecaoId, usuarioId: usuarioId }"
      :hideHeader="true"
      @select="goToViaDetalhada"
    >
      <template #subHeader>
        <SubNavbar />
      </template>

      <template #filters="{ filters }">
        <BuscaFiltros
          :filters="filters"
          :enabledFilters="['unifiedSearch', 'selectedDifficulty']"
          :staticFilters="{ colecaoId: colecaoId, usuarioId: usuarioId }"
          @applyFilters="applyFilters"
          unifiedSearchLabel="Buscar Via"
          :entity="'via'"
        />
      </template>
    </Busca>

    <!-- Botão para adicionar vias -->
    <q-btn
      fab
      icon="add"
      class="botao-add fixed-bottom-right"
      @click="openAddViaModal"
    />
    <AddViaModal
      :isOpen="isAddViaModalOpen"
      :colecaoId="colecaoId ?? 0"
      @update:isOpen="isAddViaModalOpen = $event"
      @via-added="viaAdded"
    />
  </q-page>
</template>

<style scoped lang="scss">
@import 'src/css/app.scss';

.titulo-pagina {
  font-size: 40px;
  text-align: center;
  color: $cumes-01;
}

.fixed-bottom-right {
  position: fixed;
  bottom: 120px;
  right: 16px;
  z-index: 2;
}
</style>
