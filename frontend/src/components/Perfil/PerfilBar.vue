<template>
  <div class="profile-header-container no-wrap q-pa-md row items-center shadow-item">
    <q-card-section>
      <img :src="user?.foto_perfil?.url || 'https://via.placeholder.com/150'" alt="Foto de Perfil"
           class="profile-picture"
           @click="expandImage(user?.foto_perfil?.url || 'https://via.placeholder.com/150')"/>
    </q-card-section>
    <q-card-section class="col text-left q-ml-md">
      <div class="text-h6">{{ user?.nome }}</div>
      <div class="info-list">
        <div v-for="(info, index) in userInfo" :key="index" class="info-item row items-center">
          <q-icon :name="info.icon" class="small-icon right-margem"/>
          <div class="text-subtitle1 info-text">{{ info.text }}</div>
        </div>
      </div>
    </q-card-section>
  </div>
  <q-dialog v-model="isImageModalOpen">
    <q-img :src="expandedImageUrl" style="min-width: 50vw; min-height: 50vh;"></q-img>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from 'vue';
import { Usuario } from 'src/models/Usuario';

const props = defineProps<{ user: Usuario }>();
const expandedImageUrl = ref('');
const isImageModalOpen = ref(false);

const expandImage = (url: string) => {
  expandedImageUrl.value = url;
  isImageModalOpen.value = true;
};

// Lista de informações do usuário para exibição
const userInfo = computed(() => [
  { icon: 'mail', text: props.user?.email || 'Email não disponível' },
  { icon: 'calendar_month', text: `Escalando desde: ${props.user?.data_atividade || 'Data não disponível'}` },
  { icon: 'groups_2', text: `Meu Clube/Organização: ${props.user?.clube_organizacao || 'Não disponível'}` },
  { icon: 'perm_media', text: `Minha Predileta: ${props.user?.via_preferida?.nome || 'Não disponível'}` },
  { icon: 'flag_circle', text: `De onde eu sou: ${props.user?.localizacao || 'Localização não disponível'}` }
]);
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  height: 10%;
}

.info-list {
  display: flex;
  flex-direction: column;
}

.info-item {
  display: flex;
  align-items: flex-start; /* Alinha o ícone e o texto no topo */
}

.right-margem {
  margin-right: 8px;
}

.info-text {
  flex: 1; /* Permite que o texto ocupe o espaço restante */
  word-wrap: break-word; /* Quebra o texto se for muito longo */
}

.profile-header-container{
  background-color: #bce9b4;
}
</style>
