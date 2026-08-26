# Cumes Brasil

> **Status: Archived.** This project is no longer actively developed or deployed — see [README.md](README.md) for the full story. This file is kept as-is for anyone who wants an AI assistant (or a human) to understand the codebase quickly, whether to study it, fork it, or pick it back up.

A climbing route catalog PWA focused on Rio de Janeiro. Lets climbers explore routes, build personal collections, view topo sketches (*croquis*), and access data offline.

Stack: **Vue 3 + Quasar** (frontend) · **Node.js + Express + TypeORM** (backend) · **PostgreSQL**

---

## Architecture

@documentacao/ARQUITETURA-BACKEND.md
@documentacao/ARQUITETURA-FRONTEND.md

---

## Design System

@documentacao/DESIGN_FRONTEND.md

---

## Essential Commands

```bash
# Full setup from scratch
cd backend && npm run db:fresh && npm run dev

# Seed only (incremental, idempotent) — syncs usuarios-teste.yaml (password, role)
npm run seed

# In dev, `npm run dev` applies pending migrations on startup; seeding stays manual

# New migration (always build first)
npm run build && npm run migration:generate
# → rename the generated file to something descriptive
npm run migration:run:dev
```

---

## Project History

This project isn't tracked in an active backlog anymore — what follows is a snapshot of where it landed, kept for context rather than as a to-do list.

### Completed epics
- **CERJ Classic Routes** — backend and frontend done (badge on cards, search filter, home and explore cards)
- **Persisted achievements** — tier badges computed on the backend and stored in `usuario_conquistas` (own profile and public profile)
- **Routes/Search screen redesign** — Explore screen with categories, advanced filters in a side panel, Home with visual photo cards, pt-BR copy standardized
- **Public/private profiles** — `perfil_publico` field on `Usuario` (default `true`), toggle in `PerfilEditaForm`, feed and `GET /u/:username` filter out private profiles
- **Collaborative photo system** — `ViaImageSugestao` entity + user uploads + moderation workflow, plus a role-based admin panel (`usuario` / `moderador` / `admin`)
- **Search module rename** — `SearchController`/`SearchService` replaced by a `Busca` module split by entity type (`BuscaViaService`, `BuscaEscaladaService`, `BuscaColecaoService` via `BuscaRegistry`)

### Known unfinished work (if you're picking this up)
- **Interfaces for Services and Repositories on the backend** — TypeDI is wired for interface-based injection, but most services are still injected as concrete classes
- **TypeORM query optimization** — N+1 queries, indexes, eager/lazy loading review pending
- **Image field on Colecao** — was on the roadmap, never implemented
- **AWS infrastructure decommissioned** — the app ran in production on EC2 + S3 + CloudFront for a while; infra was torn down after credits ran out. See the "Legacy Infrastructure" notes in `documentacao/ARQUITETURA-BACKEND.md` if you ever want to bring it back.

---

## Git Conventions

*(Historical — this is how the original team worked. Still a reasonable default if you keep contributing.)*

### Branches

Format: `#<task-number>-<name>-<kebab-case-description>`

- The number came from the team's Trello card
- Name is the first name of whoever was working on it
- Short kebab-case description

Real examples:
```
#2-rafael-vias-classicas-do-CERJ
#22-rafael-ajustar-sql
#13-ELMO-ordenar-colecao-por-data-de-adicao
#17-vitor-otimizar-consultas-sql
```

### Commits

