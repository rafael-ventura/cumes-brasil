<template>
  <div class="escalada-card-container">
    <!-- Imagem da Via -->
    <div class="imagem-container">
      <img
        v-if="viaImageUrl"
        :src="viaImageUrl"
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
          <GrauBadge v-if="via" :via="via" />
          <div v-else class="grau-btn">
            Grau não informado
          </div>
        </div>

        <!-- Detalhes da Escalada -->
        <div class="detalhes-container">
          <!-- Data da Escalada - Destaque -->
          <div class="data-card">
            <div class="data-icon-wrapper">
              <q-icon name="event" class="data-icon" />
            </div>
            <div class="data-content">
              <div class="data-label">Data da Escalada</div>
              <div class="data-value">{{ formatDateToDDMMYY(escaladaLocal.data) }}</div>
            </div>
          </div>

          <!-- Participantes - Layout Moderno -->
          <div class="participantes-section">
            <div class="section-header" @click="toggleDropdown">
              <div class="section-title">
                <q-icon name="people" class="section-icon" />
                <span class="section-label">Participantes</span>
                <q-badge v-if="escaladaLocal.participantes?.length" class="participantes-count">
                  {{ escaladaLocal.participantes.length }}
                </q-badge>
              </div>
              <q-icon 
                :name="dropdownOpen ? 'expand_less' : 'expand_more'" 
                class="dropdown-icon" 
              />
            </div>

            <!-- Lista de Participantes -->
            <div v-if="dropdownOpen" class="participantes-list">
              <div v-if="escaladaLocal.participantes && escaladaLocal.participantes.length > 0">
                <div
                  v-for="participante in escaladaLocal.participantes"
                  :key="participante.id || participante.nome"
                  class="participante-card"
                >
                  <div class="participante-avatar">
                    <q-icon name="person" />
                  </div>
                  <div class="participante-info">
                    <div class="participante-nome">{{ participante.nome }}</div>
                    <div
                      :style="{ backgroundColor: getParticipantColor(participante.tipo) }"
                      class="tipo-participante-badge"
                    >
                      {{ participante.tipo }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="no-participantes">
                Nenhum participante registrado
              </div>
            </div>
          </div>

          <!-- Observação - Layout Moderno -->
          <div v-if="escaladaLocal.observacao" class="observacao-section">
            <div class="section-header" @click="toggleObservacaoDropdown">
              <div class="section-title">
                <q-icon name="note" class="section-icon" />
                <span class="section-label">Observação</span>
              </div>
              <q-icon 
                :name="observacaoDropdownOpen ? 'expand_less' : 'expand_more'" 
                class="dropdown-icon" 
              />
            </div>
            <div v-if="observacaoDropdownOpen" class="observacao-content">
              <div class="observacao-text">
                {{ observacaoExibida }}
              </div>
              <q-btn
                v-if="observacaoLocal.length > 300"
                flat
                dense
                no-caps
                :label="observacaoExpandida ? 'Ver menos' : 'Ver mais'"
                :icon="observacaoExpandida ? 'expand_less' : 'expand_more'"
                class="btn-ver-mais"
                @click.stop="toggleObservacao"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { Escalada } from 'src/models/Escalada';
import { Via } from 'src/models/Via';
import ViaService from 'src/services/ViaService';
import GrauBadge from 'src/components/Via/GrauBadge.vue';
import { getViaImageUrlFull } from 'src/utils/utils';

const props = defineProps({
  escalada: {
    type: Object as () => Escalada,
    required: true
  }
});

const escaladaLocal = ref({ ...props.escalada });
const via = ref<Via | null>(null);
const dropdownOpen = ref(false);
const observacaoExpandida = ref(false);
const observacaoDropdownOpen = ref(true); // Começa aberto por padrão

const viaImageUrl = computed(() => getViaImageUrlFull(via.value));

// Observa mudanças na prop escalada
watch(() => props.escalada, (newEscalada) => {
  escaladaLocal.value = { ...newEscalada };
  // Garante que participantes seja um array
  if (!escaladaLocal.value.participantes) {
    escaladaLocal.value.participantes = [];
  }
}, { immediate: true, deep: true });

onMounted(async () => {
  // Garante que participantes seja um array
  if (!escaladaLocal.value.participantes) {
    escaladaLocal.value.participantes = [];
  }
  
  // Debug: verificar se participantes estão vindo
  console.log('Escalada recebida:', escaladaLocal.value);
  console.log('Participantes:', escaladaLocal.value.participantes);
  
  // Buscar via corretamente
  if (escaladaLocal.value.via && typeof escaladaLocal.value.via === 'object' && escaladaLocal.value.via.id) {
    via.value = await ViaService.getViaById(escaladaLocal.value.via.id);
  } else if (escaladaLocal.value.via && typeof escaladaLocal.value.via === 'number') {
    via.value = await ViaService.getViaById(escaladaLocal.value.via);
  } else if (escaladaLocal.value.id) {
    // Se não tiver via, tenta buscar pela escalada (isso não faz sentido, mas mantém compatibilidade)
    console.warn('Escalada sem via definida, tentando buscar via pelo id da escalada');
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
      return '#546119';
    case 'MISTO':
      return '#F4E285';
    case 'PARTICIPANTE':
      return '#BC4B51';
    default:
      return 'gray';
  }
}

const observacaoLocal = computed(() => {
  return escaladaLocal.value.observacao || '';
});

const observacaoExibida = computed(() => {
  if (observacaoLocal.value.length <= 300 || observacaoExpandida.value) {
    return observacaoLocal.value;
  }
  return observacaoLocal.value.substring(0, 300) + '...';
});

function toggleObservacao () {
  observacaoExpandida.value = !observacaoExpandida.value;
}

function toggleObservacaoDropdown () {
  observacaoDropdownOpen.value = !observacaoDropdownOpen.value;
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
.imagem-container {
  width: 100%;
  height: 240px; /* Altura aumentada para dar mais destaque */
  overflow: hidden;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
    pointer-events: none;
  }
}

.via-imagem {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

/* Card da Escalada */
.escalada-card-container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px $box-shadow-medium;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px $box-shadow-strong;
  }
}

.escalada-card {
  width: 100%;
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 5%) 100%);
  padding: 20px;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
}

