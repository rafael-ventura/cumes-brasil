<template>
  <div class="observacao-container">
    <q-item-label class="observacao-label">Observação</q-item-label>
    <q-input class="q-input"
      v-model="localValue"
      dense
      resizable
      type="textarea"
      disable
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

<style scoped>
.observacao-container {
  background-color: #2c2c2c;
  padding: 8px;
  border-radius: 8px;
}

.observacao-label {
  font-size: 19px;
  font-weight: bolder;
  color: var(--q-primary);
  margin-bottom: 4px;
}

.q-input {
  font-size: 20px;
  color: white;
  background-color: transparent;
}
</style>
