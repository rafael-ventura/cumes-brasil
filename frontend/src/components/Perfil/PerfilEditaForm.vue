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
        <q-btn flat label="Alterar Foto de Perfil" class="q-mt-md right-margem" />
        <q-btn type="submit" label="Salvar" color="primary" class="q-mt-md" />
      </q-form>
      <q-dialog v-model="isAddPreferidaModalOpen">
        <AddPreferidaModal :viaPreferidaId="viaPreferidaId" @viaPreferidaUpdate="viaPreferidaUpdate" />
      </q-dialog>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue';
import { Usuario } from 'src/models/Usuario';
import UserService from 'src/services/UsuarioService';
import AddPreferidaModal from 'components/Perfil/AddPreferidaModal.vue';
import { Via } from 'src/models/Via';

const props = defineProps<{ user: Usuario }>();
const emits = defineEmits(['submit', 'waiting']);

const nome = ref(props.user.nome);
const email = ref(props.user.email);
const fotoPerfil = ref(props.user.foto_perfil?.url);
const clubeOrganizacao = ref(props.user.clube_organizacao || '');
const localizacao = ref(props.user.localizacao || '');
const biografia = ref(props.user.biografia || '');
const viaPreferidaId = ref(props.user.via_favorita?.id.toString() || '');
const viaPreferidaNome = ref(props.user.via_favorita?.nome || '');
const viaPreferida = ref(props.user.via_favorita || null);

const isAddPreferidaModalOpen = ref(false);

const formattedDataAtividade = ref(
  props.user.data_atividade
    ? new Date(props.user.data_atividade).toISOString().split('T')[0] // Format to 'YYYY-MM-DD'
    : ''
);

watch(formattedDataAtividade, (newVal) => {
  dataAtividade.value = newVal ? new Date(newVal) : null;
});

const dataAtividade = ref(props.user.data_atividade ? new Date(props.user.data_atividade) : null);

const viaPreferidaUpdate = (newPreferida: Via) => {
  viaPreferida.value = newPreferida;
  viaPreferidaId.value = newPreferida.id.toString();
  viaPreferidaNome.value = newPreferida.nome;
  isAddPreferidaModalOpen.value = false;
};

const onSubmit = async () => {
  try {
    const updatedUser = {
      ...props.user,
      nome: nome.value,
      email: email.value,
      foto_perfil: fotoPerfil.value ? { url: fotoPerfil.value } : null,
      data_atividade: formattedDataAtividade.value ? new Date(formattedDataAtividade.value).toUTCString() : null,
      clube_organizacao: clubeOrganizacao.value || null,
      localizacao: localizacao.value || null,
      biografia: biografia.value || null,
      via_favorita: viaPreferida.value ? { id: viaPreferidaId.value, nome: viaPreferidaNome.value } : null
    };
    await UserService.editarDados(updatedUser);
    emits('submit', updatedUser);
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
.right-margem {
  margin-right: 16px;
}
.align-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
