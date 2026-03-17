# Arquitetura do Frontend

## Stack

- **Vue 3** (Composition API com `<script setup lang="ts">`)
- **Quasar 2** — framework UI, PWA, roteamento, notificações
- **PrimeVue 4** — componentes UI adicionais (Paginator, etc.)
- **Vite** — bundler
- **Axios** — HTTP client
- **TypeScript** em todo o projeto

---

## Estrutura de Pastas

```
src/
├── assets/         # Imagens e arquivos estáticos
├── boot/           # Inicialização do Quasar (axios, primevue, googleLogin, errorHandler)
├── components/     # Componentes reutilizáveis, organizados por feature
│   ├── Auth/
│   ├── Busca/
│   ├── Colecao/
│   ├── Escalada/
│   ├── Home/
│   ├── Perfil/
│   └── Via/
├── css/            # Estilos globais (variáveis SCSS, reset)
├── layouts/        # Layouts de página (MainLayout, NavBar, SideBar)
├── models/         # Interfaces TypeScript (Via, IUsuario, IColecao, etc.)
├── pages/          # Componentes de página mapeados às rotas
│   └── Auth/
├── router/         # Configuração do Vue Router
├── services/       # Camada de serviços — toda comunicação com a API
└── utils/          # Funções utilitárias (formatação, imagens, erros)
```

---

## Gerenciamento de Estado

**Não usa Pinia nem Vuex.** Estado é local por componente via `ref()` e `reactive()`.

- Autenticação: `localStorage.authToken` e `localStorage.usuarioId`
- Dados de página: carregados no `onMounted` de cada componente
- Comunicação entre componentes: props/emits, sem estado global

Para features com estado compartilhado mais complexo, considerar Pinia (já está no roadmap implícito).

---

## Serviços (camada de API)

Cada domínio tem um service singleton em `src/services/`:

| Service | Responsabilidade |
|---------|-----------------|
| `AuthenticateService` | Login, registro, Google OAuth, reset de senha |
| `ViaService` | Listagem, detalhes, favoritar vias |
| `ColecaoService` | CRUD de coleções e favoritos |
| `UsuarioService` | Perfil do usuário |
| `EscaladaService` | Registros de escalada |
| `SearchService` | Busca e filtros de vias |
| `HomeService` | Stats e dados da home |
| `CroquiService` | Croquis de vias |
| `ImagemService` | Processamento de URLs de imagem |
| `MontanhaService` | Dados de montanhas |

**Padrão:** Classe com métodos async que fazem chamadas via axios. Exportada como singleton (`export default new XxxService()`).

---

## Autenticação

- Token JWT guardado em `localStorage.authToken`
- ID do usuário em `localStorage.usuarioId`
- Axios interceptor (em `boot/axios.ts`) adiciona `Authorization: Bearer <token>` em todas as requests
- Respostas 401 limpam o localStorage e redirecionam para `/auth/login`
- Google OAuth via `boot/googleLogin.ts`

---

## Roteamento

Arquivo: `src/router/routes.ts`

- Todas as páginas são **lazy-loaded** (`() => import('./pages/...')`)
- Hash mode ou history mode via `VUE_ROUTER_MODE` (env)
- Rotas principais: `/`, `/busca`, `/vias/:id`, `/colecoes`, `/colecoes/:id`, `/favoritas`, `/escaladas`, `/perfil`, `/auth/*`
- `MainLayout` envolve todas as rotas autenticadas

---

## Imagens

- URLs das imagens chegam da API com prefixo `/assets/` (ex.: `/assets/vias/foto.png`)
- `ImagemService` reconstrói a URL completa usando `VITE_APP_ASSETS_URL`
- `utils.ts` tem `getViaImageUrl()` e `getViaImageUrlFull()` para fallback inteligente:
  - Via sem foto → foto da montanha → placeholder padrão

---

## Padrões de Componente

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{ via: Via }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const loading = ref(false);
const data = ref<Via[]>([]);

onMounted(async () => {
  loading.value = true;
  data.value = await viaService.list();
  loading.value = false;
});
</script>
```

- Sempre `<script setup lang="ts">`
- Props tipadas com generics do `defineProps`
- `q-*` para componentes Quasar, `pi pi-*` para ícones PrimeIcons
- Notificações via `useQuasar().notify(createNotifyConfig(...))`

---

## Design System

Ver `documentacao/DESIGN_FRONTEND.md` para:
- Paleta de cores (variáveis SCSS `$cumes-01` a `$cumes-05`)
- Regras de uso de cores em cards, botões, textos
- Padrões de modais e formulários
