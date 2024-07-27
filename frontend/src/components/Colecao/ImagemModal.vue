<template>
  <q-dialog v-model="localIsOpen" @hide="handleHide">
    <q-img :src="imageUrl" class="expanded-image" @click="closeModal"/>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch, ref } from 'vue';

const props = defineProps<{ isOpen: boolean; imageUrl: string }>();
const emit = defineEmits(['update:isOpen']);

const localIsOpen = ref(props.isOpen);

watch(() => props.isOpen, (newVal) => {
  localIsOpen.value = newVal;
});

watch(localIsOpen, (newVal) => {
  if (!newVal) {
    emit('update:isOpen', false);
  }
});

const closeModal = () => {
  localIsOpen.value = false;
};

const handleHide = () => {
  localIsOpen.value = false;
  emit('update:isOpen', false);
};
</script>

<style scoped>
.expanded-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  cursor: pointer;
}
</style>
