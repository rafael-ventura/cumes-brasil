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
  max-width: 100%;
  margin: auto;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: $tertiary-light;
}

.colecao-image {
  height: 150px;
  overflow: hidden;
}

.colecao-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.colecao-info {
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
