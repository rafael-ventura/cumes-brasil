# Backend Architecture — Cumes Brasil

## Stack

| Technology | Version | Role |
|-----------|---------|------|
| Node.js + TypeScript | — | Runtime and language |
| Express | 5.1.0 | HTTP framework |
| TypeORM | 0.3.20 | ORM and migrations |
| PostgreSQL | — | Database |
| TypeDI | 0.10.0 | Dependency injection |
| Zod | 3.x | Input validation |
| Winston | 3.x | Structured logging |
| JWT + bcrypt | — | Authentication |
| Multer-S3 | — | File uploads |

---

## DDD Architecture

The backend follows Domain-Driven Design with four layers:

```
Api  →  Application  →  Domain  ←  Infrastructure
```

### 📁 Api (`backend/src/Api/`)

The HTTP interface — receives requests, returns responses.

**Controllers** (`Api/Controllers/`):
- `AuthenticateController` — login, registration, Google OAuth
- `UsuarioController` — user CRUD
- `ViaController` — route (*via*) CRUD
- `ColecaoController` — collections
- `EscaladaController` — climb logs
- `BuscaController` — search and filters, delegates to the `Busca` service module
- `StatsController` — stats and metrics
- `ConquistasController` — achievement/badge system
- `SeguimentoController` — social follow system
- `LocalizacaoController`, `MontanhaController`, `FaceController`
- `CroquiController`, `ImagemController`, `ShareController`
- **`Admin/ViaImageSugestaoController`** — submission (regular users) + moderation (admins)
- **`Admin/AdminViaController`** — route CRUD via the admin panel
- **`Admin/AdminUsuarioController`** — user listing and role management

**Routes** (`Api/routes/`):
- `routes.ts` — central configuration; one router per resource
- **`AdminRouter.ts`** — `/admin/*` (requires `authenticateToken` + `requireAdmin`)

**Middlewares** (`Api/Middlewares/`):
- `AuthenticateMiddleware` — validates the JWT
- **`AdminMiddleware`** — role-based authorization. Exposes `requireRole(...roles)` (a factory) and `requireAdmin` (= `requireRole(PapelUsuario.Admin)`). Re-reads `role` from the database on every request to `/admin/*` routes
- `ErrorRequestMiddleware` — centralized error handling
- `RateLimitMiddleware` — per-IP rate limiting
- `MulterMiddleware` — file uploads (includes `uploadViaImagem` for `assets/vias/`)

**DTOs** (`Api/DTOs/`):
- Transform entities into response JSON
- One subdirectory per resource: `Usuario/`, `Via/`, `Colecao/`, etc.

**Entry point**: `server.ts` — initializes Express, CORS, Helmet, rate limiting, static assets, and the database connection.

---

### 📁 Application (`backend/src/Application/`)

Business logic and orchestration.

**Services** (`Application/services/`):

Some services use `@Service()` TypeDI (the ones that need injection via `Container.get()`); the rest receive their dependencies through the constructor. Services return concrete domain types directly — there's no `ServiceResponse<T>` wrapper.

```typescript
// The predominant pattern — manual constructor injection
export class ViaService extends BaseService<Via, ViaRepository> {
  constructor(viaRepo: ViaRepository) {
    super(viaRepo);
  }

  async getViaById(id: number): Promise<Via> {
    const via = await this.repository.getById(id);
    if (!via) throw new NotFoundError('Via não encontrada');
    return via;
  }
}
```

Services using `@Service()` (TypeDI): `UsuarioService`, `MailService`, `ResetUserPasswordTokenService`, `ConquistasService`, `LocalizacaoService`, `SeguimentoService`, `ColecaoRepository`, `UsuarioConquistaRepository`.

Main services: `ViaService`, `UsuarioService`, `ColecaoService`, `EscaladaService`, `StatsService`, `ConquistasService`, `SeguimentoService`, `AuthenticateService`, `GoogleAuthenticateService`, `ImagemService`, `MailService`, `ViaImageSugestaoService`.

**Search module** (`Application/services/Busca/`) — split from a single `SearchService` into one service per entity type, coordinated through a registry:
- `BuscaRegistry` — looks up the right service for a given entity type
- `BuscaViaService`, `BuscaEscaladaService`, `BuscaColecaoService` — one per searchable entity
- `IBuscaTipo` — the shared contract each of them implements

**Validations** (`Application/validations/`):
- Objects with **static methods** per resource: `ViaValidation`, `UserValidation`, `EscaladaValidation`, `BuscaValidation`, etc.
- `ValidationBase` holds shared utilities (`idParam`, `pagination`, `requireObject`)
- They throw `BadRequestError` directly — **no Zod** here (a future migration was planned but never done)

**Errors** (`Application/errors/`):
- `BadRequestError` (400), `UnauthorizedError` (401), `NotFoundError` (404), `InternalServerError` (500)
- `ErrorRequestMiddleware` handles everything centrally

---

### 📁 Domain (`backend/src/Domain/`)

Domain rules, with no dependency on external technologies.

**Entities** (`Domain/entities/`):

*Core*: `Via`, `Usuario`, `Escalada`, `Colecao`

*Hierarchical location*:
`Continente → Pais → Regiao → Estado → Cidade → Bairro → Localizacao`
and also `Montanha → Face → Setor`

*Media*: `Imagem`, `Croqui`

*Relationships*: `ViaImagem`, `ViaCroqui`, `ViaColecao`, `Participante`, `UsuarioSeguindo`, `UsuarioConquista`, `ViaImageSugestao`

*Base*: `BaseEntityWithTimestamps` — id, createdAt, updatedAt

