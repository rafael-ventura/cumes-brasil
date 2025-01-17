<template>
  <q-card class="colecao-card" @click="emitClick" v-if="colecao && colecao.id">
    <q-card-section class="colecao-content">
      <div class="colecao-image">
        <!-- Exibe o `q-img` se `colecao.imagem?.url` estiver disponível -->
        <q-img
          v-if="colecao.imagem?.url"
          :src="colecao.imagem?.url"
          alt="Imagem da Coleção"
        />
        <!-- Caso contrário, exibe o componente `ImagePlaceholder` -->
        <ImagePlaceholder v-else :fillColor="'$primary'" />
      </div>
      <div class="colecao-info">
        <div class="text-h6">{{ colecao.nome }}</div>
        <div class="text-subtitle1">{{ colecao.descricao }}</div>

        <!-- Exibe o número de vias apenas se `viasCarregadas` tiver sido preenchido -->
        <q-badge
          v-if="viasCarregadas !== null"
          color="primary"
          :label="'Vias na coleção: ' + viasCarregadas"
        />
        <q-badge v-else color="grey" label="Carregando vias..." />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, onMounted, ref, watch } from 'vue';
import { IColecao } from 'src/models/IColecao';
import { useRouter } from 'vue-router';
import ImagePlaceholder from 'components/ImagePlaceholder.vue';

const router = useRouter();
const props = defineProps<{ colecao: IColecao }>();
const emits = defineEmits(['click']);
const viasCarregadas = ref<number | null>(null); // Começa como null para mostrar "Carregando"

const verificarVias = () => {
  if (props.colecao.viaColecoes) {
    viasCarregadas.value = props.colecao.viaColecoes.length;
  } else {
    setTimeout(() => {
      verificarVias();
    }, 3000);
  }
};

watch(
  () => props.colecao.viaColecoes?.via,
  (vias) => {
    viasCarregadas.value = vias ? vias.length : null;
  },
  { immediate: true }
);

const emitClick = () => {
  emits('click');
  router.push(`/colecoes/${props.colecao.id}`);
};

onMounted(() => {
  verificarVias();
});
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.colecao-card {
  width: 100%;
  max-width: 892px;
  margin: auto;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background-color: $primary;

  &:hover {
    transform: translateY(-4px);
  }
}

.colecao-content {
  display: flex;
  align-items: center;
}

.colecao-image {
  width: 96px;
  height: 96px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
  flex-shrink: 0; /* Impede a imagem de redimensionar */
}

.colecao-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #2c2c2c;
  flex-grow: 1; /* Garante que a informação ocupe o restante do espaço */
}

.text-h6 {
  font-weight: bold;
  margin-bottom: 4px;
}

.text-subtitle1 {
  font-size: 0.9em;
  margin-bottom: 8px;
}
</style>
