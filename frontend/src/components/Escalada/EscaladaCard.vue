<template>
  <div class="escalada-card-container">
    <!-- Imagem da Via -->
    <div class="imagem-container">
      <img
        v-if="via?.imagem?.url"
        :src="via.imagem.url"
        alt="Imagem da Via"
        class="via-imagem"
      />
    </div>

    <!-- Card da Escalada -->
    <div class="escalada-card">
      <div class="escalada-card-content">
        <!-- Título da Escalada -->
        <q-item-label class="titulo-escalada">{{ via?.nome }}</q-item-label>

        <!-- Grau da Via -->
        <div class="grau-container">
          <div class="grau-btn">
            {{ via?.grau || 'Grau não informado' }}
          </div>
        </div>

        <!-- Detalhes da Escalada -->
        <div class="detalhes-container">
          <!-- Data da Escalada -->
          <div class="detalhe-item">
            <q-icon name="event" size="md" />
            <q-item-label class="data-escalada">{{ formatDateToDDMMYY(escaladaLocal.data) }}</q-item-label>
          </div>

          <!-- Participantes -->
          <div :class="['participantes-wrapper', { 'bordered': dropdownOpen }]">
            <div class="participantes-header" @click="toggleDropdown">
              <q-icon name="people" size="md" />
              <q-item-label class="label-text">Participantes</q-item-label>
              <q-icon name="arrow_drop_down" size="md" class="dropdown-icon" />
            </div>

            <!-- Dropdown de Participantes -->
            <div v-if="dropdownOpen" class="participantes-dropdown">
              <q-list class="participante-list">
                <q-item
                  v-for="participante in escaladaLocal.participantes"
                  :key="participante.nome"
                  class="participante-item"
                >
                  <!-- Nome do Participante -->
                  <div class="participante-nome">
                    {{ participante.nome }}
                  </div>

                  <!-- Tipo do Participante -->
                  <div
                    :style="{ backgroundColor: getParticipantColor(participante.tipo) }"
                    class="tipo-participante-chip"
                  >
                    {{ participante.tipo }}
                  </div>
                </q-item>
              </q-list>
            </div>
          </div>

          <!-- Observação -->
          <ObservacaoComponent v-model="escaladaLocal.observacao" />
        </div>
      </div>
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
const dropdownOpen = ref(false);

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

function toggleDropdown () {
  dropdownOpen.value = !dropdownOpen.value;
}

function getParticipantColor (tipo: string) {
  switch (tipo.toUpperCase()) {
    case 'GUIA':
      return '#EF9D9D';
    case 'MISTO':
      return '#C0E8AB';
    case 'PARTICIPANTE':
      return '#7E9CE8';
    default:
      return 'gray';
  }
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
.via-imagem {
  width: calc(100% + 2px); /* Expande a imagem horizontalmente */
  height: auto;
  position: relative;
  top: -1px; /* Sobe a imagem em 1px */
  left: -1px; /* Move a imagem para a esquerda em 1px */
  border-top-left-radius: 10px; /* Arredonda borda superior esquerda */
  border-top-right-radius: 10px; /* Arredonda borda superior direita */
  object-fit: cover;
  display: block;
}

/* Card da Escalada */
.escalada-card {
  width: 100%;
  background-color: var(--q-primary);
  padding: 16px; /* Mantém o padding interno */
  box-sizing: border-box; /* Inclui padding no tamanho */
}

.escalada-card-content {
  padding-top: 16px; /* Adiciona um espaçamento entre a imagem e o conteúdo */
}

.titulo-escalada {
  font-size: 40px;
  margin-bottom: 12px;
  font-weight: bold;
}

.grau-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.grau-btn {
  width: 100%;
  max-width: 800px;
  padding: 1%;
  border: 1px solid black;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.10);
  color: black;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
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

.participantes-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 4%;
}

.participantes-header .q-icon {
  margin-right: 8px; /* Espaço entre o ícone e a label */
}

.participantes-header {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.dropdown-icon {
  margin-left: 8px;
}

.participantes-dropdown {
  background-color: var(--q-primary);
  margin-top: 4px;
  margin-bottom: 4%;
  display: flex;
  flex-direction: column;
}

.participante-list {
  display: flex;
  flex-direction: column;
  transform: translateY(-30px); /* Sobe a lista */
}

.participante-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0; /* Remove o padding */
  margin: 0; /* Remove o margin */
}

.participante-nome,
.tipo-participante-chip {
  margin: 0; /* Remove margin entre nome e tipo */
  padding: 0; /* Remove padding dentro dos campos */
  border: none; /* Remove a borda dos campos */
}

.participante-item:last-child {
  margin-bottom: -15%;
}

.participante-nome {
  flex: 0 1 80%; /* Ajuste de largura para caber na linha */
  padding: 2%;
  border: 1px solid black;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.10);
  color: black;
  text-align: center; /* Alinha o texto à esquerda */
  margin-right: 3%;
}

.tipo-participante-chip {
  flex: 0 0 30%; /* Ajuste de largura para caber na linha */
  padding: 1%;
  border-radius: 15px;
  font-size: 14px;
  text-align: center;
}

</style>
