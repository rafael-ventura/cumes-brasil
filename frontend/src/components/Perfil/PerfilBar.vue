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
  background-color: $cumes-01;
  box-shadow: 0 4px 8px $box-shadow-strong;
  margin: auto;

  @media (min-width: 1024px) {
    padding: 24px;
    min-height: 400px;
  }

  // Mobile: encostado no topo, 100% largura, bordas inferiores arredondadas
  @media (max-width: 1023px) {
    padding: 16px;
    margin: 0;
    width: 100%;
    border-radius: 0 0 24px 24px;
  }
}

.profile-header {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 1024px) {
    gap: 24px;
  }
}

.profile-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  align-items: center;
  gap: 16px;

  @media (min-width: 1024px) {
    grid-template-columns: 200px 1fr;
    gap: 24px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 100px 1fr;
    gap: 12px;
  }
}

.profile-picture-container {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.profile-picture {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 3px solid $cumes-04;
  box-shadow: 0 4px 6px $box-shadow-strong;
  object-fit: cover;

  @media (min-width: 1024px) {
    width: 200px;
    height: 200px;
    border: 4px solid $cumes-04;
  }

  @media (max-width: 600px) {
    width: 100px;
    height: 100px;
    border: 2px solid $cumes-04;
  }
}

.user-details {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 4px;

  @media (min-width: 1024px) {
    gap: 8px;
  }
}

.user-name {
  font-size: 20px;
  font-weight: bold;
  color: $cumes-04;

  @media (min-width: 1024px) {
    font-size: 26px;
  }

  @media (max-width: 600px) {
    font-size: 18px;
  }
}

.user-location,
.user-club {
  font-size: 16px;
  color: $cumes-04;

  @media (min-width: 1024px) {
    font-size: 18px;
  }

  @media (max-width: 600px) {
    font-size: 14px;
  }
}

.escalando-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-left: auto;
  padding-left: 30px;

  @media (max-width: 600px) {
    display: none; // Esconde no mobile para economizar espaço
  }

  @media (min-width: 1024px) {
    padding-left: 40px;
  }
}

.dias-escalando {
  margin-top: 3rem;

  @media (min-width: 1024px) {
    margin-top: 2rem;
  }
}

.anos-escalando {
  margin-top: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 1024px) {
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
  }
}

.label {
  font-size: 14px;
  color: $cumes-04;

  @media (min-width: 1024px) {
    font-size: 16px;
  }
}

.dias-count,
.anos-count {
  font-size: 20px;
  font-weight: bold;
  color: $cumes-04;

  @media (min-width: 1024px) {
    font-size: 24px;
  }
}

.data-label {
  font-size: 14px;
  color: $cumes-04;

  @media (min-width: 1024px) {
    font-size: 16px;
  }
}

.data-formatada {
  font-size: 18px;
  font-weight: bold;
  color: $cumes-04;
  text-shadow: 0 2px 3px $text-shadow-default;

  @media (min-width: 1024px) {
    font-size: 20px;
  }
}
</style>
