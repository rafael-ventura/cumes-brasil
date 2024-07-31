<template>
  <q-page class="q-pa-sm">
    <BotaoVoltar />
    <div class="text-h2 q-mb-md title-margin">{{ via?.nome }}</div>
    <div class="text-subtitle1 q-mb-md title-margin">{{ via?.montanha.nome }}, {{ via?.face.nome }}</div>
    <q-separator spaced />

    <!-- Botões de ação -->
    <div class="action-buttons q-col-12">
      <q-btn rounded color="primary" icon="add_circle" @click="toggleForm">
        <div>Registrar uma escalada</div>
      </q-btn>
      <q-btn rounded color="secondary" icon="star_border" @click="addToFavorites">
        <div>Adicionar a Favoritas</div>
      </q-btn>
      <q-btn rounded color="accent" icon="style" @click="openAddToCollectionModal">
        <div>Adicionar a uma Coleção</div>
      </q-btn>
    </div>

    <div class="row q-col-gutter-none">
      <!-- Bloco Imagem da Via -->
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-5 col-xl-4">
        <CardImagem :src="via?.imagem?.url || adjustImageUrl('/assets/default-via.jpg')" />
      </div>

      <!-- Bloco Duração e Extensão -->
      <div class="col-xs-6 col-sm-6 col-md-3 col-lg-2 col-xl-2">
        <q-card class="q-ma-md bg-grey-3 rounded-borders card">
          <q-item>
            <q-card class="q-ma-sm card-parametro">
              <p><strong>Duração:</strong> {{ via?.duracao }}</p>
            </q-card>
            <q-card class="q-ma-sm card-parametro">
              <p><strong>Extensão:</strong> {{ via?.extensao }}</p>
            </q-card>
          </q-item>
        </q-card>
      </div>
      <!-- Bloco Grau, Crux, Artificial e Exposição -->
      <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2">
        <q-card class="q-ma-md bg-grey-3 rounded-borders card">
          <q-item>
            <q-card class="q-ma-sm card-parametro">
              <p><strong>Grau:</strong> {{ via?.grau }}</p>
            </q-card>
            <q-card class="q-ma-sm card-parametro">
              <p><strong>Crux:</strong> {{ via?.crux }}</p>
            </q-card>
            <q-card class="q-ma-sm card-parametro">
              <p><strong>Artificial:</strong> {{ via?.artificial }}</p>
            </q-card>
            <q-card class="q-ma-sm card-parametro">
              <p><strong>Exposição:</strong> {{ via?.exposicao }}</p>
            </q-card>
          </q-item>
        </q-card>
      </div>

      <!-- Bloco Detalhes -->
      <div class="col-xs-12 col-sm-8 col-md-12 col-lg-3 col-xl-4">
        <q-card class="q-ma-md bg-grey-3 rounded-borders card">
          <q-item>
            <q-card class="q-ma-sm card-parametro">
              <p><strong>Detalhes:</strong> {{ via?.detalhes }}</p>
            </q-card>
          </q-item>
        </q-card>
      </div>

      <!-- Bloco Fonte e Conquistadores -->
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-10 col-xl-10">
        <q-card class="q-ma-md bg-grey-3 rounded-borders card">
          <q-item>
            <q-card class="q-ma-sm card-parametro">
              <p><strong>Fonte:</strong> {{ via?.fonte.autor }}</p>
            </q-card>
            <q-card class="q-ma-sm card-parametro">
              <p><strong>Conquistadores:</strong> {{ via?.conquistadores }}</p>
            </q-card>
            <q-card class="q-ma-sm card-parametro">
              <p><strong>Referência da Fonte:</strong> {{ via?.fonte.referencia }}</p>
            </q-card>
          </q-item>
        </q-card>
      </div>

      <!-- Bloco Data -->
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 col-xl-2">
        <q-card class="q-ma-md bg-grey-3 rounded-borders card">
          <q-item>
            <q-card class="q-ma-sm card-parametro">
              <p><strong>Data do cadastro:</strong> {{ via?.data }}</p>
            </q-card>
          </q-item>
        </q-card>
      </div>

      <!-- Bloco Croquis -->
      <div class="col-12">
        <q-card class="q-ma-md bg-grey-3 rounded-borders card">
          <q-card-section>
            <!-- Placeholder para o carrossel de fotos -->
            <p><strong>Croquis:</strong></p>
            <CarrosselCroquis :croquis="via?.croquis" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Modal para registrar uma nova escalada dessa via -->
    <ModalCriarEscalada :isOpen="showForm" @update:isOpen="showForm = $event"/>

    <!-- Modal para adicionar via a coleções -->
    <q-dialog v-model="showAddToCollectionModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Adicionar Via a uma Coleção</div>
        </q-card-section>

        <q-card-section>
          <!-- Conteúdo do modal, como uma lista de coleções -->
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Adicionar" color="primary" @click="addToCollection" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Notify } from 'quasar';
import ViaService from 'src/services/ViaService';
import BotaoVoltar from 'components/BotaoVoltar.vue';
import ModalCriarEscalada from 'components/Escalada/ModalCriarEscalada.vue';
import CardImagem from 'components/Via/CardImagem.vue';
import { Via } from 'src/models/Via';
import CarrosselCroquis from 'components/Croquis/CarrosselCroquis.vue';
import { adjustImageUrl } from 'src/services/ImagemService';
import AuthenticateService from 'src/services/AuthenticateService';

const route = useRoute();
const router = useRouter();
const via = ref<Via>();
const showForm = ref(false);
const showAddToCollectionModal = ref(false);

defineOptions({
  name: 'ViaDetalhadaPage'
});

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    via.value = await ViaService.getViaById(id);
  } catch (error) {
    console.error('Erro ao buscar detalhes da via:', error);
  }
});

const toggleForm = () => {
  showForm.value = !showForm.value;
};

const addToFavorites = async () => {
  try {
    if (!AuthenticateService.isAuthenticated()) {
      router.push('/auth/login');
    } else {
      await ViaService.addToFavorites(Number(route.params.id));
      Notify.create({
        type: 'positive',
        message: 'Via adicionada a favoritos com sucesso!',
        position: 'top-right',
        timeout: 3000
      });
    }
  } catch (error: any) {
    const errorMessage = error || 'Erro desconhecido';
    Notify.create({
      type: 'negative',
      message: '' + errorMessage,
      position: 'top-right',
      timeout: 3000
    });
    console.error('Erro ao adicionar a favoritos:', error);
  }
};

const openAddToCollectionModal = () => {
  showAddToCollectionModal.value = true;
};

const addToCollection = () => {
  // Lógica para adicionar a coleção
  console.log('Adicionar a coleção');
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 15px;
  color: black;
}

.title-margin {
  margin-left: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.row {
  display: flex;
  flex-wrap: wrap; /* Permite que os itens se movam para a próxima linha se necessário */
}

.card {
  display: flex;
  flex-direction: column;
  height: 93%; /* Garante que o card ocupe toda a altura disponível da coluna */
}

.q-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Garante que o conteúdo do card se distribua igualmente */
}

.card-parametro{
  width: 100%;
}
</style>
