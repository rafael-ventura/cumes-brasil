<template>
  <q-page :class="pageClass">
    <!-- Botão de Configuração (apenas mobile) -->
    <q-btn 
      v-if="!isDesktop"
      icon="settings" 
      class="settings-btn-mobile" 
      @click="isConfigDialogOpen = true"
    />

    <!-- Layout Mobile/PWA (< 1024px) -->
    <div v-if="!isDesktop" class="mobile-layout">
      <!-- PerfilBar e PerfilGridButtons -->
      <div class="row q-col-gutter-none">
        <div class="col-12">
          <PerfilBar :user="user" @submit="handleEditSubmit" />
        </div>
        <div class="col-12">
          <PerfilGridButtons :items="items" />
        </div>
      </div>

      <!-- PerfilBio e PerfilPredileta -->
      <div class="row q-col-gutter-none">
        <div class="col-12 perfil-div">
          <PerfilBio :user="user" @bio-updated="updateUserBio" />
        </div>
        <div class="col-12 caixa2">
          <PerfilViaPredileta :user="user" @submit="handleEditSubmit"/>
        </div>
      </div>
    </div>

    <!-- Layout Desktop/WEB (>= 1024px) -->
    <div v-else class="desktop-layout">
      <!-- Header com foto e informações principais -->
      <div class="desktop-header">
        <div class="profile-picture-wrapper" @click="expandImage">
          <img
            :src="user?.foto_perfil?.url || 'https://via.placeholder.com/150'"
            alt="Foto de Perfil"
            class="desktop-profile-picture"
          />
          <div class="picture-overlay">
            <q-icon name="edit" size="32px" color="white" />
          </div>
        </div>
        
        <div class="user-info-section">
          <h3 class="user-name-desktop">{{ user?.nome }}</h3>
          <div class="user-details-desktop">
            <div class="detail-item" :class="{ 'empty': !user?.localizacao }">
              <div class="detail-label">Localização</div>
              <div class="detail-content">
                <q-icon name="place" size="18px" />
                <span>{{ user?.localizacao || 'Não informado' }}</span>
              </div>
            </div>
            <div class="detail-item" :class="{ 'empty': !user?.clube_organizacao }">
              <div class="detail-label">Clube/Organização</div>
              <div class="detail-content">
                <q-icon name="groups" size="18px" />
                <span>{{ user?.clube_organizacao || 'Não informado' }}</span>
              </div>
            </div>
            <div class="detail-item" :class="{ 'empty': !user?.data_atividade }">
              <div class="detail-label">Tempo de Atividade</div>
              <div class="detail-content">
                <q-icon name="calendar_today" size="18px" />
                <span>{{ user?.data_atividade ? `${diasEscalados} dias (${anosEscalando})` : 'Não informado' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Botão de Configuração dentro do header -->
        <q-btn 
          icon="settings" 
          class="settings-btn-header" 
          @click="isConfigDialogOpen = true"
          round
          size="md"
        />
      </div>

      <!-- Estatísticas em linha separada -->
      <div class="desktop-stats">
        <PerfilGridButtons :items="items" />
      </div>

      <!-- Conteúdo principal em colunas -->
      <div class="desktop-content">
        <div class="content-left">
          <PerfilBio :user="user" @bio-updated="updateUserBio" />
        </div>
        <div class="content-right">
          <PerfilViaPredileta :user="user" @submit="handleEditSubmit"/>
        </div>
      </div>
    </div>

    <!-- Modal de Imagem Expandida -->
    <q-dialog v-model="isImageModalOpen">
      <q-img :src="expandedImageUrl" style="min-width: 50vw; min-height: 50vh;">
        <template v-slot:default>
          <FotoPerfilUpload @closeDialogPai="closeImagePai" @submit="updateUserFotoPerfil" />
        </template>
      </q-img>
    </q-dialog>

    <!-- Configuração do Dialog -->
    <q-dialog v-model="isConfigDialogOpen">
      <q-card class="card-config">
        <q-list>
          <q-item flat label="Editar Dados" clickable @click="openEditDialog()" class="btn">
            <q-item-section avatar>
              <q-icon name="edit" />
            </q-item-section>
            <q-item-section>Editar Dados</q-item-section>
          </q-item>
          <q-item flat label="Logout" clickable @click="logout" class="btn-red">
            <q-item-section avatar>
              <q-icon name="logout" class="red" />
            </q-item-section>
            <q-item-section>Logout</q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>

    <!-- Perfil de Edição -->
    <q-dialog v-model="isEditDialogOpen">
      <PerfilEditaForm v-if="user" :user="user" @submit="handleEditSubmit" />
    </q-dialog>
  </q-page>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import UserService from 'src/services/UsuarioService';
import ColecaoService from 'src/services/ColecaoService';
import AuthenticateService from 'src/services/AuthenticateService';
import PerfilEditaForm from 'components/Perfil/PerfilEditaForm.vue';
import { IUsuario } from 'src/models/IUsuario';
import PerfilBar from 'components/Perfil/PerfilBar.vue';
import PerfilBio from 'components/Perfil/PerfilBio.vue';
import { IColecao } from 'src/models/IColecao';
import PerfilGridButtons from 'components/Perfil/PerfilGridButtons.vue';
import PerfilViaPredileta from 'components/Perfil/PerfilViaPredileta.vue';
import EscaladaService from 'src/services/EscaladaService';
import { Escalada } from 'src/models/Escalada';
import FotoPerfilUpload from 'components/Perfil/FotoPerfilUpload.vue';

const router = useRouter();
const user = ref<IUsuario | undefined>(undefined);
const numColecoes = ref();
const numEscaladas = ref();
const numFavoritas = ref();
const colecaoId = ref();
const isEditDialogOpen = ref(false);
const isConfigDialogOpen = ref(false);
const isImageModalOpen = ref(false);
const expandedImageUrl = ref<string>('');
const windowWidth = ref(window.innerWidth);

defineOptions({
  name: 'PerfilPage'
});

// Detectar se é desktop (breakpoint: 1024px)
const isDesktop = computed(() => windowWidth.value >= 1024);

// Classe dinâmica para o page
const pageClass = computed(() => {
  if (isDesktop.value) {
    return 'perfil-page-desktop';
  }
  return 'perfil-page-mobile';
});

const items = computed(() => [
  {
    label: 'Coleções',
    num: numColecoes.value,
    icon: 'style',
    color: '#546119', // $action-colecoes
    to: '/colecoes'
  },
  {
    label: 'Favoritas',
    num: numFavoritas.value,
    icon: 'star',
    color: '#F4E285', // $action-favoritos
    to: '/favoritas'
  },
  {
    label: 'Escaladas',
    num: numEscaladas.value,
    icon: 'hiking',
    color: '#F29340', // $action-escaladas
    to: '/escaladas'
  }
]);

// Computeds para informações de escalada
const diasEscalados = computed(() => {
  if (!user.value?.data_atividade) return 0;
  const partesData = user.value.data_atividade.split('/');
  const dataAtividade = new Date(`${partesData[2]}-${partesData[1]}-${partesData[0]}`);
  const hoje = new Date();
  return Math.floor((hoje.getTime() - dataAtividade.getTime()) / (1000 * 60 * 60 * 24));
});

const anosEscalando = computed(() => {
  return `${Math.floor(diasEscalados.value / 365)} ano(s)`;
});

// Listener para resize
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(async () => {
  window.addEventListener('resize', handleResize);
  
  try {
    await AuthenticateService.redirecionaSeNaoAutenticado(router);

    user.value = await UserService.getPerfil();
    const colecoes: IColecao[] | undefined = await ColecaoService.listarColecoesPorUsuario();
    const favorita: IColecao | null = await ColecaoService.obterColecaoFavoritos();
    const escaladas: Escalada[] = await EscaladaService.getEscaladasByUsuario();
    if (favorita) {
      colecaoId.value = favorita?.id;
      numFavoritas.value = favorita.viaColecoes.length;
      numColecoes.value = colecoes?.length;
    }
    if (escaladas.length === 0) {
      numEscaladas.value = 0;
    } else {
      numEscaladas.value = escaladas.length;
    }
  } catch (error) {
    console.error(error);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const expandImage = () => {
  expandedImageUrl.value = user.value?.foto_perfil?.url || 'https://via.placeholder.com/150';
  isImageModalOpen.value = true;
};

const closeImagePai = (fecharImagem: boolean) => {
  if (fecharImagem) {
    expandedImageUrl.value = '';
  }
};

const updateUserFotoPerfil = async () => {
  try {
    user.value = await UserService.getPerfil();
    isImageModalOpen.value = false;
  } catch (error) {
    console.error('Erro ao atualizar foto:', error);
  }
};

const updateUserBio = (newBio: string) => {
  if (user.value) {
    user.value.biografia = newBio;
    user.value = { ...user.value }; // Trigger reatividade
  }
};

const logout = () => {
  UserService.logout();
  router.push('/auth/login');
};

const openEditDialog = () => {
  isConfigDialogOpen.value = false;
  isEditDialogOpen.value = true;
};

const handleEditSubmit = async () => {
  try {
    user.value = await UserService.getPerfil(); // Atualiza o estado local com o perfil atualizado;
    isEditDialogOpen.value = false; // Fecha o modal de edição
  } catch (error) {
    console.error('Erro ao atualizar o perfil:', error);
  }
};
</script>
<style scoped lang="scss">
@import "src/css/app.scss";

// ============================================
// ESTILOS GLOBAIS
// ============================================
.settings-btn-mobile {
  position: fixed;
  top: 16px;
  right: 16px;
  height: 40px;
  width: 40px;
  color: $offwhite;
  background-color: $cumes-02;
  z-index: 100;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    background-color: darken($cumes-02, 10%);
  }
}

.card-config {
  border-radius: 10px;
  min-width: 250px;
}

// ============================================
// LAYOUT MOBILE (< 1024px)
// ============================================
.perfil-page-mobile {
  padding: 8px;
}

.mobile-layout {
  .perfil-div,
  .caixa2 {
    padding: 8px;
    margin-top: 16px;
  }

  .row {
    margin-bottom: 16px;
  }
}

// ============================================
// LAYOUT DESKTOP (>= 1024px)
// ============================================
.perfil-page-desktop {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
}

.desktop-layout {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

// Header Desktop - Foto e Informações
.desktop-header {
  display: flex;
  align-items: center;
  gap: 32px;
  background-color: $cumes-01;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  position: relative;

  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

// Botão de Config no Header
.settings-btn-header {
  position: absolute;
  top: 24px;
  right: 24px;
  color: $offwhite;
  background-color: $cumes-02;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    background-color: darken($cumes-02, 10%);
  }
}

// Estatísticas Desktop - Linha separada
.desktop-stats {
  background-color: $cumes-01;
  border-radius: 16px;
  padding: 24px 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
}

// Foto de Perfil Desktop
.profile-picture-wrapper {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);

    .picture-overlay {
      opacity: 1;
    }
  }
}

.desktop-profile-picture {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 5px solid $cumes-04;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  object-fit: cover;
}

.picture-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

// Informações do Usuário Desktop
.user-info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
}

.user-name-desktop {
  font-size: 36px;
  font-weight: 800;
  color: $cumes-04;
  margin: 0;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

.user-details-desktop {
  display: flex;
  flex-direction: column;
  gap: 16px;

    .detail-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 15px;
    color: $offwhite;
    padding: 12px 16px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    border-left: 4px solid $cumes-04;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
      transform: translateX(4px);
      border-left-color: $cumes-01;
    }

    &.empty {
      border-left-color: rgba($cumes-04, 0.3);
      opacity: 0.6;

      .detail-label {
        opacity: 0.7;
      }

      .detail-content {
        span {
          font-style: italic;
          opacity: 0.7;
        }
        
        .q-icon {
          opacity: 0.5;
        }
      }

      &:hover {
        opacity: 0.8;
        border-left-color: $cumes-04;
      }
    }

    .detail-label {
      font-size: 12px;
      font-weight: 600;
      color: $cumes-04;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.9;
    }

    .detail-content {
      display: flex;
      align-items: center;
      gap: 10px;

      .q-icon {
        color: $offwhite;
        opacity: 0.8;
      }

      span {
        font-weight: 500;
        color: $offwhite;
      }
    }
  }
}

// Conteúdo Principal Desktop - Duas colunas
.desktop-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.content-left,
.content-right {
  background-color: $background;
  border-radius: 16px;
  padding: 32px;
  border: 2px solid $cumes-03;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  min-height: 350px;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    transform: translateY(-4px);
    border-color: $cumes-01;
  }
}

// ============================================
// RESPONSIVIDADE ADICIONAL
// ============================================
@media (max-width: 1200px) {
  .user-info-section {
    align-items: center;
    text-align: center;
  }

  .user-details-desktop {
    align-items: center;
    width: 100%;

    .detail-item {
      align-items: center;
      
      .detail-label {
        text-align: center;
      }
      
      .detail-content {
        justify-content: center;
      }
    }
  }
  
  .desktop-content {
    grid-template-columns: 1fr;
  }
  
  .settings-btn-header {
    top: 16px;
    right: 16px;
  }
}

@media (max-width: 768px) {
  .perfil-page-desktop {
    padding: 16px;
  }

  .desktop-profile-picture {
    width: 140px;
    height: 140px;
  }

  .user-name-desktop {
    font-size: 24px;
  }

  .desktop-content {
    gap: 16px;
  }
}
</style>
