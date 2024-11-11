<template>
  <q-card class="colecao-card" @click="emitClick" v-if="colecao && colecao.id">
    <q-card-section>
      <div class="colecao-image">
        <q-img :src="colecao.imagem?.url || 'https://via.placeholder.com/300x150'" alt="Imagem da Coleção" />
      </div>
      <div class="colecao-info">
        <div class="text-h6">{{ colecao.nome }}</div>
        <div class="text-subtitle1">{{ colecao.descricao }}</div>

        <!-- Exibe o número de vias apenas se `viasCarregadas` tiver sido preenchido -->
        <q-badge v-if="viasCarregadas !== null" color="primary" :label="'Vias na coleção: ' + viasCarregadas" />
        <q-badge v-else color="grey" label="Carregando vias..." />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, onMounted } from 'vue';
import { IColecao } from 'src/models/IColecao';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps<{ colecao: IColecao }>();
const emits = defineEmits(['click']);
const viasCarregadas = ref<number | null>(null); // Começa como null para mostrar "Carregando"

// Função para verificar e atualizar `viasCarregadas` quando `colecao.vias` estiver disponível
const verificarVias = () => {
  if (props.colecao.viaColecoes) {
    console.log('entrei', props.colecao.viaColecoes.length);
    viasCarregadas.value = props.colecao.viaColecoes.length;
  } else {
    // esperar 3 segundos e veriiicar novamente
    setTimeout(() => {
      console.log('entrei else', props.colecao.viaColecoes?.length);
      verificarVias();
    }, 3000);
  }
};

// Observa mudanças em `colecao.vias`
watch(
  () => props.colecao.viaColecoes?.via,
  (vias) => {
    if (vias) {
      viasCarregadas.value = vias.length;
    } else {
      viasCarregadas.value = null;
    }
  },
  { immediate: true }
);

const emitClick = () => {
  emits('click');
  router.push(`/colecoes/${props.colecao.id}`);
};

// Chamada inicial para verificar as `vias`
onMounted(() => {
  verificarVias();
});
</script>
<style scoped lang="scss">
@import "src/css/app.scss";

.colecao-card {
  width: 100%;
  max-width: 892px;
  height: 132px;
  margin: auto;
  display: flex;
  align-items: center;
  background-color: #fcbd7b;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-4px);
  }
}

.card-content {
  display: flex;
  align-items: center;
  padding: 8px;
}

.colecao-image {
  width: 96px;
  height: 96px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
}

.colecao-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #2c2c2c;
}
</style>
