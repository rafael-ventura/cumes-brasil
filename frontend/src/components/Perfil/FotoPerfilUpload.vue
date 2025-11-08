<template>
  <div class="foto-perfil-uploader">
    <!-- Botão de deletar no canto superior direito -->
    <q-btn
      round
      flat
      icon="delete"
      class="btn-delete"
      @click="showDeleteDialog = true"
      color="negative"
    >
      <q-tooltip>Excluir foto</q-tooltip>
    </q-btn>

    <q-file
      v-model="fotoFile"
      accept=".jpg, .jpeg, .png, image/*"
      :max-file-size="1097152"
      @change="onFotoChange"
      @rejected="onFotoRejected"
      @input="onFileInput"
      style="display: none"
      ref="fileInput"
      outlined
      clearable
      clear-icon="close"
    />
    
    <div class="uploader-content">
      <q-btn
        flat
        icon="edit"
        class="btn alinha btn-escuro"
        @click="openFileDialog"
        label="Alterar Foto"
      >
        <q-tooltip>Selecionar nova foto</q-tooltip>
      </q-btn>
      
      <q-separator spaced/>
      
      <div v-if="isLoading" class="loading-wrapper btn btn-maior btn-escuro">
        <q-spinner size="30px" color="primary" />
        <span>Carregando...</span>
      </div>
      
      <q-img 
        v-if="fotoPreview" 
        :src="fotoPreview" 
        :ratio="1" 
        class="my-profile-pic imagem-preview" 
      />
      
      <q-btn
        v-if="fotoPreview"
        class="q-mt-sm btn btn-escuro btn-salvar"
        label="Salvar nova foto"
        @click="saveFoto"
        icon="save"
        dense
        flat
      />
    </div>

    <!-- Modal de confirmação de exclusão -->
    <q-dialog v-model="showDeleteDialog">
      <q-card class="delete-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Confirmar Exclusão</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <div class="text-body1 q-mb-md">
            Tem certeza que deseja excluir sua foto de perfil?
          </div>
          <div class="text-body2 text-grey-7">
            Sua foto será substituída pela imagem padrão do sistema.
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn 
            flat 
            label="Cancelar" 
            color="grey-7" 
            v-close-popup 
            class="btn-cancelar"
          />
          <q-btn 
            flat 
            label="Confirmar Exclusão" 
            color="negative" 
            @click="deleteFoto"
            class="btn-confirmar"
            :loading="isDeleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { QRejectedEntry, useQuasar } from 'quasar';
import UserService from 'src/services/UsuarioService';

const emits = defineEmits(['closeDialogPai', 'submit']);
const $q = useQuasar();

const fotoFile = ref<File | null>(null);
const fotoPreview = computed(() => fotoFile.value ? URL.createObjectURL(fotoFile.value) : null);
const isLoading = ref(false);
const showDeleteDialog = ref(false);
const isDeleting = ref(false);

watch(fotoFile, (newValue) => {
  if (newValue) {
    isLoading.value = false;
  }
});

const openFileDialog = () => {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  fileInput?.click();
  isLoading.value = true;
  emits('closeDialogPai', true);
};

const onFileInput = () => {
  if (!fotoFile.value) {
    isLoading.value = false;
    emits('closeDialogPai', false);
  }
};

const onFotoChange = () => {
  if (fotoFile.value && fotoPreview.value) {
    URL.revokeObjectURL(fotoPreview.value);
  }
};

const onFotoRejected = (rejectedEntries: QRejectedEntry[]) => {
  rejectedEntries.forEach(entry => {
    let msg = '';
    switch (entry.failedPropValidation) {
      case 'max-file-size':
        msg = 'O tamanho máximo da sua foto deve ser de 1MB.';
        break;
      case 'accept':
        msg = 'Formato inválido. Sua foto precisa ser: JPG, PNG ou GIF.';
        break;
      default:
        msg = `O arquivo "${entry.file.name}" foi rejeitado por um motivo desconhecido.`;
    }
    $q.notify({
      type: 'negative',
      message: msg
    });
  });
};

const saveFoto = async () => {
  try {
    if (!fotoFile.value) {
      $q.notify({
        type: 'negative',
        message: 'Nenhuma foto foi selecionada.'
      });
      return;
    }

    isLoading.value = true;

    const formData = new FormData();
    formData.append('foto_perfil', fotoFile.value);
    const updatedUser = await UserService.editarFotoPerfil(formData);

    $q.notify({
      type: 'positive',
      message: 'Foto atualizada com sucesso!'
    });

    emits('submit', updatedUser);

    isLoading.value = false;
  } catch (error) {
    console.error('Erro ao salvar a foto:', error);
    $q.notify({
      type: 'negative',
      message: 'Erro ao atualizar a foto. Tente novamente.'
    });
    isLoading.value = false;
  }
};

const deleteFoto = async () => {
  try {
    isDeleting.value = true;
    
    await UserService.excluirFotoPerfil();

    $q.notify({
      type: 'positive',
      message: 'Foto excluída com sucesso! Foto padrão aplicada.'
    });

    showDeleteDialog.value = false;
    emits('submit');
    
    isDeleting.value = false;
  } catch (error) {
    console.error('Erro ao excluir a foto:', error);
    $q.notify({
      type: 'negative',
      message: 'Erro ao excluir a foto. Tente novamente.'
    });
    isDeleting.value = false;
  }
};
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.foto-perfil-uploader {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15);
  flex-direction: column;
  align-items: center;
  border: 1px solid $cumes-03;
  padding: 16px;
  
  @media (max-width: 600px) {
    padding: 12px;
  }
}

.btn-delete {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  background-color: rgba(255, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 0, 0, 0.2);
    transform: scale(1.1);
  }

  @media (max-width: 600px) {
    top: 8px;
    right: 8px;
  }
}

.uploader-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
}

.imagem-preview {
  margin-bottom: 16px;
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.my-profile-pic {
  width: 100%;
  max-width: 400px;

  @media (min-width: 1024px) {
    max-width: 500px;
  }

  @media (max-width: 600px) {
    max-width: 300px;
  }
}

.loading-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
}

.btn-maior {
  margin-top: 30px;
  padding: 10px;
  font-size: large;
  text-transform: uppercase;
}

.alinha {
  align-self: flex-start;
  padding: 12px 24px;
  font-size: 16px;
  margin-bottom: 16px;

  @media (max-width: 600px) {
    padding: 10px 16px;
    font-size: 14px;
  }
}

.btn-escuro {
  background-color: rgba(0, 0, 0, 0.66);
  color: $offwhite;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
}

.btn-salvar {
  padding: 12px 24px;
  font-size: 16px;
  text-transform: uppercase;
  font-weight: bold;

  @media (max-width: 600px) {
    padding: 10px 16px;
    font-size: 14px;
  }
}

// Estilos do modal de confirmação
.delete-dialog {
  min-width: 400px;
  border-radius: 12px;

  @media (max-width: 600px) {
    min-width: 90vw;
  }

  .text-h6 {
    font-weight: bold;
    color: $cumes-03;
  }

  .text-body1 {
    font-size: 16px;
    color: $offwhite;
  }

  .text-body2 {
    font-size: 14px;
  }
}

.btn-cancelar {
  padding: 8px 20px;
  font-size: 14px;
}

.btn-confirmar {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: bold;
}
</style>
