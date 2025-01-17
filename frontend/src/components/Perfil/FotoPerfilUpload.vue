<template>
  <div class="foto-perfil-uploader">
    <q-file
      v-model="fotoFile"
      accept=".jpg, image/*"
      :max-file-size="2097152"
      @change="onFotoChange"
      @rejected="onFotoRejected"
      @input="onFileInput"
      style="display: none"
      ref="fileInput"
      outlined
      clearable
      clear-icon="close"
    />
    <q-btn
      flat
      icon="edit"
      class="btn alinha btn-escuro"
      @click="openFileDialog"
    />
    <q-separator spaced/>
    <div v-if="isLoading" class="loading-wrapper btn btn-maior btn-escuro">
      <q-spinner size="30px" color="primary" />
      <span>Carregando...</span>
    </div>
    <q-img v-if="fotoPreview" :src="fotoPreview" :ratio="1" class="my-profile-pic imagem-preview" />
    <q-btn
      v-if="fotoPreview"
      class="q-mt-sm btn btn-escuro"
      label="Salvar nova foto"
      @click="saveFoto"
      icon="save"
      dense
      flat
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, watch } from 'vue';
import { QRejectedEntry, useQuasar } from 'quasar';
import UserService from 'src/services/UsuarioService';

const emits = defineEmits(['closeDialogPai', 'submit']);
const $q = useQuasar();

const fotoFile = ref<File | null>(null);
const fotoPreview = computed(() => fotoFile.value ? URL.createObjectURL(fotoFile.value) : null);
const isLoading = ref(false);

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
        msg = 'O tamanho máximo da sua foto deve ser de 2MB.';
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

    const updatedUser = await UserService.editarDados(formData);

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
</script>

<style scoped lang="scss">
@import "src/css/app.scss";
.imagem-preview {
  margin-bottom: 16px;
}
.my-profile-pic {
  width: 100%;
}
.foto-perfil-uploader{
  display: flex;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15);
  flex-direction: column;
  align-items: center;
  border: 1px solid $cumes-03;
}
.loading-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}
.btn-maior{
  margin-top: 30px;
  padding: 10px;
  font-size: large;
  text-transform: uppercase;
}
.alinha{
  align-self: flex-start;
  padding: 10px;
}
.btn-escuro{
  background-color: rgba(0, 0, 0, 0.66);
}
</style>
