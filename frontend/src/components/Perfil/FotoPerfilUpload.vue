<template>
  <div class="foto-perfil-uploader">
    <!-- Ações sobre a foto -->
    <q-btn
      round
      icon="edit"
      class="alinha"
      @click="abrirSeletor"
    >
      <q-tooltip>Selecionar nova foto</q-tooltip>
    </q-btn>
    <q-btn
      round
      flat
      icon="delete"
      class="btn-delete"
      @click="showDeleteDialog = true"
    >
      <q-tooltip>Excluir foto</q-tooltip>
    </q-btn>

    <q-file
      ref="fileInput"
      :model-value="fotoFile"
      accept=".jpg, .jpeg, .png, image/*"
      :max-file-size="1097152"
      style="display: none"
      @update:model-value="onFotoSelecionada"
      @rejected="onFotoRejected"
    />

    <div class="uploader-content">
      <!-- Estado de envio -->
      <div v-if="isLoading" class="loading-wrapper">
        <q-spinner size="30px" color="primary" />
        <span>Salvando...</span>
      </div>

      <!-- Preview da nova foto + ações -->
      <template v-else-if="fotoPreview">
        <q-img
          :src="fotoPreview"
          :ratio="1"
          class="my-profile-pic imagem-preview"
        />
        <div class="preview-acoes">
          <q-btn
            label="Cancelar"
            class="btn-secondary-custom"
            unelevated no-caps
            @click="cancelarSelecao"
          />
          <q-btn
            label="Salvar foto"
            icon="save"
            class="btn-primary-custom"
            unelevated no-caps
            @click="saveFoto"
          />
        </div>
      </template>

      <!-- Estado inicial: convite para trocar -->
      <div v-else class="estado-inicial">
        <q-icon name="add_a_photo" size="36px" />
        <span>Selecione uma nova foto de perfil</span>
        <q-btn
          label="Escolher foto"
          icon="photo_library"
          class="btn-primary-custom"
          unelevated no-caps
          @click="abrirSeletor"
        />
      </div>
    </div>

    <!-- Modal de confirmação de exclusão -->
    <q-dialog v-model="showDeleteDialog">
      <q-card class="delete-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Confirmar exclusão</div>
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
            label="Confirmar exclusão"
            color="negative"
            class="btn-confirmar"
            :loading="isDeleting"
            @click="deleteFoto"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { QRejectedEntry, useQuasar } from 'quasar';
import UserService from 'src/services/UsuarioService';

const emits = defineEmits(['closeDialogPai', 'submit']);
const $q = useQuasar();

const fileInput = ref<any>(null);
const fotoFile = ref<File | null>(null);
const fotoPreview = ref<string | null>(null);
const isLoading = ref(false);
const showDeleteDialog = ref(false);
const isDeleting = ref(false);

/** Libera o blob URL atual para evitar vazamento de memória. */
function revogarPreview () {
  if (fotoPreview.value) {
    URL.revokeObjectURL(fotoPreview.value);
    fotoPreview.value = null;
  }
}

function abrirSeletor () {
  fileInput.value?.pickFiles();
  // Limpa a imagem de fundo do dialog pai enquanto o usuário escolhe/preview.
  emits('closeDialogPai', true);
}

function onFotoSelecionada (file: File | null) {
  revogarPreview();
  if (file) {
    fotoFile.value = file;
    fotoPreview.value = URL.createObjectURL(file);
  } else {
    fotoFile.value = null;
    emits('closeDialogPai', false);
  }
}

function cancelarSelecao () {
  revogarPreview();
  fotoFile.value = null;
  emits('closeDialogPai', false);
}

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
    $q.notify({ type: 'negative', message: msg });
  });
};