**Interfaces** (`Domain/interfaces/`):
- `repositories/` — `ICrudRepository` (implemented by `BaseRepository`), `ISearchRepository` (implemented by `ViaRepository`, `ColecaoRepository`)
- `models/` — domain interfaces (`IUsuario`, `IVia`, `IColecao`, `IFiltrosBusca`, etc.) used as types across services and DTOs

**Enums** (`Domain/enum/`):
- `EModalidadeEscalada` — climb types
- `EParticipanteTipo` — guide / participant / mixed
- `EPapelUsuario` — user role (`usuario` / `moderador` / `admin`)

---

### 📁 Infrastructure (`backend/src/Infrastructure/`)

Persistence and external integrations.

**Config** (`Infrastructure/config/`):
- `db.ts` — the single TypeORM `DataSource` configuration
- `logger.ts` — Winston configuration

**Repositories** (`Infrastructure/repositories/`):

Concrete implementations of the Domain interfaces. All extend `BaseRepository`:
`UsuarioRepository`, `ViaRepository`, `ColecaoRepository`, `EscaladaRepository`, `ImagemRepository`, `CroquiRepository`, `MontanhaRepository`, `FaceRepository`, `LocalizacaoRepository`, `UsuarioSeguindoRepository`, `UsuarioConquistaRepository`, `ViaImageSugestaoRepository`.

**Seeds** (`Infrastructure/seeds/`):
- `seed.ts` — the main orchestrator (idempotent)
- `loaders/` — `UsuarioLoader`, `ViaLoader`, `EscaladaLoader`, etc.
- Data lives in `data/*.yaml` — the **source of truth** (never edit the database directly)

**Data** (`Infrastructure/data/`):
- `usuarios-teste.yaml`, `vias.yaml`, `escaladas-teste.yaml`, `colecoes-vias-teste.yaml`

**Migrations** (`Infrastructure/migrations/`):
- Generated automatically by TypeORM
- Never edited by hand (except for data backfills, which `generate` doesn't create on its own)
- `npm run build && npm run migration:generate` → rename → `npm run migration:run:dev`

**Naming convention — why there's a timestamp:**
The numeric suffix in the class name (`AddRoleToUsuario1766100000000`) is a **hard requirement** from TypeORM: it's both the ordering key and the idempotency key (the `migrations` table stores this number — it's how the ORM knows what already ran and in what order). **It can't be removed.** What keeps this organized:
- **Always use `migration:generate`** — it stamps the real timestamp (`Date.now()`), which is unique and encodes the creation date. **Never** hand-pick round numbers (e.g. `1766000000000`) — that's exactly how a timestamp collision happened between two migrations once.
- **Descriptive PascalCase name** after the timestamp, following the `<Verb><Target>` pattern: `AddRoleToUsuario`, `CriarViaImageSugestao`, `ChangeEscaladaDataToTimestamp`.
- **One migration = one logical change.** The file name (`<timestamp>-<Name>.ts`) should match the class name.
- To read the migration history in a human-friendly way: `npx typeorm migration:show -d ./dist/Infrastructure/config/db.js` lists everything in order with `[X]`/`[ ]`.

**Helpers** (`Infrastructure/helpers/`):
- `S3Helper.ts` — uploads to AWS S3 (SDK v2 — a conscious piece of tech debt)
- `imageHelper.ts` — image processing

---

## Code Patterns

### Controller Pattern

```typescript
export class ViaController {
  async buscarPorId(req: Request, res: Response) {
    const { id } = ViaIdSchema.parse(req.params);   // Zod validation
    const result = await viaService.buscarPorId(id); // service call
    return res.json(new ViaDTO(result.data));         // response DTO
  }
}
```

### Error Handling

- Centralized in `ErrorRequestMiddleware`
- Controllers don't handle errors individually — they throw and let the middleware deal with it
- Structured logging via Winston

### Authentication

- JWT via `Authorization: Bearer <token>`
- `AuthenticateMiddleware` validates the token and populates `req.usuario`
- Google OAuth via `GoogleAuthenticateService`
- Passwords hashed with bcrypt

---

## Essential Commands

```bash
# Full setup from scratch
npm run db:fresh           # reset + build + migration + seed

# Incremental seed (idempotent)
npm run seed

# New migration
npm run build && npm run migration:generate
# → rename the generated file to something descriptive
npm run migration:run:dev

# Dev
npm run dev:watch          # nodemon + ts-node
```

---

## Test Users (seed)

| Username | Email | Password | Note |
|----------|-------|----------|------|
| `cumes_teste` | `teste@cumes.com.br` | `teste123` | — |
| `maria_escaladora` | `maria.dev@cumes.com.br` | `teste123` | — |
| `usuario_privado` | `privado.dev@cumes.com.br` | `teste123` | private profile |
| `rafael` | `rafael.dev@cumes.com.br` | `teste123` | — |

---

## Legacy Infrastructure (Decommissioned)

The app ran in production for a while before this project was archived. For anyone reviving it:

- **Frontend**: S3 + CloudFront (static PWA, `cumesbrasil.com.br`)
- **Backend**: EC2 running Docker + PM2 (Node.js, `api.cumesbrasil.com.br`)
- **Database**: PostgreSQL in Docker, on the same EC2 instance
- **Images**: S3 + CloudFront (bucket `cumes-brasil-images`)
- **Deploy**: GitHub Actions + CodeDeploy (push to `main` → automatic deploy)

To bring it back: review current AWS pricing/plans, check `backend/src/Infrastructure/helpers/S3Helper.ts`, and update environment variables to point at CloudFront URLs again.
