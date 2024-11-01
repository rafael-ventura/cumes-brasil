<template>
  <div class="card-info-principal">
    <q-img v-if="via && via.imagem && via.imagem.url" :src="via.imagem.url" :alt="via.nome" class="card-imagem" />
    <h2 class="via-nome">{{ via?.nome }}</h2>
    <p class="via-localizacao">{{ via?.montanha?.nome }}, {{ via?.face?.nome }}</p>
    <div class="via-detalhes">
      <span class="grau">{{ via?.grau }}°</span>
      <span class="artificial">{{ via?.artificial }}</span>
      <span class="exposicao">{{ via?.exposicao }}</span>
      <span class="duracao">{{ via?.duracao }}</span>
      <span class="extensao">{{ via?.extensao }} M</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Via } from 'src/models/Via';

const props = defineProps({
  via: {
    type: Object as () => Via,
    required: true
  }
});
</script>

<style scoped lang="scss">
.card-info-principal {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
  background-color: var(--q-primary);
  border-radius: 10px;
  padding: 15px;
}

.card-imagem {
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  margin-bottom: 10px;
}

.via-nome {
  font-size: 24px;
  color: #333;
  margin-bottom: 5px;
}

.via-localizacao {
  font-size: 16px;
  color: #666;
  margin-bottom: 15px;
}

.via-detalhes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.grau, .artificial, .exposicao, .duracao, .extensao {
  font-size: 14px;
  font-weight: bold;
  padding: 5px 8px;
  background-color: #fff;
  border-radius: 5px;
}
</style>
