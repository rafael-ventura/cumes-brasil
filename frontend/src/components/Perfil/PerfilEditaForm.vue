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
        <div class="col-6 btn user-via-predileta" @click="isAddPreferidaModalOpen = true">
          <div class="text-h6 left-margem">Via Predileta</div>
          <div v-if="!viaPreferida" style="text-align: center">Clique aqui para adicionar uma Via</div>
          <ViaCardSmallSmall :via="viaPreferida"/>
        </div>
        <q-separator spaced/>
        <!-- Upload de Foto de Perfil -->
        <FotoPerfilUploader :fotoPerfil="fotoPerfil" @fotoChange="handleFotoChange"/>
        <!-- Botão de Submissão -->
        <q-btn type="submit" label="Salvar" class="q-mt-md btn"/>
        <!--
        <q-btn label="Excluir Conta" class="q-mt-md btn-red left-margem" @click="isDeleteAccountDialogOpen = true"/>-->
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
        <PerfilEditaFormAddPrediletaModal :viaPreferidaId="viaPreferidaId || ''" @viaPreferidaUpdate="viaPreferidaUpdate"/>
      </q-dialog>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue';
import { IUsuario } from 'src/models/IUsuario';
import UserService from 'src/services/UsuarioService';
import PerfilEditaFormAddPrediletaModal from 'components/Perfil/PerfilEditaFormAddPrediletaModal.vue';
import FotoPerfilUploader from 'components/Perfil/FotoPerfilUpload.vue';
import { Via } from 'src/models/Via';
import { formatDateToDDMMYYYY, formatDateToYYYYMMDD } from 'src/utils/utils';
import ViaCardSmallSmall from 'components/Via/ViaCardSmallSmall.vue';

const props = defineProps<{ user: IUsuario }>();
const emits = defineEmits(['submit', 'waiting']);

const handleFotoChange = (file: File | null) => {
  fotoFile.value = file;
};

const localUser = ref<IUsuario | null>(props.user ? { ...props.user } : null);
const nome = ref(localUser.value?.nome || '');
const email = ref(localUser.value?.email || '');
const dataAtividade = ref(localUser.value?.data_atividade);
const clubeOrganizacao = ref(localUser.value?.clube_organizacao || '');
const localizacao = ref(localUser.value?.localizacao || '');
const biografia = ref(localUser.value?.biografia || '');
const viaPreferidaId = ref(localUser.value?.via_preferida?.id.toString() || '');
const viaPreferidaNome = ref(localUser.value?.via_preferida?.nome || '');
const viaPreferida = ref(localUser.value?.via_preferida as Via || null);
const isAddPreferidaModalOpen = ref(false);
const fotoFile = ref<File | null>(null);
const formattedDataAtividade = ref(dataAtividade.value ? formatDateToYYYYMMDD(dataAtividade.value) : '');
const isDeleteAccountDialogOpen = ref(false);

console.log('id de PerfilEditaForm via predileta: ', localUser.value?.via_preferida?.id);
const fotoPerfil = ref(
  localUser.value?.foto_perfil.url ? localUser.value?.foto_perfil.url : ''
);

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      localUser.value = { ...newUser };
      nome.value = newUser.nome;
      email.value = newUser.email;
      dataAtividade.value = newUser.data_atividade;
      clubeOrganizacao.value = newUser.clube_organizacao || '';
      localizacao.value = newUser.localizacao || '';
      biografia.value = newUser.biografia || '';
      viaPreferida.value = newUser.via_preferida as Via;
      viaPreferidaId.value = newUser.via_preferida?.id.toString() || '';
      viaPreferidaNome.value = newUser.via_preferida?.nome || '';
      fotoPerfil.value = newUser.foto_perfil.url ? newUser.foto_perfil.url : '';
    }
  },
  {
    immediate: true
  }
);

// Métodos
const viaPreferidaUpdate = (newPreferida: Via) => {
  viaPreferida.value = newPreferida;
  viaPreferidaId.value = newPreferida.id.toString();
  viaPreferidaNome.value = newPreferida.nome;
  isAddPreferidaModalOpen.value = false;
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
      formData.append('via_preferida_id', viaPreferidaId.value);// é via_preferida_id mesmo
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

.user-via-predileta {
  min-width: max-content;
}

.edit-form {
  padding-left: 50px;
}

.btn {
  border-radius: 4px;
}
</style>
