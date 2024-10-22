<template>
  <q-page class="q-pa-none">
    <div v-if="colecao">
      <div class="header-container" @click="expandImage(colecao!.imagem?.url || 'https://via.placeholder.com/300x150')">
        <BotaoVoltar class="back-button" />
        <div class="header"
             :style="{ backgroundImage: `url(${colecao!.imagem?.url || 'https://via.placeholder.com/300x150'})` }">
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
          </div>
        </div>
      </div>

      <!-- Componente de busca para vias dentro da coleção -->
      <SearchEntity
        ref="searchEntityRef"
        entity="via"
        :staticFilters="{ colecaoId: colecao?.id }"
        @select="goToViaDetalhada"
      >
        <template #filters="{ filters }">
          <SearchFilters
            :filters="filters"
            :enabledFilters="['unifiedSearch', 'selectedDifficulty']"
            @applyFilters="applyFilters"
            :staticFilters="{ colecaoId: colecao?.id }"
          />
        </template>
      </SearchEntity>

      <!-- Outros componentes de configuração e modais -->
      <ModalConfigColecoes
        v-model="isConfigDialogOpen"
        :collectionData="colecao"
        @edit="editCollection"
        @delete="confirmDeletion"
      />
      <ImagemModal :isOpen="isImageModalOpen" :imageUrl="expandedImageUrl" @update:isOpen="isImageModalOpen = $event" />
      <!-- Confirmar exclusão -->
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
      <!-- Formulário de edição -->
      <q-dialog v-model="isEditFormOpen" persistent>
        <q-card>
          <q-card-section>
            <q-input v-model="colecaoEdit.nome" label="Nome da Coleção" />
            <q-input v-model="colecaoEdit.descricao" label="Descrição da Coleção" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Editar" color="primary" @click="submitEditCollection" />
            <q-btn flat label="Voltar" @click="isEditFormOpen = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-btn
        fab
        icon="add"
        class="botao-add fixed-bottom-right"
        @click="openAddViaModal"
      />

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
import { Colecao } from 'src/models/Colecao';
import BotaoVoltar from 'components/BotaoVoltar.vue';
import ImagemModal from 'components/Colecao/ImagemModal.vue';
import ModalConfigColecoes from 'components/Colecao/ModalConfigColecoes.vue';
import AddViaModal from 'components/Colecao/AddViaModal.vue';
import SearchFilters from 'components/Busca/SearchFilters.vue';
import SearchEntity from 'components/Busca/SearchEntity.vue';

const route = useRoute();
const router = useRouter();
const searchEntityRef = ref();
const colecao = ref<Colecao | null>(null);
const colecaoEdit = ref({
  nome: '',
  descricao: ''
});
const isImageModalOpen = ref(false);
const isDeleteConfirmOpen = ref(false);
const isEditFormOpen = ref(false);
const isAddViaModalOpen = ref(false);
const expandedImageUrl = ref('');
const isConfigDialogOpen = ref(false);

onMounted(async () => {
  const colecaoId = Number(route.params.id);
  colecao.value = await ColecaoService.getById(colecaoId);
});

const applyFilters = (filters: any) => {
  if (searchEntityRef.value && searchEntityRef.value.handleApplyFilters) {
    searchEntityRef.value.handleApplyFilters(filters);
  } else {
    console.error('SearchEntity ref not found or handleApplyFilters not defined');
  }
};

const goToViaDetalhada = (id: any) => {
  router.push(`/vias/${id}`);
};

const expandImage = (url: string) => {
  expandedImageUrl.value = url;
  isImageModalOpen.value = true;
};
const confirmDeletion = () => {
  isDeleteConfirmOpen.value = true;
};

const deleteCollection = async () => {
  if (colecao.value) {
    try {
      await ColecaoService.delete(colecao.value.id);
      router.push('/colecoes');
    } catch (error) {
      console.error('Erro ao excluir a coleção:', error);
    }
  }
};

const submitEditCollection = () => {
  if (colecao.value) {
    editCollection({
      nome: colecaoEdit.value.nome,
      descricao: colecaoEdit.value.descricao
    });
  }
};

const editCollection = async (data: { nome: string; descricao: string }) => {
  if (colecao.value) {
    try {
      await ColecaoService.update(colecao.value.id, data);
      colecao.value.nome = data.nome;
      colecao.value.descricao = data.descricao;
      isEditFormOpen.value = false;
    } catch (error) {
      console.error('Erro ao editar a coleção:', error);
    }
  }
};

const openAddViaModal = () => {
  isAddViaModalOpen.value = true;
};

const updateIsAddViaModalOpen = (value: boolean) => {
  isAddViaModalOpen.value = value;
};

const viaAdded = () => {
  // Atualize a busca após adicionar uma nova via
  searchEntityRef.value?.handleApplyFilters({ page: 1 });
};
</script>
<style scoped>
.header-container {
  margin-bottom: 16px;
  position: relative;
  cursor: pointer;
}

.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}

.header {
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.header-content {
  background: rgba(0, 0, 0, 0.5);
  padding: 4%;
  border-radius: 4%;
  width: 100%;
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icons-container {
  position: relative;
  z-index: 20; /* Garante que os ícones estejam acima do cabeçalho */
}

.icons-container q-icon {
  cursor: pointer;
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
  bottom: 120px; /* Ajuste a posição para ficar acima da navbar */
  right: 16px;
  z-index: 2; /* Garante que o botão esteja acima do conteúdo */
}
</style>
