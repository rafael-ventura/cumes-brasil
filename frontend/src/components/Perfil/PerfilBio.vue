<template>
  <div class="q-pa-md q-mb-md no-wrap top-margem fundo1 border-radius-large">
    <div class="row title-box border-radius-medium">
      <div class="text-h5 titulo">Bio</div>
      <q-icon name="edit" class="medium-icon right-margem icon" @click="toggleEditMode" />
    </div>
    <q-separator spaced />
    <div class="col text-left">
      <div v-if="!isEditing" class="text-h6 descricao-bio">{{ displayedBio }}</div>
      <q-input v-else v-model="newBio" type="textarea" class="custom-input" outlined/>
    </div><br/>
    <div v-if="isEditing">
      <q-btn flat label="Cancelar" class="btn-dark left-margem right-margem" @click="cancelEdit" />
      <q-btn flat label="Salvar" class="btn-dark" @click="saveBio" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, defineEmits } from 'vue';
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
  padding-top: 10px;
  background-color: $dark;
  height: 50px;
  width: max-content;
}
.titulo {
  margin-left: 5px;
  color: $cumes-01;
}
.icon{
  color: $dark;
  background-color: $cumes-01;
  border-radius: 5px;
  margin-left: 20px;
}
.descricao-bio{
  padding: 15px;
  border-radius: 10px;
  color: white;
  background-color: $dark;
  border: 2px solid $cumes-01;
}
.right-margem {
  margin-right: 16px;
}
.custom-input{
  background-color: $dark;
  border: 5px solid $cumes-01;
  border-radius: 10px;
  font-size: 20px;
  color: white;
}
</style>
