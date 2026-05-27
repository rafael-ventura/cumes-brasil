# Arquitetura Frontend — Cumes Brasil

## Stack

| Tecnologia | Versão | Papel |
|-----------|--------|-------|
| Vue 3 | 3.4.18 | Framework reativo (Composition API + `<script setup lang="ts">`) |
| Quasar | 2.16.0 | UI base, PWA, build system, componentes `q-*` |
| PrimeVue | 4.2.5 | Componentes complementares (Paginator, Dropdown, Button) |
| TypeScript | — | Linguagem |
| Vue Router | 4 | Roteamento com lazy loading |
| Axios | 1.7.4 | Comunicação HTTP com a API |
| @vueuse/core | — | Composables utilitários |

---

## Estrutura de Pastas

```
frontend/src/
├── boot/          # Plugins inicializados antes do app montar
├── components/    # Componentes reutilizáveis por feature
├── css/           # Estilos globais e variáveis SCSS
├── layouts/       # Layouts de página
├── models/        # Interfaces TypeScript
├── pages/         # Views mapeadas às rotas
├── router/        # Configuração de rotas
├── services/      # Comunicação com a API (singletons)
└── utils/         # Funções utilitárias
```

---

## Componentes (`components/`)

Organizados por feature. Quasar (`q-*`) como base; PrimeVue quando existir componente adequado.

