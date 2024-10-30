<template>
  <div class="escalada-card q-mb-md">
    <!-- Título da Escalada -->
    <q-item-label class="titulo-escalada">{{ via?.nome }}</q-item-label>

    <!-- Grau da Via -->
    <div class="grau-container">
      <q-item-label class="grau">{{ via?.grau || 'Grau não informado' }}</q-item-label>
    </div>

    <!-- Detalhes da Escalada -->
    <div class="detalhes-container">
      <!-- Data da Escalada -->
      <div class="detalhe-item">
        <q-icon name="event" size="md" />
        <q-item-label class="data-escalada">{{ formatDateToDDMMYY(escaladaLocal.data) }}</q-item-label>
      </div>

      <!-- Participantes -->
      <div class="detalhe-item">
        <q-icon name="people" size="md" />
        <q-item-label class="label-text">Participantes</q-item-label>
        <q-expansion-item expand-separator class="dropdown">
          <q-list>
            <q-item v-for="participante in escaladaLocal.participantes" :key="participante.nome">
              <q-item-section>
                <q-item-label :class="getParticipantClass(participante.tipo)">
                  {{ participante.nome }}
                </q-item-label>
                <q-chip
                  :color="getParticipantColor(participante.tipo)"
                  class="q-ml-sm"
                >
                  {{ participante.tipo }}
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </div>

      <!-- Observação -->
      <ObservacaoComponent v-model="escaladaLocal.observacao" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Escalada } from 'src/models/Escalada';
import { Via } from 'src/models/Via';
import ViaService from 'src/services/ViaService';
import ObservacaoComponent from 'src/components/Escalada/Observacao.vue';

const props = defineProps({
  escalada: {
    type: Object as () => Escalada,
    required: true
  }
});

const escaladaLocal = ref({ ...props.escalada });
const via = ref<Via | null>(null);

onMounted(async () => {
  if (escaladaLocal.value.id) {
    via.value = await ViaService.getViaById(escaladaLocal.value.id);
  }
});

function formatDateToDDMMYY (date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
}

function getParticipantColor (tipo: string) {
  switch (tipo) {
    case 'Guia':
      return 'red';
    case 'Misto':
      return 'blue';
    case 'Participante':
      return 'green';
    default:
      return 'gray';
  }
}

function getParticipantClass (tipo: string) {
  return tipo === 'Participante' ? 'participante-label' : '';
}
</script>

<style scoped>
.escalada-card {
  width: 100%;
  max-width: 390px; /* Limita a largura máxima a 390px */
  background-color: var(--q-primary);
  padding: 16px;
  border-radius: 16px; /* Aumenta o arredondamento das bordas */
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  margin: 0 auto; /* Centraliza o card horizontalmente */
}

.titulo-escalada {
  font-size: 40px;
  text-align: left;
  margin-bottom: 12px;
  font-weight: bold;
}

.grau-container {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

.detalhes-container {
  display: flex;
  flex-direction: column;
}

.detalhe-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.data-escalada {
  font-size: 32px;
  font-weight: bold;
  margin-left: 8px;
}

.label-text {
  font-size: 19px;
  font-weight: 600;
  margin-left: 8px;
}

.observacao-container {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.q-input {
  margin-top: 4px;
}

.modal-participantes {
  max-width: 390px;
  margin: 0 auto;
  background-color: var(--q-primary);
  padding: 16px;
  border-radius: 8px;
}
</style>
