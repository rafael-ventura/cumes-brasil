<template>
  <div class="profile-card-container">
    <div class="profile-header">
      <div class="profile-row">
        <div class="profile-picture-container">
          <img
            :src="localUser?.foto_perfil?.url || 'https://via.placeholder.com/150'"
            alt="Foto de Perfil"
            class="profile-picture"
            @click="expandImage(props.user?.foto_perfil?.url || 'https://via.placeholder.com/150')"
          />
        </div>
        <div class="escalando-info">
          <div class="dias-escalando">
            <div class="label">Escalando há</div>
            <div class="dias-count">{{ diasEscalados }} dias</div>
          </div>
          <div class="anos-escalando">
            <div class="anos-count">{{ anosEscalando }}</div>
            <div class="data-label">
              Desde <span class="data-formatada">{{ dataFormatada }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="user-details">
        <div class="user-name">{{ props.user?.nome }}</div>
        <div class="user-location">{{ props.user?.localizacao }}</div>
        <div class="user-club" v-if="props.user?.clube_organizacao">{{ props.user.clube_organizacao }}</div>
      </div>
    </div>
    <q-dialog v-model="isImageModalOpen">
      <q-img :src="expandedImageUrl" style="min-width: 50vw; min-height: 50vh;">
        <template v-slot:default>
          <FotoPerfilUpload @closeDialogPai="closeImagePai" @submit="updateUserFotoPerfil" />
        </template>
      </q-img>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import FotoPerfilUpload from 'components/Perfil/FotoPerfilUpload.vue';
import { IUsuario } from 'src/models/IUsuario';

const props = defineProps<{ user: IUsuario | undefined }>();
const emits = defineEmits(['submit']);

const localUser = ref<IUsuario | undefined>(props.user);
const isImageModalOpen = ref(false);
const expandedImageUrl = ref<string | undefined>(undefined);

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      localUser.value = newUser;
      expandedImageUrl.value = newUser.foto_perfil?.url || 'https://via.placeholder.com/150';
    }
  },
  { immediate: true }
);

const expandImage = (url: string) => {
  expandedImageUrl.value = url;
  isImageModalOpen.value = true;
};

const closeImagePai = (fecharImagem: boolean) => {
  if (fecharImagem) {
    expandedImageUrl.value = undefined;
  }
};

const updateUserFotoPerfil = (updatedUser: IUsuario) => {
  emits('submit', updatedUser);
  isImageModalOpen.value = false;
};

const diasEscalados = computed(() => {
  if (!props.user?.data_atividade) return 0;
  const partesData = props.user.data_atividade.split('/');
  const dataAtividade = new Date(`${partesData[2]}-${partesData[1]}-${partesData[0]}`);
  const hoje = new Date();
  return Math.floor((hoje.getTime() - dataAtividade.getTime()) / (1000 * 60 * 60 * 24));
});

const anosEscalando = computed(() => {
  return `${Math.floor(diasEscalados.value / 365)} ano(s)`;
});

const dataFormatada = computed(() => {
  if (!props.user?.data_atividade) return '';
  const partesData = props.user.data_atividade.split('/');
  const dataAtividade = new Date(`${partesData[2]}-${partesData[1]}-${partesData[0]}`);
  const dataString = dataAtividade.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });
  return dataString.charAt(0).toUpperCase() + dataString.slice(1);
});
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.profile-card-container {
  padding: 16px;
  background-color: $cumes-05;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin: auto;
}

.profile-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  align-items: center;
  gap: 16px;
}

.profile-picture-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-picture {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 3px solid $cumes-04;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.user-details {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.user-name {
  font-size: 20px;
  font-weight: bold;
  color: $cumes-04;
}

.user-location,
.user-club {
  font-size: 16px;
  color: $cumes-04;
}

.escalando-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-left: auto;
  padding-left: 30px;
}

.dias-escalando{
  margin-top: 3rem;
}

.anos-escalando {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.label {
  font-size: 14px;
  color: $cumes-04;
}

.dias-count,
.anos-count {
  font-size: 20px;
  font-weight: bold;
  color: $cumes-04;
}

.data-label {
  font-size: 14px;
  color: $cumes-04;
}

.data-formatada {
  font-size: 18px;
  font-weight: bold;
  color: $cumes-04;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
}
</style>