**Auth/** — `GoogleLoginButton.vue`

**Busca/** — `Busca.vue` (container + `defineExpose({ aoAplicarFiltros })`), `BuscaFiltros.vue`, `BuscaResultados.vue`, `SearchBar.vue`

**Colecao/** — `ColecaoCard.vue`, `ColecaoLista.vue`, `AddColecaoModal.vue`, `AddViaModal.vue`, `ItemSelectorModal.vue`, `ModalConfigColecoes.vue`

**Escalada/** — `EscaladaCard.vue`, `ModalCriarEscalada.vue`, `Observacao.vue`

**Explorar/** — `FilterChips.vue`, `LocationExplorer.vue`

**Home/** — `FeedEscaladaPost.vue`

**Perfil/** — `PerfilBar.vue`, `PerfilBio.vue`, `PerfilEditaForm.vue`, `PerfilEditaFormAddPrediletaModal.vue`, `PerfilEscaladasDestaque.vue`, `PerfilGridButtons.vue`, `PerfilMarcacaoEscaladaRow.vue`, `PerfilViaPredileta.vue`, `FotoPerfilUpload.vue`

**Via/** — `ViaCard.vue`, `ViaCardSmall.vue`, `ViaCardSmallSmall.vue`, `ViaLista.vue`, `BotoesAcao.vue`, `BotoesAcaoMelhorado.vue`, `CardInfoPrincipal.vue`, `GrauBadge.vue`, `BadgeCerj.vue`, `SecaoCroqui.vue`, `SecaoGrau.vue`, `SecaoLocalizacao.vue`, `SecaoMaisDetalhes.vue`

**Utilitários raiz** — `BotaoVoltar.vue`, `PaginacaoPadrao.vue`, `ImagePlaceholder.vue`, `ItemSugestao.vue`, `ScrolToTop.vue`, `ErrorHandler.vue`

---

## Layouts (`layouts/`)

- `MainLayout.vue` — layout principal. Renderiza `TopBar` em desktop (≥1024px) e `NavBar` em mobile. Padding-top 70px para compensar a TopBar fixa.
- `TopBar.vue` — barra superior fixa, 70px, desktop only
- `NavBar.vue` — barra inferior de navegação, mobile only
- `SubNavbar.vue` — subnav contextual (busca, explorar)

---

## Pages (`pages/`)

| Arquivo | Rota |
|---------|------|
| `Home.vue` | `/` |
| `ExplorarVias.vue` | `/explorar` |
| `CatalogoVias.vue` | `/busca` |
| `ViaDetalhada.vue` | `/vias/:id` |
| `Colecoes.vue` | `/colecoes` |
| `ColecaoDetalhada.vue` | `/colecoes/:id` |
| `Favoritas.vue` | `/favoritas` |
| `Escaladas.vue` | `/escaladas` |
| `EscaladaDetalhada.vue` | `/escaladas/:id` |
| `PerfilPageWrapper.vue` | `/perfil/:username` (wrapper que distingue dono x visitante) |
| `Perfil.vue` | perfil do próprio usuário (edição) |
| `PerfilPublico.vue` | perfil de outro usuário (somente leitura) |
| `PerfilEscaladasLista.vue` | `/perfil/:username/escaladas` |
| `Auth/Login.vue` | `/auth/login` |
| `Auth/Register.vue` | `/auth/register` |
| `Auth/RedefinirSenha.vue` | `/auth/reset-password` |
| **`Admin/AdminDashboard.vue`** | `/admin` (requer `is_admin`) |
| **`Admin/AdminSugestoesImagens.vue`** | `/admin/sugestoes` — moderar fotos |
| **`Admin/AdminVias.vue`** | `/admin/vias` — CRUD de vias |
| `ErrorNotFound.vue` | 404 |

---

## Services (`services/`)

Singletons que encapsulam todas as chamadas à API via Axios:

`AuthenticateService` (inclui `isAdmin()`), `ViaService`, `ColecaoService`, `EscaladaService`, `UsuarioService`, `SearchService`, `HomeService`, `CroquiService`, `ImagemService`, `MontanhaService`, `LocalizacaoService`, `ConquistasService`, `SeguimentoService`, **`ViaImageSugestaoService`** (submissão e moderação de fotos)

---

## CSS (`css/`)

| Arquivo | Conteúdo |
|---------|----------|
| `app.scss` | Variáveis globais de cores, sombras, funções SCSS, classes utilitárias |
| `quasar.variables.scss` | Variáveis do tema Quasar (`$primary`, `$dark`, dark mode) |
| `inputs.scss` | Estilos de inputs de autenticação |
| `lista-toolbar-acoes.scss` | Toolbar de ações (escaladas, favoritos, coleções) |

Consultar `DESIGN_FRONTEND.md` para a paleta completa e regras de uso.

---

## State Management

**Sem Pinia/Vuex** — estado local por componente:
- `ref()` e `reactive()` (Composition API)
- `localStorage` para autenticação: `authToken`, `usuarioId`, `username`
- Props + emits para comunicação entre componentes pai/filho

---

## Boot Files (`boot/`)

Executados antes do `app.mount()`:
- `axios.ts` — instância Axios + interceptors (auth token nos headers, redirect 401)
- `googleLogin.ts` — configuração Google OAuth
- `primevue.ts` — registro global de componentes PrimeVue
- `errorHandler.ts` — tratamento de erros globais

---

## Roteamento (`router/`)

- `routes.ts` — define todas as rotas; todas com lazy loading (`() => import(...)`)
- `index.ts` — configuração Vue Router

**Guard de perfil**: `PerfilPageWrapper` verifica se o `username` da rota é o usuário logado para renderizar o perfil de edição ou o perfil público.

**Rotas de perfil**:
- `/perfil/:username` — rota principal
- `/perfil` e `/perfil/me` → redirecionam para `/perfil/<username-logado>`

---

## Padrões de Código

### Estrutura de componente

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{ via: Via }>();
const emit = defineEmits<{ (e: 'fechar'): void }>();

const carregando = ref(false);
const dados = ref<Via[]>([]);

async function aoSalvar() {
  carregando.value = true;
  // ...
}
</script>

<template>
  <!-- componentes q-* (Quasar) e PrimeVue quando adequado -->
</template>

<style scoped lang="scss">
@import 'src/css/app.scss';
/* estilos com variáveis SCSS do design system */
</style>
```

### Convenções de nomenclatura

| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| Variáveis JS/TS | ptBR camelCase | `const carregando = ref(false)` |
| Funções / métodos | ptBR camelCase | `async function aoSalvar() {}` |
| Event handlers | prefixo `ao*` em ptBR | `aoClicarFavorito`, `aoAplicarFiltros` |
| Interfaces / Types | ptBR camelCase | `interface CardExplorar {}` |
| Constantes | ptBR UPPER_SNAKE | `const DIAS_CACHE = 7` |
| Classes CSS | English kebab-case | `.modal-card`, `.btn-primary-custom` |
| Nomes de libs/frameworks | Mantêm original | `useRouter`, `ref`, `onMounted` |

### Notificações

```typescript
import { useQuasar } from 'quasar';
const $q = useQuasar();
$q.notify({ type: 'positive', message: '...', position: 'top-right' });
```

### Acesso a método exposto via ref (Busca.vue)

Busca.vue expõe `aoAplicarFiltros` via `defineExpose`. Pages acessam assim:

```typescript
const searchEntityRef = ref();
// No template: <Busca ref="searchEntityRef" ... />
searchEntityRef.value?.aoAplicarFiltros({ page: 1 });
```

---

## Models (`models/`)

Interfaces TypeScript que espelham os DTOs da API:

**Core**: `Via`, `Escalada`, `IColecao`, `IUsuario`

**Suporte**: `Croqui`, `Imagem`, `Face`, `Fonte`, `Montanha`, `Localizacao`, `Participante`, `ModalidadeEscalada`, `SearchResult`, `BuscaRequest`, `IConquistas`

---

## Utils (`utils/`)

- `utils.ts` — utilitários gerais, `getViaImageUrl` (resolve thumbnail de via)
- `colecaoUtils.ts` — funções de coleções
- `dataAtividade.ts` — formatação de datas em pt-BR
- `escalaDuracao.ts` — formatação de duração de escaladas
- `buscaOrdenacao.ts` — ordenação de resultados de busca
- `share.ts` — geração de URLs compartilháveis
