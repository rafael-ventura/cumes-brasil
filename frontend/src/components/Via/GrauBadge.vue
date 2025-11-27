<!-- src/components/GrauBadge.vue -->
<template>
  <div class="grau-badge">
    <span>{{ formattedGrau }}<span v-if="extensaoValida">, {{ extensaoValida }}</span></span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Via } from 'src/models/Via';

const props = defineProps<{ via: Via }>();

// Função de validação
const isValid = (value: any) => value != null && value !== 'N/A';

// Construção do texto completo do grau
const formattedGrau = computed(() => {
  const grauParts = [
    isValid(props.via?.grau) ? props.via?.grau : null,
    isValid(props.via?.crux) ? props.via?.crux : null,
    isValid(props.via?.artificial) ? props.via?.artificial : null,
    isValid(props.via?.exposicao) ? props.via?.exposicao : null,
    isValid(props.via?.duracao) ? props.via?.duracao : null
  ].filter(Boolean);

  return grauParts.length > 0 ? grauParts.join(' ') : null;
});

const extensaoValida = computed(() => {
  return isValid(props.via?.extensao) ? `${props.via?.extensao} Metros` : null;
});

</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.grau-badge {
  width: 90%;
  max-width: 800px;
  padding: 8px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, $cumes-04 0%, darken($cumes-04, 10%) 100%);
  color: $background;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  box-shadow: 0 4px 12px $box-shadow-medium;
  border: 2px solid rgba($cumes-03, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-icon {
  cursor: pointer;
  color: $cumes-03;
}
</style>
