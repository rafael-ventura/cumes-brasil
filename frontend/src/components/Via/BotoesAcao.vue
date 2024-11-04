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

    <!-- Modal de confirmação de remoção dos favoritos -->
    <q-dialog v-model="confirmRemoveFavorite">
      <q-card>
        <q-card-section class="text-h6">Remover dos Favoritos?</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Remover" color="negative" @click="removeFromFavorites" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de adicionar à coleção -->
    <q-dialog v-model="showCollectionModal">
      <q-card>
        <q-card-section>Adicionar a Coleção</q-card-section>
        <q-card-section>
          <ItemSugestao :items="colecoes" @add-item="addToCollection" item-type="colecao" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, onMounted, ref } from 'vue';
import ColecaoService from 'src/services/ColecaoService';
import { Notify } from 'quasar';
import ModalCriarEscalada from 'components/Escalada/ModalCriarEscalada.vue';
import ItemSugestao from 'components/ItemSugestao.vue';
import { Via } from 'src/models/Via';
import { Colecao } from 'src/models/Colecao';

const props = defineProps<{
  via: Via | null;
  favoriteCollectionId: number | null;
}>();

const emit = defineEmits(['update:isFavorited']);
const isFavorited = ref(false);
const confirmRemoveFavorite = ref(false);
const showEscaladaModal = ref(false);
const showCollectionModal = ref(false);
const colecoes = ref<Colecao[]>([]); // Tipo definido como Colecao[]

onMounted(async () => {
  if (props.favoriteCollectionId && props.via) {
    const favoriteCollection = await ColecaoService.getFirstByUsuarioId();
    if (favoriteCollection && favoriteCollection.vias?.some(v => v.id === props.via?.id)) {
      isFavorited.value = true;
    }
  }
});

// Alterna o status de favorito
const toggleFavoriteStatus = () => {
  isFavorited.value ? confirmRemoveFavorite.value = true : addToFavorites();
};

// Adiciona aos favoritos
const addToFavorites = async () => {
  if (props.favoriteCollectionId && props.via) {
    try {
      await ColecaoService.addViaToColecao(props.favoriteCollectionId, props.via.id);
      isFavorited.value = true;
      emit('update:isFavorited', true);
      Notify.create({
        type: 'positive',
        message: 'Via adicionada a favoritos!',
        position: 'top-right'
      });
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
      Notify.create({
        type: 'negative',
        message: 'Erro ao adicionar aos favoritos'
      });
    }
  }
};

// Remove dos favoritos
const removeFromFavorites = async () => {
  if (props.favoriteCollectionId && props.via) {
    try {
      await ColecaoService.removeViaFromColecao(props.favoriteCollectionId, props.via.id);
      isFavorited.value = false;
      confirmRemoveFavorite.value = false;
      emit('update:isFavorited', false);
      Notify.create({
        type: 'positive',
        message: 'Via removida dos favoritos!',
        position: 'top-right'
      });
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error);
      Notify.create({
        type: 'negative',
        message: 'Erro ao remover dos favoritos'
      });
    }
  }
};

// Abre o modal de criação de escalada
const toggleEscaladaModal = () => {
  showEscaladaModal.value = !showEscaladaModal.value;
};

// Abre o modal de adicionar à coleção
const openCollectionModal = async () => {
  if (props.via) {
    try {
      const result = await ColecaoService.getCollecoesNotContainingVia(props.via.id, 1, 10);
      colecoes.value = result.colecoes;
      showCollectionModal.value = true;
    } catch (error) {
      console.error('Erro ao buscar coleções:', error);
    }
  }
};

// Adiciona à coleção selecionada
const addToCollection = async (colecao: Colecao) => {
  try {
    if (props.via) {
      await ColecaoService.addViaToColecao(colecao.id, props.via.id);
      Notify.create({
        type: 'positive',
        message: 'Via adicionada à coleção com sucesso!',
        position: 'top-right'
      });
    }
  } catch (error) {
    console.error('Erro ao adicionar à coleção:', error);
    Notify.create({
      type: 'negative',
      message: 'Erro ao adicionar à coleção'
    });
  }
};
</script>

<style lang="scss">
.botoes-acao {
  display: flex;
  gap: 10px;
  justify-content: center;
  padding: 10px;
  border-radius: 8px;
}

.btn-acao {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 14px;
}

.registrar {
  background-color: #EF9D9D;
}

.favoritos {
  background-color: #C0E8AB;
}

.colecao {
  background-color: #7E9CE8;
}

.q-icon {
  margin-right: 8px;
  font-size: 18px;
}
</style>
