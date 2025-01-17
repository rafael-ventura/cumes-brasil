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
          :rules="[ val => !!val || 'Campo obrigatório']"
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
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { IUsuario } from 'src/models/IUsuario';
import UserService from 'src/services/UsuarioService';
import { formatDateToDDMMYYYY, formatDateToYYYYMMDD } from 'src/utils/utils';

const props = defineProps<{ user: IUsuario }>();
const emits = defineEmits(['submit', 'waiting']);
const $q = useQuasar();

const localUser = ref<IUsuario | null>(props.user ? { ...props.user } : null);
const nome = ref(localUser.value?.nome || '');
const email = ref(localUser.value?.email || '');
const dataAtividade = ref(localUser.value?.data_atividade);
const clubeOrganizacao = ref(localUser.value?.clube_organizacao || '');
const localizacao = ref(localUser.value?.localizacao || '');
const formattedDataAtividade = ref(dataAtividade.value ? formatDateToYYYYMMDD(dataAtividade.value) : '');
const isDeleteAccountDialogOpen = ref(false);

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
    }
  },
  {
    immediate: true
  }
);

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
    } else {
      // Se não houver foto, enviar a foto padrão (ID 3)
      formData.append('removerFoto', 'true');
    }
    // Chamar o serviço com FormData e obter o usuário atualizado
    const updatedUser = await UserService.editarDados(formData);
    emits('submit', updatedUser);
    $q.notify({
      type: 'positive',
      message: 'Dados atualizados com sucesso!'
    });
  } catch (error) {
    console.error(error);
    // Adicionar notificação de erro
    $q.notify({
      type: 'negative',
      message: 'Erro ao atualizar os dados. Tente novamente.'
    });
  }
};
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.my-card {
  min-width: 280px;
  border-radius: 10px;
  margin: auto;
  background-color: $dark;
  color: $cumes-01;
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
