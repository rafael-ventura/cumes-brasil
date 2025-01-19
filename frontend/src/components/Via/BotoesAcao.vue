<template>
  <div class="botoes-acao">
    <q-btn @click="toggleEscaladaModal" class="btn-acao registrar">
      <q-icon name="add_circle" />
      <span>Registrar Escalada</span>
    </q-btn>

    <!-- Botão de favoritos com ícone e texto dinâmicos -->
    <q-btn @click="toggleFavoriteStatus" class="btn-acao favoritos">
      <q-icon :name="isFavorited ? 'star' : 'star_border'" />
      <span>{{ isFavorited ? 'Remover de Favoritos' : 'Adicionar a Favoritos' }}</span>
    </q-btn>

    <q-btn @click="openCollectionModal" class="btn-acao colecao">
      <q-icon name="style" />
      <span>Adicionar a Coleção</span>
    </q-btn>

    <!-- Modal de criação de escalada -->
    <ModalCriarEscalada :isOpen="showEscaladaModal" @closeModal="toggleEscaladaModal" />
    <q-dialog v-model="showCollectionModal">
      <q-card class="collection-card">
        <q-card-section class="collection-header">Adicionar a Coleção</q-card-section>
        <q-card-section class="collection-content">
          <ItemSugestao :items="colecoes" @add-item="addToCollection" item-type="colecao" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ColecaoService from 'src/services/ColecaoService';
import { Notify } from 'quasar';
import ModalCriarEscalada from 'components/Escalada/ModalCriarEscalada.vue';
import ItemSugestao from 'components/ItemSugestao.vue';
import { IColecao } from 'src/models/IColecao';
import { createNotifyConfig } from 'src/utils/utils';

const props = defineProps({
  via: Object,
  favoriteCollectionId: Number
});
const emit = defineEmits(['update:isFavorited']);

const isFavorited = ref(false);
const showEscaladaModal = ref(false);
const showCollectionModal = ref(false);
const colecoes = ref<IColecao[]>([]);

// Verifica se a via está na coleção favorita ao montar o componente
const checkIfFavorited = async () => {
  if (props.favoriteCollectionId && props.via) {
    try {
      const favoriteCollection = await ColecaoService.getById(props.favoriteCollectionId);
      isFavorited.value = favoriteCollection?.viaColecoes?.some((v: any) => v.via.id === props.via?.id) ?? false;
    } catch (error) {
      console.error('Erro ao verificar se a via é favorita:', error);
    }
  }
};

onMounted(checkIfFavorited);

// Alterna o status de favorito
const toggleFavoriteStatus = async () => {
  try {
    isFavorited.value ? await removeFromFavorites() : await addToFavorites();
  } catch (error) {
    console.error('Erro ao alternar status de favorito:', error);
  }
};

// Adiciona aos favoritos
const addToFavorites = async () => {
  if (props.favoriteCollectionId && props.via) {
    try {
      await ColecaoService.addViaToColecao(props.favoriteCollectionId, props.via.id);
      updateFavoriteStatus(true, 'Via adicionada a favoritos!');
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
      Notify.create(createNotifyConfig('negative', 'Erro ao dicionar aos favoritos', 'top-right'));
    }
  }
};

// Remove dos favoritos
const removeFromFavorites = async () => {
  if (props.favoriteCollectionId && props.via) {
    try {
      await ColecaoService.removeViaFromColecao(props.favoriteCollectionId, props.via.id);
      updateFavoriteStatus(false, 'Via removida dos favoritos!');
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error);
      Notify.create(createNotifyConfig('negative', 'Erro ao remover dos favoritos', 'top-right'));
    }
  }
};

const updateFavoriteStatus = (status: boolean, message: string) => {
  isFavorited.value = status;
  emit('update:isFavorited', status);
  if (status) {
    Notify.create(createNotifyConfig('positive', message, 'top-right'));
  } else {
    Notify.create(createNotifyConfig('negative', message, 'top-right'));
  }
};

const toggleEscaladaModal = () => {
  showEscaladaModal.value = !showEscaladaModal.value;
};

const openCollectionModal = async () => {
  if (props.via) {
    try {
      const usuarioId = Number(localStorage.getItem('usuarioId'));
      const result = await ColecaoService.getCollecoesNotContainingVia(
        props.via.id,
        1,
        10
      );
      colecoes.value = result.colecoes;
      showCollectionModal.value = true;
    } catch (error) {
      console.error('Erro ao buscar coleções:', error);
    }
  }
};

const addToCollection = async (colecao: IColecao) => {
  if (props.via) {
    try {
      await ColecaoService.addViaToColecao(colecao.id, props.via.id);
      Notify.create(createNotifyConfig('positive', 'Via adicionada à coleção com sucesso!', 'top-right'));
    } catch (error) {
      console.error('Erro ao adicionar à coleção:', error);
      Notify.create(createNotifyConfig('negative', 'Erro ao adicionar à coleção', 'top-right'));
    }
  }
};

</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.botoes-acao {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 10px;
  border-radius: 8px;
}

.btn-acao {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px; /* Mantém bordas levemente arredondadas */
  width: 100px; /* Define a largura para 100px */
  height: 100px; /* Define a altura para 100px */
  flex-direction: column; /* Alinha o ícone e o texto verticalmente */
  font-size: 14px;
  text-align: center;
}

.registrar {
  background-color: $cumes-02;
}

.favoritos {
  background-color: $cumes-04;
}

.colecao {
  background-color: $cumes-05;
}

.collection-card {
  background-color: $background;
  color: $primary;
  border-radius: 8px;
  width: 100%;
}

.collection-header {
  font-size: 20px;
  font-weight: bold;
  color: $primary;
  background-color: $background;
  padding: 5px;
  border-bottom: 1px solid $primary;
}

.collection-content {
  padding: 16px;
  color: $primary;
}
</style>
