<template>
  <q-list bordered separator>
    <q-item v-for="via in props.vias" :key="via.id" clickable @click="addVia(via)">
      <q-item-section avatar>
        <q-avatar square size="50px" class="custom-avatar">
          <q-img :src="via.imagem?.url || 'https://via.placeholder.com/50'" cover />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ via.nome }}</q-item-label>
        <q-item-label caption>{{ via.montanha.nome }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn
          flat
          round
          :icon="via.added ? 'check' : 'add'"
          :color="via.added ? 'green' : 'primary'"
          @click.stop="addVia(via)"
          :disabled="via.added" />
      </q-item-section>
    </q-item>
    <q-item v-if="!props.vias.length">
      <q-item-section>
        <q-item-label>Nenhuma via encontrada.</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Via } from 'src/models/Via';

interface ViaWithAdded extends Via {
  added?: boolean;
}

const props = defineProps<{ vias: ViaWithAdded[] }>();
const emit = defineEmits(['add-via']);

const addVia = (via: ViaWithAdded) => {
  if (!via.added) {
    via.added = true;
    emit('add-via', via);
  }
};
</script>

<style scoped>
.custom-avatar {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
