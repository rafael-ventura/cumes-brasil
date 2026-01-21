<template>
  <q-expansion-item
    expand-separator
    icon="description"
    label="Graduação"
    :header-class="isExpanded ? 'expansion-header-expanded' : 'expansion-header'"
    content-class="expansion-content"
    @expand="isExpanded = true"
    @collapse="isExpanded = false"
  >
    <div class="detalhes-container">
      <!-- Grau - sempre exibe, mesmo se for "-" -->
      <div class="detalhe-item">
        <div class="detalhe-grau">
          <span>Grau:</span>
          <q-icon name="info" @click.stop="showGrauInfo = true" class="info-icon" />
        </div>
        <span class="valor-detalhe" :class="{ 'valor-vazio': formattedGrau === '-' }">{{ formattedGrau }}</span>
      </div>

      <!-- Crux - sempre exibe -->
      <div class="detalhe-item">
        <span>Crux:</span>
        <span class="valor-detalhe" :class="{ 'valor-vazio': formattedCrux === '-' }">{{ formattedCrux }}</span>
      </div>

      <!-- Artificial - sempre exibe -->
      <div class="detalhe-item">
        <span>Artificial:</span>
        <span class="valor-detalhe" :class="{ 'valor-vazio': formattedArtificial === '-' }">{{ formattedArtificial }}</span>
      </div>

      <!-- Exposição - sempre exibe -->
      <div class="detalhe-item">
        <span>Exposição:</span>
        <span class="valor-detalhe" :class="{ 'valor-vazio': formattedExposicao === '-' }">{{ formattedExposicao }}</span>
      </div>

      <!-- Duração - sempre exibe -->
      <div class="detalhe-item">
        <span>Duração:</span>
        <span class="valor-detalhe" :class="{ 'valor-vazio': formattedDuracao === '-' }">{{ formattedDuracao }}</span>
      </div>
    </div>

    <q-dialog v-model="showGrauInfo">
      <q-card class="modal-card">
        <q-card-section>
          <div class="modal-title">
            <q-icon name="info" />
            Como Ler o Grau de uma Via?
          </div>
          <p class="modal-content">
            A graduação de uma via é composta por Grau, Crux, Artificial, Exposição e Duração.
            Cada um desses fatores expressa uma parte da dificuldade e exposição da escalada.
            Consulte o guia da FEMERJ para detalhes completos.
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn class="q-button" flat label="Fechar" @click="showGrauInfo = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Via } from 'src/models/Via';

const props = defineProps<{
  via: Via;
}>();

const showGrauInfo = ref(false);

// Formatação dos dados - retorna "-" quando não há informação
const formattedGrau = computed(() => {
  if (!props.via.grau || props.via.grau === 'NA' || props.via.grau === 'N/A') return '-';
  return props.via.grau;
});

const formattedCrux = computed(() => {
  if (!props.via.crux || props.via.crux === 'NA' || props.via.crux === 'N/A') return '-';
  return props.via.crux;
});

const formattedArtificial = computed(() => {
  if (!props.via.artificial || props.via.artificial === 'N/A' || props.via.artificial === 'NA') return '-';
  return `A${props.via.artificial}`;
});

const formattedExposicao = computed(() => {
  if (!props.via.exposicao || props.via.exposicao === 'N/A' || props.via.exposicao === 'NA') return '-';
  return `E${props.via.exposicao}`;
});

const formattedDuracao = computed(() => {
  if (!props.via.duracao || props.via.duracao === 'N/A' || props.via.duracao === 'NA') return '-';
  return `D${props.via.duracao}`;
});

// Outros dados permanecem os mesmos
computed(() => props.via.fonte ? props.via.fonte.autor.split(';').map(fonte => fonte.trim()) : []);
computed(() => props.via.conquistadores ? props.via.conquistadores.split(';').map(conquistador => conquistador.trim()) : []);
computed(() => props.via.via_principal?.nome || '');
const isExpanded = ref(false);
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
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.detalhe-grau {
  display: flex;
  align-items: baseline;

  .info-icon {
    margin-left: 4px;
    font-size: 16px;
    position: relative;
    top: -2px; /* Alinha o ícone um pouco acima */
  }
}

.valor-detalhe {
  margin-left: auto;
}

.valor-vazio {
  color: rgba($cumes-03, 0.5);
  font-style: italic;
}

.info-icon {
  cursor: pointer;
  color: $cumes-01;
}

.tag-container {
  font-size: 10px;
}

.tag {
  padding: 4px 6px;
  border-radius: 10px;
  border: 1px solid $primary;
  color: $primary;
  margin-bottom: 3%;
}

.modal-card {
  background-color: $primary;
}

.modal-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: $background;
}

.modal-content {
  margin-top: 8px;
  font-size: 14px;
  color: $background;
}

.q-button {
  color: $background;
  font-weight: bolder;
  font-size: 14px;
  padding: 4px 16px;
  border-radius: 10px;
  border: 1px solid $background;
}
</style>
