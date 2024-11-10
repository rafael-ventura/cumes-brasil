<template>
  <q-dialog v-model="localIsOpen" @hide="closeModal">
    <q-card class="modal-card-primary">
      <q-card-section class="modal-content">
        <q-icon name="add" size="56px" class="icon-center" color="dark" />
        <div class="title">Adicionar Coleção</div>
        <q-input
          v-model="colecao.nome"
          label="Nome da Coleção"
          outlined
          class="input-field"
          label-color="dark"
        />
        <q-input
          v-model="colecao.descricao"
          label="Descrição da Coleção"
          outlined
          type="textarea"
          class="input-field"
          label-color="dark"
        />
      </q-card-section>

      <q-card-actions align="center" class="action-buttons">
        <q-btn flat label="Cancelar" color="dark" @click="closeModal" />
        <q-btn flat label="Adicionar" color="dark" @click="emitCollectionAdded" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue';
import { Colecao } from 'src/models/IColecao';
import { Usuario } from 'src/models/IUsuario';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['update:isOpen', 'collection-added']);

// Estado local do modal
const localIsOpen = ref(props.isOpen);

// Instância da coleção usando a model diretamente
const colecao = ref(new Colecao());

// Observa a propriedade isOpen e atualiza o estado local
watch(
  () => props.isOpen,
  (newValue) => {
    localIsOpen.value = newValue;
  }
);

// Função para fechar o modal e resetar o estado da coleção
const closeModal = () => {
  emit('update:isOpen', false);
  localIsOpen.value = false;
};

// Função para emitir o evento de adicionar coleção para o componente pai
const emitCollectionAdded = () => {
  if (colecao.value.nome.trim()) {
    // Define apenas o campo `id` no objeto `usuario` antes de emitir
    colecao.value.usuario = new Usuario(Number(localStorage.getItem('userId')) || 0);

    emit('collection-added', { ...colecao.value });
    closeModal();
    resetColecao();
  }
};

// Função para resetar a coleção
const resetColecao = () => {
  colecao.value = new Colecao();
  colecao.value.usuario = new Usuario(Number(localStorage.getItem('userId')) || 0);
};

</script>
<style scoped lang="scss">
@import "src/css/app.scss";

.modal-card-primary {
  background-color: $primary;
  color: $dark;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.icon-center {
  margin-bottom: 12px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: $dark;
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  margin-bottom: 16px;
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}
</style>
