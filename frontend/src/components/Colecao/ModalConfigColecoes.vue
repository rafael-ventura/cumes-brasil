<template>
  <q-dialog :model-value="modelValue" @update:model-value="closeDialog">
    <q-card>
      <div v-if="currentView === 'main'">
        <q-list>
          <q-item clickable @click="isEdite = true">
            <q-item-section avatar>
              <q-icon name="edit" />
            </q-item-section>
            <q-item-section>Editar Coleção</q-item-section>
          </q-item>
          <q-item clickable @click="isDelete = true">
            <q-item-section avatar>
              <q-icon name="delete" color="red" />
            </q-item-section>
            <q-item-section>Excluir Coleção</q-item-section>
          </q-item>
        </q-list>
      </div>

      <q-dialog v-model="isEdite">
        <q-card style="min-width: 300px;">
          <q-card-section>
            <q-input v-model="collectionName" label="Nome da Coleção" />
            <q-input v-model="collectionDescription" label="Descrição da Coleção" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Salvar" color="primary" @click="emitEdit" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="isDelete">
        <q-card>
          <q-card-section>
            Tem certeza que deseja excluir esta coleção?
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Sim" color="red" @click="emitDelete" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  collectionData: {
    type: Object,
    required: true
  }
});

const emits = defineEmits(['update:modelValue', 'edit', 'delete']);

const isEdite = ref(false);
const isDelete = ref(false);
const currentView = ref('main');
const collectionName = ref(props.collectionData.nome);
const collectionDescription = ref(props.collectionData.descricao);

watch(() => props.collectionData, (newData) => {
  collectionName.value = newData.nome;
  collectionDescription.value = newData.descricao;
}, { immediate: true });

const emitEdit = () => {
  emits('edit', {
    nome: collectionName.value,
    descricao: collectionDescription.value
  });
  closeDialog();
};

const emitDelete = () => {
  emits('delete');
  closeDialog();
};

const closeDialog = () => {
  isEdite.value = false;
  isDelete.value = false;
  emits('update:modelValue', false);
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
</style>
