<template>
  <q-dialog v-model="localIsOpen" @hide="closeModal">
    <q-card class="modal-card-primary">
      <q-card-section class="modal-content">
        <q-icon name="add" size="56px" class="icon-center" color="dark" />
        <div class="title">Adicionar Coleção</div>
        <q-input
          v-model="novaColecao.nome"
          label="Nome da Coleção"
          outlined
          class="input-field"
          label-color="dark"
        />
        <q-input
          v-model="novaColecao.descricao"
          label="Descrição da Coleção"
          outlined
          type="textarea"
          class="input-field"
          label-color="dark"
        />
      </q-card-section>

      <q-card-actions align="center" class="action-buttons">
        <q-btn flat label="Cancelar" color="dark" @click="closeModal" />
        <q-btn flat label="Adicionar" color="dark" @click="addColecao" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, Ref, ref, watch } from 'vue';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['update:isOpen', 'collection-added']);

// Variável local para controlar a abertura do modal
const localIsOpen = ref(props.isOpen);

watch(
  () => props.isOpen,
  (newValue) => {
    localIsOpen.value = newValue;
  }
);

// Defina uma nova coleção com as estruturas `Usuario` e `Imagem` adequadas
let novaColecao: Ref<{
  imagem: { tipo_entidade: string; fonte: { id: number; autor: string; referencia: string }; id: number; url: string };
  nome: string;
  usuario: {
    password_hash: string;
    foto_perfil: {
      tipo_entidade: string;
      fonte: { id: number; autor: string; referencia: string };
      id: number;
      url: string
    };
    nome: string;
    id: number;
    email: string
  };
  descricao: string
}> = ref({
  nome: '',
  descricao: '',
  usuario: {
    id: Number(localStorage.getItem('userId')) || 0,
    nome: 'Nome do Usuário',
    email: '',
    password_hash: '',
    foto_perfil: {
      id: 1,
      url: 'https://via.placeholder.com/300x150',
      fonte: {
        autor: 'Autor Desconhecido',
        id: 0,
        referencia: 'N/A'
      },
      tipo_entidade: 'usuario'
    } as any
  },
  imagem: {
    id: 1,
    url: 'https://via.placeholder.com/300x150',
    fonte: {
      autor: 'Autor Desconhecido',
      id: 0,
      referencia: 'N/A'
    },
    tipo_entidade: 'colecao'
  }
});
// Função para fechar o modal e emitir o evento para o componente pai
const closeModal = () => {
  emit('update:isOpen', false);
  localIsOpen.value = false;
};

// Função para adicionar a coleção e fechar o modal
const addColecao = async () => {
  if (novaColecao.value.nome.trim()) {
    emit('collection-added', novaColecao.value);
    closeModal();
    // Limpa o estado da nova coleção
    novaColecao = ref({
      nome: '',
      descricao: '',
      usuario: {
        id: Number(localStorage.getItem('userId')) || 0,
        nome: 'Nome do Usuário',
        email: 'usuario@example.com',
        password_hash: '',
        foto_perfil: {
          id: 1,
          url: 'https://via.placeholder.com/300x150',
          fonte: {
            autor: 'Autor Desconhecido',
            id: 0,
            referencia: 'N/A'
          },
          tipo_entidade: 'usuario'
        }
      },
      imagem: {
        id: 1,
        url: 'https://via.placeholder.com/300x150',
        fonte: {
          autor: 'Autor Desconhecido',
          id: 0,
          referencia: 'N/A'
        },
        tipo_entidade: 'colecao'
      }
    });
  }
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
