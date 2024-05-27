<template>
  <q-page class="q-pa-md">
    <BotaoVoltar />
    <div class="collection-header q-mb-md q-px-md q-pt-md q-pb-none">
      <q-avatar size="100px" color="primary" text-color="white" class="q-mb-md">
        {{ colecao?.nome.charAt(0) }}
      </q-avatar>
      <div class="collection-info">
        <div class="text-h6">{{ colecao?.nome }}</div>
        <div class="text-subtitle1 q-mb-md">{{ colecao?.descricao }}</div>
        <q-btn flat label="Editar Coleção" @click="editCollection" class="q-mr-sm" />
        <q-btn flat label="Adicionar Via" @click="addVia" />
      </div>
    </div>
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Vias</div>
      </q-card-section>
      <ViaLista :vias="vias" />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Via } from "src/models/Via";
import { Colecao } from "src/models/Colecao";
import ColecaoService from "src/services/ColecaoService";
import BotaoVoltar from "components/BotaoVoltar.vue";
import ViaLista from "components/Via/ViaLista.vue";

const route = useRoute();
const router = useRouter();
const vias = ref<Via[]>([]);
const colecao = ref<Colecao | null>(null);

defineOptions({
  name: "ColecaoDetalhadaPage"
});

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    const colecaoData = await ColecaoService.getColecaoById(id);
    colecao.value = colecaoData;
    vias.value = colecaoData.vias;
  } catch (error) {
    console.error("Erro ao buscar detalhes da coleção:", error);
  }
});

const editCollection = () => {
  // lógica para editar a coleção
};

const addVia = () => {
  // lógica para adicionar via
};
</script>

<style scoped>
.collection-header {
  display: flex;
  align-items: center;
  text-align: center;
}

.collection-info {
  margin-left: 16px;
  flex: 1;
}

.collection-info .q-btn {
  display: block;
  margin-top: 8px;
}

.q-mb-md {
  margin-bottom: 16px;
}

.q-pa-md {
  padding: 16px;
}
</style>
