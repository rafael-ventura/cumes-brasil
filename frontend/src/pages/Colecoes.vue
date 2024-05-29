<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">Suas Coleções</div>
    <div class="row items-center q-my-md">
      <div class="col-12 col-md">
        <q-input v-model="searchQuery" label="Buscar suas colecoes" @input="searchVias" debounce="300"/>
      </div>
      <div class="col-auto">
        <q-btn flat icon="filter_list" label="Filtros" @click="openFilterModal"/>
      </div>
    </div>
    <q-dialog v-model="isFilterModalOpen" persistent>
      <FiltrosAvancados @apply-filters="applyFilters"/>
    </q-dialog>
    <q-list bordered separator>
      <q-item v-for="colecao in colecoes" :key="colecao.id" clickable @click="goToColecaoDetalhada(colecao)">
        <q-item-section avatar>
          <q-avatar square size="150px" class="custom-avatar" color="primary" text-color="white">
            <q-img :src="colecao.imagem?.url" cover/>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h4">{{ colecao.nome }}</q-item-label>
          <q-item-label caption class="text-body1">{{ colecao.descricao }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AuthenticateService from "src/services/AuthenticateService";
import ColecaoService from "src/services/ColecaoService";
import { Colecao } from "src/models/Colecao";
import FiltrosAvancados from "components/Busca/BuscaFiltros.vue";

const router = useRouter();
const colecoes = ref<Colecao[]>([]);
const searchQuery = ref("");
const isFilterModalOpen = ref(false);

defineOptions({
  name: "ColecoesPage"
});

onMounted(async () => {
  if (!AuthenticateService.isAuthenticated()) {
    await router.push("/auth/login");
    return;
  }

  try {
    colecoes.value = await ColecaoService.getAll();
  } catch (error) {
    console.error("Erro ao buscar coleções:", error);
  }
});

const searchVias = async () => {
  try {
    colecoes.value = await ColecaoService.search(searchQuery.value);
  } catch (error) {
    console.error("Erro ao buscar coleções:", error);
  }
};

const openFilterModal = () => {
  isFilterModalOpen.value = true;
};

const applyFilters = async (filters: any) => {
  try {
    colecoes.value = await ColecaoService.search(filters);
  } catch (error) {
    console.error("Erro ao aplicar filtros:", error);
  }
};

const goToColecaoDetalhada = (colecao: Colecao) => {
  router.push(`/colecoes/${colecao.id}`);
};
</script>

<style scoped>
.q-page {
  padding: 16px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.col-12 {
  flex: 1 1 100%;
}

.col-md {
  flex: 1 1 auto;
}

.q-list {
  margin-top: 16px;
}

.q-item {
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.q-item-section:first-of-type {
  flex: 0 0 150px;
  max-width: 150px;
}

.q-avatar {
  height: 150px;
  width: 150px;
  border-radius: 12px;
}

.q-item-section:last-of-type {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 24px;
}

.text-h4 {
  font-size: 1.5rem;
}

.text-body1 {
  font-size: 1.2rem;
}

.custom-avatar {
  border-radius: 12px;
}
</style>
