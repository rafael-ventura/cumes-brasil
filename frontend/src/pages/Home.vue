<template>
  <q-page>
    <div class="q-pa-md">
      <q-img src="../assets/logo.png" alt="Cumes Brasil" class="q-mb-md text-center logo-tamanho" />
      <div class="text-h2 text-center q-mb-md">Bem-vindo ao Cumes Brasil</div>
      <div class="text-h5 text-center q-mb-md">Descubra Sua Próxima Aventura</div>

      <div class="card-list">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="card"
        >
          <q-card class="card" @click="goToFilteredSearch(card.filterType)">
            <q-img :src="card.image" :alt="card.title">
              <div class="absolute-bottom text-white text-left">
                <div class="text-h4">{{ card.title }}</div>
                <div class="text-h6">{{ card.count }} vias encontradas</div>
              </div>
            </q-img>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import HomeService from 'src/services/HomeService';
import CopacabanaImage from 'src/assets/home/copacabana.webp';
import TerceiroGrauImage from 'src/assets/home/terceiroGrau.webp';
import ExposicaoE2Image from 'src/assets/home/exposicaoE2.webp';
import { useRouter } from 'vue-router';

const router = useRouter();
defineOptions({
  name: 'HomePage'
});
const cards = ref([
  {
    title: 'Vias em Copacabana',
    filterType: 'bairro=copacabana',
    count: 0,
    image: CopacabanaImage
  },
  {
    title: 'Vias de Terceiro Grau',
    filterType: 'grau=3',
    count: 0,
    image: TerceiroGrauImage
  },
  {
    title: 'Vias com Exposição até E2',
    filterType: 'exposicao=2',
    count: 0,
    image: ExposicaoE2Image
  }
]);

onMounted(async () => {
  for (const card of cards.value) {
    card.count = await HomeService.getCount(card.filterType);
  }
});

function goToFilteredSearch (filterType: string) {
  let query = {};

  if (filterType === 'bairro=copacabana') {
    query = { bairro: 'Copacabana' }; // Filtro por bairro
  } else if (filterType === 'grau=3') {
    query = { selectedDifficulty: '3' }; // Filtro por grau
  } else if (filterType === 'exposicao=2') {
    query = { selectedExposicao: ['e1', 'e2'] }; // Filtro por extensão
  }

  router.push({
    name: 'busca',
    query
  });
}

</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.logo-tamanho {
  width: 310px;
  margin: 0 auto;
  display: flex;
}

.card {
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 20px;
  border-radius: 10px;
}

.card:hover {
  transform: scale(1.05);
}

.absolute-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 24px;
  background: rgba(0, 0, 0, 0.5);
}

.text-h2 {
  color: $tertiary;
}

.text-h5 {
  color: $tertiary;
}

.text-h4 {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;

  @media (max-width: 425px) {
    font-size: 1.8rem;
  }
}

.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  padding: 10px;
  justify-content: center;
  margin: 0 auto;
}
</style>
