<template>
  <div class="foto-perfil-uploader">
    <!-- Visualização da Imagem -->
    <div v-if="imagemCarregada" class="imagem-preview">
      <q-img :src="fotoPreview ?? undefined" :ratio="1" class="my-profile-pic" />
    </div>

    <!-- Upload do Arquivo -->
    <q-file
      v-model="fotoFile"
      label="Escolha uma nova foto de perfil"
      accept=".jpg, image/*"
      :max-file-size="2097152"
      @change="onFotoChange"
      @rejected="onFotoRejected"
      outlined
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

// Tratamento de arquivos rejeitados
interface ExtendedQRejectedEntry extends QRejectedEntry {
  reason: 'size' | 'type' | 'extension' | string;
}

const onFotoRejected = (rejectedEntries: QRejectedEntry[]) => {
  rejectedEntries.forEach(entry => {
    const extendedEntry = entry as ExtendedQRejectedEntry;
    let msg = '';
    switch (extendedEntry.reason) {
      case 'size':
        msg = `O arquivo "${entry.file.name}" é muito grande.`;
        break;
      case 'type':
      case 'extension':
        msg = `O tipo do arquivo "${entry.file.name}" não é permitido.`;
        break;
      default:
        msg = `O arquivo "${entry.file.name}" foi rejeitado.`;
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
