<template>
  <q-expansion-item
    expand-separator
    icon="info"
    label="Mais Detalhes"
    :header-class="isExpanded ? 'expansion-header-expanded' : 'expansion-header'"
    content-class="expansion-content"
    @expand="isExpanded = true"
    @collapse="isExpanded = false"
  >
    <div class="detalhes-container">

      <!-- Conquistadores -->
      <div class="detalhe-item" v-if="conquistadores.length">
        <span>Conquistadores:</span>
        <div class="badges-container">
          <q-badge
            v-for="(conquistador, index) in conquistadores"
            :key="index"
            class="badge"
            :class="`badge-color-${(index % badgeColors.length) + 1}`"
          >
            {{ conquistador }}
          </q-badge>
        </div>
      </div>

      <!-- Data de Conquista -->
      <div class="detalhe-item" v-if="formattedDataConquista">
        <span>Data de Conquista:</span>
        <q-badge class="badge-data">{{ formattedDataConquista }}</q-badge>
      </div>

      <!-- Coordenadas Geográficas -->
      <div class="detalhe-item" v-if="via.latitude && via.longitude">
        <span>Coordenadas:</span>
        <q-badge class="badge-highlight">
          {{ via.latitude.toFixed(6) }}, {{ via.longitude.toFixed(6) }}
        </q-badge>
      </div>

      <!-- Extensão da Via -->
      <div class="detalhe-item" v-if="via.extensao">
        <span>Extensão da Via:</span>
        <q-badge class="badge-highlight">
          {{ via.extensao }} metros
        </q-badge>
      </div>

      <!-- Descrição -->
      <div class="detalhe-item descricao-container">
        <span>Descrição:</span>
        <span v-if="via.detalhes" class="valor-detalhe descricao">{{ via.detalhes }}</span>
        <span v-else class="descricao-vazia">Sem descrição disponível</span>
      </div>

    </div>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Via } from 'src/models/Via';

const props = defineProps<{
  via: Via;
}>();

const isExpanded = ref(false);

// Conquistadores formatados corretamente
const conquistadores = computed(() =>
  props.via.conquistadores ? props.via.conquistadores.split(';').map(nome => nome.trim()) : []
);

// Formatar data de conquista (dd/MM/yyyy)
const formattedDataConquista = computed(() => {
  if (!props.via.data || props.via.data === 'NULL') return null;

  const data = new Date(props.via.data);
  if (isNaN(data.getTime())) return null; // Verifica se a data é válida

  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
});

// Define as cores disponíveis para os badges (quantidade controlada pelo SCSS)
const badgeColors = ['cumes-01', 'cumes-03', 'primary', 'secondary'];
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.q-expansion-item {
  background-color: $primary;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
}

.expansion-content {
  background-color: $background;
}

.detalhes-container {
  padding: 16px;
  background-color: $background;
  border: 1px solid $cumes-01;
  border-radius: 8px;
  color: $cumes-03;
}

.detalhe-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 8px;
}

.valor-detalhe {
  margin-top: 4px;
  font-weight: bold;
}

.badges-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Centraliza verticalmente */
  gap: 8px; /* Espaçamento entre os badges */
  margin-top: 4px;
}

.badge {
  padding: 6px 12px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
  text-align: center;
}

/* Badge da Data de Conquista */
.badge-data {
  background-color: $cumes-01;
  color: $background;
  font-size: 16px;
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 12px;
  margin-top: 4px;
  display: inline-block;
}

/* Badge para Altura da Montanha e Extensão da Via */
.badge-highlight {
  background-color: $cumes-01;
  color: black;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 16px;
  border-radius: 12px;
  margin-top: 6px;
  display: inline-block;
}

/* Estilo das cores dinâmicas */
.badge-color-1 {
  background-color: $cumes-04;
  color: $background;
}

.badge-color-2 {
  background-color: $cumes-05;
  color: $offwhite;
}

.badge-color-3 {
  background-color: $cumes-03;
  color: black;
}

.badge-color-4 {
  background-color: $cumes-01;
  color: $offwhite;
}

.descricao {
  color: $cumes-01;
}

.descricao-vazia {
  color: gray;
  font-style: italic;
}
</style>
