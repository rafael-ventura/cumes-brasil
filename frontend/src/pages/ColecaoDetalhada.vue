<template>
  <q-page class="q-pa-md">
    <div class="header-container">
      <BotaoVoltar/>
      <div class="header"
           :style="{ backgroundImage: `url(${colecao?.imagem?.url || 'https://via.placeholder.com/300x150'})` }">
        <q-card class="absolute-bottom opaco">
          <q-card-section class="header-content">
            <div class="text-h5">{{ colecao?.nome }}</div>
            <div class="text-subtitle1">{{ colecao?.descricao }}</div>
            <div class="text-caption">{{ vias?.length || "0" }} vias</div>
          </q-card-section>
          <q-btn flat icon="filter_list" class="header-filter-btn"/>
        </q-card>
      </div>
    </div>
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
import { Colecao } from "src/models/Colecao";
import { Via } from "src/models/Via";
import ModalViaDetalhada from "components/Via/ModalViaDetalhada.vue";
import BotaoVoltar from "components/BotaoVoltar.vue";

const route = useRoute();
const router = useRouter();
const colecao = ref<Colecao | null>(null);
const vias = ref<Via[]>();
const isModalOpen = ref(false);
const selectedVia = ref<Via | null>(null);

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
</script>

<style scoped>
.header-container {
  margin-bottom: 16px;
  position: relative;
}

.opaco {
  opacity: 0.6;
}

.header {
  width: 100%;
  height: 250px;
  background-size: cover;
  background-position: center;
  color: white;
  text-align: left;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  border-radius: 8px;
}

.header-content {
  background: rgba(0, 0, 0, 0.5);
  padding: 16px;
  border-radius: 8px;
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
}

.via-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 90%;
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
