<!-- src/components/GrauBadge.vue -->
<template>
  <div class="grau-badge">
    <span>{{ grauText }}<span v-if="extensaoText">, {{ extensaoText }}</span></span>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
  grauText: {
    type: String,
    required: true
  },
  extensaoText: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['showInfo']);

const onInfoClick = () => {
  emit('showInfo');
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.grau-badge {
  width: 90%;
  max-width: 800px;
  padding: 1%;
  border: 1px solid black;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.10);
  color: black;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.info-icon {
  cursor: pointer;
  color: $primary;
}
</style>
