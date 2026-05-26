<template>
  <q-page :class="pageClass">
    <!-- Botão de Configuração (apenas mobile) -->
    <q-btn
      v-if="!isDesktop"
      icon="settings"
      class="botao-config-mobile"
      @click="isConfigDialogOpen = true"
    />

    <!-- Layout Mobile/PWA (< 1024px) -->
    <div v-if="!isDesktop" class="mobile-layout">
      <!-- Cabeçalho e estatísticas -->
      <div class="row q-col-gutter-none">
        <div class="col-12">
          <PerfilBar :user="user" @submit="aoSalvarEdicao" />
        </div>
        <div class="col-12 estatisticas-mobile">
          <PerfilGridButtons :itens="itens" @clique-item="aoAbrirListaSeguimento" />
        </div>
      </div>

      <div class="desktop-conteudo-grid">
        <div class="cartao-info cartao-info--bio">
          <PerfilBio :user="user" @bio-updated="atualizarBiografia" />
        </div>

        <div class="cartao-info cartao-info--via">
          <PerfilViaPredileta :user="user" @submit="aoSalvarEdicao" />
        </div>

        <div class="cartao-acao cartao-cordada cartao-acao--linha" @click="irParaCordada">
          <div class="cartao-acao__cabecalho">
            <i class="pi pi-users cartao-cordada__icone" />
            <span class="cartao-acao__titulo">Na cordada</span>
            <span v-if="numeroDeMarcados > 0" class="cartao-acao__contagem">{{ numeroDeMarcados }}</span>
          </div>
          <div class="cartao-acao__rodape">
            <span class="cartao-acao__descricao">{{ descricaoCordada }}</span>
            <i class="pi pi-angle-right cartao-acao__seta" />
          </div>
        </div>

        <div class="cartao-acao cartao-conquistas cartao-acao--linha" @click="isAchievementsDialogOpen = true">
          <div class="cartao-acao__cabecalho">
            <i class="pi pi-trophy cartao-conquistas__icone" />
            <span class="cartao-acao__titulo">Conquistas</span>
            <span v-if="conquistas.length" class="cartao-acao__contagem">{{ conquistas.length }}</span>
          </div>
          <div class="cartao-acao__rodape">
            <div v-if="conquistas.length" class="conquistas-mini-bolhas">
              <div
                v-for="conquista in conquistas.slice(0, 4)"
                :key="conquista.id"
                class="conquista-mini-bolha"
                :style="{ backgroundColor: conquista.badge.cor }"
              >
                <i :class="iconeConquistaPi(conquista.badge.icone)" />
                <q-tooltip>
                  <div class="conquista-tooltip-title">{{ conquista.titulo }}</div>
                  <div v-if="conquista.descricao" style="font-size: 12px; opacity: 0.8;">{{ conquista.descricao }}</div>
                </q-tooltip>
              </div>
            </div>
            <span v-else class="cartao-acao__descricao">Desbloqueie escalando</span>
            <i class="pi pi-angle-right cartao-acao__seta" />
          </div>
        </div>
      </div>
    </div>

    <!-- Layout Desktop/WEB (>= 1024px) -->
    <div v-else class="desktop-layout">
      <!-- Cabeçalho: foto + informações + ações -->
      <div class="desktop-cabecalho">
        <div class="foto-perfil-wrapper" @click="expandirImagem">
          <img
            :src="urlFotoPerfil"
            alt="Foto de Perfil"
            class="foto-perfil-desktop"
          />
          <div class="foto-perfil-sobreposicao">
            <i class="pi pi-pencil sobreposicao-icone" />
          </div>
        </div>

        <div class="cabecalho-informacoes">
          <div class="cabecalho-nome-linha">
            <h2 class="nome-usuario-desktop">{{ user?.nome }}</h2>
            <span v-if="user?.username" class="badge-username">@{{ user.username }}</span>
          </div>
          <div class="detalhes-usuario-desktop">
            <div class="detalhe-chip" :class="{ 'detalhe-chip--vazio': !user?.localizacao }">
              <i class="pi pi-map-marker detalhe-chip__icone" />
              <span>{{ user?.localizacao || 'Não informado' }}</span>
            </div>
            <div class="detalhe-chip" :class="{ 'detalhe-chip--vazio': !user?.clube_organizacao }">
              <i class="pi pi-users detalhe-chip__icone" />
              <span>{{ user?.clube_organizacao || 'Não informado' }}</span>
            </div>
            <div class="detalhe-chip" :class="{ 'detalhe-chip--vazio': !user?.link_externo }">
              <i class="pi pi-globe detalhe-chip__icone" />
              <a
                v-if="user?.link_externo"
                :href="user.link_externo"
                target="_blank"
                rel="noopener noreferrer"
                class="link-externo"
              >{{ user.link_externo }}</a>
              <span v-else>Não informado</span>
            </div>
            <div class="detalhe-chip" :class="{ 'detalhe-chip--vazio': !user?.data_atividade }">
              <i class="pi pi-calendar detalhe-chip__icone" />
              <span>{{ user?.data_atividade ? `${diasEscalados} dias (${anosEscalando})` : 'Não informado' }}</span>
            </div>
          </div>
        </div>

        <!-- Botões de ação do cabeçalho: apenas configurações e compartilhar -->
        <div class="cabecalho-acoes">
          <button class="botao-acao-cabecalho" @click="isConfigDialogOpen = true" title="Configurações">
            <i class="pi pi-cog" />
          </button>
          <button
            v-if="user?.username"
            class="botao-acao-cabecalho"
            title="Compartilhar perfil"
            @click="compartilharPerfilDesktop"
          >
            <i class="pi pi-share-alt" />
          </button>
        </div>
      </div>

      <!-- Barra de estatísticas -->
      <div class="barra-estatisticas-desktop">
        <PerfilGridButtons :itens="itens" @clique-item="aoAbrirListaSeguimento" />
      </div>

      <!-- Conteúdo desktop em grade fixa -->
      <div class="desktop-conteudo-grid">
        <div class="cartao-info cartao-info--bio">
          <PerfilBio :user="user" @bio-updated="atualizarBiografia" />
        </div>

        <div class="cartao-info cartao-info--via">
          <PerfilViaPredileta :user="user" @submit="aoSalvarEdicao" />
        </div>

        <div class="cartao-acao cartao-cordada cartao-acao--linha" @click="irParaCordada">
          <div class="cartao-acao__cabecalho">
            <i class="pi pi-users cartao-cordada__icone" />
            <span class="cartao-acao__titulo">Na cordada</span>
            <span v-if="numeroDeMarcados > 0" class="cartao-acao__contagem">{{ numeroDeMarcados }}</span>
          </div>
          <div class="cartao-acao__rodape">
            <span class="cartao-acao__descricao">{{ descricaoCordada }}</span>
            <i class="pi pi-angle-right cartao-acao__seta" />
          </div>
        </div>

        <div class="cartao-acao cartao-conquistas cartao-acao--linha" @click="isAchievementsDialogOpen = true">
          <div class="cartao-acao__cabecalho">
            <i class="pi pi-trophy cartao-conquistas__icone" />
            <span class="cartao-acao__titulo">Conquistas</span>
            <span v-if="conquistas.length" class="cartao-acao__contagem">{{ conquistas.length }}</span>
          </div>
          <div class="cartao-acao__rodape">
            <div v-if="conquistas.length" class="conquistas-mini-bolhas">
              <div
                v-for="conquista in conquistas.slice(0, 4)"
                :key="conquista.id"
                class="conquista-mini-bolha"
                :style="{ backgroundColor: conquista.badge.cor }"
              >
                <i :class="iconeConquistaPi(conquista.badge.icone)" />
                <q-tooltip>
                  <div class="conquista-tooltip-title">{{ conquista.titulo }}</div>
                  <div v-if="conquista.descricao" style="font-size: 12px; opacity: 0.8;">{{ conquista.descricao }}</div>
                </q-tooltip>
              </div>
            </div>
            <span v-else class="cartao-acao__descricao">Desbloqueie escalando</span>
            <i class="pi pi-angle-right cartao-acao__seta" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Imagem Expandida -->
    <q-dialog v-model="isImageModalOpen">
      <q-img :src="expandedImageUrl" style="min-width: 50vw; min-height: 50vh;">
        <template v-slot:default>
          <FotoPerfilUpload @closeDialogPai="fecharImagemPai" @submit="atualizarFotoPerfil" />
        </template>
      </q-img>
    </q-dialog>

    <!-- Configuração do Dialog -->
    <q-dialog v-model="isConfigDialogOpen">
      <q-card class="card-config">
        <q-card-section class="config-header">
          <div class="config-title">
            <q-icon name="settings" size="24px" />
            <span>Configurações</span>
          </div>
        </q-card-section>

        <q-list class="config-list">
          <q-item
            clickable
            @click="abrirEdicao()"
            class="config-item"
            v-ripple
          >
            <q-item-section avatar>
              <q-icon name="edit" size="24px" class="item-icon icon-edit" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="item-label">Editar Dados</q-item-label>
              <q-item-label caption class="item-caption">Alterar suas informações pessoais</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" size="20px" />
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item
            clickable
            @click="sair"
            class="config-item logout-item"
            v-ripple
          >
            <q-item-section avatar>
              <q-icon name="logout" size="24px" class="item-icon icon-logout" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="item-label">Sair da Conta</q-item-label>
              <q-item-label caption class="item-caption">Desconectar do aplicativo</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" size="20px" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>

    <!-- Perfil de Edição -->
    <q-dialog v-model="isEditDialogOpen">
      <PerfilEditaForm v-if="user" :user="user" @submit="aoSalvarEdicao" />
    </q-dialog>

    <!-- Estrutura de Conquistas -->
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
              Assim que você desbloquear conquistas, elas aparecerão aqui.
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" no-caps @click="isAchievementsDialogOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Lista de Seguimento -->
    <q-dialog v-model="isSeguidoresDialogOpen">
      <q-card class="card-config seguimento-card">
        <q-card-section class="config-header">
          <div class="config-title">
            <q-icon name="people" size="24px" />
            <span>Seguidores</span>
          </div>
        </q-card-section>

        <q-card-section class="config-list">
          <q-list bordered class="seguimento-list">
            <q-item v-if="carregandoSeguidores" class="seguimento-loading">
              <q-item-section avatar>
                <q-spinner size="26px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Carregando...</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              v-else
              v-for="u in usuariosSeguidores"
              :key="u.id"
              clickable
              @click="irParaPerfil(u.username)"
              class="seguimento-item"
            >
              <q-item-section avatar>
                <q-avatar square size="48px" class="custom-avatar">
                  <q-img
                    :src="u.foto_perfil_url ? ImagemService.obterUrlCompleta(u.foto_perfil_url) : 'https://via.placeholder.com/80'"
                  />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ u.nome || 'Usuário' }}</q-item-label>
                <q-item-label caption>@{{ u.username }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="!carregandoSeguidores && !usuariosSeguidores.length" class="seguimento-empty">
              <q-item-section>
                <q-item-label>Sem seguidores por enquanto</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" no-caps @click="isSeguidoresDialogOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isSeguindoDialogOpen">
      <q-card class="card-config seguimento-card">
        <q-card-section class="config-header">
          <div class="config-title">
            <q-icon name="person_add" size="24px" />
            <span>Seguindo</span>
          </div>
        </q-card-section>

        <q-card-section class="config-list">
          <q-list bordered class="seguimento-list">
            <q-item v-if="carregandoSeguindo" class="seguimento-loading">
              <q-item-section avatar>
                <q-spinner size="26px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Carregando...</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              v-else
              v-for="u in usuariosSeguindo"
              :key="u.id"
              clickable
              @click="irParaPerfil(u.username)"
              class="seguimento-item"
            >
              <q-item-section avatar>
                <q-avatar square size="48px" class="custom-avatar">
                  <q-img
                    :src="u.foto_perfil_url ? ImagemService.obterUrlCompleta(u.foto_perfil_url) : 'https://via.placeholder.com/80'"
                  />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ u.nome || 'Usuário' }}</q-item-label>
                <q-item-label caption>@{{ u.username }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="!carregandoSeguindo && !usuariosSeguindo.length" class="seguimento-empty">
              <q-item-section>
                <q-item-label>Você não segue ninguém por enquanto</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" no-caps @click="isSeguindoDialogOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

        <ModalCompartilhamento
          v-model="isModalCompartilhamentoAberto"
          :dados-compartilhamento="dadosCompartilhamento"
        />
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
import FotoPerfilUpload from 'components/Perfil/FotoPerfilUpload.vue';
import ImagemService from 'src/services/ImagemService';
import { parseDataAtividade } from 'src/utils/dataAtividade';
import { obterUrlCompartilhavel } from 'src/utils/share';
import ModalCompartilhamento from 'components/Compartilhamento/ModalCompartilhamento.vue';
import SeguimentoService, { UsuarioResumoSeguimento } from 'src/services/SeguimentoService';
import ConquistasService from 'src/services/ConquistasService';
import type { ConquistaPorTipo } from 'src/models/IConquistas';

const props = defineProps<{ userInicial?: IUsuario }>();
const router = useRouter();
const user = ref<IUsuario | undefined>(props.userInicial);
const numColecoes = ref();
const numEscaladas = ref();
const numFavoritas = ref();
const numeroDeMarcados = ref(0);
const colecaoId = ref();
const isEditDialogOpen = ref(false);
const isConfigDialogOpen = ref(false);
const isAchievementsDialogOpen = ref(false);
const isImageModalOpen = ref(false);
const expandedImageUrl = ref<string>('');
const windowWidth = ref(window.innerWidth);

// Conquistas com badges por tier (fonte: backend).
const conquistas = ref<ConquistaPorTipo[]>([]);

const isSeguidoresDialogOpen = ref(false);
const isSeguindoDialogOpen = ref(false);
const carregandoSeguidores = ref(false);
const carregandoSeguindo = ref(false);
const usuariosSeguidores = ref<UsuarioResumoSeguimento[]>([]);
const usuariosSeguindo = ref<UsuarioResumoSeguimento[]>([]);

const numSeguidores = ref(0);
const numSeguindo = ref(0);

defineOptions({
  name: 'PerfilPage'
});

// Detectar se é desktop (breakpoint: 1024px)
const isDesktop = computed(() => windowWidth.value >= 1024);

const urlFotoPerfil = computed(() => {
  const url = user.value?.foto_perfil?.url;
  return url ? ImagemService.obterUrlCompleta(url) : 'https://via.placeholder.com/150';
});

// Classe dinâmica para o page
const pageClass = computed(() => {
  if (isDesktop.value) {
    return 'perfil-page-desktop';
  }
  return 'perfil-page-mobile';
});

const itens = computed(() => {
  const linkParticipacoes = '/escaladas?filtro=marcado';
  return [
    {
      label: 'Coleções',
      num: numColecoes.value,
      icon: 'pi pi-bookmark',
      color: '#546119', // $cumes-02 (action-colecoes)
      to: '/colecoes'
    },
    {
      label: 'Favoritas',
      num: numFavoritas.value,
      icon: 'pi pi-star-fill',
      color: '#F4E285', // $cumes-04 (action-favoritos)
      to: '/favoritas'
    },
    {
      label: 'Escaladas',
      num: numEscaladas.value,
      icon: 'pi pi-flag-fill',
      color: '#F29340', // $cumes-03 (action-escaladas)
      to: linkParticipacoes
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

const descricaoCordada = computed(() => {
  if (!numeroDeMarcados.value) {
    return 'Ainda sem marcações de cordada';
  }
  if (numeroDeMarcados.value === 1) {
    return '1 escalada em que você foi marcado';
  }
  return `${numeroDeMarcados.value} escaladas em que você foi marcado`;
});

// Computeds para informações de escalada
const diasEscalados = computed(() => {
  if (!user.value?.data_atividade) return 0;
  const dataAtividade = parseDataAtividade(user.value.data_atividade);
  if (!dataAtividade) return 0;
  const hoje = new Date();
  return Math.floor((hoje.getTime() - dataAtividade.getTime()) / (1000 * 60 * 60 * 24));
});

const anosEscalando = computed(() => {
  return `${Math.floor(diasEscalados.value / 365)} ano(s)`;
});

const aoRedimensionar = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(async () => {
  window.addEventListener('resize', aoRedimensionar);

  try {
    await AuthenticateService.redirecionaSeNaoAutenticado(router);

    if (!props.userInicial) {
      user.value = await UserService.getPerfil();
    }
    const colecoes: IColecao[] | undefined = await ColecaoService.listarColecoesPorUsuario();
    const favorita: IColecao | null = await ColecaoService.obterColecaoFavoritos();
    if (user.value?.id) {
      const [listaComoAutor, listaComeMarcado] = await Promise.all([
        EscaladaService.listarPorUsuarioId(user.value.id, 'autor'),
        EscaladaService.listarOndeFoiMarcado(user.value.id)
      ]);
      const identificadoresUnicos = new Set<number>([
        ...(listaComoAutor ?? []).map(e => e.id),
        ...(listaComeMarcado ?? []).map(e => e.id)
      ]);
      numEscaladas.value = identificadoresUnicos.size;
      numeroDeMarcados.value = (listaComeMarcado ?? []).length;
    } else {
      numEscaladas.value = 0;
      numeroDeMarcados.value = 0;
    }
    if (favorita) {
      colecaoId.value = favorita?.id;
      numFavoritas.value = favorita.viaColecoes.length;
      numColecoes.value = colecoes?.length;
    }

    const statsSeguimento = await SeguimentoService.obterEstatisticasMe();
    if (statsSeguimento) {
      numSeguidores.value = statsSeguimento.num_seguidores;
      numSeguindo.value = statsSeguimento.num_seguindo;
    }

    const conquistasResposta = await ConquistasService.obterConquistasMe();
    if (conquistasResposta?.conquistas) {
      conquistas.value = conquistasResposta.conquistas;
    }
  } catch (error) {
    console.error(error);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', aoRedimensionar);
});

function irParaPerfil (username?: string) {
  if (!username) return;
  isSeguidoresDialogOpen.value = false;
  isSeguindoDialogOpen.value = false;
  router.push(`/perfil/${username}`);
}

function traduzirIconeConquistaPrimeVue(icone: string): string {
  if (icone === 'emoji_events') return 'pi pi-trophy';
  if (icone === 'lock') return 'pi pi-lock';
  return 'pi pi-circle';
}

// Mantém compatibilidade com o template que usa o nome antigo
const iconeConquistaPi = traduzirIconeConquistaPrimeVue;

function irParaCordada() {
  router.push('/escaladas?filtro=marcado');
}

// Chamado pelo @clique-item do PerfilGridButtons
async function aoAbrirListaSeguimento (item: { label: string }) {
  if (!user.value?.username) return;

  if (item.label === 'Seguidores') {
    isSeguidoresDialogOpen.value = true;
    carregandoSeguidores.value = true;
    usuariosSeguidores.value = (await SeguimentoService.listarSeguidoresMe()) ?? [];
    carregandoSeguidores.value = false;
    return;
  }

  if (item.label === 'Seguindo') {
    isSeguindoDialogOpen.value = true;
    carregandoSeguindo.value = true;
    usuariosSeguindo.value = (await SeguimentoService.listarSeguindoMe()) ?? [];
    carregandoSeguindo.value = false;
  }
}

const expandirImagem = () => {
  expandedImageUrl.value = urlFotoPerfil.value;
  isImageModalOpen.value = true;
};

const fecharImagemPai = (fecharImagem: boolean) => {
  if (fecharImagem) {
    expandedImageUrl.value = '';
  }
};

const atualizarFotoPerfil = async () => {
  try {
    user.value = await UserService.getPerfil();
    isImageModalOpen.value = false;
  } catch (error) {
    console.error('Erro ao atualizar foto:', error);
  }
};

const atualizarBiografia = (novaBio: string) => {
  if (user.value) {
    user.value.biografia = novaBio;
    user.value = { ...user.value };
  }
};

const sair = () => {
  UserService.logout();
  router.push('/auth/login');
};

const sharePreviewUrl = computed(() => {
  const u = user.value?.username;
  if (!u) return '';
  return obterUrlCompartilhavel(`/share/perfil/${u}`);
});

const isModalCompartilhamentoAberto = ref(false);

const dadosCompartilhamento = computed(() => {
  if (!user.value?.username) return null;
  return {
    titulo: `Perfil de @${user.value?.username}`,
    texto: 'Veja o perfil no Cumes Brasil.',
    url: sharePreviewUrl.value
  };
});

async function compartilharPerfilDesktop () {
  if (!dadosCompartilhamento.value?.url) return;
  isModalCompartilhamentoAberto.value = true;
}

const abrirEdicao = () => {
  isConfigDialogOpen.value = false;
  isEditDialogOpen.value = true;
};

const aoSalvarEdicao = async () => {
  try {
    user.value = await UserService.getPerfil();
    isEditDialogOpen.value = false;
  } catch (error) {
    console.error('Erro ao atualizar o perfil:', error);
  }
};
</script>
<style scoped lang="scss">
@import "src/css/app.scss";

.perfil-page-desktop {
  --ds-bg: hsl(80 10% 8%);
  --ds-fg: hsl(45 20% 90%);
  --ds-card: hsla(80, 15%, 14%, 0.6);
  --ds-primary: hsl(80 40% 38%);
  --ds-muted: hsl(80 10% 18%);
  --ds-muted-fg: hsl(45 10% 55%);
  --ds-accent: hsl(36 80% 50%);
  --ds-accent-fg: hsl(36 90% 15%);
  --ds-border: hsl(80 15% 22%);
}

// ============================================
// BOTÃO FLUTUANTE MOBILE (CONFIGURAÇÕES)
// ============================================
.botao-config-mobile {
  position: fixed;
  top: 20px;
  right: 20px;
  height: 44px;
  width: 44px;
  color: $offwhite;
  background-color: $cumes-02;
  z-index: 1000;
  border-radius: 50%;
  box-shadow: 0 4px 12px $box-shadow-dark;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px $box-shadow-dark;
    background-color: cumesDarken($cumes-02, 10%);
  }
}

// ============================================
// MODAIS / DIÁLOGOS (CONFIG, CONQUISTAS, SEGUIMENTO)
// ============================================
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

.config-item {
  border-radius: 12px;
  padding: 16px 12px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
  background-color: transparent;

  &:hover {
    background-color: rgba($cumes-01, 0.1);
    transform: translateX(4px);
  }

  .item-icon {
    color: $cumes-03;
    transition: all 0.3s ease;

    &.icon-edit {
      color: $cumes-03;
    }

    &.icon-logout {
      color: $error-color;
    }
  }

  .item-label {
    font-size: 16px;
    font-weight: 600;
    color: $background;
  }

  .item-caption {
    font-size: 13px;
    color: $cumes-02;
    margin-top: 2px;
  }

  .q-item__section--side {
    color: $cumes-03;
  }

  &.logout-item {
    &:hover {
      background-color: rgba($error-color, 0.05);

      .item-label {
        color: $error-color;
      }
    }
  }
}

// ============================================
// LAYOUT MOBILE (< 1024px)
// ============================================
.perfil-page-mobile {
  padding: 0;
}

.mobile-layout {
  padding-bottom: 24px; // espaço no final da página mobile

  .row {
    margin-bottom: 0;
  }

  // PerfilBar sem padding lateral
  > .row:first-child {
    .col-12:first-child {
      padding: 0;
    }
  }
}

// Estatísticas mobile — abaixo do PerfilBar
.estatisticas-mobile {
  padding: 0 8px;
  margin-top: 16px;
}

// Seção de ações rápidas (Cordada | Conquistas) — mobile e desktop
.secao-acoes-rapidas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 0 8px;
  margin-top: 12px;
  min-width: 0; // evita overflow no grid

  @media (min-width: 1024px) {
    padding: 0;
    gap: 12px;
  }
}

// Cartão de ação genérico
.cartao-acao {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 10px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.14);
  border: 1px solid rgba($offwhite, 0.08);
  cursor: pointer;
  transition: background 0.15s ease, transform 0.12s ease;
  min-width: 0; // essencial para grid não vazar
  overflow: hidden;

  &:hover {
    background: rgba(0, 0, 0, 0.24);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (min-width: 1024px) {
    padding: 12px 16px;
  }
}

// Cabeçalho do cartão de ação
.cartao-acao__cabecalho {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
}

.cartao-acao__titulo {
  font-size: 12px;
  font-weight: 800;
  color: $offwhite;
  letter-spacing: -0.01em;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 1024px) {
    font-size: 14px;
  }
}

.cartao-acao__contagem {
  font-size: 10px;
  font-weight: 800;
  color: $background;
  padding: 1px 5px;
  border-radius: 999px;
  line-height: 1.4;
  flex-shrink: 0;
}

// Rodapé do cartão de ação
.cartao-acao__rodape {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.cartao-acao__descricao {
  font-size: 10px;
  color: rgba($offwhite, 0.45);
  flex: 1;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 1024px) {
    font-size: 12px;
  }
}

.cartao-acao__seta {
  font-size: 12px;
  color: rgba($offwhite, 0.3);
  margin-left: auto;
  flex-shrink: 0;
}

// Variante: Cordada
.cartao-cordada {
  border-color: rgba($action-escaladas, 0.2);
}

.cartao-cordada__icone {
  font-size: 13px;
  color: $action-escaladas;
}

.cartao-cordada .cartao-acao__contagem {
  background: $action-escaladas;
}

// Variante: Conquistas
.cartao-conquistas {
  border-color: rgba($cumes-03, 0.2);
}

.cartao-conquistas__icone {
  font-size: 13px;
  color: $cumes-03;
}

.cartao-conquistas .cartao-acao__contagem {
  background: $cumes-03;
}

// Mini bolhas de conquistas dentro do cartão
.conquistas-mini-bolhas {
  display: flex;
  gap: 4px;
  flex: 1;
  align-items: center;
}

.conquista-mini-bolha {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba($offwhite, 0.15);
  flex-shrink: 0;

  i {
    font-size: 9px;
    color: #081012;
  }
}

// Seção Bio + Via Predileta
.secao-bio-predileta {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  padding: 0 8px;
  margin-top: 8px;
  min-width: 0; // evita overflow no grid

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    padding: 0;
    gap: 12px;
  }
}

// Cartão de informação (Bio, Via Predileta)
.cartao-info {
  background: rgba(0, 0, 0, 0.14);
  border: 1px solid rgba($cumes-03, 0.18);
  border-radius: 12px;
  padding: 8px 10px;
  min-height: 0;
  min-width: 0; // essencial para não vazar no grid
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    padding: 10px 14px;
    border-radius: 14px;
  }
}

// ============================================
// LAYOUT DESKTOP (>= 1024px)
// ============================================
.perfil-page-desktop {
  max-width: 1024px;
  margin: 0 auto;
  padding: 20px 18px 28px;
  color: hsl(45 20% 90%);
  font-family: 'DM Sans', sans-serif;
}

.desktop-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

// Cabeçalho Desktop: foto + informações + ações
.desktop-cabecalho {
  display: flex;
  align-items: center;
  gap: 18px;
  background: var(--ds-card);
  border-radius: 16px;
  padding: 20px 20px;
  border: 1px solid color-mix(in srgb, var(--ds-border) 90%, transparent);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  position: relative;
  backdrop-filter: blur(10px);
  background-image: linear-gradient(
    120deg,
    hsla(80, 15%, 14%, 0.78) 0%,
    hsla(80, 18%, 12%, 0.78) 58%,
    hsla(80, 14%, 10%, 0.78) 100%
  );
}

// Wrapper da foto de perfil
.foto-perfil-wrapper {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.25s ease;

  &:hover {
    transform: scale(1.04);

    .foto-perfil-sobreposicao {
      opacity: 1;
    }
  }
}

.foto-perfil-desktop {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  border: 2px solid rgba($cumes-04, 0.6);
  box-shadow: 0 4px 14px $box-shadow-dark;
  object-fit: cover;
  display: block;
}

.foto-perfil-sobreposicao {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.sobreposicao-icone {
  font-size: 22px;
  color: $offwhite;
}

// Informações do usuário ao lado da foto
.cabecalho-informacoes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.cabecalho-nome-linha {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 10px;
  min-width: 0;
}

.nome-usuario-desktop {
  font-size: clamp(20px, 1.9vw, 28px);
  font-weight: 800;
  color: hsl(45 30% 95%);
  margin: 0;
  text-shadow: 0 2px 5px $text-shadow-default;
  line-height: 1.2;
  font-family: 'Sora', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.badge-username {
  font-size: 10px;
  font-weight: 600;
  color: var(--ds-muted-fg);
  padding: 2px 7px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--ds-border) 90%, transparent);
  background: color-mix(in srgb, var(--ds-muted) 75%, transparent);
  white-space: nowrap;
  flex-shrink: 0;
}

// Grade 2x2 de chips de detalhes
.detalhes-usuario-desktop {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 18px;
  row-gap: 8px;
}

.detalhe-chip {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0;
  background: transparent;
  border-radius: 0;
  overflow: hidden;

  &--vazio {
    opacity: 0.45;

    span, a {
      font-style: italic;
    }
  }

  &__icone {
    font-size: 12px;
    color: var(--ds-accent);
    flex-shrink: 0;
  }

  span, a {
    font-size: 12px;
    color: color-mix(in srgb, var(--ds-fg) 90%, transparent);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
  }
}

.link-externo {
  color: $offwhite;
  text-decoration: underline;
  font-size: 12px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Botões de ação no cabeçalho (config, compartilhar)
.cabecalho-acoes {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: -2px;
}

.botao-acao-cabecalho {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--ds-border) 90%, transparent);
  background: color-mix(in srgb, var(--ds-muted) 70%, transparent);
  color: var(--ds-accent);
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;

  &:hover {
    background: color-mix(in srgb, var(--ds-muted) 88%, transparent);
    transform: scale(1.08);
  }
}

