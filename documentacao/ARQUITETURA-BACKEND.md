# Arquitetura Backend — Cumes Brasil

## Stack

| Tecnologia | Versão | Papel |
|-----------|--------|-------|
| Node.js + TypeScript | — | Runtime e linguagem |
| Express | 5.1.0 | Framework HTTP |
| TypeORM | 0.3.20 | ORM e migrations |
| PostgreSQL | — | Banco de dados |
| TypeDI | 0.10.0 | Injeção de dependência |
| Zod | 3.x | Validação de entrada |
| Winston | 3.x | Logs estruturados |
| JWT + bcrypt | — | Autenticação |
| Multer-S3 | — | Upload de arquivos |

---

## Arquitetura DDD

O backend segue Domain-Driven Design com quatro camadas:

```
Api  →  Application  →  Domain  ←  Infrastructure
```

### 📁 Api (`backend/src/Api/`)

Interface HTTP — recebe requests, retorna responses.

**Controllers** (`Api/Controllers/`):
- `AuthenticateController` — login, registro, Google OAuth
- `UsuarioController` — CRUD de usuários
- `ViaController` — CRUD de vias
- `ColecaoController` — coleções
- `EscaladaController` — escaladas
- `SearchController` — busca e filtros
- `StatsController` — estatísticas e métricas
- `ConquistasController` — sistema de badges
- `SeguimentoController` — sistema social
- `LocalizacaoController`, `MontanhaController`, `FaceController`
- `CroquiController`, `ImagemController`, `ShareController`
- **`Admin/ViaImageSugestaoController`** — submissão (usuários) + moderação (admins)
- **`Admin/AdminViaController`** — CRUD de vias via painel admin
- **`Admin/AdminUsuarioController`** — listagem e toggle de admin

**Routes** (`Api/routes/`):
- `routes.ts` — configuração central; um router por recurso
- **`AdminRouter.ts`** — `/admin/*` (requer `authenticateToken` + `requireAdmin`)

**Middlewares** (`Api/Middlewares/`):
- `AuthenticateMiddleware` — valida JWT
- **`AdminMiddleware`** — verifica `is_admin` no banco para rotas `/admin/*`
- `ErrorRequestMiddleware` — tratamento global de erros
- `RateLimitMiddleware` — rate limiting por IP
- `MulterMiddleware` — upload de arquivos (inclui `uploadViaImagem` para `assets/vias/`)

**DTOs** (`Api/DTOs/`):
- Transformam entidades em JSON de resposta
- Um subdiretório por recurso: `Usuario/`, `Via/`, `Colecao/`, etc.

**Entry point**: `server.ts` — inicializa Express, CORS, Helmet, rate limiting, static assets, DB.

---

### 📁 Application (`backend/src/Application/`)

Lógica de negócio e orquestração.

**Services** (`Application/services/`):

Todos usam `@Service()` TypeDI e retornam `ServiceResponse<T>`:

```typescript
@Service()
export class ViaService {
  constructor(@Inject() private viaRepository: ViaRepository) {}

  async buscarPorId(id: number): Promise<ServiceResponse<Via>> {
    // lógica de negócio
    return ServiceResponse.success(via);
  }
}
```

Services principais: `ViaService`, `UsuarioService`, `ColecaoService`, `EscaladaService`, `SearchService`, `StatsService`, `ConquistasService`, `SeguimentoService`, `AuthenticateService`, `GoogleAuthenticateService`, `ImagemService`, `MailService`, **`ViaImageSugestaoService`**.

**Validations** (`Application/validations/`):
- Esquemas Zod por recurso: `ViaValidation`, `UsuarioValidation`, `EscaladaValidation`, etc.
- `ValidationBase` com utilitários comuns

**Errors** (`Application/errors/`):
- `BadRequestError` (400), `UnauthorizedError` (401), `NotFoundError` (404), `InternalServerError` (500)
- `ErrorRequestMiddleware` trata tudo centralmente

---

### 📁 Domain (`backend/src/Domain/`)

Regras de domínio, sem dependência de tecnologias externas.

**Entities** (`Domain/entities/`):

*Core*: `Via`, `Usuario`, `Escalada`, `Colecao`

