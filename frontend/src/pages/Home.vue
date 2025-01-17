<template>
  <q-page>
    <div class="q-pa-md">
      <q-img
        src="../assets/logo-amarelo.webp"
        alt="Cumes Brasil"
        class="q-mb-md text-center logo-tamanho"
        style="object-fit: cover; object-position: center;"
      />
      <div class="text-h2 text-center q-mb-md color-text">Bem-vindo ao Cumes Brasil</div>
      <div class="text-h5 text-center q-mb-md color-text">Descubra Sua Próxima Aventura</div>

      <div class="card-list">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="card"
        >
          <q-card class="card" @click="goToFilteredSearch(card.filterType)">
            <q-img :src="card.image" :alt="card.title" class="card-image">
              <div class="absolute-bottom text-left">
                <div class="text-h4 text-black">{{ card.title }}</div>
                <div class="text-h6 text-black"><span class="span-count-vias text-weight-bolder"> {{ card.count }} </span> vias encontradas
                </div>
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
    filterType: 'exposicao=E2',
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
  } else if (filterType === 'exposicao=E2') {
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
  height: 100px; /* Defina a altura desejada para cortar */
  margin: 0 auto;
  display: flex;
  object-fit: cover; /* Garante que a largura seja mantida */
  object-position: center; /* Centraliza o corte vertical */
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

.card-image {
  height: 200px; /* Altura ajustada para as imagens dos cards */
  object-fit: cover; /* Corta as imagens para manter a largura */
  object-position: center; /* Centraliza o corte */
}

.absolute-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background-color: rgba($cumes-01, 0.9);
}

.text-h2 {
  color: $cumes-03;
}

.text-h5 {
  color: $cumes-03;
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

.color-text {
  color: $cumes-03;
}

.color-div {
  color: black;
  font-weight: bolder;
}

.titulo-card {
  color: black;
}

.span-count-vias {
  opacity: 0.9;
}
</style>
