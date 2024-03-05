<template>
  <div>
    <v-card flat title="Vias de Escalada">
      <v-data-table
        :headers="headers"
        :items="vias"
        @click:row="showViaDetails"
      ></v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import viaService from "@/services/viaService";

const headers = [
  { title: "Nome", key: "nome" },
  { title: "Artificial", key: "artificial" },
  { title: "Extensão (m)", key: "extensao" },
  { title: "Exposição", key: "exposicao" },
  { title: "Grau", key: "grau" }
];
const vias = ref([]);
const router = useRouter();

const showViaDetails = async (via) => {
  try {
    const response = await viaService.getById(via.id);
    const detalhesVia = response;
    await router.push({
      name: "ViaDetalhada",
      params: { id: via.id, detalhes: detalhesVia }
    });
  } catch (error) {
    console.error("Erro ao obter detalhes da via:", error);
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