*Localização hierárquica*:
`Continente → Pais → Regiao → Estado → Cidade → Bairro → Localizacao`
e também `Montanha → Face → Setor`

*Mídia*: `Imagem`, `Croqui`

*Relacionamentos*: `ViaImagem`, `ViaCroqui`, `ViaColecao`, `Participante`, `UsuarioSeguindo`, `UsuarioConquista`, **`ViaImageSugestao`**

*Base*: `BaseEntityWithTimestamps` — id, createdAt, updatedAt

**Interfaces** (`Domain/interfaces/`):
- `repositories/` — `IUsuarioRepository`, `IViaRepository`, `ICrudRepository`
- `services/` — `IViaService`, `IFonteService`, `ISearchQuery`
- `models/` — interfaces de domínio (`IUsuario`, `IVia`, `IColecao`, etc.)

**Enums** (`Domain/enum/`):
- `EModalidadeEscalada` — tipos de escalada
- `EParticipanteTipo` — guia / participante / misto

---

### 📁 Infrastructure (`backend/src/Infrastructure/`)

Persistência e integrações externas.

**Config** (`Infrastructure/config/`):
- `db.ts` — DataSource TypeORM (configuração única)
- `logger.ts` — configuração Winston

**Repositories** (`Infrastructure/repositories/`):

Implementações concretas das interfaces do Domain. Todos estendem `BaseRepository`:
`UsuarioRepository`, `ViaRepository`, `ColecaoRepository`, `EscaladaRepository`, `ImagemRepository`, `CroquiRepository`, `MontanhaRepository`, `FaceRepository`, `LocalizacaoRepository`, `UsuarioSeguindoRepository`, `UsuarioConquistaRepository`.

**Seeds** (`Infrastructure/seeds/`):
- `seed.ts` — orquestrador principal (idempotente)
- `loaders/` — `UsuarioLoader`, `ViaLoader`, `EscaladaLoader`, etc.
- Dados em `data/*.yaml` — **fonte da verdade** (não editar direto no banco)

**Data** (`Infrastructure/data/`):
- `usuarios-teste.yaml`, `vias.yaml`, `escaladas-teste.yaml`, `colecoes-vias-teste.yaml`

**Migrations** (`Infrastructure/migrations/`):
- Geradas automaticamente pelo TypeORM
- Nunca editar manualmente
- `npm run build && npm run migration:generate` → renomear → `npm run migration:run:dev`

**Helpers** (`Infrastructure/helpers/`):
- `S3Helper.ts` — upload para AWS S3 (SDK v2 — débito técnico consciente)
- `imageHelper.ts` — processamento de imagens

---

## Padrões de Código

### Controller Pattern

```typescript
export class ViaController {
  async buscarPorId(req: Request, res: Response) {
    const { id } = ViaIdSchema.parse(req.params);   // validação Zod
    const result = await viaService.buscarPorId(id); // service
    return res.json(new ViaDTO(result.data));         // DTO de resposta
  }
}
```

### Error Handling

- Middleware centralizado em `ErrorRequestMiddleware`
- Controllers não tratam erros individualmente — lançam para o middleware
- Logs estruturados com Winston

### Autenticação

- JWT em `Authorization: Bearer <token>`
- `AuthenticateMiddleware` valida token e popula `req.usuario`
- Google OAuth via `GoogleAuthenticateService`
- Senhas com bcrypt

---

## Comandos Essenciais

```bash
# Setup completo do zero
npm run db:fresh           # reset + build + migration + seed

# Seed incremental (idempotente)
npm run seed

# Nova migration
npm run build && npm run migration:generate
# → renomear arquivo gerado para algo descritivo
npm run migration:run:dev

# Dev
npm run dev:watch          # nodemon + ts-node
```

---

## Usuários de Teste (seed)

| Username | Email | Senha | Observação |
|----------|-------|-------|-----------|
| `cumes_teste` | `teste@cumes.com.br` | `teste123` | — |
| `maria_escaladora` | `maria.dev@cumes.com.br` | `teste123` | — |
| `usuario_privado` | `privado.dev@cumes.com.br` | `teste123` | perfil privado |
| `rafael` | `rafael.dev@cumes.com.br` | `teste123` | — |
