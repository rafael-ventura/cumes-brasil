<template>
  <q-page class="home-page">
    <div class="q-pa-md">
      <!-- Logo e Cabeçalho -->
      <q-img
        src="../assets/logo-amarelo.webp"
        alt="Cumes Brasil"
        class="q-mb-md text-center logo-tamanho"
        style="object-fit: cover; object-position: center;"
      />
      <div class="text-h2 text-center q-mb-md title-text">Bem-vindo ao Cumes Brasil</div>

      <!-- Mosaico de Cards -->
      <CardMosaic :cards="cards" @navigate="goToFilteredSearch" />

      <!-- Botão de Via Aleatória -->
      <div class="random-section">
        <div class="random-title">Explore uma Via Aleatória</div>
        <q-btn
          icon="shuffle"
          color="primary"
          class="random-btn"
          @click="chooseRandomVia"
        />
      </div>

      <!-- Espaço para o Mapa -->
      <div class="map-section">
        <div class="map-text">Em breve explore vias diretamente no mapa</div>
        <q-icon name="map" size="100px" color="$cumes-04" class="map-icon" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import HomeService from 'src/services/HomeService';
import CardMosaic from 'src/components/Home/CardMosaic.vue';
import { useRouter } from 'vue-router';
import CopacabanaImage from 'src/assets/home/copacabana.webp';
import TerceiroGrauImage from 'src/assets/home/terceiroGrau.webp';
import ExposicaoE2Image from 'src/assets/home/exposicaoE2.webp';
import DuracaoRapidaImage from 'src/assets/home/duracao-rapida.webp';
import UrcaImage from 'src/assets/home/urca.webp';

const router = useRouter();

export interface Card {
  title: string;
  filterType: string;
  count: number;
  image: any;
}

const cards = ref<Card[]>([
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
  },
  {
    title: 'Vias com Duração Rápida',
    filterType: 'duracao=d1',
    count: 0,
    image: DuracaoRapidaImage
  },
  {
    title: 'Vias no Bairro da Urca',
    filterType: 'bairro=urca',
    count: 0,
    image: UrcaImage
  }
]);

onMounted(async () => {
  for (const card of cards.value) {
    card.count = await HomeService.getCount(card.filterType);
  }
});

function goToFilteredSearch(filterType: string) {
  router.push({
    name: 'busca',
    query: { filterType }
  });
}

function chooseRandomVia() {
  const randomCard = cards.value[Math.floor(Math.random() * cards.value.length)];
  alert(`Via aleatória: ${randomCard.title}`);
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.home-page {
  text-align: center;
}

.logo-tamanho {
  width: 310px;
  height: 100px;
  margin: 0 auto;
  display: flex;
}

.title-text {
  color: $cumes-04;
}

.random-section {
  border: 2px solid $cumes-04;
  border-radius: 10px;
  padding: 10px;
  margin: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .random-title {
    color: $cumes-04;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .random-btn {
    border-radius: 100%;
    width: 50px;
    height: 50px;
    color: black;
    background: $cumes-02;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
    }
  }
}

.map-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $cumes-05;
  padding: 0.5rem 1rem;
  border-radius: 8px;

  .map-text {
    color: $cumes-04;
    font-size: 18px;
    font-weight: bold;
    flex: 1;
    text-align: left;
  }

  .map-icon {
    flex: 1;
    text-align: right;
  }
}
</style>
