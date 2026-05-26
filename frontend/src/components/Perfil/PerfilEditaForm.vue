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
          <label class="field-label">Username *</label>
          <q-input
            id="username"
            v-model="username"
            type="text"
            placeholder="ex: joao_escalador"
            :rules="[
              val => !!val || 'Campo obrigatório',
              val => !val || /^[a-z0-9_]{3,30}$/.test(val.toLowerCase()) || 'Apenas letras minúsculas, números e _ (3-30 caracteres)'
            ]"
            outlined
            class="custom-input"
            dense
            @blur="username = username ? username.trim().toLowerCase() : ''"
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

        <div class="form-field">
          <label class="field-label">Link externo</label>
          <q-input
            id="linkExterno"
            v-model="linkExterno"
            type="text"
            placeholder="seusite.com"
            outlined
            class="custom-input"
            dense
            hint="Pode digitar só o domínio (ex: cumesbrasil.com)"
          />
        </div>

        <div class="form-field form-field-toggle">
          <label class="field-label">Perfil público</label>
          <q-toggle
            v-model="perfilPublico"
            color="cumes-01"
            label="Qualquer pessoa pode ver meu perfil e minhas escaladas no feed"
            class="toggle-perfil"
          />
        </div>

        <div class="form-field form-field-toggle">
          <label class="field-label">Conquistas públicas</label>
          <q-toggle
            v-model="conquistasPublico"
            color="cumes-01"
            label="Outras pessoas podem ver minhas conquistas"
            class="toggle-perfil"
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
const username = ref(localUser.value?.username || '');
const email = ref(localUser.value?.email || '');
const dataAtividade = ref(localUser.value?.data_atividade);
const clubeOrganizacao = ref(localUser.value?.clube_organizacao || '');
const localizacao = ref(localUser.value?.localizacao || '');
const linkExterno = ref(localUser.value?.link_externo || '');
const perfilPublico = ref(localUser.value?.perfil_publico !== false);
const conquistasPublico = ref(localUser.value?.conquistas_publico !== false);
const formattedDataAtividade = ref(dataAtividade.value ? formatDateToYYYYMMDD(dataAtividade.value) : '');
const isDeleteAccountDialogOpen = ref(false);

function normalizarLinkExterno(valor: string): string {
  const texto = (valor || '').trim();
  if (!texto) return '';

  const semProtocolo = texto.replace(/^https?:\/\//i, '');
  const semBarraFinal = semProtocolo.replace(/\/+$/, '');
  const comWww = semBarraFinal.startsWith('www.') ? semBarraFinal : `www.${semBarraFinal}`;

  return `https://${comWww}`;
}

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      localUser.value = { ...newUser };
      nome.value = newUser.nome;
      username.value = newUser.username || '';
      email.value = newUser.email;
      dataAtividade.value = newUser.data_atividade;
      clubeOrganizacao.value = newUser.clube_organizacao || '';
      localizacao.value = newUser.localizacao || '';
      linkExterno.value = newUser.link_externo || '';
      perfilPublico.value = newUser.perfil_publico !== false;
      conquistasPublico.value = newUser.conquistas_publico !== false;
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
    formData.append('username', username.value.trim().toLowerCase());
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
    const linkExternoNormalizado = normalizarLinkExterno(linkExterno.value);
    formData.append('link_externo', linkExternoNormalizado);
    formData.append('perfil_publico', String(perfilPublico.value));
    formData.append('conquistas_publico', String(conquistasPublico.value));
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
  max-height: 90vh;
  border-radius: 16px;
  margin: auto;
  background-color: $background;
  border: 2px solid $cumes-01;
  box-shadow: 0 8px 32px $box-shadow-dark;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
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
  background: linear-gradient(135deg, $cumes-01 0%, cumesDarken($cumes-01, 8%) 100%);
  padding: 18px 22px;
  border-bottom: 3px solid $cumes-03;
  flex-shrink: 0;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
  font-weight: 800;
  color: $offwhite;
  text-shadow: 0 2px 4px $text-shadow-default;

  .title-icon {
    color: $cumes-04;
  }
}

// Body do Card
.card-body {
  padding: 18px 22px;
  overflow-y: auto;
  overscroll-behavior: contain;

  @media (max-width: 600px) {
    padding: 16px 14px;
  }
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

// Form Fields
.form-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-field-toggle {
  .toggle-perfil :deep(.q-toggle__label) {
    color: $offwhite;
    font-size: 14px;
  }
}

.field-label {
  font-size: 12px;
  font-weight: 700;
  color: $cumes-04;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

// Custom Input Styling
.custom-input {
  :deep(.q-field__control) {
    background-color: rgba($offwhite, 0.98);
    border-radius: 10px;
    padding: 0 !important;
    min-height: 42px;
    
    &::before {
      border-color: rgba($cumes-01, 0.55);
      border-width: 1px;
    }
  }

  :deep(.q-field__native) {
    color: $background;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 12px !important;
  }

  :deep(input) {
    padding: 8px 12px !important;
  }

  :deep(input::placeholder) {
    color: rgba($background, 0.5);
  }

  &:deep(.q-field--focused) {
    .q-field__control::before {
      border-color: $cumes-03;
      border-width: 1.5px;
      box-shadow: 0 0 0 2px rgba($cumes-03, 0.12);
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
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba($cumes-03, 0.2);
  position: sticky;
  bottom: 0;
  background: linear-gradient(to top, rgba($background, 0.98), rgba($background, 0.92));
  z-index: 2;
}

// Custom Primary Button
.btn-primary-custom {
  background: $cumes-01 !important;
  color: $offwhite !important;
  padding: 9px 18px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  border-radius: 10px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px $box-shadow-medium !important;

  &:hover {
    background: cumesDarken($cumes-01, 10%) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 16px $box-shadow-strong !important;
  }

  &:active {
    transform: translateY(0) !important;
  }
}
</style>
