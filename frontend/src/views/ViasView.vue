<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="4" v-for="(via, index) in vias" :key="index">
          <v-card flat>
            <v-card-actions @click="goViaDetalhadaView(via)">
              <div>
                <v-card-title>{{ via.nome }}</v-card-title>
                <v-card-subtitle>{{ via.montanha_id.nome }}</v-card-subtitle>
                <v-card-text id="extensao">
                  <p>Extensão: {{ via.extensao }} m</p>
                </v-card-text>
                <v-card-text id="grau-crux">
                  <p>Grau: {{ via.grau }}</p>
                  <p>Crux: {{ via.crux }}</p>
                </v-card-text>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import viaService from "@/services/viaService";

const headers = [
  { title: "Nome", key: "nome" },
  { title: "Montanha", key: "montanha_id.nome" },
  { title: "Extensão (m)", key: "extensao" },
  { title: "Grau", key: "grau" },
  { title: "Crux", key: "crux"}
];
const vias = ref([]);
const router = useRouter();

const goViaDetalhadaView = async (via) => {
  try {
    await router.push(`/vias/${via.id}`);
  } catch (error) {
    console.error("Erro ao redirecionar para detalhes da via:", error);
  }
};

onMounted(async () => {
  try {
    const response = await viaService.getAllVias();
    vias.value = response;
  } catch (error) {
    console.error("Erro ao obter lista de vias:", error);
  }
});
</script>
<style scoped>
.v-card {
  border-radius: 15px;
  color: #ffffff;
  background-color: #7d5d3b;
}


</style>
