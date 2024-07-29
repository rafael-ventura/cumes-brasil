<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 700px">
      <q-img src="../../../assets/logo.png" alt="Cumes Brasil" class="q-mb-md" />
      <div class="text-h3 text-center q-mb-md">Bem-vindo ao Cumes Brasil</div>
      <div class="text-h5 text-center q-mb-md">Descubra Sua Próxima Aventura</div>

      <div class="row q-gutter-md justify-center">
        <div class="col-12 col-md-6 col-lg-4">
          <q-card class="hover-card" @click="goToFilteredSearch('urca')">
            <q-img :src="urcaImage" alt="Vias na Urca">
              <div class="absolute-bottom text-white text-left">
                <div class="text-h6">Vias na Urca</div>
                <div class="text-caption">{{ urcaVias.length }} vias encontradas</div>
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
                <div class="text-caption">{{ exposicaoE2Vias.values.length }} vias encontradas</div>
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
import { adjustImageUrl } from 'src/services/ImagemService';
import { Via } from 'src/models/Via';

const urcaVias = ref<Via[]>([]);
const terceiroGrauVias = ref<Via[]>([]);
const exposicaoE2Vias = ref<Via[]>([]);
const urcaImage = ref<string>(adjustImageUrl('/assets/montanha-default-01.jpg'));
const terceiroGrauImage = ref<string>(adjustImageUrl('/assets/via-default-01.jpg'));
const exposicaoE2Image = ref<string>(adjustImageUrl('/assets/via-default-02.jpg'));

defineOptions({
  name: 'HomePage'
});

onMounted(async () => {
  urcaVias.value = await HomeService.getViasNaUrca();
  terceiroGrauVias.value = await HomeService.getViasDeTerceiroGrau();
  exposicaoE2Vias.value = await HomeService.getViasComExposicaoMenorOuIgualE2();

  if (urcaVias.value.length > 0 && urcaVias.value[0].imagem?.url) {
    urcaImage.value = adjustImageUrl(urcaVias.value[0].imagem.url);
  }

  if (terceiroGrauVias.value.length > 0 && terceiroGrauVias.value[0].imagem?.url) {
    terceiroGrauImage.value = adjustImageUrl(terceiroGrauVias.value[0].imagem.url);
  }

  if (exposicaoE2Vias.value.length > 0 && exposicaoE2Vias.value[0].imagem?.url) {
    exposicaoE2Image.value = adjustImageUrl(exposicaoE2Vias.value[0].imagem.url);
  }
});

function goToFilteredSearch (filter: string) {
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

.absolute-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
}
</style>
