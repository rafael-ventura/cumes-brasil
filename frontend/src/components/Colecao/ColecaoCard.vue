<template>
  <q-card class="colecao-card" @click="emitClick">
    <q-card-section>
      <div class="colecao-image">
        <q-img :src="colecao.imagem?.url || 'https://via.placeholder.com/300x150'" alt="Imagem da Coleção" />
      </div>
      <div class="colecao-info">
        <div class="text-h6">{{ colecao.nome }}</div>
        <div class="text-subtitle1">{{ colecao.descricao }}</div>

        <!-- Exibe o número de vias se houver -->
        <q-badge v-if="colecao.vias && colecao.vias.length > 0"
                 color="primary"
                 :label="'Vias na coleção: ' + colecao.vias.length" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Colecao } from 'src/models/Colecao';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps<{ colecao: Colecao }>();
const emits = defineEmits(['click']);

const emitClick = () => {
  emits('click');
  router.push(`/colecoes/${props.colecao.id}`);
};
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
