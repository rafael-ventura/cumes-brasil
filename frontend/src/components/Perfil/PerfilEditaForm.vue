// src/components/Perfil/PerfilEditaForm.vue

<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h6">Editar Dados:</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="onSubmit">
        <q-input v-model="nome" label="Nome" type="text" required />
        <q-input v-model="email" label="Email" type="email" required />
        <q-input v-model="formattedDataAtividade" label="Data de Atividade" type="date" />
        <q-input v-model="clubeOrganizacao" label="Clube ou Organização" type="text" />
        <q-input v-model="localizacao" label="Localização" type="text" />
        <q-input v-model="biografia" label="Biografia" type="textarea" />
        <q-separator spaced />
        <div class="row">
          <q-btn class="col-6" label="Via Predileta" color="secondary" @click="isAddPreferidaModalOpen = true" />
          <div class="col-6 align-center">{{ viaPreferidaNome }}</div>
        </div>
        <q-separator spaced />

        <!-- Seção de Upload da Foto de Perfil -->
        <div class="q-mt-md">
          <q-img :src="fotoPreview" :ratio="1" class="my-profile-pic" />
          <q-file
            v-model="fotoFile"
            label="Escolha uma nova foto de perfil"
            accept=".jpg, image/*"
            :max-file-size="2097152"
            @change="onFotoChange"
            @rejected="onFotoRejected"
          />
        </div>

        <!-- Botão de Submissão -->
        <q-btn type="submit" label="Salvar" color="primary" class="q-mt-md" />

      </q-form>
      <q-dialog v-model="isAddPreferidaModalOpen">
        <AddPreferidaModal :viaPreferidaId="viaPreferidaId" @viaPreferidaUpdate="viaPreferidaUpdate" />
      </q-dialog>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, ref } from 'vue';
import { Usuario } from 'src/models/Usuario';
import UserService from 'src/services/UsuarioService';
import AddPreferidaModal from 'components/Perfil/AddPreferidaModal.vue';
import { Via } from 'src/models/Via';
import { formatDateToDDMMYYYY, formatDateToYYYYMMDD } from 'src/utils/utils';
import ImageService from 'src/services/ImagemService';
import { QRejectedEntry, useQuasar } from 'quasar';

interface CustomRejectedEntry {
  failedPropValidation: boolean;
  file: File;
  reason: 'size' | 'type' | 'extension' | string;
}

const props = defineProps<{ user: Usuario }>();
const emits = defineEmits(['submit', 'waiting']);
const nome = ref(props.user.nome);
const email = ref(props.user.email);
const dataAtividade = ref(props.user.data_atividade);
const clubeOrganizacao = ref(props.user.clube_organizacao || '');
const localizacao = ref(props.user.localizacao || '');
const biografia = ref(props.user.biografia || '');
const viaPreferidaId = ref(props.user.via_preferida?.id.toString() || '');
const viaPreferidaNome = ref(props.user.via_preferida?.nome || '');
const viaPreferida = ref(props.user.via_preferida || null);
const isAddPreferidaModalOpen = ref(false);
const $q = useQuasar();

// Novas refs para upload de foto
const fotoFile = ref<File | null>(null);
const fotoPerfil = ref(
  props.user.foto_perfil?.url ? ImageService.getFullImageUrl(props.user.foto_perfil.url) : ''
);

const fotoPreview = computed(() => {
  if (fotoFile.value) {
    return URL.createObjectURL(fotoFile.value);
  } else if (fotoPerfil.value) {
    return fotoPerfil.value;
  } else {
    return 'caminho/para/imagem/padrao.png'; // Forneça o caminho para uma imagem padrão
  }
});

const formattedDataAtividade = ref(
  dataAtividade.value ? formatDateToYYYYMMDD(dataAtividade.value) : ''
);

// Métodos
const viaPreferidaUpdate = (newPreferida: Via) => {
  viaPreferida.value = newPreferida;
  viaPreferidaId.value = newPreferida.id.toString();
  viaPreferidaNome.value = newPreferida.nome;
  isAddPreferidaModalOpen.value = false;
};

const onFotoChange = () => {
  if (fotoFile.value) {
    // Se um novo arquivo for selecionado, limpe a URL existente de fotoPerfil
    fotoPerfil.value = '';
  }
};

interface ExtendedQRejectedEntry extends QRejectedEntry {
  reason: 'size' | 'type' | 'extension' | string;
}

const onFotoRejected = (rejectedEntries: QRejectedEntry[]) => {
  rejectedEntries.forEach(entry => {
    const extendedEntry = entry as ExtendedQRejectedEntry;
    let message = '';
    switch (extendedEntry.reason) {
      case 'size':
        message = `O arquivo "${entry.file.name}" é muito grande.`;
        break;
      case 'type':
      case 'extension':
        message = `O tipo do arquivo "${entry.file.name}" não é permitido.`;
        break;
      default:
        message = `O arquivo "${entry.file.name}" foi rejeitado.`;
    }
    $q.notify({
      type: 'negative',
      message: message
    });
  });
};

const onSubmit = async () => {
  try {
    const formData = new FormData();
    formData.append('nome', nome.value);
    formData.append('email', email.value);

    if (formattedDataAtividade.value) {
      formData.append('data_atividade', formatDateToDDMMYYYY(formattedDataAtividade.value));
    }
    if (clubeOrganizacao.value) {
      formData.append('clube_organizacao', clubeOrganizacao.value);
    }
    if (localizacao.value) {
      formData.append('localizacao', localizacao.value);
    }
    if (biografia.value) {
      formData.append('biografia', biografia.value);
    }
    if (viaPreferidaId.value) {
      formData.append('via_preferida_id', viaPreferidaId.value);
    }

    if (fotoFile.value) {
      console.log('Anexando arquivo ao FormData:', fotoFile.value);
      formData.append('foto_perfil', fotoFile.value);
    } else {
      console.log('Nenhum arquivo para anexar');
    }

    // Chamar o serviço com FormData
    await UserService.editarDados(formData);

    // Atualizar o usuário
    emits('submit' /* Dados atualizados do usuário */);
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.my-card {
  max-width: 400px;
  margin: auto;
}
.q-mt-md {
  margin-top: 16px;
}

.align-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
