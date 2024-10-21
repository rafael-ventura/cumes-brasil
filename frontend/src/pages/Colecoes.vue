<template>
  <q-page class="page-padding">
    <div class="text-h2 q-mb-md">Minhas Coleções</div>
    <div class="row items-center q-my-md">
      <div class="busca-input col-12 col-md">
<!--        <q-input v-model="searchQuery" label="Buscar minhas coleções" @input="searchColecoes" debounce="300" />-->
      </div>
      <div class="busca-button col-auto">
        <q-btn flat icon="filter_list" label="Filtros" @click="isFilterModalOpen = true" text-color="#af8355" />
      </div>
    </div>
    <BuscaAvancada @apply-filters="applyFilters" v-model="isFilterModalOpen" />
    <q-list>
      <q-item v-for="colecao in colecoes" :key="colecao.id" clickable @click="goToColecaoDetalhada(colecao)"
              class="colecao-item">
        <q-item-section avatar>
          <q-avatar square size="150px" class="custom-avatar" color="primary" text-color="white">
            <q-img class="img-colecao" :src="colecao.imagem?.url" cover style="width: 100%; height: 100%;" />
          </q-avatar>
        </q-item-section>
        <q-item-section class="info-section">
          <q-item-label class="text-h5 break-word">{{ colecao.nome }}</q-item-label>
          <q-item-label caption class="text-body1">{{ colecao.descricao }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Botão de adicionar coleção -->
    <q-btn
      fab
      icon="add"
      class="botao-add fixed-bottom-right"
      @click="isAddColecaoModalOpen = true"
    />

    <q-dialog v-model="isAddColecaoModalOpen" class="modal-add-colecao q-pa-md">
      <q-card style="min-width: 300px;" class="modal-add-colecao q-pa-md">
        <q-card-section>
          <div class="text-h6">Adicionar Coleção</div>
        </q-card-section>
        <div>
          <q-card-section>
            <q-input
              class="input-white"
              v-model="novaColecao.nome"
              label="Nome da Coleção"
              color="white"
              label-color="white"
              aria-valuetext="white"
              outlined
              dense
            />

            <q-input
              class="input-white"
              v-model="novaColecao.descricao"
              label="Descrição da Coleção"
              color="white" label-color="white"
              outlined
              dense
              lie
            />
          </q-card-section>
        </div>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="isAddColecaoModalOpen = false" />
          <q-btn flat label="Adicionar" @click="addColecao" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthenticateService from 'src/services/AuthenticateService';
import ColecaoService from 'src/services/ColecaoService';
import { Colecao } from 'src/models/Colecao';
import BuscaAvancada from 'components/Busca/BuscaAvancada.vue';
const searchEntityRef = ref();
const router = useRouter();
const colecoes = ref<Colecao[]>([]);
const searchQuery = ref('');
const isFilterModalOpen = ref(false);
const isAddColecaoModalOpen = ref(false);
const novaColecao = ref({
  nome: '',
  descricao: '',
  usuario_id: Number(localStorage.getItem('userId')) || 0,
  imagem_id: 1
});

const addColecao = async () => {
  try {
    novaColecao.value.usuario_id = Number(localStorage.getItem('userId')) || 0; // Assegure que o usuário está sendo passado
    await ColecaoService.create(novaColecao.value);
    colecoes.value = await ColecaoService.getByUsuarioId();
    isAddColecaoModalOpen.value = false;
    novaColecao.value = {
      nome: '',
      descricao: '',
      usuario_id: Number(localStorage.getItem('userId')) || 0,
      imagem_id: 1
    };
  } catch (error) {
    console.error('Erro ao adicionar coleção:', error);
  }
};

defineOptions({
  name: 'ColecoesPage'
});

onMounted(async () => {
  if (!AuthenticateService.isAuthenticated()) {
    await router.push('/auth/login');
    // return;
  }

  /* try {
    colecoes.value = await ColecaoService.getByUsuarioId();
  } catch (error) {
    console.error('Erro ao buscar coleções:', error);
  } */
});

const applyFilters = (filters: any) => {
  if (searchEntityRef.value && searchEntityRef.value.handleApplyFilters) {
    searchEntityRef.value.handleApplyFilters(filters);
  } else {
    console.error('SearchEntity ref not found or handleApplyFilters not defined');
  }
};

/* const updateSearchResults = (results: any[]) => {
  console.log('Search results updated:', results);
};*/

const goToColecaoDetalhada = (colecao: Colecao) => {
  router.push(`/colecoes/${colecao.id}`);
};

</script>

<style scoped>
.page-padding {
  padding: 16px;
}

.custom-avatar {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-avatar img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.fixed-bottom-right {
  position: fixed;
  bottom: 120px; /* Ajuste a posição para ficar acima da navbar */
  right: 16px;
  z-index: 2; /* Garante que o botão esteja acima do conteúdo */
}

.break-word {
  word-break: break-all;
}

.q-item, .botao-add {
  background-color: #daffd3;;
}

.busca-button, .busca-input {
  color: #fcbd7b;
}

.modal-add-colecao {
  background-color: #2c2c2c;
  color: white;
}

.info-section {
  background-color: #bce9b4;
  border-radius: 2px;
  padding-bottom: 4%;
  padding-left: 1%;
  padding-top: 1px;
}

.colecao-item {
  padding-right: 6%;
}

.text-body1 {
  color: black;
  font-style: oblique;
  padding-top: 2%;
}

.text-h6 {
  color: black;
}

.text-h2 {
  color: #fcbd7b;
}

.img-colecao {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
