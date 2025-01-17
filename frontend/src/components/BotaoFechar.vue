<template>
  <q-btn
    flat
    round
    icon="close"
    class="btn-close"
    @click="emitClose"
  />
</template>

<script setup lang="ts">

const emits = defineEmits(['close']);

const emitClose = () => {
  emits('close');
};
</script>
