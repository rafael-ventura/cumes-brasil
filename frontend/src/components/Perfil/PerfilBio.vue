<template>
  <q-card class="q-pa-md q-mb-md no-wrap top-margem shadow-item border-radius-large fundo1">
    <div class="row justify-between">
      <div class="text-h5 left-margem">Bio</div>
      <q-icon name="edit" class="medium-icon right-margem" @click="toggleEditMode" />
    </div>
    <q-separator spaced />
    <q-card-section class="col text-left">
      <div v-if="!isEditing" class="text-h6">{{ displayedBio }}</div>
      <q-input v-else v-model="newBio" type="textarea" class="custom-input fundo2"/>
    </q-card-section>
    <div v-if="isEditing" class="">
      <q-btn flat label="Cancelar" @click="cancelEdit" />
      <q-btn flat label="Salvar" color="tertiary" class="custom-save-button" @click="saveBio" />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, computed, defineEmits } from 'vue';
import { IUsuario } from 'src/models/IUsuario';
import UserService from 'src/services/UsuarioService';

const props = defineProps<{ user: IUsuario }>();
const emits = defineEmits(['bio-updated']);

const isEditing = ref(false);
const newBio = ref('');

watch(
  () => props.user,
  (newVal) => {
    if (newVal) {
      newBio.value = newVal.biografia || '';
    }
  },
  { immediate: true }
);

const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
};

const cancelEdit = () => {
  newBio.value = props.user?.biografia || '';
  isEditing.value = false;
};

const saveBio = async () => {
  try {
    await UserService.editarBio(newBio.value);
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
.left-margem {
  margin-left: 16px;
}
.right-margem {
  margin-right: 16px;
}
.custom-save-button {
  background-color: $secondary-dark;
}
.custom-input{
  background-color: #9fd191;
  border-radius: 10px;
  font-size: 20px;
  padding: 10px 10px;
  width: 100%;
  height: 150px;
}
.fundo1{
  background-color: $primary;
}
.fundo2{
  background-color: $primary-dark;
}
</style>
