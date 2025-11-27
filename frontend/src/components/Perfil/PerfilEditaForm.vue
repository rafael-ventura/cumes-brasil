// src/components/Perfil/PerfilEditaForm.vue

<template>
  <q-card class="my-card">
    <q-card-section class="card-header">
      <div class="card-title">
        <q-icon name="edit" size="28px" class="title-icon" />
        <span>Editar Dados</span>
      </div>
    </q-card-section>

    <q-card-section class="card-body">
      <q-form @submit.prevent="onSubmit" class="edit-form">
        <div class="form-field">
          <label class="field-label">Nome *</label>
          <q-input
            id="nome"
            v-model="nome"
            type="text"
            placeholder="Digite seu nome"
            :rules="[ val => !!val || 'Campo obrigatório']"
            outlined
            required
            class="custom-input"
            dense
          />
        </div>

        <div class="form-field">
          <label class="field-label">Data de Atividade</label>
          <q-input
            id="date"
            v-model="formattedDataAtividade"
            type="date"
            outlined
            hide-icon
            class="custom-input"
            dense
          />
        </div>

        <div class="form-field">
          <label class="field-label">Clube ou Organização</label>
          <q-input
            id="clubeOrganizacao"
            v-model="clubeOrganizacao"
            type="text"
            placeholder="Seu clube ou organização"
            outlined
            class="custom-input"
            dense
          />
        </div>

        <div class="form-field">
          <label class="field-label">Localização</label>
          <q-input
            id="localizacao"
            v-model="localizacao"
            type="text"
            placeholder="Cidade, Estado"
            outlined
            class="custom-input"
            dense
          />
        </div>

        <!-- Botões -->
        <div class="form-actions">
          <q-btn 
            type="submit" 
            label="Salvar Alterações" 
            icon="save"
            class="btn-primary-custom"
            unelevated
            no-caps
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
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
  min-width: 320px;
  max-width: 500px;
  width: 92vw;
  border-radius: 16px;
  margin: auto;
  background-color: $background;
  border: 2px solid $cumes-01;
  box-shadow: 0 8px 32px $box-shadow-dark;
  overflow: hidden;
  
  @media (min-width: 768px) {
    width: 600px;
    max-width: 600px;
  }
  
  @media (min-width: 1024px) {
    width: 700px;
    max-width: 700px;
  }
  
  @media (min-width: 1440px) {
    width: 800px;
    max-width: 800px;
  }
}

// Header do Card
.card-header {
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 8%) 100%);
  padding: 24px 32px;
  border-bottom: 3px solid $cumes-03;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 800;
  color: $offwhite;
  text-shadow: 0 2px 4px $text-shadow-default;

  .title-icon {
    color: $cumes-04;
  }
}

// Body do Card
.card-body {
  padding: 32px;

  @media (max-width: 600px) {
    padding: 24px 20px;
  }
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

// Form Fields
.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 13px;
  font-weight: 700;
  color: $cumes-04;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

// Custom Input Styling
.custom-input {
  :deep(.q-field__control) {
    background-color: $offwhite;
    border-radius: 8px;
    padding: 0 !important;
    
    &::before {
      border-color: $cumes-01;
      border-width: 2px;
    }
  }

  :deep(.q-field__native) {
    color: $background;
    font-size: 15px;
    font-weight: 500;
    padding: 10px 14px !important;
  }

  :deep(input) {
    padding: 10px 14px !important;
  }

  :deep(input::placeholder) {
    color: rgba($background, 0.5);
  }

  &:deep(.q-field--focused) {
    .q-field__control::before {
      border-color: $cumes-03;
      border-width: 2px;
    }
  }

  &:deep(.q-field--error) {
    .q-field__control::before {
      border-color: $error-color;
    }
  }
}

// Form Actions
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba($cumes-03, 0.2);
}

// Custom Primary Button
.btn-primary-custom {
  background: $cumes-01 !important;
  color: $offwhite !important;
  padding: 12px 32px !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px $box-shadow-medium !important;

  &:hover {
    background: darken($cumes-01, 10%) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 16px $box-shadow-strong !important;
  }

  &:active {
    transform: translateY(0) !important;
  }
}
</style>
