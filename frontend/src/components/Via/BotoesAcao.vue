<template>
  <div class="botoes-acao">
    <!-- Botão para registrar escalada -->
    <q-btn @click="handleEscaladaClick" class="btn-acao registrar">
      <q-icon name="add_circle" />
      <span>Registrar Escalada</span>
    </q-btn>

    <!-- Botão de favoritos com ícone e texto dinâmicos -->
    <q-btn @click="handleFavoritoClick" class="btn-acao favoritos">
      <q-icon :name="isFavorited ? 'star' : 'star_border'" />
      <span>{{ isFavorited ? 'Remover de Favoritos' : 'Adicionar a Favoritos' }}</span>
    </q-btn>

    <!-- Botão para abrir o modal de coleções -->
    <q-btn @click="handleColecaoClick" class="btn-acao colecao">
      <q-icon name="style" />
      <span>Adicionar a Coleção</span>
    </q-btn>

    <!-- Modal reutilizável para adicionar a coleção -->
    <ItemSelectorModal
      :isOpen="showCollectionModal"
      title="Adicionar a Coleção"
      :fetchItems="fetchColecoesSemVia"
      :addItemToTarget="adicionarViaNaColecao"
      itemType="colecao"
      @update:isOpen="showCollectionModal = $event"
      @item-added="onColecaoAdded"
    />

    <!-- Modal para registrar escalada -->
    <ModalCriarEscalada :isOpen="showEscaladaModal" @closeModal="toggleEscaladaModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ColecaoService from 'src/services/ColecaoService';
import { Notify } from 'quasar';
import ModalCriarEscalada from 'components/Escalada/ModalCriarEscalada.vue';
import ItemSelectorModal from 'components/Colecao/ItemSelectorModal.vue';
import { createNotifyConfig } from 'src/utils/utils';
import { useRouter } from 'vue-router';
import AuthenticateService from 'src/services/AuthenticateService';

const props = defineProps({
  via: Object, // A via atualmente sendo manipulada
  favoriteCollectionId: Number // ID da coleção de favoritos
});
const emit = defineEmits([
  'atualizar:isFavorited',
  'acao:escalada',
  'acao:favorito',
  'acao:colecao'
]);

const router = useRouter();
const isFavorited = ref(false); // Controle do status de favorito
const showEscaladaModal = ref(false); // Controle de exibição do modal de escalada
const showCollectionModal = ref(false); // Controle de exibição do modal de coleções

// Atualiza o status de favorito quando recebe a informação do pai
const checkIfFavorited = () => {
  if (props.favoriteCollectionId && props.via) {
    try {
      ColecaoService.buscarColecaoPorId(props.favoriteCollectionId)
        .then(favoriteCollection => {
          isFavorited.value = favoriteCollection?.viaColecoes?.some((v: any) => v.via.id === props.via?.id) ?? false;
        })
        .catch(error => {
          console.error('Erro ao verificar se a via é favorita:', error);
        });
    } catch (error) {
      console.error('Erro ao verificar se a via é favorita:', error);
    }
  }
};

// Funções para emitir eventos para o componente pai
const handleEscaladaClick = () => {
  emit('acao:escalada');
};

const handleFavoritoClick = () => {
  emit('acao:favorito');
  if (props.favoriteCollectionId) {
    toggleFavoriteStatus();
  }
};

const handleColecaoClick = () => {
  emit('acao:colecao');
  toggleCollectionModal();
};

// Alterna o status de favorito
const toggleFavoriteStatus = async () => {
  if (await AuthenticateService.redirecionaSeNaoAutenticado(router)) {
    return;
  }

  try {
    isFavorited.value ? await removeFromFavorites() : await addToFavorites();
  } catch (error) {
    console.error('Erro ao alternar status de favorito:', error);
  }
};

// Adiciona a via aos favoritos
const addToFavorites = async () => {
  if (props.favoriteCollectionId && props.via) {
    try {
      await ColecaoService.adicionarViaNaColecao(props.favoriteCollectionId, props.via.id);
      updateFavoriteStatus(true, 'Via adicionada a favoritos!');
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
      Notify.create(createNotifyConfig('negative', 'Erro ao adicionar aos favoritos', 'top-right'));
    }
  }
};

// Remove a via dos favoritos
const removeFromFavorites = async () => {
  if (props.favoriteCollectionId && props.via) {
    try {
      await ColecaoService.removerViaDaColecao(props.favoriteCollectionId, props.via.id);
      updateFavoriteStatus(false, 'Via removida dos favoritos!');
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error);
      Notify.create(createNotifyConfig('negative', 'Erro ao remover dos favoritos', 'top-right'));
    }
  }
};

// Atualiza o status de favorito e exibe uma notificação
const updateFavoriteStatus = (status: boolean, message: string) => {
  isFavorited.value = status;
  emit('atualizar:isFavorited', status);
  Notify.create(createNotifyConfig(status ? 'positive' : 'negative', message, 'top-right'));
};

// Alterna a exibição do modal de escalada
const toggleEscaladaModal = async () => {
  if (await AuthenticateService.redirecionaSeNaoAutenticado(router)) {
    return;
  }

  showEscaladaModal.value = !showEscaladaModal.value;
};

// Alterna a exibição do modal de coleções
const toggleCollectionModal = async () => {
  if (await AuthenticateService.redirecionaSeNaoAutenticado(router)) {
    return;
  }

  showCollectionModal.value = !showCollectionModal.value;
};

// Busca coleções em que a via não está presente
const fetchColecoesSemVia = async (page: number, limit: number) => {
  if (props.via) {
    try {
      const result = await ColecaoService.listarColecoesSemVia(props.via.id, page, limit);
      return {
        items: result.colecoes,
        total: result.total
      };
    } catch (error) {
      console.error('Erro ao buscar coleções:', error);
      return {
        items: [],
        total: 0
      };
    }
  }
  return {
    items: [],
    total: 0
  };
};

// Adiciona a via à coleção selecionada
const adicionarViaNaColecao = async (colecaoId: number) => {
  if (props.via) {
    try {
      await ColecaoService.adicionarViaNaColecao(colecaoId, props.via.id);
    } catch (error) {
      console.error('Erro ao adicionar à coleção:', error);
      throw error;
    }
  }
};

// Callback quando uma coleção é adicionada
const onColecaoAdded = () => {
  Notify.create(createNotifyConfig('positive', 'Via adicionada à coleção com sucesso!', 'top-right'));
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
  border-radius: 8px;
  width: 100px;
  height: 100px;
  flex-direction: column;
  font-size: 14px;
  text-align: center;
}

.registrar {
  background-color: $action-escaladas;
  color: $offwhite;
}

.favoritos {
  background-color: $action-favoritos;
  color: $background;
}

.colecao {
  background-color: $action-colecoes;
  color: $offwhite;
}

.collection-card {
  background-color: $background;
  color: $cumes-01;
  border-radius: 8px;
  width: 100%;
}

.collection-header {
  font-size: 20px;
  font-weight: bold;
  color: $cumes-01;
  background-color: $background;
  padding: 5px;
  border-bottom: 1px solid $cumes-01;
}

.collection-content {
  padding: 16px;
  color: $cumes-01;
}
</style>
