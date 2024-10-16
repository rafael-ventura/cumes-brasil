<template>
  <q-page>
    <div class="q-pa-md">
      <q-img src="../assets/logo.png" alt="Cumes Brasil" class="q-mb-md text-center logo-tamanho"/>
      <div class="text-h2 text-center q-mb-md">Bem-vindo ao Cumes Brasil</div>
      <div class="text-h5 text-center q-mb-md">Descubra Sua Próxima Aventura</div>

      <div class="card-list">
        <div class="col-12 col-md-6 col-lg-4">
          <q-card class="hover-card" @click="goToFilteredSearch('leme')">
            <q-img :src="copacabanaImage" alt="Vias na copacabana">
              <div class="absolute-bottom text-white text-left">
                <div class="text-h6">Vias em Copacabana</div>
                <div class="text-caption">{{ copacabanaVias.length }} vias encontradas</div>
              </div>
            </q-img>
          </q-card>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <q-card class="hover-card" @click="goToFilteredSearch('terceiro-grau')">
            <q-img :src="terceiroGrauImage" alt="Vias de Terceiro Grau">
              <div class="absolute-bottom text-white text-left">
                <div class="text-h6">Vias de Terceiro Grau</div>
                <div class="text-caption">{{ terceiroGrauVias.length }} vias encontradas</div>
              </div>
            </q-img>
          </q-card>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <q-card class="hover-card" @click="goToFilteredSearch('exposicao-e2')">
            <q-img :src="exposicaoE2Image" alt="Vias com Exposição até E2">
              <div class="absolute-bottom text-white text-left">
                <div class="text-h6">Vias com Exposição até E2</div>
                <div class="text-caption">{{ exposicaoE2Vias.length }} vias encontradas</div>
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
  console.log('copacabanaVias', copacabanaVias.value);
  terceiroGrauVias.value = await HomeService.getViasDeTerceiroGrau();
  console.log('terceiroGrauVias', terceiroGrauVias.value);
  exposicaoE2Vias.value = await HomeService.getViasComExposicaoMenorOuIgualE2();
  console.log('exposicaoE2Vias', exposicaoE2Vias.value);

  if (copacabanaVias.value.length > 0 && copacabanaVias.value[0].imagem?.url) {
    copacabanaImage.value = copacabanaVias.value[0].imagem.url;
  }

  if (terceiroGrauVias.value.length > 0 && terceiroGrauVias.value[0].imagem?.url) {
    terceiroGrauImage.value = terceiroGrauVias.value[0].imagem.url;
  }

  if (exposicaoE2Vias.value.length > 0 && exposicaoE2Vias.value[0].imagem?.url) {
    exposicaoE2Image.value = exposicaoE2Vias.value[0].imagem.url;
  }
});

function goToFilteredSearch (filter: string) {
  // TODO: Filter search do @Vitor
  console.log(`Navigate to: ${filter}`);
}
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.logo-tamanho{
  width: 310px;
  margin: 0 auto;
  display: flex;
}

.hover-card {
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 20px;
}

.hover-card:hover {
  transform: scale(1.05);
}

.absolute-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
}

.text-h2 {
  color: $tertiary;
}

.text-h5 {
  color: $tertiary;
}

.text-h6 {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%; /* Ajuste conforme necessário */
}

.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
}
</style>
