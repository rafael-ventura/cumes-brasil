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
  @include campo-busca-primario(16px, 52px);
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
