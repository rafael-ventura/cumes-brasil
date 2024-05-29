<template>
  <q-page class="q-pa-none">
    <div class="header-container">
      <BotaoVoltar class="back-button"/>
      <div class="header"
           :style="{ backgroundImage: `url(${colecao?.imagem?.url || 'https://via.placeholder.com/300x150'})` }">
        <div class="header-content">
          <div class="text-h5">{{ colecao?.nome }}</div>
          <div class="text-subtitle1">{{ colecao?.descricao }}</div>
          <div class="text-caption">{{ vias?.length || "0" }} vias</div>
          <q-btn flat icon="sort" class="header-filter-btn" @click="toggleSortMenu"/>
        </div>
      </div>
    </div>
    <ViasOrdena v-if="sortMenu" @sort="handleSort" @close="toggleSortMenu"/>
    <div class="via-list">
      <q-card v-for="via in vias" :key="via.id" class="via-card" clickable @click="goToViaDetalhada(via.id)">
        <q-img :src="via.imagem?.url || 'https://via.placeholder.com/150x150'" class="via-image" alt="via image"/>
        <q-card-section class="q-pt-none">
          <div class="via-info">
            <div class="text-h6">{{ via.nome }}</div>
            <div class="text-subtitle2">Grau: {{ via.grau }}</div>
            <div class="text-subtitle2">Extensão: {{ via.extensao }}m</div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-dialog v-model="isModalOpen" @hide="closeModal" persistent>
      <ModalViaDetalhada :isOpen="isModalOpen" :via="<Via>selectedVia" @update:isOpen="isModalOpen = $event"/>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ColecaoService from "src/services/ColecaoService";
import ViaService from "src/services/ViaService";
import { Colecao } from "src/models/Colecao";
import { Via } from "src/models/Via";
import ModalViaDetalhada from "components/Via/ModalViaDetalhada.vue";
import BotaoVoltar from "components/BotaoVoltar.vue";
import ViasOrdena from "components/Colecao/ViasOrdena.vue";

type SortParams = {
  key: keyof Via;
  order: "asc" | "desc";
};

const route = useRoute();
const router = useRouter();
const colecao = ref<Colecao | null>(null);
const vias = ref<Via[]>([]);
const isModalOpen = ref(false);
const selectedVia = ref<Via | null>(null);
const sortMenu = ref(false);

onMounted(async () => {
  try {
    const colecaoId = route.params.id as string;
    colecao.value = await ColecaoService.getById(colecaoId);
    vias.value = await ColecaoService.getViasInColecao(colecaoId);
  } catch (error) {
    console.error("Erro ao buscar detalhes da coleção:", error);
  }
});

const goToViaDetalhada = (id: number) => {
  router.push(`/vias/${id}`);
};
const closeModal = () => {
  isModalOpen.value = false;
};

const toggleSortMenu = () => {
  sortMenu.value = !sortMenu.value;
};

const handleSort = async ({ key, order }: SortParams) => {
  try {
    vias.value = await ViaService.searchViasWithFilters({ key, order });
  } catch (error) {
    console.error("Erro ao ordenar vias:", error);
  }
  sortMenu.value = false;
};
</script>

<style scoped>
.header-container {
  margin-bottom: 16px;
  position: relative;
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
  padding: 16px;
  border-radius: 8px;
  width: 100%;
}

.header-filter-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  color: white;
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
</style>
