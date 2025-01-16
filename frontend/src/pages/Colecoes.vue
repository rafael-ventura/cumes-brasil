<template>
  <q-page>
    <div class="titulo-pagina">Minhas Coleções</div>
    <Busca
      ref="searchEntityRef"
      entity="colecao"
      @select="goToColecaoDetalhada"
      @update-results="updateSearchResults"
      :enableSortOptions="[{ field: 'nome', label: 'Nome' }]"
      :hideHeader="true"
    >
      <template #subHeader>
        <SubNavbar />
      </template>

      <template #filters="{ filters }">
        <BuscaFiltros :entity="'colecao'" :filters="filters" :enabledFilters="['searchQuery']"
                      @applyFilters="applyFilters" unifiedSearchLabel="Nome da Coleção" />
      </template>
    </Busca>

    <q-btn
      fab
      icon="add"
      class="botao-add fixed-bottom-right"
      @click="isAddColecaoModalOpen = true"
    />

    <AddColecaoModal
      :isOpen="isAddColecaoModalOpen"
      @update:isOpen="isAddColecaoModalOpen = $event"
      @collection-added="addColecao"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthenticateService from 'src/services/AuthenticateService';
import ColecaoService from 'src/services/ColecaoService';
import { IColecao } from 'src/models/IColecao';
import Busca from 'components/Busca/Busca.vue';
import BuscaFiltros from 'components/Busca/BuscaFiltros.vue';
import SubNavbar from 'layouts/SubNavbar.vue';
import AddColecaoModal from 'components/Colecao/AddColecaoModal.vue';

const searchEntityRef = ref();
const router = useRouter();
const colecoes = ref<IColecao[] | undefined>([]);
const isAddColecaoModalOpen = ref(false);
ref({
  nome: '',
  descricao: '',
  usuario_id: Number(localStorage.getItem('usuarioId')) || 0
});
const addColecao = async (colecaoPreenchida: IColecao) => {
  try {
    console.log('Adicionando coleção:', colecaoPreenchida);
    await ColecaoService.create(colecaoPreenchida);
    colecoes.value = await ColecaoService.getByUsuarioId();
    isAddColecaoModalOpen.value = false;
  } catch (error) {
    console.error('Erro ao adicionar coleção:', error);
  }
};

defineOptions({
  name: 'ColecoesPage'
});

onMounted(async () => {
  if (!AuthenticateService.isAuthenticated()) {
    await router.push('/auth/login');
  }
});

const applyFilters = (filters: any) => {
  if (searchEntityRef.value && searchEntityRef.value.handleApplyFilters) {
    searchEntityRef.value.handleApplyFilters(filters);
  } else {
    console.error('Busca ref not found or handleApplyFilters not defined');
  }
};

const updateSearchResults = (results: any[]) => {
  console.log('Search results updated:', results);
};

const goToColecaoDetalhada = (colecao: IColecao) => {
  router.push(`/colecoes/${colecao.id}`);
};

</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
.page-padding {
  padding: 16px;
}

.custom-avatar {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-avatar img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.fixed-bottom-right {
  position: fixed;
  bottom: 120px;
  right: 16px;
  z-index: 2;
}

.break-word {
  word-break: break-all;
}

.titulo-pagina {
  font-size: 40px;
  text-align: center;
  color: $primary;
}
</style>
