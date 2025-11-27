<template>
  <q-btn
    round
    icon="add"
    size="0.8rem"
    class="btn-add"
    @click="onAdd"
  />
</template>

<script setup lang="ts">
const emit = defineEmits(['add']);

const onAdd = () => {
  emit('add');
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.q-btn.btn-add {
  position: fixed;
  bottom: 100px; /* Aumentado de 80px para subir mais */
  right: 16px;
  background-color: rgba($background, 0.85) !important; /* Mais escuro, menos translúcido */
  color: $offwhite !important;
  z-index: 1000;
  box-shadow: 0 4px 12px $box-shadow-medium !important;
  border-radius: 100%;
  pointer-events: auto;
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  width: 56px;
  height: 56px;
  aspect-ratio: 1;
  border: 2px solid $cumes-01 !important; /* Borda verde conforme design system */

  :deep(.q-icon) {
    color: $cumes-01 !important; /* Ícone verde */
  }

  &:hover {
    transform: scale(1.1);
    background-color: rgba($background, 0.95) !important; /* Ainda mais escuro no hover */
    box-shadow: 0 6px 16px $box-shadow-strong !important;
    border-color: $cumes-03 !important; /* Borda laranja no hover */
    
    :deep(.q-icon) {
      color: $cumes-03 !important; /* Ícone laranja no hover */
    }
  }
}
</style>
