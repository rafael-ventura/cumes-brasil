<template>
  <div class="profile-header-container no-wrap q-pa-md row items-center shadow-item">
    <q-card-section>
      <img :src="user?.foto_perfil?.url || 'https://via.placeholder.com/150'" alt="Foto de Perfil"
           class="profile-picture"
           @click="expandImage(user?.foto_perfil?.url || 'https://via.placeholder.com/150')"/>
    </q-card-section>
    <q-card-section class="col text-left q-ml-md">
      <div class="text-h6">{{ user?.nome }}</div>
      <div class="row items-center">
        <q-icon name="mail" class="small-icon right-margem"/>
        <div class="text-subtitle1">{{ user?.email }}</div>
      </div>
      <div class="row items-center">
        <q-icon name="calendar_month" class="small-icon right-margem"/>
        <div class="text-subtitle1">Escalando desde: {{ user?.data_atividade}}</div>
      </div>
      <div class="row items-center">
        <q-icon name="groups_2" class="small-icon right-margem"/>
        <div class="text-subtitle1">Meu Clube/Organização: {{ user?.clube_organizacao}}</div>
      </div>
      <div class="row items-center">
        <q-icon name="perm_media" class="small-icon right-margem"/>
        <div class="text-subtitle1">Minha Via favorita: {{ user?.via_favorita?.nome}}</div>
      </div>
      <div class="row items-center">
        <q-icon name="flag_circle" class="small-icon right-margem"/>
        <div class="text-subtitle1">De onde eu sou: {{ user?.localizacao}}</div>
      </div>
    </q-card-section>
  </div>
  <q-dialog v-model="isImageModalOpen">
    <q-img :src="expandedImageUrl" style="min-width: 50vw; min-height: 50vh;"></q-img>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { Usuario } from 'src/models/Usuario';

defineProps<{ user: Usuario }>();
const expandedImageUrl = ref('');
const isImageModalOpen = ref(false);

const expandImage = (url: string) => {
  expandedImageUrl.value = url;
  isImageModalOpen.value = true;
};
</script>

<style scoped>
.profile-header-container {
  border-radius: 0 0 30px 30px;
  flex-direction: column;
  align-items: flex-start;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}

.shadow-item {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); /* Ajuste os valores conforme necessário */
  display: flex; /* Torna o item um contêiner flexível */
  height: 100%; /* Faz com que o item ocupe toda a altura disponível da coluna */
}

</style>
