// src/components/Perfil/PerfilEditaForm.vue

<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h6">Editar Dados:</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="onSubmit">
        <q-input
          id="nome"
          v-model="nome"
          type="text"
          label="Nome"
          color="primary"
          :rules="[val => !!val || 'Campo obrigatório']"
          outlined
          required
        />
        <q-separator spaced/>
        <q-input
          id="date"
          v-model="formattedDataAtividade"
          type="date"
          label="Data de Atividade"
          color="primary"
          outlined
          hide-icon
        ></q-input>
        <q-separator spaced/>
        <q-input
          id="clubeOrganizacao"
          v-model="clubeOrganizacao"
          type="text"
          label="Clube ou Organização"
          color="primary"
          outlined
        />
        <q-separator spaced/>
        <q-input
          id="localizacao"
          v-model="localizacao"
          type="text"
          label="Localização"
          color="primary"
          outlined
        />
        <q-separator spaced/>
        <q-input
          id="biografia"
          v-model="biografia"
          type="textarea"
          label="Biografia"
          color="primary"
          outlined
        />
        <q-separator spaced/>
        <q-btn class="col-6 btn user-via-predileta" label="Via Predileta" @click="isAddPreferidaModalOpen = true"/>
        <div class="col-6 align-center">{{ viaPreferidaNome }}</div>
        <q-separator spaced/>
        <!-- Upload de Foto de Perfil -->
        <FotoPerfilUploader :fotoPerfil="fotoPerfil" @fotoChange="handleFotoChange"/>
        <!-- Botão de Submissão -->
        <q-btn type="submit" label="Salvar" class="q-mt-md btn"/>
        <q-btn disabled label="Excluir Conta" class="q-mt-md btn-red left-margem" @click="isDeleteAccountDialogOpen = true"
        />
        <!-- Pop-up de aviso ao clicar em excluir conta -->
        <q-dialog v-model="isDeleteAccountDialogOpen">
          <q-card style="background-color: #2c2c2c; color: #FCBD7BFF">
            <q-card-section class="row items-center">
              <div class="text-h6">Aviso</div>
            </q-card-section>
            <q-card-section>
              <p>A função de exclusão de conta ainda não está disponível. Por favor, tente novamente mais tarde.</p>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" @click="isDeleteAccountDialogOpen = false" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-form>
      <q-dialog v-model="isAddPreferidaModalOpen">
        <AddPrediletaModal :viaPreferidaId="viaPreferidaId" @viaPreferidaUpdate="viaPreferidaUpdate"
                           class="fundoEditarVia"/>
      </q-dialog>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue';
import { IUsuario } from 'src/models/IUsuario';
import UserService from 'src/services/UsuarioService';
import AddPrediletaModal from 'components/Perfil/PerfilEditaFormAddPrediletaModal.vue';
import FotoPerfilUploader from 'components/Perfil/FotoPerfilUpload.vue';
import { Via } from 'src/models/Via';
import { formatDateToDDMMYYYY, formatDateToYYYYMMDD } from 'src/utils/utils';
import ImageService from 'src/services/ImagemService';

const props = defineProps<{ user: IUsuario }>();
const emits = defineEmits(['submit', 'waiting']);

const handleFotoChange = (file: File | null) => {
  fotoFile.value = file;
};

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
const fotoFile = ref<File | null>(null);
const formattedDataAtividade = ref(dataAtividade.value ? formatDateToYYYYMMDD(dataAtividade.value) : '');
const isDeleteAccountDialogOpen = ref(false);

console.log('nome da via predileta: ', props.user?.via_preferida?.id);
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

// Métodos
const viaPreferidaUpdate = (newPreferida: Via) => {
  viaPreferidaId.value = newPreferida.id.toString();
  viaPreferidaNome.value = newPreferida.nome;
  viaPreferida.value = newPreferida;
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
    emits('submit', updatedUser);
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.my-card {
  min-width: 280px;
  border-radius: 10px;
  margin: auto;
  background-color: #2C2C2CF4;
  color: $primary;
}

.q-mt-md {
  margin-top: 16px;
}

.align-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.fundoEditarVia {
  background-color: $dark;
}

.user-via-predileta {
  min-width: max-content;
}

.edit-form {
  padding-left: 50px;
}
</style>
