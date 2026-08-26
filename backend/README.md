# Backend — Cumes Brasil

REST API in Node.js + TypeScript, with Express, TypeORM, and PostgreSQL.

---

## Requirements

- Node.js 20+
- PostgreSQL 14+ (local or via Docker)
- A configured `.env.development` file (see below)

---

## Environment Variables

Create `backend/.env.development` with:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_user
DB_PASSWORD=your_password
DB_NAME=cumes-brasil

JWT_SECRET=your_jwt_secret
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET_NAME=...
CLOUDFRONT_URL=...
```

To run the database via Docker, set `DB_HOST=db` and start it with `docker-compose up -d db` from the project root.

---

## Main Scripts

| Command | What it does |
|---------|---------------|
| `npm run dev` | Starts the API in development mode (applies **pending migrations** automatically; **does not** run the seed) |
| `npm run dev:watch` | Same as `dev`, with hot-reload via nodemon |
| `npm run build` | Compiles TypeScript to `dist/` |
| `npm run seed` | Populates the database from the YAMLs in `src/Infrastructure/data/` |
| `npm run db:reset` | Drops and recreates the PostgreSQL database |
| `npm run db:fresh` | Full reset: drop → build → migrations → seed |
| `npm run migration:run:dev` | Runs pending migrations (requires a prior build) |
| `npm run migration:generate` | Generates a new migration from the entities (requires a prior build) |

### Typical flow from scratch

```bash
npm install
npm run db:fresh   # creates the database, runs migrations and the seed
npm run dev        # in dev, pending migrations run on startup; the seed is separate (npm run seed)
```

After changing the entity structure or `usuarios-teste.yaml`:

```bash
npm run build && npm run migration:run:dev   # if you'd rather apply migrations manually
npm run seed                                 # syncs test users (password, role, etc.)
```

### Generating a new migration

```bash
npm run build
npm run migration:generate
# TypeORM creates src/Infrastructure/migrations/<timestamp>-Migration.ts
# Rename the file to something descriptive, e.g. <timestamp>-AddXyzField.ts
npm run migration:run:dev
```

> `Migration` in the script name is just the base suffix — TypeORM always prefixes it with the timestamp. Rename the generated file before committing.

---

## Layer Structure

The backend follows DDD across four layers:

```
src/
├── Domain/          # TypeORM entities and repository interfaces
├── Application/     # Services (business logic)
├── Infrastructure/  # Repositories, DB config, migrations, seeds
│   ├── config/      # TypeORM DataSource (db.ts)
│   ├── data/         # YAML files — the seed's data source
│   ├── migrations/  # TypeORM migrations
│   ├── seeds/        # Seed orchestrator and loaders
│   └── repositories/
└── Api/             # Controllers, DTOs, routes, server.ts
```

---

## Seed System

The seed loads data from `src/Infrastructure/data/*.yaml` into the database, in dependency order:

```
ReferenciasLoader → … → ViaLoader → … → UsuarioLoader → EscaladaLoader → ColecaoConteudoLoader
```

- YAML files are the **source of truth** for the data
- **Development users** (`usuarios-teste.yaml`, shared password `teste123`):
  - `teste@cumes.com.br` / username `cumes_teste` (public profile)
  - `maria.dev@cumes.com.br` / `maria_escaladora` (public profile)
  - `privado.dev@cumes.com.br` / `usuario_privado` (private profile — for testing visibility restrictions)
  - `rafael.dev@cumes.com.br` / `rafael` (public profile)
- Climbs and collection links: `escaladas-teste.yaml`, `colecoes-vias-teste.yaml`
- The seed is **idempotent**: it can be re-run without duplicating data
- To add a simple updatable field on `Via`: include it in the `ViaYaml` interface and the `UPSERT_FIELDS` array in `ViaLoader.ts`
- Shared seed utilities live in `seeds/seedUtils.ts`

---

## Image System

- Images are served by Express from `backend/assets/`
- Every path stored in the database must start with `/assets/` (e.g. `/assets/vias/photo.png`)
- The frontend strips the `/assets/` prefix and rebuilds the URL using `VITE_APP_ASSETS_URL`
- The `ViaImagem` entity allows multiple images per route; `ViaDTO` exposes both `imagem` (the first one) and `imagens` (the full array)
