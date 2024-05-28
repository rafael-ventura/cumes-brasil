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
          <q-avatar size="56px" color="primary" text-color="white">
            <q-img :src="colecao.imagem?.url" cover/>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">{{ colecao.nome }}</q-item-label>
          <q-item-label caption>{{ colecao.descricao }}</q-item-label>
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
import FiltrosAvancados from "components/Busca/FiltrosAvancados.vue";

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