// Barra de estatísticas Desktop — fundo transparente (usa o fundo da página)
.barra-estatisticas-desktop {
  background: transparent;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  margin-top: -6px;
}

.desktop-conteudo-grid {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  grid-template-rows: minmax(132px, auto) minmax(94px, auto);
  grid-template-areas:
    "bio via"
    "cordada conquistas";
  gap: 16px;
}

.cartao-info--bio { grid-area: bio; }
.cartao-info--via { grid-area: via; }
.cartao-cordada { grid-area: cordada; }
.cartao-conquistas { grid-area: conquistas; }

.cartao-acao--linha {
  min-height: 94px;
}

@media (min-width: 1024px) {
  .cartao-info,
  .cartao-acao {
    background: var(--ds-card);
    border: 1px solid color-mix(in srgb, var(--ds-border) 90%, transparent);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    transition: border-color 0.2s ease, transform 0.15s ease;
  }

  .cartao-info {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .cartao-info:hover,
  .cartao-acao:hover {
    border-color: color-mix(in srgb, var(--ds-primary) 40%, transparent);
  }

  .cartao-acao__titulo {
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    color: hsl(45 30% 95%);
  }

  .cartao-acao__descricao {
    color: var(--ds-muted-fg);
  }

  .cartao-acao__contagem {
    background: var(--ds-accent) !important;
    color: var(--ds-accent-fg) !important;
  }
}

/* Ajuste fino dos componentes internos para casar com o template */
@media (min-width: 1024px) {
  :deep(.div-externa .title-box) {
    border-bottom: 1px solid color-mix(in srgb, var(--ds-border) 90%, transparent) !important;
  }

  :deep(.div-externa .titulo) {
    color: var(--ds-accent) !important;
    font-family: 'Sora', sans-serif;
    font-size: 12px !important;
    letter-spacing: 0.06em !important;
    text-transform: uppercase;
  }

  :deep(.div-externa .icon) {
    color: var(--ds-accent) !important;
    opacity: 0.9;
  }

  :deep(.div-externa .descricao-bio),
  :deep(.div-externa .empty-text),
  :deep(.div-externa .montanha-info) {
    color: var(--ds-muted-fg) !important;
    font-family: 'DM Sans', sans-serif;
  }

  :deep(.div-externa .btn-ver-mais) {
    color: var(--ds-accent) !important;
  }

  :deep(.div-externa .via-nome) {
    font-family: 'Sora', sans-serif;
    color: hsl(45 30% 95%) !important;
  }

  :deep(.div-externa .card-info) {
    background: color-mix(in srgb, var(--ds-primary) 42%, var(--ds-card)) !important;
    border: 1px solid color-mix(in srgb, var(--ds-border) 88%, transparent) !important;
    border-radius: 14px !important;
    box-shadow: none !important;
  }
}

// ============================================
// DIÁLOGO DE CONQUISTAS
// ============================================
.conquista-tooltip-title {
  font-weight: 700;
  margin-bottom: 2px;
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

.conquista-descricao {
  margin-top: 6px;
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

.achievements-list {
  border-radius: 12px;
  overflow: hidden;
}

// ============================================
// DIÁLOGO DE SEGUIMENTO (SEGUIDORES / SEGUINDO)
// ============================================
.seguimento-list {
  border-radius: 12px;
  overflow: hidden;
  min-width: 280px;
}

.seguimento-item {
  border-radius: 8px;
  transition: background 0.15s ease;

  &:hover {
    background: rgba($cumes-01, 0.06);
  }
}

.seguimento-loading,
.seguimento-empty {
  padding: 12px;
  color: rgba($background, 0.6);
  font-size: 14px;
}

.custom-avatar {
  border-radius: 8px !important;
  overflow: hidden;
}
</style>
