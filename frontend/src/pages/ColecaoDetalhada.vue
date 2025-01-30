<template>
  <q-page>
    <div v-if="colecao">
      <div class="header-container" @click="expandImage(colecao!.imagem?.url || '')">
        <BotaoVoltar class="back-button" />
        <div class="header">
          <div
            v-if="colecao!.imagem?.url"
            :style="{ backgroundImage: `url(${colecao!.imagem.url})` }"
            class="header-image"
          ></div>
          <ImagePlaceholder
            v-else
            class="header-placeholder"
            :fillColor="'$primary'"
          />
          <div class="header-content">
            <div class="header-info">
              <div class="text-h5">{{ colecao.nome }}</div>
              <!-- Botão de edição -->
              <q-btn
                flat
                dense
                icon="edit"
                color="white"
                @click.stop="isConfigDialogOpen = true"
              />
            </div>
            <div class="text-subtitle1">{{ colecao.descricao }}</div>
            <!-- quantidade de vias na coleção -->
            <div class="text-caption">Vias: {{ colecao.viaColecoes?.length || 0 }}</div>
          </div>
        </div>
      </div>

      <!-- Componente de busca para vias dentro da coleção -->
      <Busca
        ref="searchEntityRef"
        entity="via"
        :staticFilters="{ colecaoId: colecao?.id }"
        @select="goToViaDetalhada"
        :hideHeader="true"
      >
        <template #filters="{ filters }">
          <BuscaFiltros
            :filters="filters"
            :enabledFilters="['unifiedSearch', 'selectedDifficulty']"
            @applyFilters="applyFilters"
            :staticFilters="{ colecaoId: colecao?.id }"
            unifiedSearchLabel="Nome da Via"
            :entity="'via'"
          />
        </template>
      </Busca>

      <!-- Substituição pelo componente de botão -->
      <BotaoAdicionar @add="openAddViaModal" />

      <AddViaModal
        :isOpen="isAddViaModalOpen"
        :colecaoId="colecao!.id"
        @update:isOpen="updateIsAddViaModalOpen"
        @via-added="viaAdded"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ColecaoService from 'src/services/ColecaoService';
import { IColecao } from 'src/models/IColecao';
import BotaoVoltar from 'components/BotaoVoltar.vue';
import AddViaModal from 'components/Colecao/AddViaModal.vue';
import BuscaFiltros from 'components/Busca/BuscaFiltros.vue';
import Busca from 'components/Busca/Busca.vue';
import ImagePlaceholder from 'components/ImagePlaceholder.vue';
import BotaoAdicionar from 'components/BotaoAdicionar.vue'; // Importação do novo botão

const route = useRoute();
const router = useRouter();
const searchEntityRef = ref();
const colecao = ref<IColecao | null | undefined>(null);
const isImageModalOpen = ref(false);
const isAddViaModalOpen = ref(false);
const expandedImageUrl = ref('');
const isConfigDialogOpen = ref(false);

onMounted(async () => {
  const colecaoId = Number(route.params.id);
  colecao.value = await ColecaoService.buscarColecaoPorId(colecaoId);
});

const applyFilters = (filters: any) => {
  if (searchEntityRef.value && searchEntityRef.value.handleApplyFilters) {
    searchEntityRef.value.handleApplyFilters(filters);
  } else {
    console.error('Busca ref not found or handleApplyFilters not defined');
  }
};

const goToViaDetalhada = (id: any) => {
  router.push(`/vias/${id}`);
};

const expandImage = (url: string) => {
  expandedImageUrl.value = url;
  isImageModalOpen.value = true;
};

const openAddViaModal = () => {
  isAddViaModalOpen.value = false; // Força um reset antes de abrir
  setTimeout(() => {
    isAddViaModalOpen.value = true;
  }, 50); // Pequeno delay para garantir que o Vue processe a atualização corretamente
};

const updateIsAddViaModalOpen = (value: boolean) => {
  isAddViaModalOpen.value = value;
};

const viaAdded = () => {
  searchEntityRef.value?.handleApplyFilters({ page: 1 });
};
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.header-container {
  position: relative;
  width: 100%;
  cursor: pointer;
  margin: 0;
}

.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}

.header {
  width: 100%;
  height: 300px; /* Altura fixa */
  background-color: rgba($cumes-01, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-bottom-left-radius: 16px; /* Bordas arredondadas nos cantos inferiores */
  border-bottom-right-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.header-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-bottom-left-radius: 16px; /* Alinha o arredondamento com a `header` */
  border-bottom-right-radius: 16px;
}

.header-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba($cumes-01, 0.1);
  border-bottom-left-radius: 16px; /* Alinha o arredondamento com a `header` */
  border-bottom-right-radius: 16px;
}

.header-content {
  background: rgba(0, 0, 0, 0.7); /* Fundo preto com transparência */
  padding: 8px 16px; /* Reduz o espaço interno */
  width: 100%; /* Ocupa toda a largura */
  display: flex;
  flex-direction: column;
  gap: 8px; /* Espaçamento entre os elementos */
  border-bottom-left-radius: 16px; /* Arredondamento da caixa */
  border-bottom-right-radius: 16px;
}

.header-info {
  display: flex;
  justify-content: space-between; /* Texto à esquerda e ícone à direita */
  align-items: center;
}

.text-h5 {
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
}

.text-subtitle1 {
  font-size: 1rem;
  color: white;
}

.text-caption {
  font-size: 0.875rem;
  color: white;
}

.q-btn {
  margin: 0;
  padding: 0;
  color: white;
}

.via-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  padding: 16px;
}

.via-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding: 16px;
  border-radius: 8px;
}

.via-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 16px;
}

.via-info {
  flex: 1;
}

.fixed-bottom-right {
  position: fixed;
  bottom: 120px; /* Ajuste para manter o botão acima da navbar */
  right: 16px;
  z-index: 2; /* Garante que o botão esteja acima do conteúdo */
}

</style>
