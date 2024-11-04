<template>
  <q-page class="favoritas-page" v-if="colecao != null && colecao.id != null">
    <!-- Título da página -->
    <div class="titulo-pagina">Vias Favoritas</div>

    <!-- Busca por vias na coleção de favoritas -->
    <SearchEntity
      ref="searchEntityRef"
      entity="via"
      :enableSortOptions="[{ field: 'nome', label: 'Nome' }]"
      @select="goToViaDetalhada"
      @update-results="updateSearchResults"
      :staticFilters="{ colecaoId: colecao?.id }"
      :hideHeader="true"
    >
      <template #subHeader>
        <SubNavbar />
      </template>

      <template #filters="{ filters }">
        <SearchFilters v-if="colecao && colecao.id"
                       :filters="filters"
                       :enabledFilters="['unifiedSearch', 'selectedDifficulty']"
                       @applyFilters="applyFilters"
                       :staticFilters="{ colecaoId: colecao.id }"
                       unifiedSearchLabel="Buscar Via"
                       :entity="'via'"
        />
      </template>
    </SearchEntity>

    <!-- Botão para adicionar vias -->
    <q-btn
      fab
      icon="add"
      class="botao-add fixed-bottom-right"
      @click="openAddViaModal"
    />

    <!-- Modais e componentes auxiliares -->
    <ModalConfigColecoes
      v-model="isConfigDialogOpen"
      :collectionData="colecao || {}"
      @edit="editCollection"
      @delete="confirmDeletion"
    />
    <ImagemModal :isOpen="isImageModalOpen" :imageUrl="expandedImageUrl" @update:isOpen="isImageModalOpen = $event" />
    <q-dialog v-model="isDeleteConfirmOpen" persistent>
      <q-card>
        <q-card-section>
          Tem certeza que deseja excluir esta coleção?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Sim" color="red" @click="deleteCollection" />
          <q-btn flat label="Voltar" @click="isDeleteConfirmOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <AddViaModal
      :isOpen="isAddViaModalOpen"
      :colecaoId="colecao?.id || 0"
      @update:isOpen="updateIsAddViaModalOpen"
      @via-added="viaAdded"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import ColecaoService from 'src/services/ColecaoService';
import { Colecao } from 'src/models/Colecao';
import ImagemModal from 'components/Colecao/ImagemModal.vue';
import ModalConfigColecoes from 'components/Colecao/ModalConfigColecoes.vue';
import AddViaModal from 'components/Colecao/AddViaModal.vue';
import SearchFilters from 'components/Busca/BuscaFiltros.vue';
import SearchEntity from 'components/Busca/Busca.vue';
import SubNavbar from 'layouts/SubNavbar.vue';

const router = useRouter();
const searchEntityRef = ref();
const colecao = ref<Colecao | null>(null);
const isImageModalOpen = ref(false);
const isDeleteConfirmOpen = ref(false);
const isAddViaModalOpen = ref(false);
const expandedImageUrl = ref('');
const isConfigDialogOpen = ref(false);
computed(() => ({
  colecaoId: colecao.value?.id
}));
defineOptions({
  name: 'FavoritasPage'
});

onMounted(async () => {
  try {
    colecao.value = await ColecaoService.getFirstByUsuarioId();
  } catch (error) {
    console.error('Coleção de Vias Favoritas não encontrada:', error);
    await router.push('/colecoes');
  }
});

// Watch for changes in colecao and apply filters when it is loaded
watch(colecao, (newVal) => {
  if (newVal && newVal.id) {
    applyFilters({ staticFilters: { colecaoId: newVal.id } });
  }
});

const deleteCollection = async () => {
  if (colecao.value) {
    try {
      await ColecaoService.delete(colecao.value.id);
      await router.push('/colecoes');
    } catch (error) {
      console.error('Erro ao excluir a coleção:', error);
    }
  }
};

// Função para editar a coleção
const editCollection = async (data: { nome: string; descricao: string }) => {
  if (colecao.value) {
    try {
      await ColecaoService.update(colecao.value.id, data);
      colecao.value.nome = data.nome;
      colecao.value.descricao = data.descricao;
    } catch (error) {
      console.error('Erro ao editar a coleção:', error);
    }
  }
};

// Função para abrir o modal de adicionar via
const openAddViaModal = () => {
  isAddViaModalOpen.value = true;
};

// Função para redirecionar para a página de detalhes da via
const goToViaDetalhada = (via: any) => {
  router.push(`/vias/${via.id}`);
};

// Função para aplicar filtros na busca
const applyFilters = (filters: any) => {
  if (searchEntityRef.value && searchEntityRef.value.handleApplyFilters) {
    searchEntityRef.value.handleApplyFilters(filters);
  } else {
    console.error('searchEntityRef ou handleApplyFilters não está definido');
  }
};

// Função para atualizar os resultados da busca
const updateSearchResults = (results: any[]) => {
  console.log('Resultados da busca atualizados:', results);
};

// Função para manipular a visibilidade do modal de adição de via
const updateIsAddViaModalOpen = (value: boolean) => {
  isAddViaModalOpen.value = value;
};

// Função para adicionar uma nova via à lista de favoritas
const viaAdded = () => {
  searchEntityRef.value?.handleApplyFilters({ page: 1 });
};

const confirmDeletion = () => {
  isDeleteConfirmOpen.value = true;
};
</script>

<style scoped>
.titulo-pagina {
  font-size: 40px;
  text-align: center;
  color: var(--q-primary);
}

.fixed-bottom-right {
  position: fixed;
  bottom: 120px;
  right: 16px;
  z-index: 2;
}
</style>
