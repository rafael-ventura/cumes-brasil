<template>
  <div class="botoes-acao">
    <!-- Error Handler -->
    <ErrorHandler
      :error="error"
      position="top-right"
      @close="clearError"
    />

    <!-- Botão de Favorito -->
    <q-btn
      :icon="isFavorited ? 'favorite' : 'favorite_border'"
      :color="isFavorited ? 'red' : 'grey'"
      round
      size="lg"
      @click="toggleFavorite"
      :loading="loading"
    />

    <!-- Botão de Escalada -->
    <q-btn
      icon="flag"
      color="primary"
      round
      size="lg"
      @click="toggleEscaladaModal"
    />

    <!-- Botão de Adicionar à Coleção -->
    <q-btn
      icon="add"
      color="secondary"
      round
      size="lg"
      @click="toggleCollectionModal"
    />

    <!-- Modal de Escalada -->
    <ModalCriarEscalada
      v-model="showEscaladaModal"
      :via="props.via"
      @escalada-criada="onEscaladaCriada"
    />

    <!-- Modal de Coleções -->
    <ItemSelectorModal
      v-model="showCollectionModal"
      title="Adicionar à Coleção"
      :fetch-items="fetchColecoesSemVia"
      :add-item="adicionarViaNaColecao"
      @item-added="onColecaoAdded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { createNotifyConfig } from 'src/utils/utils';
import ErrorHandler from 'src/components/ErrorHandler.vue';
import ModalCriarEscalada from 'src/components/Escalada/ModalCriarEscalada.vue';
import ItemSelectorModal from 'src/components/Colecao/ItemSelectorModal.vue';
import ColecaoService from 'src/services/ColecaoService';
import AuthenticateService from 'src/services/AuthenticateService';
import { Via } from 'src/models/Via';

interface Props {
  via: Via;
  favoriteCollectionId?: number;
  isFavorited?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isFavorited: false
});

const emit = defineEmits(['atualizar:isFavorited']);

const router = useRouter();
const isFavorited = ref(props.isFavorited);
const showEscaladaModal = ref(false);
const showCollectionModal = ref(false);
const loading = ref(false);
const error = ref<Error | null>(null);

// Limpa o erro
const clearError = () => {
  error.value = null;
};

// Alterna o status de favorito
const toggleFavorite = async () => {
  if (!props.favoriteCollectionId) {
    error.value = new Error('Coleção de favoritos não configurada');
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    if (isFavorited.value) {
      await removeFromFavorites();
    } else {
      await addToFavorites();
    }
  } catch (err) {
    error.value = err instanceof Error ? err : new Error('Erro ao atualizar favoritos');
  } finally {
    loading.value = false;
  }
};

// Adiciona a via aos favoritos
const addToFavorites = async () => {
  if (props.favoriteCollectionId && props.via) {
    await ColecaoService.adicionarViaNaColecao(props.favoriteCollectionId, props.via.id);
    updateFavoriteStatus(true, 'Via adicionada a favoritos!');
  }
};

// Remove a via dos favoritos
const removeFromFavorites = async () => {
  if (props.favoriteCollectionId && props.via) {
    await ColecaoService.removerViaDaColecao(props.favoriteCollectionId, props.via.id);
    updateFavoriteStatus(false, 'Via removida dos favoritos!');
  }
};

// Atualiza o status de favorito e exibe uma notificação
const updateFavoriteStatus = (status: boolean, message: string) => {
  isFavorited.value = status;
  emit('atualizar:isFavorited', status);
  Notify.create(createNotifyConfig(status ? 'positive' : 'negative', message, 'top-right'));
};

// Alterna a exibição do modal de escalada
const toggleEscaladaModal = () => {
  AuthenticateService.redirecionaSeNaoAutenticado(router);
  showEscaladaModal.value = !showEscaladaModal.value;
};

// Alterna a exibição do modal de coleções
const toggleCollectionModal = () => {
  AuthenticateService.redirecionaSeNaoAutenticado(router);
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
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Erro ao buscar coleções');
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
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Erro ao adicionar à coleção');
      throw err;
    }
  }
};

// Callback quando uma escalada é criada
const onEscaladaCriada = () => {
  Notify.create(createNotifyConfig('positive', 'Escalada criada com sucesso!', 'top-right'));
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
  background-color: rgba($cumes-05, 0.1);
  margin: 10px 0;
}

// Responsividade
@media (max-width: 768px) {
  .botoes-acao {
    gap: 15px;
    padding: 8px;

    .q-btn {
      size: md;
    }
  }
}
</style>
