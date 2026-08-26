# Frontend Architecture — Cumes Brasil

## Stack

| Technology | Version | Role |
|-----------|---------|------|
| Vue 3 | 3.4.18 | Reactive framework (Composition API + `<script setup lang="ts">`) |
| Quasar | 2.16.0 | UI base, PWA, build system, `q-*` components |
| PrimeVue | 4.2.5 | Complementary components (Paginator, Dropdown, Button) |
| TypeScript | — | Language |
| Vue Router | 4 | Routing with lazy loading |
| Axios | 1.7.4 | HTTP communication with the API |
| @vueuse/core | — | Utility composables |

---

## Folder Structure

```
frontend/src/
├── boot/          # Plugins initialized before the app mounts
├── components/    # Reusable components, organized by feature
├── css/           # Global styles and SCSS variables
├── layouts/       # Page layouts
├── models/        # TypeScript interfaces
├── pages/         # Views mapped to routes
├── router/        # Route configuration
├── services/      # API communication (singletons)
└── utils/         # Utility functions
```

---

## Components (`components/`)

Organized by feature. Quasar (`q-*`) as the base; PrimeVue where a suitable component exists.

**Auth/** — `GoogleLoginButton.vue`

**Busca/** — `Busca.vue` (container, exposes `aoAplicarFiltros` via `defineExpose`), `BuscaFiltros.vue`, `BuscaResultados.vue`, `SearchBar.vue`

**Colecao/** — `ColecaoCard.vue`, `ColecaoLista.vue`, `AddColecaoModal.vue`, `AddViaModal.vue`, `ItemSelectorModal.vue`, `ModalConfigColecoes.vue`

**Escalada/** — `EscaladaCard.vue`, `ModalCriarEscalada.vue`, `Observacao.vue`

**Explorar/** — `FilterChips.vue`, `LocationExplorer.vue`

**Home/** — `FeedEscaladaPost.vue`

**Perfil/** — `PerfilBar.vue`, `PerfilBio.vue`, `PerfilEditaForm.vue`, `PerfilEditaFormAddPrediletaModal.vue`, `PerfilEscaladasDestaque.vue`, `PerfilGridButtons.vue`, `PerfilMarcacaoEscaladaRow.vue`, `PerfilViaPredileta.vue`, `FotoPerfilUpload.vue`

**Via/** — `ViaCard.vue`, `ViaCardSmall.vue`, `ViaCardSmallSmall.vue`, `ViaLista.vue`, `BotoesAcao.vue`, `CardInfoPrincipal.vue`, `GrauBadge.vue`, `BadgeCerj.vue`, `SecaoCroqui.vue`, `SecaoGrau.vue`, `SecaoLocalizacao.vue`, `SecaoMaisDetalhes.vue`, `CarrosselFotosVia.vue`, `ModalSugestaoMelhoria.vue` (community photo/correction submissions)

**Root utilities** — `BotaoVoltar.vue`, `PaginacaoPadrao.vue`, `ImagePlaceholder.vue`, `ItemSugestao.vue`, `ScrolToTop.vue`, `ErrorHandler.vue`

---

## Layouts (`layouts/`)

- `MainLayout.vue` — the main layout. Renders `TopBar` on desktop (≥1024px) and `NavBar` on mobile. 70px top padding compensates for the fixed `TopBar`.
- `TopBar.vue` — fixed top bar, 70px, desktop only
- `NavBar.vue` — bottom navigation bar, mobile only
- `SubNavbar.vue` — contextual subnav (search, explore)

---

## Pages (`pages/`)

| File | Route |
|------|-------|
| `Home.vue` | `/` |
| `ExplorarVias.vue` | `/explorar` |
| `CatalogoVias.vue` | `/busca` |
| `ViaDetalhada.vue` | `/vias/:id` |
| `Colecoes.vue` | `/colecoes` |
| `ColecaoDetalhada.vue` | `/colecoes/:id` |
| `Favoritas.vue` | `/favoritas` |
| `Escaladas.vue` | `/escaladas` |
| `EscaladaDetalhada.vue` | `/escaladas/:id` |
| `PerfilPageWrapper.vue` | `/perfil/:username` (wrapper distinguishing owner vs. visitor) |
| `Perfil.vue` | own profile (editable) |
| `PerfilPublico.vue` | another user's profile (read-only) |
| `PerfilEscaladasLista.vue` | `/perfil/:username/escaladas` |
| `Auth/Login.vue` | `/auth/login` |
| `Auth/Register.vue` | `/auth/register` |
| `Auth/RedefinirSenha.vue` | `/auth/reset-password` |
| **`Admin/AdminDashboard.vue`** | `/admin` (requires an admin/moderator role) |
| **`Admin/AdminSugestoesImagens.vue`** | `/admin/sugestoes` — moderate community photos |
| **`Admin/AdminVias.vue`** | `/admin/vias` — route CRUD |
| **`Admin/AdminUsuarios.vue`** | `/admin/usuarios` — list users and set role (`usuario`/`moderador`/`admin`) via `PATCH /admin/usuarios/:id/papel` |
| `ErrorNotFound.vue` | 404 |

---

## Services (`services/`)

Singletons that wrap every API call through Axios:

`AuthenticateService` (includes `getRole()`, `temPapel(...)`, `isModerador()`, `isAdmin()` — the role is kept in `localStorage` purely as a UI hint; real authorization happens on the backend), `ViaService`, `ColecaoService`, `EscaladaService`, `UsuarioService`, `SearchService`, `HomeService`, `CroquiService`, `ImagemService`, `MontanhaService`, `LocalizacaoService`, `ConquistasService`, `SeguimentoService`, `ViaImageSugestaoService` (photo submission and moderation)

---

## CSS (`css/`)

| File | Content |
|------|---------|
| `app.scss` | Global color/shadow variables, SCSS functions, utility classes |
| `quasar.variables.scss` | Quasar theme variables (`$primary`, `$dark`, dark mode) |
| `inputs.scss` | Auth input styles |
| `lista-toolbar-acoes.scss` | Action toolbar (climbs, favorites, collections) |

See `DESIGN_FRONTEND.md` for the full palette and usage rules.

---

## State Management

**No Pinia/Vuex** — state is local per component:
- `ref()` and `reactive()` (Composition API)
- `localStorage` for auth: `authToken`, `usuarioId`, `username`
- Props + emits for parent/child communication

---

## Boot Files (`boot/`)

Run before `app.mount()`:
- `axios.ts` — Axios instance + interceptors (auth token in headers, 401 redirect)
- `googleLogin.ts` — Google OAuth setup
- `primevue.ts` — global PrimeVue component registration
- `errorHandler.ts` — global error handling

---

## Routing (`router/`)

- `routes.ts` — defines every route; all lazy-loaded (`() => import(...)`)
- `index.ts` — Vue Router configuration

**Profile guard**: `PerfilPageWrapper` checks whether the route's `username` matches the logged-in user, to render either the editable profile or the read-only public one.

**Profile routes**:
- `/perfil/:username` — main route
- `/perfil` and `/perfil/me` → redirect to `/perfil/<logged-in-username>`

---

## Code Patterns

### Component structure

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
  <!-- q-* (Quasar) components, and PrimeVue where appropriate -->
</template>

<style scoped lang="scss">
@import 'src/css/app.scss';
/* styles using the design system's SCSS variables */
</style>
```

### Naming conventions

| Context | Convention | Example |
|---------|-----------|---------|
| JS/TS variables | pt-BR camelCase | `const carregando = ref(false)` |
| Functions/methods | pt-BR camelCase | `async function aoSalvar() {}` |
| Event handlers | pt-BR `ao*` prefix | `aoClicarFavorito`, `aoAplicarFiltros` |
| Interfaces/types | pt-BR camelCase | `interface CardExplorar {}` |
| Constants | pt-BR UPPER_SNAKE | `const DIAS_CACHE = 7` |
| CSS classes | English kebab-case | `.modal-card`, `.btn-primary-custom` |
| Library/framework names | Kept as-is | `useRouter`, `ref`, `onMounted` |

This mixed convention (Portuguese logic, English CSS) was a deliberate choice — see `DESIGN_FRONTEND.md` for the reasoning.

### Notifications

```typescript
import { useQuasar } from 'quasar';
const $q = useQuasar();
$q.notify({ type: 'positive', message: '...', position: 'top-right' });
```

### Accessing an exposed method via ref (`Busca.vue`)

`Busca.vue` exposes `aoAplicarFiltros` via `defineExpose`. Pages access it like this:

```typescript
const searchEntityRef = ref();
// In the template: <Busca ref="searchEntityRef" ... />
searchEntityRef.value?.aoAplicarFiltros({ page: 1 });
```

---

## Models (`models/`)

TypeScript interfaces mirroring the API's DTOs:

**Core**: `Via`, `Escalada`, `IColecao`, `IUsuario`

**Supporting**: `Croqui`, `Imagem`, `Face`, `Fonte`, `Montanha`, `Localizacao`, `Participante`, `ModalidadeEscalada`, `SearchResult`, `BuscaRequest`, `IConquistas`, `IViaImageSugestao`

---

## Utils (`utils/`)

- `utils.ts` — general utilities, `getViaImageUrl` (resolves a route's thumbnail)
- `colecaoUtils.ts` — collection helper functions
- `dataAtividade.ts` — pt-BR date formatting
- `escalaDuracao.ts` — climb duration formatting
- `buscaOrdenacao.ts` — search result ordering
- `share.ts` — shareable URL generation
