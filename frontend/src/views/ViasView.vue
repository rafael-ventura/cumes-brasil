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
import axios from "axios";
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const headers = [
  { text: 'Nome', value: 'nome' },
  { text: 'Local', value: 'local' },
  { text: 'Grau', value: 'grau' }
];
const vias = ref([]);
const router = useRouter();

const showViaDetails = async (via) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/vias/${via.id}`);
    const detalhesVia = response.data;
    await router.push({name: 'ViaDetalhada', params: {id: via.id, detalhes: detalhesVia}});
  } catch (error) {
    console.error('Erro ao obter detalhes da via:', error);
  }
};

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/vias');
    vias.value = response.data;
  } catch (error) {
    console.error('Erro ao obter lista de vias:', error);
  }
});
</script>
