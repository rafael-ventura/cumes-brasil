<template>
  <div class="card-info-principal">
    <q-img v-if="via && via.imagem && via.imagem.url" :src="via.imagem.url" :alt="via.nome" class="card-imagem" />
    <h2 class="via-nome">{{ via?.nome }}</h2>
    <p class="via-detalhes">{{ via?.grau }}, {{ via?.artificial }}, {{ via?.exposicao }}, {{ via?.duracao }} - {{ via?.extensao }} Metros</p>
    <p class="via-localizacao">{{ via?.montanha?.nome }}, {{ via?.face?.nome }}</p>
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

.via-detalhes {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 10px 0;
}

.via-localizacao {
  font-size: 14px;
  color: #666;
}
</style>
