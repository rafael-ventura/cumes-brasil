<template>
  <q-dialog v-model="localIsOpen" @hide="closeModal">
    <q-card class="modal-card">
      <q-card-section class="modal-header">
        <q-icon name="add_circle" size="64px" class="icon-header" color="white" />
        <div class="title">Nova Coleção</div>
      </q-card-section>

      <q-card-section class="modal-body">
        <q-input
          v-model="colecao.nome"
          label="Nome da Coleção"
          outlined
          class="input-field"
          dense
        />
        <q-input
          v-model="colecao.descricao"
          label="Descrição da Coleção"
          outlined
          type="textarea"
          class="input-field"
          dense
        />
      </q-card-section>

      <q-card-actions align="center" class="modal-actions">
        <q-btn flat label="Cancelar" class="btn-cancel" @click="closeModal" />
        <q-btn flat label="Adicionar" class="btn-add" @click="emitCollectionAdded" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Colecao } from 'src/models/IColecao';
import { Usuario } from 'src/models/IUsuario';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['atualizar:isOpen', 'collection-added']);

const localIsOpen = ref(props.isOpen);
const colecao = ref(new Colecao());

watch(
  () => props.isOpen,
  (newValue) => {
    localIsOpen.value = newValue;
  }
);

const closeModal = () => {
  emit('atualizar:isOpen', false);
  localIsOpen.value = false;
  resetColecao();
};

const emitCollectionAdded = () => {
  if (colecao.value.nome.trim()) {
    colecao.value.usuario = new Usuario(Number(localStorage.getItem('usuarioId')) || 0);
    emit('collection-added', { ...colecao.value });
    closeModal();
  }
};

const resetColecao = () => {
  colecao.value = new Colecao();
  colecao.value.usuario = new Usuario(Number(localStorage.getItem('usuarioId')) || 0);
};
</script>

<style lang="scss">
@import "src/css/app.scss";

/* 🔹 Estrutura do Modal */
.modal-card {
  background-color: $cumes-03;
  color: white;
  width: 85vw;
  max-width: 600px;
  border-radius: 14px;
  transition: transform 0.3s ease;
}

/* 🔹 Cabeçalho do Modal */
.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: $cumes-03;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
}

.icon-header {
  margin-bottom: 10px;
}

.title {
  font-size: 22px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 🔹 Corpo do Modal */
.modal-body {
  padding: 20px;
}

/* 🔹 Estilização dos Inputs */
.input-field {
  width: 100%;
  margin-bottom: 16px;
  color: black;

  /* 🔹 Bordas brancas sempre */
  .q-field__control {
    border-radius: 6px;
    border: 2px solid white !important;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  /* 🔹 Hover e foco do input */
  .q-field--focused .q-field__control,
  &:hover .q-field__control {
    border-color: white !important;
    box-shadow: 0px 0px 6px rgba(255, 255, 255, 0.5);
  }

  /* 🔹 Texto digitado */
  .q-field__native {
    color: black !important;
  }

  /* 🔹 Placeholder */
  .q-placeholder {
    color: rgba(255, 255, 255, 0.6) !important;
  }
}

/* 🔹 Ações do Modal */
.modal-actions {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

/* 🔹 Botão Cancelar */
.btn-cancel {
  color: white;
  border: 2px solid white;
  transition: background 0.3s, color 0.3s;
  border-radius: 6px;
  padding: 8px 16px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    background: black;
    color: white;
  }
}

/* 🔹 Botão Adicionar (igual ao Cancelar, mas com efeito especial no clique) */
.btn-add {
  background: transparent;
  color: white;
  border: 2px solid white;
  font-weight: bold;
  transition: background 0.3s, color 0.3s;
  border-radius: 6px;
  padding: 8px 16px;

  &:hover {
    background: white;
    color: $cumes-03;
  }

  &:active {
    background: black;
    color: white;
  }
}
</style>
