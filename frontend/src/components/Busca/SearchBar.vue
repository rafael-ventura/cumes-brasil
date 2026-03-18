<template>
  <div class="search-bar">
    <q-input
      v-model="searchText"
      :label="label"
      debounce="300"
      outlined
      color="secondary"
      label-color="secondary"
      rounded
      class="search-input"
      @update:model-value="onSearch"
      @keydown.enter="onSearch(searchText)"
    >
      <template #prepend>
        <q-icon name="search" class="search-icon" />
      </template>
      <template #append>
        <q-icon
          v-if="searchText"
          name="close"
          class="clear-icon cursor-pointer"
          @click="clearSearch"
        />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = withDefaults(defineProps<{
  modelValue?: string;
  label?: string;
}>(), {
  modelValue: '',
  label: 'Buscar por nome, local ou montanha...'
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'search': [value: string];
}>();

const searchText = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  searchText.value = val;
});

const onSearch = (value: string | number | null) => {
  const str = String(value ?? '');
  emit('update:modelValue', str);
  emit('search', str);
};

const clearSearch = () => {
  searchText.value = '';
  emit('update:modelValue', '');
  emit('search', '');
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.search-bar {
  width: 100%;
}

.search-input {
  :deep(.q-field__control) {
    background-color: $offwhite !important;
    border-radius: 16px !important;
    padding: 0 4px !important;
    height: 52px;

    &::before {
      border-color: rgba($cumes-01, 0.4) !important;
      border-width: 2px !important;
      border-radius: 16px !important;
    }
  }

  :deep(.q-field__native) {
    color: $background !important;
    font-size: 15px !important;
    font-weight: 500 !important;
    padding: 10px 8px !important;
  }

  :deep(input),
  :deep(.q-field__input) {
    color: $background !important;
  }

  :deep(input::placeholder) {
    color: rgba($background, 0.45) !important;
  }

  :deep(.q-field__label) {
    color: rgba($background, 0.6) !important;
    font-weight: 600 !important;
    font-size: 14px !important;
  }

  &:deep(.q-field--focused) {
    .q-field__control::before {
      border-color: $cumes-03 !important;
      border-width: 2px !important;
    }
  }
}

.search-icon {
  color: $cumes-03 !important;
  font-size: 22px !important;
}

.clear-icon {
  color: rgba($background, 0.5) !important;
  font-size: 20px !important;
  transition: color 0.2s;

  &:hover {
    color: $error-color !important;
  }
}
</style>
