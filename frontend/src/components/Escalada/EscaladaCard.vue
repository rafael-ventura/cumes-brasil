<template>
  <div class="escalada-card q-mb-md">
    <!-- Grau da Via -->
    <div class="grau-container">
      <q-item-label class="grau">{{ via?.grau || 'Grau não informado' }}</q-item-label>
    </div>

    <!-- Detalhes da Escalada -->
    <div class="detalhes-container">
      <div class="detalhe-item">
        <q-icon name="event" />
        <q-item-label>{{ formatDateToDDMMYY(escaladaLocal.data) }}</q-item-label>
      </div>

      <!-- Participantes -->
      <div class="detalhe-item">
        <q-icon name="people" />
        <q-item-label>Participantes</q-item-label>
        <q-expansion-item expand-separator class="dropdown">
          <q-list>
            <q-item v-for="participante in escaladaLocal.participantes" :key="participante.nome">
              <q-item-section>
                <q-item-label>{{ participante.nome }} ({{ participante.tipo }})</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </div>

      <!-- Observação -->
      <div class="detalhe-item">
        <q-icon name="note" />
        <q-item-label class="observacao-label">Observação</q-item-label>
        <q-input v-model="escaladaLocal.observacao" outlined dense />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Escalada } from 'src/models/Escalada';
import { Via } from 'src/models/Via';
import ViaService from 'src/services/ViaService';

const props = defineProps({
  escalada: {
    type: Object as () => Escalada,
    required: true
  }
});

const escaladaLocal = ref({ ...props.escalada });
const via = ref<Via | null>(null);

onMounted(async () => {
  console.log('escaladaLocal', escaladaLocal.value);
  via.value = await ViaService.getViaById(escaladaLocal.value.id!);
});

function formatDateToDDMMYY (date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
}
</script>

<style scoped>
.escalada-card {
  width: 100%;
  background-color: #f4a261;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.grau-container {
  background-color: #264653;
  color: #fff;
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

.observacao-label {
  margin-top: 8px;
}
</style>
