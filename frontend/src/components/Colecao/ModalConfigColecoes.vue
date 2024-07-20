<template>
  <q-dialog :model-value="modelValue" @update:model-value="closeDialog" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <h6 class="q-ml-sm">Configurações da Coleção</h6>
      </q-card-section>
      <q-separator />
      <div v-if="currentView === 'main'">
        <q-list>
          <q-item clickable @click="showEditView">
            <q-item-section avatar>
              <q-icon name="edit" />
            </q-item-section>
            <q-item-section>Editar Coleção</q-item-section>
          </q-item>
          <q-item clickable @click="showDeleteView">
            <q-item-section avatar>
              <q-icon name="delete" color="red" />
            </q-item-section>
            <q-item-section>Excluir Coleção</q-item-section>
          </q-item>
        </q-list>
      </div>

      <div v-if="currentView === 'edit'">
        <q-card-section>
          <q-input v-model="collectionName" label="Nome da Coleção" />
          <q-input v-model="collectionDescription" label="Descrição da Coleção" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Editar" color="primary" @click="emitEdit" />
          <q-btn flat label="Voltar" @click="showMainView" />
        </q-card-actions>
      </div>

      <div v-if="currentView === 'delete'">
        <q-card-section>
          Tem certeza que deseja excluir esta coleção?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Sim" color="red" @click="emitDelete" />
          <q-btn flat label="Voltar" @click="showMainView" />
        </q-card-actions>
      </div>

      <q-card-actions align="right" v-if="currentView === 'main'">
        <q-btn flat label="Cancelar" color="primary" @click="closeDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";

const props = defineProps({
  modelValue: Boolean
});

const emits = defineEmits(["update:modelValue", "edit", "delete"]);

const currentView = ref("main");
const collectionName = ref("");
const collectionDescription = ref("");

const emitEdit = () => {
  emits("edit");
  closeDialog();
};

const emitDelete = () => {
  emits("delete");
  closeDialog();
};

const closeDialog = () => {
  currentView.value = "main";
  emits("update:modelValue", false);
};

const showEditView = () => {
  currentView.value = "edit";
};

const showDeleteView = () => {
  currentView.value = "delete";
};

const showMainView = () => {
  currentView.value = "main";
};
</script>

<style scoped>
</style>
