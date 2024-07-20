<template>
  <div class="via-list-container">
    <div class="header" :style="{ backgroundImage: `url(${colecao.imagem?.url})` }">
      <div class="header-content">
        <div class="header-title">{{ colecao.nome }}</div>
        <q-btn flat icon="filter_list" label="Filtros" @click="openFilterModal"/>
      </div>
    </div>
    <div class="collection-details">
      <div class="text-caption">{{ colecao.descricao }}</div>
      <div class="text-caption">{{ vias.length }} vias</div>
    </div>
    <div class="via-list">
      <ColecaoCard v-for="via in vias" :key="via.id" :via="via" @click="showDetails(via)"/>
    </div>
    <q-dialog v-model="isModalOpen" @hide="closeModal" persistent>
      <ModalViaDetalhada :isOpen="isModalOpen" :via="<Via>selectedVia" @update:isOpen="isModalOpen = $event"/>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ColecaoService from "src/services/ColecaoService";
import ColecaoCard from "components/Colecao/ColecaoCard.vue";
import ModalViaDetalhada from "components/Via/ModalViaDetalhada.vue";
import { Colecao } from "src/models/Colecao";
import { Via } from "src/models/Via";

const route = useRoute();
const colecao = ref<Colecao>(await ColecaoService.getById(route.params.id));
const vias = ref<Via[]>([]);
const isModalOpen = ref(false);
const selectedVia = ref<Via | null>(null);

onMounted(async () => {
  try {
    const colecaoId = route.params.id;
    colecao.value = await ColecaoService.getById(colecaoId);
    vias.value = await ColecaoService.getViasIn(colecaoId);
  } catch (error) {
    console.error(error);
  }
});

const openFilterModal = () => {
  // Logic to open the filter modal
};

const showDetails = (via: Via) => {
  selectedVia.value = via;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<style scoped>
.via-list-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
}

.header {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  color: white;
  text-align: left;
  padding: 16px;
  display: flex;
  align-items: flex-end;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px;
  border-radius: 8px;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
}

.collection-details {
  width: 100%;
  text-align: left;
  padding: 16px;
}

.via-list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
}
</style>
