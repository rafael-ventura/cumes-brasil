<template>
  <div>
    <v-card flat title="Vias de Escalada">
      <v-data-table
        :headers="headers"
        :items="vias"
        @click:row="goViaDetalhadaView"
      ></v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import viaService from "@/services/viaService";

const headers = [
  { title: "Id", key: "id" },
  { title: "Nome", key: "nome" },
  { title: "Artificial", key: "artificial" },
  { title: "Extensão (m)", key: "extensao" },
  { title: "Exposição", key: "exposicao" },
  { title: "Grau", key: "grau" }
];
const vias = ref([]);
const router = useRouter();

const goViaDetalhadaView = async (event, rowData) => {
  try {
    await router.push(`/vias/${rowData.item.id}`);
  } catch (error) {
    console.error("Erro ao redirecionar para detalhes da via:", error);
  }
};

onMounted(async () => {
  try {
    const response = await viaService.getAll();
    vias.value = response;
  } catch (error) {
    console.error("Erro ao obter lista de vias:", error);
  }
});
</script>
