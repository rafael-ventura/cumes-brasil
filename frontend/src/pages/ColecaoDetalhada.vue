<template>
  <q-page class="q-pa-none">
    <div v-if="colecao">
      <div class="header-container" @click="expandImage(colecao!.imagem?.url || 'https://via.placeholder.com/300x150')">
        <BotaoVoltar class="back-button" />
        <div class="header"
             :style="{ backgroundImage: `url(${colecao!.imagem?.url || 'https://via.placeholder.com/300x150'})` }">
          <div class="header-content">
            <div class="header-info">
              <div>
                <div class="text-h5">{{ colecao!.nome }}</div>
                <div class="text-subtitle1">{{ colecao!.descricao }}</div>
                <div class="text-caption">{{ vias.length || '0' }} vias</div>
              </div>
              <div class="icons-container">
                <q-icon name="settings" size="2rem" @click.stop="isConfigDialogOpen = true" />
                <br>
                <q-icon name="sort" size="2rem" @click.stop="toggleSortMenu" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalConfigColecoes
        v-model="isConfigDialogOpen"
        :collectionData="colecao"
        @edit="editCollection"
        @delete="confirmDeletion"
      />

      <ViasOrdena v-model="sortMenu" @sort="handleSort" @reset="resetSort" @close="toggleSortMenu" />

      <div class="via-list">
        <q-card v-for="via in vias" :key="via.id" class="via-card" clickable @click="goToViaDetalhada(via.id)">
          <q-img :src="via.imagem?.url || 'https://via.placeholder.com/150x150'" class="via-image" alt="via image" />
          <q-card-section class="q-pt-none">
            <div class="via-info">
              <div class="text-h6">{{ via.nome }}</div>
              <div class="text-subtitle2"> Grau: {{ via.grau || 'N/A' }}</div>
              <div class="text-subtitle2"> Extensão: {{ via.extensao }}m</div>
              <div class="text-subtitle2"> Duração: {{ via.duracao }}</div>
              <div class="text-subtitle2"> Montanha: {{ via.montanha.nome }}</div>
              <div class="text-subtitle2"> Face: {{ via.face.nome }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <ImagemModal :isOpen="isImageModalOpen" :imageUrl="expandedImageUrl" @update:isOpen="isImageModalOpen = $event" />

      <q-dialog v-model="isModalOpen" @hide="closeModal">
        <ModalViaDetalhada :isOpen="isModalOpen" :via="<Via>selectedVia" @update:isOpen="isModalOpen = $event" />
      </q-dialog>

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
        color="blue"
        class="fixed-bottom-right"
        @click="openAddViaModal"
      />

      <AddViaModal
        :isOpen="isAddViaModalOpen"
        :colecaoId="colecao!.id"
        @update:isOpen="updateIsAddViaModalOpen"
        @via-added="viaAdded"
      />

    </div>
    <div v-else>
      <q-spinner size="2em" />
      <div>Carregando coleção...</div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ColecaoService from 'src/services/ColecaoService';
import { Colecao } from 'src/models/Colecao';
import { Via } from 'src/models/Via';
import ModalViaDetalhada from 'components/Via/ModalViaDetalhada.vue';
import BotaoVoltar from 'components/BotaoVoltar.vue';
import ViasOrdena from 'components/Colecao/ViasOrdenacao.vue';
import ImagemModal from 'components/Colecao/ImagemModal.vue';
import ModalConfigColecoes from 'components/Colecao/ModalConfigColecoes.vue';
import AddViaModal from 'components/Colecao/AddViaModal.vue';

type SortParams = {
  key: keyof Via;
  order: 'asc' | 'desc';
};

const route = useRoute();
const router = useRouter();
const colecao = ref<Colecao | null>(null);
const colecaoEdit = ref({
  nome: '',
  descricao: ''
});
const vias = ref<Via[]>([]);
const isModalOpen = ref(false);
const isImageModalOpen = ref(false);
const isDeleteConfirmOpen = ref(false);
const isEditFormOpen = ref(false);
const isAddViaModalOpen = ref(false);
const selectedVia = ref<Via | null>(null);
const expandedImageUrl = ref('');
const sortMenu = ref(false);
const isConfigDialogOpen = ref(false);

onMounted(async () => {
  try {
    const colecaoId = Number(route.params.id);
    if (isNaN(colecaoId)) {
      console.error('ID inválido');
      router.push('/colecoes');
      return;
    }
    colecao.value = await ColecaoService.getById(colecaoId);
    vias.value = await ColecaoService.getViasIn(colecaoId);
  } catch (error) {
    console.error('Erro ao buscar detalhes da coleção:', error);
  }
});

const goToViaDetalhada = (id: number) => {
  router.push(`/vias/${id}`);
};

const closeModal = () => {
  isModalOpen.value = false;
};

const expandImage = (url: string) => {
  expandedImageUrl.value = url;
  isImageModalOpen.value = true;
};

const toggleSortMenu = () => {
  sortMenu.value = !sortMenu.value;
};

const handleSort = async ({ key, order }: SortParams) => {
  try {
    vias.value = await ColecaoService.sortVias(vias.value, { key, order });
  } catch (error) {
    console.error('Erro ao ordenar vias:', error);
  }
};

const resetSort = async () => {
  try {
    const colecaoId = Number(route.params.id);
    if (!isNaN(colecaoId)) {
      vias.value = await ColecaoService.getViasIn(colecaoId);
    }
  } catch (error) {
    console.error('Erro ao redefinir a ordenação:', error);
  }
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

const viaAdded = (via: Via) => {
  vias.value.push(via);
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
