<template>
  <q-expansion-item
    expand-separator
    icon="description"
    label="Mais Detalhes"
    :header-class="isExpanded ? 'expansion-header-expanded' : 'expansion-header'"
    content-class="expansion-content"
    @expand="isExpanded = true"
    @collapse="isExpanded = false"
  >
    <div class="detalhes-container">
      <div class="detalhe-item" v-if="formattedGrau">
        <div class="detalhe-grau">
          <span>Grau:</span>
          <q-icon name="info" @click.stop="showGrauInfo = true" class="info-icon" />
        </div>
        <span class="valor-detalhe">{{ formattedGrau }}</span>
      </div>

      <!-- Crux -->
      <div class="detalhe-item" v-if="formattedCrux">
        <span>Crux:</span>
        <span class="valor-detalhe">{{ formattedCrux }}</span>
      </div>

      <!-- Artificial -->
      <div class="detalhe-item" v-if="formattedArtificial">
        <span>Artificial:</span>
        <span class="valor-detalhe">{{ formattedArtificial }}</span>
      </div>

      <!-- Exposição -->
      <div class="detalhe-item" v-if="formattedExposicao">
        <span>Exposição:</span>
        <span class="valor-detalhe">{{ formattedExposicao }}</span>
      </div>

      <!-- Duração -->
      <div class="detalhe-item" v-if="formattedDuracao">
        <span>Duração:</span>
        <span class="valor-detalhe">{{ formattedDuracao }}</span>
      </div>

      <!-- Outros itens permanecem os mesmos -->
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
            Consulte o site da FEMERJ para detalhes completos.
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

// Formatação dos dados com ajuste para não adicionar sufixo se o valor for "NA"
const formattedGrau = computed(() => props.via.grau && props.via.grau !== 'NA' ? `${props.via.grau}` : 'NA');
const formattedCrux = computed(() => props.via.crux || 'NA');
const formattedArtificial = computed(() => props.via.artificial && props.via.artificial !== 'N/A' ? `A${props.via.artificial}` : 'N/A');
const formattedExposicao = computed(() => props.via.exposicao && props.via.exposicao !== 'N/A' ? `E${props.via.exposicao}` : 'N/A');
const formattedDuracao = computed(() => props.via.duracao && props.via.duracao !== 'N/A' ? `D${props.via.duracao}` : 'N/A');

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
  border: 1px solid $primary;
  border-radius: 8px;
  color: $primary;
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

.info-icon {
  cursor: pointer;
  color: $primary;
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