const saveFoto = async () => {
  if (!fotoFile.value) {
    $q.notify({ type: 'negative', message: 'Nenhuma foto foi selecionada.' });
    return;
  }

  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('foto_perfil', fotoFile.value);
    const updatedUser = await UserService.editarFotoPerfil(formData);

    $q.notify({ type: 'positive', message: 'Foto atualizada com sucesso!' });
    revogarPreview();
    fotoFile.value = null;
    emits('submit', updatedUser);
  } catch (error) {
    console.error('Erro ao salvar a foto:', error);
    $q.notify({ type: 'negative', message: 'Erro ao atualizar a foto. Tente novamente.' });
  } finally {
    isLoading.value = false;
  }
};

const deleteFoto = async () => {
  isDeleting.value = true;
  try {
    await UserService.excluirFotoPerfil();
    $q.notify({ type: 'positive', message: 'Foto excluída com sucesso! Foto padrão aplicada.' });
    revogarPreview();
    fotoFile.value = null;
    showDeleteDialog.value = false;
    emits('submit');
  } catch (error) {
    console.error('Erro ao excluir a foto:', error);
    $q.notify({ type: 'negative', message: 'Erro ao excluir a foto. Tente novamente.' });
  } finally {
    isDeleting.value = false;
  }
};

onBeforeUnmount(revogarPreview);
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.foto-perfil-uploader {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: rgba($background, 0.15);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid $cumes-03;
  padding: 16px;
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 600px) {
    padding: 12px;
  }
}

.btn-delete {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  background-color: cumesDarken($error-color, 0.9);
  color: $offwhite;
  transition: all 0.3s ease;

  &:hover {
    background-color: cumesDarken($error-color, 10%);
    transform: scale(1.1);
  }

  @media (max-width: 600px) {
    top: 8px;
    right: 8px;
  }
}

.alinha {
  background-color: $cumes-01;
  color: $offwhite;
  position: absolute;
  top: 12px;
  right: 60px;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background-color: cumesDarken($cumes-01, 10%);
    transform: scale(1.1);
  }

  @media (max-width: 600px) {
    top: 8px;
    right: 60px;
  }
}

.uploader-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.estado-inicial {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 16px;
  color: rgba($offwhite, 0.8);
  text-align: center;
  font-weight: 600;

  .q-icon { color: $cumes-03; }
}

.imagem-preview {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px $box-shadow-dark;
}

.my-profile-pic {
  width: 100%;
  max-width: 400px;

  @media (min-width: 1024px) { max-width: 500px; }
  @media (max-width: 600px) { max-width: 300px; }
}

.preview-acoes {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.loading-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 24px;
  color: $offwhite;
  font-weight: 600;
}

// Botões padronizados (design system)
.btn-primary-custom {
  background: $cumes-01 !important;
  color: $offwhite !important;
  border-radius: 8px !important;
  font-weight: 700 !important;
  padding: 10px 24px !important;

  &:hover { background: cumesDarken($cumes-01, 10%) !important; }
}

.btn-secondary-custom {
  background: transparent !important;
  color: $cumes-01 !important;
  border: 2px solid $cumes-01 !important;
  border-radius: 8px !important;
  font-weight: 700 !important;
  padding: 10px 24px !important;

  &:hover { background: rgba($cumes-01, 0.1) !important; }
}

// Modal de confirmação de exclusão
.delete-dialog {
  min-width: 400px;
  border-radius: 12px;
  background-color: $offwhite;
  border: 2px solid $error-color;

  @media (max-width: 600px) { min-width: 90vw; }

  .text-h6 { font-weight: 700; color: $error-color; font-size: 20px; }
  .text-body1 { font-size: 16px; color: $background; font-weight: 500; }
  .text-body2 { font-size: 14px; color: $cumes-02; }
}

.btn-cancelar {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  background-color: rgba($cumes-01, 0.1);
  color: $cumes-01;
  border-radius: 8px;

  &:hover { background-color: rgba($cumes-01, 0.2); }
}

.btn-confirmar {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 700;
  background-color: $error-color;
  color: $offwhite;
  border-radius: 8px;

  &:hover { background-color: cumesDarken($error-color, 10%); }
}
</style>
