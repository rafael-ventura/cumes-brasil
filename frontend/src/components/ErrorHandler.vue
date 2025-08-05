<template>
  <div v-if="showError" class="error-container">
    <q-banner class="bg-negative text-white">
      <template v-slot:avatar>
        <q-icon name="error" color="white" />
      </template>
      {{ errorMessage }}
      <template v-slot:action>
        <q-btn flat color="white" label="Fechar" @click="closeError" />
      </template>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Notify } from 'quasar';
import { createNotifyConfig } from 'src/utils/utils';

interface Props {
  error?: Error | null;
  showNotification?: boolean;
  position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';
  timeout?: number;
}

const props = withDefaults(defineProps<Props>(), {
  error: null,
  showNotification: true,
  position: 'top',
  timeout: 5000
});

const emit = defineEmits(['close']);

const showError = ref(false);
const errorMessage = ref('');

watch(() => props.error, (newError) => {
  if (newError) {
    errorMessage.value = newError.message || 'Ocorreu um erro inesperado';
    showError.value = true;
    
    if (props.showNotification) {
      Notify.create(createNotifyConfig('negative', errorMessage.value, props.position, props.timeout));
    }
  } else {
    showError.value = false;
  }
}, { immediate: true });

const closeError = () => {
  showError.value = false;
  emit('close');
};
</script>

<style scoped lang="scss">
.error-container {
  margin: 16px 0;
}
</style> 