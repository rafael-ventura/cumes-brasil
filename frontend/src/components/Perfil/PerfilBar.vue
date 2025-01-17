<template>
  <div class="profile-header-container no-wrap q-pa-md row items-center text-color">
    <q-item-section class="profile-info">
      <div class="profile-picture-container">
        <img :src="localUser?.foto_perfil?.url || 'https://via.placeholder.com/150'" alt="Foto de Perfil"
             class="profile-picture"
             @click="expandImage(props.user?.foto_perfil?.url || 'https://via.placeholder.com/150')"/>
      </div>
      <div class="user-details">
        <div class="caixa-escalada border-radius-medium top-margem">
          <div class="text-h5">
            {{ diasEscalados }}
            <div class="text-h8" style="display: inline-block">dias</div>
          </div>
          <div class="text-h7">
            Desde {{dataFormatada}}
          </div>
        </div>
        <div class="text-h6 user-localizacao">{{props.user?.localizacao}}</div>
      </div>
    </q-item-section>
  </div>
  <div class="text-h4 user-name">
    {{ props.user?.nome }}
  </div>
  <q-dialog v-model="isImageModalOpen">
    <q-img :src="expandedImageUrl" style="min-width: 50vw; min-height: 50vh;">
      <template v-slot:default>
        <!-- Componente de upload -->
        <FotoPerfilUpload @closeDialogPai="closeImagePai" @submit="updateUserFotoPerfil"/>
      </template>
    </q-img>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue';
import { IUsuario } from 'src/models/IUsuario';
import FotoPerfilUpload from 'components/Perfil/FotoPerfilUpload.vue';

const props = defineProps<{ user: IUsuario | undefined }>();
const emits = defineEmits(['submit']);

const localUser = ref<IUsuario | undefined>(props.user);
const isImageModalOpen = ref(false);
const expandedImageUrl = ref<string | undefined>(undefined);
const modalImageUrl = ref<string | null>(null);

watch(() => props.user, (newUser) => {
  if (newUser) {
    localUser.value = newUser;
    expandedImageUrl.value = newUser.foto_perfil?.url || 'https://via.placeholder.com/150';
  }
}, { immediate: true });

const expandImage = (url: string) => {
  expandedImageUrl.value = url;
  isImageModalOpen.value = true;
};

const closeImagePai = (fecharImagem: boolean) => {
  if (fecharImagem) {
    expandedImageUrl.value = undefined;
  }
  if (!fecharImagem) {
    expandedImageUrl.value = modalImageUrl.value || undefined;
  }
};

const updateUserFotoPerfil = (updatedUser: IUsuario) => {
  emits('submit', updatedUser);
  isImageModalOpen.value = false;
};

const diasEscalados = computed(() => {
  if (!props.user?.data_atividade) return 0;
  const partesData = props.user.data_atividade.split('/'); // Divide a string em partes
  const dataAtividade = new Date(`${partesData[2]}-${partesData[1]}-${partesData[0]}`);
  const hoje = new Date();
  if (dataAtividade > hoje) return 0;
  const diffTime = hoje.getTime() - dataAtividade.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

const dataFormatada = computed(() => {
  if (!props.user?.data_atividade) return '';
  const partesData = props.user.data_atividade.split('/');
  const dataAtividade = new Date(`${partesData[2]}-${partesData[1]}-${partesData[0]}`);
  const dataString = dataAtividade.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return dataString.charAt(0).toUpperCase() + dataString.slice(1);
});

</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.text-color{
  color: $cumes-03
}

.profile-header-container {
  border-radius: 0 0 30px 30px;
  padding-top: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: $cumes-03;
}

.profile-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.profile-picture-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
}

.profile-picture {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}

.club-info {
  margin-top: 8px;
  max-width: 18ch;
  word-wrap: break-word;
  font-size: 14px;
}

.user-details {
  display: flex;
  flex-direction: column;
  flex: 1;
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
  background-color: $background;
}

.caixa-escalada{
  border: $cumes-03 solid 2px;
  max-width: 240px;
  padding: 20px;
  text-align: center;
}

.user-name{
  color: $cumes-03;
  padding-left: 15px;
}

.user-localizacao{
  padding: 10px;
}
</style>
