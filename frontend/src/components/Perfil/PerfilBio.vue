<template>
  <div class="div-externa">
    <div class="title-box">
      <div class="titulo">Bio</div>
      <q-icon name="edit" size="20px" class="icon" @click="toggleEditMode" />
    </div>
    <div class="content-wrapper">
      <div v-if="!isEditing" class="descricao-bio">{{ displayedBio }}</div>
      <q-input v-else v-model="newBio" type="textarea" class="custom-input" outlined/>
    </div>
    <div v-if="isEditing" class="actions-wrapper">
      <q-btn flat label="Cancelar" class="btn-secondary" @click="cancelEdit" />
      <q-btn flat label="Salvar" class="btn-primary" @click="saveBio" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import UserService from 'src/services/UsuarioService';
import { IUsuario } from 'src/models/IUsuario';

const props = defineProps<{ user?: IUsuario | null }>();
const emits = defineEmits(['bio-updated']);

const isEditing = ref(false);
const newBio = ref<string>(props.user?.biografia || '');

const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    newBio.value = props.user?.biografia || ''; // Aqui você garante que `newBio` tenha o valor atual de `bio` quando inicia a edição
  }
};

const cancelEdit = () => {
  newBio.value = props.user?.biografia || '';
  isEditing.value = false;
};

const saveBio = async () => {
  try {
    const bio = newBio.value?.trim() || '';
    await UserService.editarBio(bio);
    emits('bio-updated', newBio.value);
    isEditing.value = false;
  } catch (error) {
    console.error(error);
  }
};

const displayedBio = computed(() => props.user?.biografia || 'Nenhuma biografia disponível.');
</script>

<style scoped lang="scss">
@import "src/css/app.scss";
.title-box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 20px 0;
  background-color: transparent;
  height: auto;
  width: 100%;
  border-bottom: 2px solid rgba($cumes-03, 0.3);
  margin-bottom: 20px;
}
.titulo {
  color: $cumes-03;
  font-weight: 700;
  font-size: 22px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}
.icon{
  color: $cumes-03;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: $cumes-01;
    transform: scale(1.15);
  }
}
.descricao-bio{
  padding: 0;
  border-radius: 12px;
  color: $offwhite;
  background-color: transparent;
  border: none;
  font-size: 16px;
  line-height: 1.6;
  min-height: 100px;
}
.custom-input{
  background-color: $offwhite;
  border: 2px solid $cumes-01;
  border-radius: 12px;

  :deep(.q-field__control) {
    background-color: $offwhite;
    padding: 0 !important;
  }

  :deep(.q-field__native) {
    color: $background;
    font-size: 15px;
    font-weight: 500;
    min-height: 120px;
    padding: 12px !important;
  }

  :deep(textarea) {
    color: $background;
    line-height: 1.6;
    padding: 12px !important;
  }

  :deep(textarea::placeholder) {
    color: rgba($background, 0.5);
  }

  &:deep(.q-field--focused) {
    border-color: $cumes-03;

    .q-field__control {
      background-color: $offwhite;
    }
  }
}

.div-externa{
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.actions-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
