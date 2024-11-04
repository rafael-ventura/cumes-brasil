<template>
  <q-expansion-item expand-separator icon="info" label="Mais Detalhes">
    <div class="detalhes-container">

      <!-- Grau com ícone de informação que abre o modal -->
      <div class="detalhe-item" v-if="formattedGrau">
        <span>Grau:</span>
        <span>{{ formattedGrau }}</span>
        <q-icon name="info" @click="showGrauInfo = true" class="info-icon" />
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

      <!-- Fonte - exibe o nome da fonte -->
      <div class="detalhe-item" v-if="props.via.fonte?.referencia">
        <span>Fonte:</span>
        <div class="fonte-botoes">
          <q-btn flat>{{ props.via.fonte.referencia }}</q-btn>
        </div>
      </div>

      <!-- Conquistadores - separados em botões individuais -->
      <div class="detalhe-item" v-if="conquistadoresArray.length">
        <span>Conquistadores:</span>
        <div class="conquistadores-botoes">
          <q-btn v-for="conquistador in conquistadoresArray" :key="conquistador" flat>{{ conquistador }}</q-btn>
        </div>
      </div>

    </div>

    <!-- Modal de ajuda para o grau da via -->
    <q-dialog v-model="showGrauInfo">
      <q-card>
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
          <q-btn flat label="Fechar" color="primary" @click="showGrauInfo = false" />
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

// Modal de ajuda sobre o grau
const showGrauInfo = ref(false);

// Formatações com regras específicas para cada campo
const formattedGrau = computed(() => props.via.grau ? `${props.via.grau}°` : '');
const formattedCrux = computed(() => props.via.crux || '');
const formattedArtificial = computed(() => props.via.artificial?.startsWith('A') ? props.via.artificial : `A${props.via.artificial}`);
const formattedExposicao = computed(() => props.via.exposicao?.startsWith('E') ? props.via.exposicao : `E${props.via.exposicao}`);
const formattedDuracao = computed(() => props.via.duracao?.startsWith('D') ? props.via.duracao : `D${props.via.duracao}`);

// Dividir conquistadores em array, caso exista e seja uma string separada por ponto e vírgula
const conquistadoresArray = computed(() => props.via.conquistadores ? props.via.conquistadores.split(';') : []);

// Nome da via original, caso seja uma variante
const originalViaName = computed(() => props.via.via_principal?.nome || '');

// Navega para a via principal caso seja uma variante
const navigateToOriginalVia = () => {
  if (props.via.via_principal) {
    router.push(`/via/${props.via.via_principal.id}`);
  }
};
</script>

<style scoped lang="scss">
.detalhes-container {
  padding: 16px;
}

.detalhe-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.info-icon {
  cursor: pointer;
  margin-left: 4px;
}

.fonte-botoes, .conquistadores-botoes {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.modal-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.modal-content {
  margin-top: 8px;
  font-size: 14px;
}
</style>
