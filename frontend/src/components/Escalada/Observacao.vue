<template>
  <div class="observacao-container">
    <div class="observacao-header">
      <q-icon name="book" size="md" />
      <q-item-label class="observacao-label">Observação</q-item-label>
    </div>
    <q-input
      v-model="localValue"
      type="textarea"
      dense
      class="q-input-custom"
      readonly
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps({
  modelValue: String
});

const emit = defineEmits(['update:modelValue']);
const localValue = ref(props.modelValue);

// Observa mudanças na prop e atualiza o valor local
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue;
});

// Emite o evento quando o valor local muda
watch(localValue, (newValue) => {
  emit('update:modelValue', newValue);
});

defineOptions({
  name: 'ObservacaoComponent'
});
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
.observacao-container {
  background-color: #2c2c2c;
  padding: 8px;
  border-radius: 11px;
  border: none;
}

.observacao-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px; /* Espaço entre a linha de título e o campo de texto */
}

.observacao-header .q-icon {
  color: var(--q-primary); /* Define a cor do ícone para a cor primária */
  margin-right: 8px; /* Espaço entre o ícone e a label */
}

.observacao-label {
  font-size: 19px;
  font-weight: bolder;
  color: var(--q-primary);
}
</style>
