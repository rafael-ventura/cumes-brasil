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
      <!-- Grau com ícone de informação antes do valor -->
      <div class="detalhe-item" v-if="formattedGrau">
        <div class="detalhe-grau">
          <span>Grau:</span>
          <q-icon name="info" @click.stop="showGrauInfo = true" class="info-icon" />
          <span>{{ formattedGrau }}</span>
        </div>
      </div>

      <!-- Crux -->
      <div class="detalhe-item" v-if="formattedCrux">
        <span>Crux:</span>
        <span>{{ formattedCrux }}</span>
      </div>

      <!-- Artificial -->
      <div class="detalhe-item" v-if="formattedArtificial">
        <span>Artificial:</span>
        <span>{{ formattedArtificial }}</span>
      </div>

      <!-- Exposição -->
      <div class="detalhe-item" v-if="formattedExposicao">
        <span>Exposição:</span>
        <span>{{ formattedExposicao }}</span>
      </div>

      <!-- Duração -->
      <div class="detalhe-item" v-if="formattedDuracao">
        <span>Duração:</span>
        <span>{{ formattedDuracao }}</span>
      </div>

      <!-- Variante - aparece somente se for uma variante de outra via -->
      <div v-if="props.via.via_principal" class="detalhe-item">
        <span>Variante de:</span>
        <q-btn flat @click="navigateToOriginalVia">{{ originalViaName }}</q-btn>
      </div>

      <!-- Fonte -->
      <div class="detalhe-item" v-if="fontesArray.length">
        <span>Fonte:</span>
        <div class="tag-container">
          <div v-for="fonte in fontesArray" :key="fonte" class="tag">{{ fonte }}</div>
        </div>
      </div>

      <!-- Conquistadores -->
      <div class="detalhe-item" v-if="conquistadoresArray.length">
        <span>Conquistadores:</span>
        <div class="tag-container">
          <div v-for="conquistador in conquistadoresArray" :key="conquistador" class="tag">{{ conquistador }}</div>
        </div>
      </div>
    </div>

    <!-- Modal de ajuda para o grau da via -->
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
import { useRouter } from 'vue-router';
import { Via } from 'src/models/Via';

const props = defineProps<{
  via: Via;
}>();

const router = useRouter();
const showGrauInfo = ref(false);

// Formatação dos dados
const formattedGrau = computed(() => props.via.grau ? `${props.via.grau}°` : '');
const formattedCrux = computed(() => props.via.crux || '');
const formattedArtificial = computed(() => props.via.artificial?.startsWith('A') ? props.via.artificial : `A${props.via.artificial}`);
const formattedExposicao = computed(() => props.via.exposicao?.startsWith('E') ? props.via.exposicao : `E${props.via.exposicao}`);
const formattedDuracao = computed(() => props.via.duracao?.startsWith('D') ? props.via.duracao : `D${props.via.duracao}`);

// Separação dos dados de fonte e conquistadores com tratamento de espaços
const fontesArray = computed(() => props.via.fonte ? props.via.fonte.autor.split(';').map(fonte => fonte.trim()) : []);
const conquistadoresArray = computed(() => props.via.conquistadores ? props.via.conquistadores.split(';').map(conquistador => conquistador.trim()) : []);

const originalViaName = computed(() => props.via.via_principal?.nome || '');

const navigateToOriginalVia = () => {
  if (props.via.via_principal) {
    router.push(`/via/${props.via.via_principal.id}`);
  }
};

// Gerencia o estado de expansão para aplicar classes
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
  display: inline-flex;
  align-items: center;

  .info-icon {
    margin-left: 4px;
  }
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
