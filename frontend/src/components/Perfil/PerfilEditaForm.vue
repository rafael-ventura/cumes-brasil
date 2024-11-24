// src/components/Perfil/PerfilEditaForm.vue

<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h6">Editar Dados:</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="onSubmit">
        <q-input v-model="nome" label="Nome" type="text" required maxlength="35"/>
        <q-input v-model="email" label="Email" type="email" required mask="email" />
        <q-input v-model="formattedDataAtividade" label="Data de Atividade" type="date" />
        <q-input v-model="clubeOrganizacao" label="Clube ou Organização" type="text" />
        <q-input v-model="localizacao" label="Localização" type="text" />
        <q-input v-model="biografia" label="Biografia" type="textarea"  autogrow />
        <q-separator spaced />
        <div class="row">
          <q-btn class="col-12 btn align-center" label="Via Predileta" @click="isAddPreferidaModalOpen = true" icon="edit"/>
          <div class="align-center">
            <q-icon name="forest" /> {{ viaPreferidaNome }}
          </div>
        </div>
        <q-separator spaced />

        <!-- Seção de Upload da Foto de Perfil -->
        <div class="q-mt-md">
          <q-file
            class="q-mt-md q-mb-sm"
            v-model="fotoFile"
            label="Escolha uma nova foto"
            accept=".jpg, image/*"
            :max-file-size="2097152"
            @change="onFotoChange"
            @rejected="onFotoRejected"
            clearable
            clear-icon="close"
          />
          <q-img :src="fotoPreview" :ratio="1" class="my-profile-pic"/>
          <q-btn
            v-if="fotoPerfil && !fotoPerfil.endsWith('/assets/usuario-default-01.jpg')"
            class="q-mt-sm"
            label="Remover foto de perfil"
            @click="removeFotoPerfil"
            icon="delete"
            dense
            flat
          />
        </div>
        <q-separator spaced />

        <!-- Botão de Submissão -->
        <q-btn type="submit" label="Salvar" class="q-mt-md btn" />

      </q-form>
      <q-dialog v-model="isAddPreferidaModalOpen">
        <AddPreferidaModal :viaPreferidaId="viaPreferidaId" @viaPreferidaUpdate="viaPreferidaUpdate" class="fundoEditarVia"/>
      </q-dialog>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue';
import { IUsuario } from 'src/models/IUsuario';
import UserService from 'src/services/UsuarioService';
import AddPreferidaModal from 'components/Perfil/AddPreferidaModal.vue';
import { Via } from 'src/models/Via';
import { formatDateToDDMMYYYY, formatDateToYYYYMMDD } from 'src/utils/utils';
import ImageService from 'src/services/ImagemService';
import { QRejectedEntry, useQuasar } from 'quasar';

const props = defineProps<{ user: IUsuario }>();
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
const fotoFile = ref<File | null>(null);
const fotoPerfil = ref(
  props.user.foto_perfil.url ? props.user.foto_perfil.url : ''
);
const fotoPreview = computed(() => {
  if (fotoFile.value) {
    console.log(URL.createObjectURL(fotoFile?.value));
  }
  console.log(fotoPerfil.value);
  return fotoFile.value ? URL.createObjectURL(fotoFile.value) : fotoPerfil.value;
});

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      nome.value = newUser.nome;
      email.value = newUser.email;
      dataAtividade.value = newUser.data_atividade;
      clubeOrganizacao.value = newUser.clube_organizacao || '';
      localizacao.value = newUser.localizacao || '';
      biografia.value = newUser.biografia || '';
      viaPreferidaId.value = newUser.via_preferida?.id.toString() || '';
      viaPreferidaNome.value = newUser.via_preferida?.nome || '';
      fotoPerfil.value = newUser.foto_perfil.url ? newUser.foto_perfil.url : '';
    }
  },
  {
    immediate: true,
    deep: true
  }
);

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
      formData.append('via_preferida', viaPreferidaId.value);
    }

    if (fotoFile.value) {
      console.log('Foto selecionada:', fotoFile.value);
      formData.append('foto_perfil', fotoFile.value);
    } else {
      console.log('Nenhuma foto selecionada');
      // Se não houver foto, enviar a foto padrão (ID 3)
      formData.append('removerFoto', 'true');
    }

    // Chamar o serviço com FormData e obter o usuário atualizado
    const updatedUser = await UserService.editarDados(formData);

    nome.value = updatedUser.nome;
    email.value = updatedUser.email;
    dataAtividade.value = updatedUser.data_atividade;
    formattedDataAtividade.value = updatedUser.data_atividade
      ? formatDateToYYYYMMDD(updatedUser.data_atividade)
      : '';
    clubeOrganizacao.value = updatedUser.clube_organizacao || '';
    localizacao.value = updatedUser.localizacao || '';
    biografia.value = updatedUser.biografia || '';
    viaPreferidaId.value = updatedUser.via_preferida?.id.toString() || '';
    viaPreferidaNome.value = updatedUser.via_preferida?.nome || '';
    viaPreferida.value = updatedUser.via_preferida || null;
    fotoPerfil.value = updatedUser.foto_perfil?.url
      ? ImageService.getFullImageUrl(updatedUser.foto_perfil.url)
      : '';
    emits('submit', updatedUser);
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped lang="scss">
@import "src/css/app.scss";
.my-card {
  min-width: 250px;
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
.fundoEditarVia{
  background-color: $primary-light;
}
</style>
