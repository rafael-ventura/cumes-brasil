<template>
  <div class="foto-perfil-uploader">
    <!-- Upload do Arquivo -->
    <q-file
      v-model="fotoFile"
      label="Escolha uma nova foto de perfil"
      accept=".jpg, image/*"
      :max-file-size="2097152"
      @change="onFotoChange"
      @rejected="onFotoRejected"
      outlined
      clearable
      clear-icon="close"
    />
    <q-img  v-if="imagemCarregada" :src="fotoPreview ?? undefined" :ratio="1" class="my-profile-pic imagem-preview" />
    <q-btn
      v-if="imagemCarregada && !fotoPerfil.endsWith('/assets/usuario-default-01.jpg')"
      class="q-mt-sm btn"
      label="Remover foto de perfil"
      @click="removeFotoPerfil"
      icon="delete"
      dense
      flat
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, watch } from 'vue';
import { QRejectedEntry, useQuasar } from 'quasar';

const emits = defineEmits(['fotoChange']);
const $q = useQuasar();

const fotoFile = ref<File | null>(null);
const fotoPerfil = ref('');
const imagemCarregada = ref(false);

// Computed para pré-visualizar a imagem carregada ou existente
const fotoPreview = computed(() => {
  if (imagemCarregada.value && fotoFile.value) {
    return URL.createObjectURL(fotoFile.value);
  }
  if (!imagemCarregada.value && fotoPerfil.value) {
    return fotoPerfil.value;
  }
  return undefined;
});

// Observador para emitir mudanças no arquivo de foto
watch(fotoFile, (newFile) => {
  imagemCarregada.value = !!newFile;
  emits('fotoChange', newFile); // Emite o novo arquivo para o componente pai
});

// Metodo de tratamento de mudança na foto
const onFotoChange = () => {
  imagemCarregada.value = !!fotoFile.value;
};

const removeFotoPerfil = async () => {
  // Atribui a foto padrão ao campo fotoPerfil
  fotoPerfil.value = '/assets/usuario-default-01.jpg'; // Caminho da foto padrão
  fotoFile.value = null; // Limpa o arquivo selecionado
};

const onFotoRejected = (rejectedEntries: QRejectedEntry[]) => {
  rejectedEntries.forEach(entry => {
    let msg = '';
    console.log(entry);

    // Verificando o motivo da rejeição através de failedPropValidation
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
</script>

<style scoped lang="scss">
.imagem-preview {
  margin-bottom: 16px;
}
.my-profile-pic {
  border-radius: 50%;
}
</style>