Format: **Conventional Commits**, written in Portuguese (the team's shared language).

```
<type>: <short description in Portuguese>
```

Types used in this project:
- `feat:` — new feature
- `fix:` — bug fix
- `refactor:` — restructuring without behavior change
- `style:` — visual tweaks (CSS, layout, colors)
- `docs:` — documentation
- `chore:` — maintenance, configs, dependencies

Real examples:
```
feat: implementa estrutura de localização e refatora componentes relacionados
fix: corrige inconsistencias de cores entre paginas
refactor: reorganizar pasta assets e corrigir upload de fotos
style: ajusta espacamentos na hero section da Home
docs: adicionar índice com navegação no arquivo melhorias.md
```

When a commit is tied to a specific task, it could be prefixed with `#N`:
```
#14- filtro de montanha na tela de busca
#2-rafael: Vias Classicas do CERJ
```

---

## Code Conventions

### Variable and function names

- **Portuguese (pt-BR) camelCase** throughout the codebase (variables, functions, interfaces, fields) — this was a deliberate choice by a Brazilian team building for Brazilian climbers, not an inconsistency to "fix."
- Framework/library names keep their original casing (`useRouter`, `ref`, `onMounted`)
- Constants in `UPPER_SNAKE_CASE` with Portuguese words (`CHAVE_CACHE`, `DIAS_CACHE`)

### Examples

```typescript
// Variables
const carregando = ref(true);
const totalVias = ref(0);
const filtrosLocalizacaoAtual = ref({});

// Functions
function irParaBuscaFiltrada(tipoFiltro: string) { ... }
function aoMudarLocalizacao(filtros: Record<string, number>) { ... }
async function obterEstatisticas(): Promise<IEstatisticas> { ... }

// Interfaces
interface CardExplorar {
  titulo: string;
  tipoFiltro: string;
  contagem: number | null;
}
```

---

## Decisions & Context Not Obvious From the Code

- **No Pinia/Vuex** — state is local per component. Shared state would need discussion before implementation.
- **UI: PrimeVue-first, Quasar as the base** — new components prefer PrimeVue (more configurable); Quasar remains the shell (build, PWA, routing, `q-layout`/`q-page` layouts). Quasar was never meant to be removed from the project. Migrating existing `q-*` components was meant to happen incrementally, per area. Details in `DESIGN_FRONTEND.md`.
- **Clean frontend type-check** — `npx vue-tsc --noEmit` was kept at **0 errors** (`skipLibCheck: true` in `tsconfig.json` ignores third-party `.d.ts` files). Worth keeping that way if you touch the frontend.
- **`aws-sdk` v2** in `S3Helper` — a conscious piece of tech debt; migration to v3 was never done.
- **YAML files are the source of truth for data** — never edit the database directly; always go through `src/Infrastructure/data/*.yaml` + `npm run seed`.
- **Images need `@JoinColumn`** — relations to `Imagem` on the `Usuario` entity use `foto_perfilId` (capital I).
- **Public/private profiles** — `Usuario.perfil_publico` (default `true`). Private profiles don't show up in the feed or at `GET /u/:username` (404). Toggle lives in `PerfilEditaForm`.
- **Role-based authorization (`role`)** — `Usuario.role` (enum `PapelUsuario`: `usuario`/`moderador`/`admin`, default `usuario`) is the **single source of truth** for backend authorization. `is_admin` became a **derived getter** (`role === admin`) with no column in the database — used only as a UI hint on the frontend (login/DTO/localStorage). The backend authorizes via `requireRole(...roles)`/`requireAdmin`, which re-reads `role` from the database on every request (editing localStorage client-side grants no real access). The seed accepts an explicit `role:` or `is_admin: true` (compat, maps to `admin`). Admin panel: `PATCH /admin/usuarios/:id/papel` (set role) and `.../toggle-admin` (compat).
- **Profile route** — `/perfil/:username` (own profile or a visitor's). `/perfil` and `/perfil/me` redirect to the logged-in user's own profile. The guard in `PerfilPageWrapper` distinguishes owner (editable) from visitor (read-only).
- **"On the rope" mentions** — profile preview: a compact strip with bubbles (route photos) and a "See list" link; the `/perfil/:username/escaladas` page (login required) uses rows (`PerfilMarcacaoEscaladaRow`), not a grid of `EscaladaCard`. API: `como=marcado`; the repository loads `viaImagens` for thumbnails.
- **Test users** — seeded via `usuarios-teste.yaml`: shared password `teste123` — `teste@cumes.com.br` (`cumes_teste`), `maria.dev@cumes.com.br` (`maria_escaladora`), `privado.dev@cumes.com.br` (`usuario_privado`, private profile), `rafael.dev@cumes.com.br` (`rafael`). Climbs and collections: `escaladas-teste.yaml`, `colecoes-vias-teste.yaml`.
- **AWS infrastructure decommissioned** due to running out of credits — see `documentacao/ARQUITETURA-BACKEND.md` for the legacy setup if it's ever worth reviving.

---

## Documentation

| File | Content |
|------|---------|
| `README.md` | Project overview, features, local setup, credits |
| `CONTRIBUTORS.md` | The people who built this, and data/content sources |
| `documentacao/ARQUITETURA-BACKEND.md` | DDD, entities, seed, migrations, patterns |
| `documentacao/ARQUITETURA-FRONTEND.md` | Vue 3, services, routing, auth, components |
| `documentacao/DESIGN_FRONTEND.md` | Color palette, typography, buttons, modals, CSS conventions |
| `backend/README.md` | Local setup, scripts, environment variables |
