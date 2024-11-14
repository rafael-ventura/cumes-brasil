<template>
  <div class="q-pa-md q-mb-md no-wrap top-margem fundo1 border-radius-large">
    <div class="row title-box border-radius-medium">
      <div class="text-h5 titulo">Bio</div>
      <q-icon name="edit" class="medium-icon right-margem icon" @click="toggleEditMode" />
    </div>
    <q-separator spaced />
    <q-card-section class="col text-left">
      <div v-if="!isEditing" class="text-h6">{{ displayedBio }}</div>
      <q-input v-else v-model="newBio" type="textarea" class="custom-input" outlined/>
    </q-card-section>
    <div v-if="isEditing">
      <q-btn flat label="Cancelar" class="btn-dark left-margem right-margem" @click="cancelEdit" />
      <q-btn flat label="Salvar" class="btn-dark" @click="saveBio" />
    </div>
  </div>
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
.title-box{
  padding-top: 10px;
  background-color: $dark;
  height: 50px;
  width: max-content;
}
.titulo {
  margin-left: 16px;
  color: $primary;
}
.icon{
  color: $dark;
  background-color: $primary;
  border-radius: 5px;
  margin-left: 20px;
}
.right-margem {
  margin-right: 16px;
}
.custom-input{
  background-color: $dark;
  border-radius: 10px;
  font-size: 20px;
  color: white;
}
.fundo1{
  background-color: $primary;
}
</style>
