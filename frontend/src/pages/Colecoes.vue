<template>
  <div class="titulo-pagina">Minhas Coleções</div>
  <q-page>
    <Busca
      ref="searchEntityRef"
      entity="colecao"
      @select="goToColecaoDetalhada"
      :enableSortOptions="[{ field: 'nome', label: 'Nome' }]"
      :hide-header="true"
    >
      <template #subHeader>
        <SubNavbar />
      </template>

      <template #filters="{ filters }">
        <BuscaFiltros :entity="'colecao'" :filters="filters" :enabledFilters="['searchQuery']"
                      @applyFilters="handleApplyFilters" unifiedSearchLabel="Nome da Coleção" />
      </template>
    </Busca>

    <!-- Botão de Adicionar -->
    <BotaoAdicionar @add="abrirModalAdicao" />

    <AddColecaoModal
      :isOpen="isAddColecaoModalOpen"
      @update:isOpen="isAddColecaoModalOpen = $event"
      @collection-added="addColecao"
    />
    
    <!-- Espaçamento no final da página -->
    <div class="page-bottom-spacer"></div>
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
import BotaoAdicionar from 'components/BotaoAdicionar.vue'; // Importa o botão

const searchEntityRef = ref();
const router = useRouter();
const colecoes = ref<IColecao[] | undefined>([]);
const isAddColecaoModalOpen = ref(false);

// Agora garantimos que o evento do botão realmente abre o modal
const abrirModalAdicao = () => {
  console.log('Abrindo modal de adição...');
  isAddColecaoModalOpen.value = true;
};

const addColecao = async (colecaoPreenchida: IColecao) => {
  try {
    await ColecaoService.criarColecao(colecaoPreenchida);
    colecoes.value = await ColecaoService.listarColecoesPorUsuario();
    isAddColecaoModalOpen.value = false;
    handleApplyFilters({ page: 1 });
  } catch (error) {
    console.error('Erro ao adicionar coleção:', error);
  }
};

defineOptions({
  name: 'ColecoesPage'
});

onMounted(async () => {
  await AuthenticateService.redirecionaSeNaoAutenticado(router);
});

const handleApplyFilters = (filters: any) => {
  if (searchEntityRef.value && searchEntityRef.value.handleApplyFilters) {
    searchEntityRef.value.handleApplyFilters(filters);
  } else {
    console.error('Busca ref not found or handleApplyFilters not defined');
  }
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

.titulo-pagina {
  font-size: 40px;
  font-weight: 700;
  text-align: center;
  color: $cumes-01;
  text-shadow: 0 2px 4px $text-shadow-default;
  /* Removido margin-bottom para alinhar com outras abas */
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
}

.page-bottom-spacer {
  height: 48px;
  width: 100%;
  
  @media (max-width: 768px) {
    height: 32px;
  }
}
</style>
