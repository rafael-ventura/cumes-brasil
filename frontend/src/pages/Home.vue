<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 700px">
      <q-img src="../../../assets/logo.png" alt="Cumes Brasil" class="q-mb-md" />
      <div class="text-h3 text-center q-mb-md">Bem-vindo ao Cumes Brasil</div>

      <div class="row q-gutter-md">
        <div class="col-12 col-md-6">
          <q-card class="hover-card" @click="goToFilteredSearch('urca')">
            <q-img :src="urcaImage" alt="Vias na Urca" />
            <q-card-section>
              <div class="text-h6">Vias na Urca</div>
              <div class="text-caption">{{ urcaVias.length }} vias encontradas</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <q-card class="hover-card" @click="goToFilteredSearch('terceiro-grau')">
            <q-img :src="terceiroGrauImage" alt="Vias de Terceiro Grau" />
            <q-card-section>
              <div class="text-h6">Vias de Terceiro Grau</div>
              <div class="text-caption">{{ terceiroGrauVias.length }} vias encontradas</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <q-card class="hover-card" @click="goToFilteredSearch('exposicao-e2')">
            <q-img :src="exposicaoE2Image" alt="Vias com Exposição até E2" />
            <q-card-section>
              <div class="text-h6">Vias com Exposição até E2</div>
              <div class="text-caption">{{ exposicaoE2Vias.length }} vias encontradas</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import HomeService from 'src/services/HomeService';

const urcaVias = ref([]);
const terceiroGrauVias = ref([]);
const exposicaoE2Vias = ref([]);
const urcaImage = 'path/to/urca.jpg'; // Substitua pelo caminho da imagem correta
const terceiroGrauImage = 'path/to/grau3.jpg'; // Substitua pelo caminho da imagem correta
const exposicaoE2Image = 'path/to/exposicao.jpg'; // Substitua pelo caminho da imagem correta

defineOptions({
  name: 'HomePage'
});

onMounted(async () => {
  urcaVias.value = await HomeService.getViasNaUrca();
  terceiroGrauVias.value = await HomeService.getViasDeTerceiroGrau();
  exposicaoE2Vias.value = await HomeService.getViasComExposicaoMenorOuIgualE2();
});

function goToFilteredSearch (filter) {
  // Implementar navegação ou outra lógica aqui se necessário
  console.log(`Navigate to: ${filter}`);
}
</script>

<style scoped>
.hover-card {
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 20px;
}

.hover-card:hover {
  transform: scale(1.05);
}
</style>
