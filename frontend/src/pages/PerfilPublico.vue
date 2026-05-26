<template>
  <q-page :class="pageClass">
      <!-- Layout Mobile -->
      <div v-if="!isDesktop" class="mobile-layout">
        <div class="row q-col-gutter-none">
          <div class="col-12">
            <PerfilBar :user="props.user" :readonly="true" />
          </div>
          <div v-if="props.user?.username && isLogado" class="col-12">
            <q-btn
              flat
              dense
              no-caps
              class="follow-btn-mobile"
              :icon="isSeguindo ? 'check_circle' : 'person_add'"
              :disable="isSeguindo === null"
              :label="isSeguindo ? 'Seguindo' : 'Seguir'"
              @click="alternarSeguimento"
            />
          </div>
          <div class="col-12">
            <PerfilGridButtons :itens="itens" :somenteLeitura="true" />
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

        <!-- Conquistas (mobile - visitante) -->
        <div
          v-if="props.user?.username && props.user?.conquistas_publico !== false"
          class="row q-col-gutter-none"
        >
          <div class="col-12">
            <q-card class="achievements-preview-card">
              <q-card-section class="achievements-preview-header">
                <div class="achievements-preview-title">
                  <q-icon name="emoji_events" size="24px" />
                  <span>Conquistas</span>
                </div>

                <q-btn
                  flat
                  dense
                  no-caps
                  class="achievements-preview-open-btn"
                  icon="chevron_right"
                  @click="isAchievementsDialogOpen = true"
                />
              </q-card-section>

              <q-card-section class="achievements-preview-body">
                <div v-if="conquistas.length" class="achievements-badges-preview">
                  <div
                    v-for="c in conquistas"
                    :key="c.id"
                    class="conquista-tier-circle"
                    :style="{ backgroundColor: c.badge.cor, color: '#081012' }"
                  >
                    <q-icon :name="c.badge.icone" size="18px" />
                    <q-tooltip>
                      <div class="conquista-tooltip-title">{{ c.titulo }}</div>
                      <div>{{ c.descricao }}</div>
                    </q-tooltip>
                  </div>
                </div>

                <div v-else class="achievements-empty">
                  <div class="achievements-empty-title">Sem notificações por enquanto</div>
                  <div class="achievements-empty-sub">
                    Assim que houver conquistas, elas aparecerão aqui.
                  </div>
                </div>
              </q-card-section>
            </q-card>
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
              <q-btn
                v-if="props.user?.username && props.user?.conquistas_publico !== false"
                flat
                dense
                no-caps
                icon="emoji_events"
                class="achievements-btn-publico"
                @click="isAchievementsDialogOpen = true"
              />

              <!-- Seguir / Seguindo -->
              <q-btn
                v-if="props.user?.username && isLogado"
                flat
                dense
                no-caps
                class="follow-btn-publico"
                :icon="isSeguindo ? 'check_circle' : 'person_add'"
                :disable="isSeguindo === null"
                @click="alternarSeguimento"
              />
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
              <div class="detail-item" :class="{ 'empty': !props.user?.link_externo }">
                <div class="detail-label">Link externo</div>
                <div class="detail-content">
                  <q-icon name="public" size="18px" />
                  <a
                    v-if="props.user?.link_externo"
                    :href="props.user.link_externo"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="external-link"
                  >
                    {{ props.user.link_externo }}
                  </a>
                  <span v-else>Não informado</span>
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
          <PerfilGridButtons :itens="itens" :somenteLeitura="true" />
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

        <!-- Conquistas (desktop - visitante) -->
        <q-card
          v-if="props.user?.username && props.user?.conquistas_publico !== false"
          class="achievements-preview-card achievements-preview-card--desktop"
        >
          <q-card-section class="achievements-preview-header">
            <div class="achievements-preview-title">
              <q-icon name="emoji_events" size="24px" />
              <span>Conquistas</span>
            </div>

            <q-btn
              flat
              dense
              no-caps
              class="achievements-preview-open-btn"
              icon="chevron_right"
              @click="isAchievementsDialogOpen = true"
            />
          </q-card-section>

          <q-card-section class="achievements-preview-body">
            <div v-if="conquistas.length" class="achievements-badges-preview">
              <div
                v-for="c in conquistas"
                :key="c.id"
                class="conquista-tier-circle"
                :style="{ backgroundColor: c.badge.cor, color: '#081012' }"
              >
                <q-icon :name="c.badge.icone" size="18px" />
                <q-tooltip>
                  <div class="conquista-tooltip-title">{{ c.titulo }}</div>
                  <div>{{ c.descricao }}</div>
                </q-tooltip>
              </div>
            </div>

            <div v-else class="achievements-empty">
              <div class="achievements-empty-title">Sem notificações por enquanto</div>
              <div class="achievements-empty-sub">
                Assim que houver conquistas, elas aparecerão aqui.
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Estrutura de Conquistas (visitante) -->
      <q-dialog v-model="isAchievementsDialogOpen">
        <q-card class="card-config achievements-card">
          <q-card-section class="config-header">
            <div class="config-title">
              <q-icon name="emoji_events" size="24px" />
              <span>Conquistas</span>
            </div>
          </q-card-section>

          <q-card-section class="config-list">
            <div class="achievements-subtitle">Conquistas</div>

            <q-list v-if="conquistas.length" bordered class="achievements-list">
              <q-item v-for="c in conquistas" :key="c.id">
                <q-item-section>
                  <q-item-label>{{ c.titulo }}</q-item-label>
                  <q-item-label caption>
                    <span v-if="c.progresso.proximo != null">
                      {{ c.progresso.atual }} / {{ c.progresso.proximo }}
                    </span>
                    <span v-else>
                      Desbloqueado ({{ c.badge.label }})
                    </span>
                  </q-item-label>
                  <q-item-label v-if="c.descricao" caption class="conquista-descricao">
                    {{ c.descricao }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div
                    class="conquista-tier-circle conquista-tier-circle--dialog"
                    :style="{ backgroundColor: c.badge.cor, color: '#081012' }"
                  >
                    <q-icon :name="c.badge.icone" size="16px" />
                    <q-tooltip>
                      <div class="conquista-tooltip-title">{{ c.titulo }}</div>
                      <div>{{ c.descricao }}</div>
                    </q-tooltip>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>

            <div v-else class="achievements-empty">
              <div class="achievements-empty-title">Sem notificações por enquanto</div>
              <div class="achievements-empty-sub">
                Assim que houver conquistas, elas aparecerão aqui.
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Fechar" no-caps @click="isAchievementsDialogOpen = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>

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
import AuthenticateService from 'src/services/AuthenticateService';
import SeguimentoService from 'src/services/SeguimentoService';
import ConquistasService from 'src/services/ConquistasService';
import type { ConquistaPorTipo } from 'src/models/IConquistas';

const props = defineProps<{
  user: IUsuario & { username?: string; numEscaladas?: number; numColecoes?: number; numFavoritas?: number };
}>();

const larguraTela = ref(window.innerWidth);

defineOptions({ name: 'PerfilPublicoPage' });

const isDesktop = computed(() => larguraTela.value >= 1024);

const urlFotoPerfil = computed(() => {
  const url = props.user?.foto_perfil?.url;
  return url ? ImagemService.obterUrlCompleta(url) : 'https://via.placeholder.com/150';
});

const pageClass = computed(() =>
  isDesktop.value ? 'perfil-page-desktop' : 'perfil-page-mobile'
);

const isAchievementsDialogOpen = ref(false);
const conquistas = ref<ConquistaPorTipo[]>([]);

const numSeguidores = ref(0);
const numSeguindo = ref(0);
const isSeguindo = ref<boolean | null>(null);

const isLogado = computed(() => AuthenticateService.isTokenValid());

const itens = computed(() => {
  const u = props.user?.username;
  const linkEscaladas = u ? `/perfil/${u}/escaladas` : '#';
  return [
    {
      label: 'Coleções',
      num: props.user?.numColecoes ?? 0,
      icon: 'pi pi-bookmark',
      color: '#546119',
      to: '#'
    },
    {
      label: 'Favoritas',
      num: props.user?.numFavoritas ?? 0,
      icon: 'pi pi-star-fill',
      color: '#F4E285',
      to: '#'
    },
    {
      label: 'Escaladas',
      num: props.user?.numEscaladas ?? 0,
      icon: 'pi pi-flag-fill',
      color: '#F29340',
      to: linkEscaladas
    },
    {
      label: 'Seguindo',
      num: numSeguindo.value,
      icon: 'pi pi-user-plus',
      color: '#8CB369',
      to: '#'
    },
    {
      label: 'Seguidores',
      num: numSeguidores.value,
      icon: 'pi pi-users',
      color: '#BC4B51',
      to: '#'
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

onMounted(async () => {
  window.addEventListener('resize', aoRedimensionar);

  const username = props.user?.username;
  if (!username) return;

  const stats = await SeguimentoService.obterEstatisticasPorUsername(username);
  if (!stats) return;

  numSeguidores.value = stats.num_seguidores;
  numSeguindo.value = stats.num_seguindo;
  isSeguindo.value = stats.is_seguindo;

  if (props.user?.conquistas_publico !== false) {
    const conquistasResposta = await ConquistasService.obterConquistasPorUsername(username);
    if (conquistasResposta?.conquistas) {
      conquistas.value = conquistasResposta.conquistas;
    }
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', aoRedimensionar);
});

async function alternarSeguimento () {
  if (!props.user?.username) return;

  // Se a API ainda não deu status, evita disparar múltiplas chamadas.
  if (isSeguindo.value === null) return;

  const username = props.user.username;
  if (isSeguindo.value) {
    await SeguimentoService.deixarDeSeguir(username);
  } else {
    await SeguimentoService.seguir(username);
  }

  const stats = await SeguimentoService.obterEstatisticasPorUsername(username);
  if (!stats) return;

  numSeguidores.value = stats.num_seguidores;
  numSeguindo.value = stats.num_seguindo;
  isSeguindo.value = stats.is_seguindo;
}
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

.achievements-btn-publico {
  margin-left: 6px;
  color: $cumes-03;
}

.follow-btn-publico {
  margin-left: 6px;
  color: $cumes-03;
  background-color: transparent !important;
  border: 1px solid rgba($cumes-03, 0.45) !important;
  box-shadow: none !important;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  padding: 0 !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.follow-btn-publico:disabled {
  opacity: 0.55;
}

.follow-btn-mobile {
  width: 100%;
  justify-content: center;
  color: $cumes-03;
  background-color: transparent !important;
  border: 1px solid rgba($cumes-03, 0.45) !important;
  box-shadow: none !important;
  border-radius: 12px;
}

.card-config {
  border-radius: 16px;
  min-width: 320px;
  max-width: 400px;
  background-color: $offwhite;
  border: 2px solid $cumes-01;
  box-shadow: 0 8px 24px $box-shadow-dark;
  overflow: hidden;

  @media (min-width: 1024px) {
    min-width: 420px;
    max-width: 500px;
  }
}

.config-header {
  background: linear-gradient(135deg, $cumes-01 0%, cumesDarken($cumes-01, 8%) 100%);
  padding: 20px 24px;
  border-bottom: 3px solid $cumes-03;
}

.config-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: $offwhite;
  text-shadow: 0 2px 4px $text-shadow-default;

  .q-icon {
    color: $cumes-04;
  }
}

.config-list {
  padding: 12px;
}

.achievements-subtitle {
  font-size: 14px;
  font-weight: 700;
  color: $cumes-03;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.achievements-empty {
  padding: 16px;
  border-radius: 12px;
  background: rgba($offwhite, 0.03);
  border: 1px solid rgba($offwhite, 0.08);
}

.achievements-empty-title {
  font-size: 14px;
  font-weight: 700;
  color: $offwhite;
  margin-bottom: 6px;
}

.achievements-empty-sub {
  font-size: 13px;
  color: rgba($offwhite, 0.7);
  line-height: 1.4;
}

.achievements-preview-card {
  width: 100%;
  border-radius: 16px;
  background-color: $background;
  border: 2px solid $cumes-03;
  box-shadow: 0 4px 16px $box-shadow-medium;
  overflow: hidden;
}

.achievements-preview-card--desktop {
  margin-top: 16px;
}

.achievements-preview-header {
  background: linear-gradient(135deg, $cumes-01 0%, cumesDarken($cumes-01, 8%) 100%);
  border-bottom: 3px solid $cumes-03;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.achievements-preview-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 800;
  color: $offwhite;
  text-shadow: 0 2px 4px $text-shadow-default;
}

.achievements-preview-body {
  padding: 16px 20px 20px;
}

.achievements-badges-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.conquista-tier-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba($offwhite, 0.18);
  box-shadow: 0 4px 12px $box-shadow-dark;
  font-weight: 800;
}

.conquista-tier-circle--dialog {
  width: 40px;
  height: 40px;
}

.conquista-tooltip-title {
  font-weight: 700;
  margin-bottom: 2px;
}

.conquista-descricao {
  margin-top: 6px;
}

.achievements-list {
  border-radius: 12px;
  overflow: hidden;
}

.achievements-preview-open-btn {
  color: $offwhite;
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

.external-link {
  color: $offwhite;
  text-decoration: underline;
  font-size: 14px;
  font-weight: 500;
  word-break: break-word;
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
