<template>
  <q-input v-model="query" :label="props.label" @input="updateQuery" debounce="300" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  label: String
});

const emits = defineEmits(['update:query']);

const query = ref('');

const updateQuery = () => {
  emits('update:query', query.value);
};
</script>
