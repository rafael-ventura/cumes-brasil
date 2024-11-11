<template>
  <q-page>
    <div class="q-pa-md">
      <q-img src="../assets/logo.png" alt="Cumes Brasil" class="q-mb-md text-center logo-tamanho"/>
      <div class="text-h2 text-center q-mb-md">Bem-vindo ao Cumes Brasil</div>
      <div class="text-h5 text-center q-mb-md">Descubra Sua Próxima Aventura</div>

      <div class="card-list">
        <div class="card">
          <q-card class="card" @click="goToFilteredSearch('copacabana')">
            <q-img :src="copacabanaImage" alt="Vias na copacabana">
              <div class="absolute-bottom text-white text-left">
                <div class="text-h4">Vias em Copacabana</div>
                <div class="text-h6">{{ copacabanaVias.length }} vias encontradas</div>
              </div>
            </q-img>
          </q-card>
        </div>
        <div class="">
          <q-card class="card" @click="goToFilteredSearch('terceiroGrau')">
            <q-img :src="terceiroGrauImage" alt="Vias de Terceiro Grau">
              <div class="absolute-bottom text-white text-left">
                <div class="text-h4">Vias de Terceiro Grau</div>
                <div class="text-h6">{{ terceiroGrauVias.length }} vias encontradas</div>
              </div>
            </q-img>
          </q-card>
        </div>
        <div class="">
          <q-card class="card" @click="goToFilteredSearch('exposicaoE2')">
            <q-img :src="exposicaoE2Image" alt="Vias com Exposição até E2">
              <div class="absolute-bottom text-white text-left">
                <div class="text-h4">Vias com Exposição até E2</div>
                <div class="text-h6">{{ exposicaoE2Vias.length }} vias encontradas</div>
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
import { Via } from 'src/models/Via';
import { useRouter } from 'vue-router';

const router = useRouter();
const copacabanaVias = ref<Via[]>([]);
const terceiroGrauVias = ref<Via[]>([]);
const exposicaoE2Vias = ref<Via[]>([]);
const copacabanaImage = ref<string>();
const terceiroGrauImage = ref<string>();
const exposicaoE2Image = ref<string>();

defineOptions({
  name: 'HomePage'
});

onMounted(async () => {
  copacabanaVias.value = await HomeService.getViasEmCopa();
  terceiroGrauVias.value = await HomeService.getViasDeTerceiroGrau();
  exposicaoE2Vias.value = await HomeService.getViasComExposicaoMenorOuIgualE2();

  if (copacabanaVias.value.length > 0 && copacabanaVias.value[0].imagem?.url) {
    console.log(copacabanaVias.value[0].imagem.url);
    copacabanaImage.value = copacabanaVias.value[0].imagem.url;
  }

  if (terceiroGrauVias.value.length > 0 && terceiroGrauVias.value[0].imagem?.url) {
    console.log(terceiroGrauVias.value[0].imagem.url);
    terceiroGrauImage.value = terceiroGrauVias.value[0].imagem.url;
  }

  if (exposicaoE2Vias.value.length > 0 && exposicaoE2Vias.value[0].imagem?.url) {
    console.log(exposicaoE2Vias.value[0].imagem.url);
    exposicaoE2Image.value = exposicaoE2Vias.value[0].imagem.url;
  }
});

function goToFilteredSearch (filterType: string) {
  let query = {};

  if (filterType === 'copacabana') {
    query = { bairro: 'Copacabana' }; // Filtro por bairro
  } else if (filterType === 'terceiroGrau') {
    query = { selectedDifficulty: 'III' }; // Filtro por grau
  } else if (filterType === 'exposicaoE2') {
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

.logo-tamanho{
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

  @media (max-width: 425px){
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
