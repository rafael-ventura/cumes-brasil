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
  bottom: 80px;
  right: 16px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  z-index: 1000;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  opacity: 0.9;
  pointer-events: auto;
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
    background-color: rgba(0, 0, 0, 0.8);
  }
}
</style>
