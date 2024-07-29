<template>
  <div class="profile-header-container no-wrap q-pa-md row items-center">
    <q-card-section>
      <img :src="user?.foto_perfil?.url || 'https://via.placeholder.com/150'" alt="Foto de Perfil"
           class="profile-picture"
           @click="expandImage(user?.foto_perfil?.url || 'https://via.placeholder.com/150')"/>
    </q-card-section>
    <q-card-section class="col text-left q-ml-md">
      <div class="text-h6">{{ user?.nome }}</div>
      <div class="text-subtitle1">{{ user?.email }}</div>
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
  background-color: #ededed;
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

</style>