.escalada-card-content {
  padding-top: 0; /* Remove padding extra */
}

.titulo-escalada {
  font-size: 22px;
  margin-bottom: 16px;
  font-weight: 700;
  color: $offwhite;
  text-shadow: 0 2px 4px $text-shadow-default;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 12px;
  }
}

.grau-container {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
  width: 100%;
  
  :deep(.grau-badge) {
    width: 100%;
    max-width: 100%;
  }
}

.grau-btn {
  width: 100%;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, $cumes-04 0%, darken($cumes-04, 10%) 100%);
  color: $background;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  box-shadow: 0 2px 6px $box-shadow-medium;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 6px 12px;
  }
}

.detalhes-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Data Card - Layout Moderno */
.data-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.35);
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.3);
  }
}

.data-icon-wrapper {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $cumes-03 0%, darken($cumes-03, 10%) 100%);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.data-icon {
  color: $offwhite;
  font-size: 24px;
}

.data-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.data-label {
  font-size: 12px;
  font-weight: 600;
  color: $offwhite;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-value {
  font-size: 18px;
  font-weight: 700;
  color: $offwhite;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
}

/* Participantes Section - Layout Moderno */
.participantes-section {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.15);
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  color: $cumes-04;
  font-size: 20px;
}

.section-label {
  font-size: 15px;
  font-weight: 700;
  color: $offwhite;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.participantes-count {
  background: $cumes-03 !important;
  color: $offwhite !important;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.dropdown-icon {
  color: $cumes-04;
  font-size: 24px;
  transition: transform 0.2s ease;
}

.participantes-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.participante-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.3);
    transform: translateX(4px);
    border-color: rgba(255, 255, 255, 0.25);
  }
}

.participante-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $cumes-02 0%, darken($cumes-02, 10%) 100%);
  border-radius: 50%;
  color: $offwhite;
  font-size: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.participante-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.participante-nome {
  font-size: 15px;
  font-weight: 600;
  color: $offwhite;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
}

.tipo-participante-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  color: $background;
  text-align: center;
  width: fit-content;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    font-size: 10px;
    padding: 3px 8px;
  }
}

.no-participantes {
  padding: 16px;
  text-align: center;
  color: $offwhite;
  opacity: 0.6;
  font-size: 14px;
  font-style: italic;
}

/* Observação Section - Layout Moderno */
.observacao-section {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.observacao-content {
  padding: 12px 16px 16px 16px;
  color: $offwhite;
  font-size: 14px;
  line-height: 1.6;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 10px 12px 12px 12px;
  }
}

.observacao-text {
  color: $offwhite;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.btn-ver-mais {
  align-self: flex-start;
  color: $cumes-04 !important; /* Amarelo ao invés de laranja */
  font-weight: 600;
  font-size: 13px;
  padding: 4px 8px;
  margin-top: 4px;
  
  :deep(.q-btn__content) {
    gap: 4px;
  }
  
  :deep(.q-icon) {
    color: $cumes-04 !important;
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
}

</style>
