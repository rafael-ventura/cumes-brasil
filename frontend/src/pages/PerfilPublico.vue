<template>
  <q-page :class="pageClass">
      <!-- Layout Mobile -->
      <div v-if="!isDesktop" class="mobile-layout">
        <div class="row q-col-gutter-none">
          <div class="col-12">
            <PerfilBar :user="props.user" :readonly="true" />
          </div>
          <div class="col-12">
            <PerfilGridButtons :items="items" :readonly="true" />
          </div>
          <div v-if="props.user?.id" class="col-12">
            <PerfilEscaladasDestaque
              :usuario-id="props.user.id"
              :username="props.user.username || ''"
              :modo-proprio="false"
              :num-escaladas-conhecido="typeof props.user.numEscaladas === 'number' ? props.user.numEscaladas : undefined"
            />
          </div>
        </div>
        <div class="row q-col-gutter-none">
          <div class="col-12 perfil-div">
            <PerfilBio :user="props.user" :readonly="true" />
          </div>
          <div class="col-12 caixa2">
            <PerfilViaPredileta :user="props.user" :readonly="true" />
          </div>
        </div>
      </div>

      <!-- Layout Desktop -->
      <div v-else class="desktop-layout">
        <div class="desktop-header">
          <div class="profile-picture-wrapper">
            <img
              :src="urlFotoPerfil"
              alt="Foto de Perfil"
              class="desktop-profile-picture"
            />
          </div>
          <div class="user-info-section">
            <div class="user-name-row">
              <h3 class="user-name-desktop">{{ props.user?.nome }}</h3>
              <span v-if="props.user?.username" class="username-badge">@{{ props.user.username }}</span>
            </div>
            <div class="user-details-desktop">
              <div class="detail-item" :class="{ 'empty': !props.user?.localizacao }">
                <div class="detail-label">Localização</div>
                <div class="detail-content">
                  <q-icon name="place" size="18px" />
                  <span>{{ props.user?.localizacao || 'Não informado' }}</span>
                </div>
              </div>
              <div class="detail-item" :class="{ 'empty': !props.user?.clube_organizacao }">
                <div class="detail-label">Clube/Organização</div>
                <div class="detail-content">
                  <q-icon name="groups" size="18px" />
                  <span>{{ props.user?.clube_organizacao || 'Não informado' }}</span>
                </div>
              </div>
              <div class="detail-item" :class="{ 'empty': !props.user?.data_atividade }">
                <div class="detail-label">Tempo de Atividade</div>
                <div class="detail-content">
                  <q-icon name="calendar_today" size="18px" />
                  <span>{{ props.user?.data_atividade ? `${diasEscalados} dias (${anosEscalando})` : 'Não informado' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="desktop-stats">
          <PerfilGridButtons :items="items" :readonly="true" />
        </div>

        <PerfilEscaladasDestaque
          v-if="props.user?.id"
          :usuario-id="props.user.id"
          :username="props.user.username || ''"
          :modo-proprio="false"
          :num-escaladas-conhecido="typeof props.user.numEscaladas === 'number' ? props.user.numEscaladas : undefined"
        />

        <div class="desktop-content">
          <div class="content-left">
            <PerfilBio :user="props.user" :readonly="true" />
          </div>
          <div class="content-right">
            <PerfilViaPredileta :user="props.user" :readonly="true" />
          </div>
        </div>
      </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import PerfilBar from 'components/Perfil/PerfilBar.vue';
import PerfilBio from 'components/Perfil/PerfilBio.vue';
import PerfilGridButtons from 'components/Perfil/PerfilGridButtons.vue';
import PerfilViaPredileta from 'components/Perfil/PerfilViaPredileta.vue';
import PerfilEscaladasDestaque from 'components/Perfil/PerfilEscaladasDestaque.vue';
import ImagemService from 'src/services/ImagemService';
import { IUsuario } from 'src/models/IUsuario';
import { parseDataAtividade } from 'src/utils/dataAtividade';

const props = defineProps<{
  user: IUsuario & { username?: string; numEscaladas?: number; numColecoes?: number; numFavoritas?: number };
}>();

const larguraTela = ref(window.innerWidth);

defineOptions({ name: 'PerfilPublicoPage' });

const isDesktop = computed(() => larguraTela.value >= 1024);

const urlFotoPerfil = computed(() => {
  const url = props.user?.foto_perfil?.url;
  return url ? ImagemService.getFullImageUrl(url) : 'https://via.placeholder.com/150';
});

const pageClass = computed(() =>
  isDesktop.value ? 'perfil-page-desktop' : 'perfil-page-mobile'
);

const items = computed(() => {
  const u = props.user?.username;
  const linkEscaladas = u ? `/perfil/${u}/escaladas` : '#';
  return [
    {
      label: 'Coleções',
      num: props.user?.numColecoes ?? 0,
      icon: 'style',
      color: '#546119',
      to: '#'
    },
    {
      label: 'Favoritas',
      num: props.user?.numFavoritas ?? 0,
      icon: 'star',
      color: '#F4E285',
      to: '#'
    },
    {
      label: 'Marcações',
      num: props.user?.numEscaladas ?? 0,
      icon: 'hiking',
      color: '#F29340',
      to: linkEscaladas
    }
  ];
});

const diasEscalados = computed(() => {
  if (!props.user?.data_atividade) return 0;
  const dataAtividade = parseDataAtividade(props.user.data_atividade);
  if (!dataAtividade) return 0;
  const hoje = new Date();
  return Math.floor((hoje.getTime() - dataAtividade.getTime()) / (1000 * 60 * 60 * 24));
});

const anosEscalando = computed(() =>
  `${Math.floor(diasEscalados.value / 365)} ano(s)`
);

const aoRedimensionar = () => {
  larguraTela.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', aoRedimensionar);
});

onUnmounted(() => {
  window.removeEventListener('resize', aoRedimensionar);
});
</script>

<style scoped lang="scss">
@import "src/css/app.scss";


.perfil-page-mobile {
  padding: 0;
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

  > .row:first-child .col-12:nth-child(2) {
    margin-top: 20px;
    padding: 0 8px;
  }

  > .row:nth-child(2) {
    padding: 0 8px;
  }
}

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

.desktop-header {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  background-color: $cumes-01;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 24px $box-shadow-strong;
}

.profile-picture-wrapper {
  flex-shrink: 0;
}

.desktop-profile-picture {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 5px solid $cumes-04;
  box-shadow: 0 8px 20px $box-shadow-dark;
  object-fit: cover;
}

.user-info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.user-name-desktop {
  font-size: 36px;
  font-weight: 800;
  color: $cumes-04;
  margin: 0;
  text-shadow: 0 3px 6px $text-shadow-default;
}

.username-badge {
  font-size: 18px;
  font-weight: 600;
  color: rgba($offwhite, 0.8);
}

.user-details-desktop {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 15px;
  color: $offwhite;
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border-left: 4px solid $cumes-04;
}

.detail-item.empty {
  border-left-color: rgba($cumes-04, 0.3);
  opacity: 0.6;
}

.detail-label {
  font-size: 11px;
  font-weight: 600;
  color: $cumes-04;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-content {
  display: flex;
  align-items: center;
  gap: 8px;

  .q-icon {
    color: $offwhite;
  }

  span {
    font-weight: 500;
    color: $offwhite;
  }
}

.desktop-stats {
  background-color: $cumes-01;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 16px $box-shadow-medium;
}

.desktop-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.content-left,
.content-right {
  background-color: $background;
  border-radius: 16px;
  padding: 16px;
  border: 2px solid $cumes-03;
  box-shadow: 0 4px 16px $box-shadow-medium;
}
</style>
