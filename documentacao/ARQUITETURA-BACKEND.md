# Arquitetura do Backend

## Estrutura de Camadas (DDD)

O backend segue Domain-Driven Design com 4 camadas bem definidas:

```
src/
├── Domain/          # O quê existe no sistema
├── Application/     # O que o sistema faz
├── Infrastructure/  # Como o sistema persiste e se conecta
└── Api/             # Como o sistema é acessado
```

### Domain
- Entidades TypeORM (`Via`, `Montanha`, `Face`, `Usuario`, `Croqui`, `Imagem`, etc.)
- Interfaces de repositório (`IViaRepository`, etc.)
- Regras de domínio
- Não depende de nenhuma outra camada

### Application
- Services com a lógica de negócio (`ViaService`, `UsuarioService`, etc.)
- Injetados via **TypeDI** — usar sempre `@Service()` e `@Inject()`
- Retornam `ServiceResponse<T>` padronizado
- Não conhecem Express nem HTTP

### Infrastructure
- Repositórios concretos TypeORM implementando as interfaces do Domain
- `config/db.ts` — DataSource TypeORM (único ponto de configuração do banco)
- `migrations/` — nunca editar manualmente; gerar com `npm run migration:generate`
- `seeds/` — carregamento de dados via YAML
- `helpers/` — S3Helper para upload de imagens

### Api
- Controllers Express: recebem Request, chamam Services, retornam Response
- DTOs: transformam entidades para JSON de resposta (ex.: `ViaDTO`)
- Validação com **Zod** antes de chegar no service
- Middleware centralizado de erros (`errorHandler`)
- `server.ts` — ponto de entrada da aplicação

---

## Hierarquia de Entidades

```
Continente → Pais → Regiao → Estado → Cidade → Bairro → Localizacao

Montanha ──┐
           ├── Via ──── ViaImagem (via_id, imagem_id)
Face ──────┘       └── ViaCroqui (via_id, croqui_id) ──── Croqui

Fonte ──── Via, Face, Croqui, Imagem
Usuario ── Colecao ── ColecaoVia ── Via
        └─ Escalada ── Via
        └─ foto_perfil → Imagem
        └─ via_predileta → Via
```

**Campos importantes da Via:**
- `grau`, `crux`, `artificial`, `duracao`, `exposicao`, `extensao`
- `conquistadores`, `data`, `detalhes`, `historia_resumo`
- `via_cerj` (boolean) — identifica vias clássicas do CERJ
- `equipamentos` (texto livre), `tracklog_aproximacao` (URL)
- `viaPrincipal` (auto-referência para variantes)

---

## Sistema de Seed

Dados vivem nos YAMLs em `src/Infrastructure/data/`. O seed é **idempotente**.

**Ordem de execução (dependências em cascata):**
```
ReferenciasLoader → MontanhaLoader → FacesLoader → ViaLoader → CroquiLoader → ViaCroquiLoader
```

- Utilitários compartilhados em `seeds/seedUtils.ts` (`loadYaml<T>`, `resolveLocalizacaoIds`)
- `ViaLoader` usa `UPSERT_FIELDS` — array declarativo dos campos atualizados no re-seed
- Para adicionar campo simples atualizável em Via: incluir em `ViaYaml` + `UPSERT_FIELDS`

```bash
npm run seed         # seed incremental (idempotente, não destrói dados)
npm run db:fresh     # drop → build → migrations → seed (reset completo)
```

---

## Sistema de Imagens

- Servidas pelo Express de `backend/assets/` via `/assets` (estático)
- Todos os paths no banco começam com `/assets/` (ex.: `/assets/vias/foto.png`)
- `ViaImagem` — permite múltiplas imagens por via
- `ViaDTO` expõe: `imagem` (primeira, compat. legada) e `imagens` (array completo)
- Upload para S3 via `S3Helper` (usa `aws-sdk` v2 — débito técnico, migrar para v3 futuramente)

---

## Padrões de Código

| Camada | Padrão |
|--------|--------|
| Repositories | Herdam de classe base, implementam interface do Domain |
| Services | `@Service()` TypeDI, retornam `ServiceResponse<T>` |
| Controllers | Validam com Zod → chamam service → retornam HTTP |
| DTOs | Classes com construtor que mapeia entidade para JSON |
| Erros | Middleware `errorHandler` centralizado |
| Logs | **Winston** — não usar `console.log` em produção |

---

## Migrations

```bash
npm run build                   # sempre antes de gerar/rodar migrations
npm run migration:generate      # gera <timestamp>-Migration.ts — renomear depois
npm run migration:run:dev       # aplica pendentes (dev)
npm run migration:run           # aplica pendentes (prod, usa dist/)
```

> O TypeORM gera o arquivo com sufixo `-Migration`. Renomeie para algo descritivo antes de commitar: ex. `1741234567890-AddCampoEquipamentos.ts`.
