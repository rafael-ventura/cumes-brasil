<template>
  <q-page class="favoritas-page">
    <!-- Título da página -->
    <div class="titulo-pagina">Vias Favoritas</div>

    <!-- Lista de vias favoritas -->
    <div v-if="vias.length" class="via-list">
      <ViaLista :vias="vias" />
    </div>
    <div v-else>
      <p class="text-center">Nenhuma via na coleção de favoritas.</p>
    </div>

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
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ColecaoService from 'src/services/ColecaoService';
import { Colecao } from 'src/models/Colecao';
import ImagemModal from 'components/Colecao/ImagemModal.vue';
import ModalConfigColecoes from 'components/Colecao/ModalConfigColecoes.vue';
import AddViaModal from 'components/Colecao/AddViaModal.vue';
import ViaLista from 'components/Via/ViaLista.vue'; // Lista de vias favoritas

const router = useRouter();
const colecao = ref<Colecao | null>(null);
const vias = ref([]); // Armazena as vias da coleção de favoritas
const colecaoEdit = ref({ nome: '', descricao: '' });
const isImageModalOpen = ref(false);
const isDeleteConfirmOpen = ref(false);
const isEditFormOpen = ref(false);
const isAddViaModalOpen = ref(false);
const expandedImageUrl = ref('');
const isConfigDialogOpen = ref(false);

defineOptions({
  name: 'FavoritasPage'
});

onMounted(async () => {
  const result = await ColecaoService.getFirstByUsuarioId();
  if (result) {
    colecao.value = result;
    vias.value = result.vias || []; // Armazena as vias da coleção de favoritas
  } else {
    console.error('Coleção de "Vias Favoritas" não encontrada. Verifique se ela foi excluída.');
  }
});

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
  onMounted(); // Recarrega a lista de vias ao adicionar uma nova via
};
</script>

<style scoped>
.favoritas-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
}

.titulo-pagina {
  font-size: 40px;
  text-align: center;
  color: var(--q-primary);
}

.via-list {
  width: 100%;
  padding: 16px;
}

.fixed-bottom-right {
  position: fixed;
  bottom: 120px;
  right: 16px;
  z-index: 2;
}
</style>
