# Backend — Cumes Brasil

API REST em Node.js + TypeScript com Express, TypeORM e PostgreSQL.

---

## Pré-requisitos

- Node.js 20+
- PostgreSQL 14+ (local ou via Docker)
- Arquivo `.env.development` configurado (ver abaixo)

---

## Variáveis de Ambiente

Crie `backend/.env.development` com:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=cumes-brasil

JWT_SECRET=seu_jwt_secret
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET_NAME=...
CLOUDFRONT_URL=...
```

Para usar o banco via Docker, defina `DB_HOST=db` e suba com `docker-compose up -d db` na raiz do projeto.

---

## Scripts Principais

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Sobe a API em modo desenvolvimento com ts-node |
| `npm run dev:watch` | Igual ao `dev`, com hot-reload via nodemon |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm run seed` | Popula o banco a partir dos YAMLs em `src/Infrastructure/data/` |
| `npm run db:reset` | Dropa e recria o banco PostgreSQL |
| `npm run db:fresh` | Reset completo: drop → build → migrations → seed |
| `npm run migration:run:dev` | Executa migrações pendentes (requer build prévio) |
| `npm run migration:generate` | Gera nova migração com base nas entidades (requer build prévio) |

### Fluxo típico do zero

```bash
npm install
npm run db:fresh   # cria banco, roda migrations e seed
npm run dev
```

### Gerar uma nova migração

```bash
npm run build
npm run migration:generate
# TypeORM cria src/Infrastructure/migrations/<timestamp>-Migration.ts
# Renomeie o arquivo para algo descritivo, ex: <timestamp>-AddCampoXyz.ts
npm run migration:run:dev
```

> O nome `Migration` no script é apenas o sufixo base — TypeORM sempre prefixa com o timestamp. Renomeie o arquivo gerado antes de commitar.

---

## Estrutura de Camadas

O backend segue DDD com 4 camadas:

```
src/
├── Domain/          # Entidades TypeORM e interfaces de repositório
├── Application/     # Services (lógica de negócio)
├── Infrastructure/  # Repositórios, config do BD, migrations, seeds
│   ├── config/      # DataSource TypeORM (db.ts)
│   ├── data/        # Arquivos YAML — fonte de dados do seed
│   ├── migrations/  # Migrations TypeORM
│   ├── seeds/       # Orquestrador e loaders do seed
│   └── repositories/
└── Api/             # Controllers, DTOs, rotas, server.ts
```

---

## Sistema de Seed

O seed carrega dados dos arquivos `src/Infrastructure/data/*.yaml` para o banco, em ordem de dependência:

```
ReferenciasLoader → … → ViaLoader → … → UsuarioLoader → EscaladaLoader → ColecaoConteudoLoader
```

- Os YAMLs são a **fonte de verdade** dos dados
- **Usuários de desenvolvimento** (`usuarios-teste.yaml`, senha comum `teste123`):
  - `teste@cumes.com.br` / username `cumes_teste` (perfil público)
  - `maria.dev@cumes.com.br` / `maria_escaladora` (perfil público)
  - `privado.dev@cumes.com.br` / `usuario_privado` (perfil privado — para testar bloqueios)
  - `rafael.dev@cumes.com.br` / `rafael` (perfil público)
- Escaladas e vínculos em coleções: `escaladas-teste.yaml`, `colecoes-vias-teste.yaml`
- O seed é **idempotente**: pode ser re-executado sem duplicar dados
- Para adicionar um campo simples atualizável em Via: inclua na interface `ViaYaml` e no array `UPSERT_FIELDS` em `ViaLoader.ts`
- Utilitários compartilhados do seed ficam em `seeds/seedUtils.ts`

---

## Sistema de Imagens

- Imagens são servidas pelo Express a partir de `backend/assets/`
- Todos os paths no banco devem começar com `/assets/` (ex.: `/assets/vias/foto.png`)
- O frontend remove o prefixo `/assets/` e reconstrói a URL com `VITE_APP_ASSETS_URL`
- A entidade `ViaImagem` permite múltiplas imagens por via; o `ViaDTO` expõe `imagem` (primeira) e `imagens` (array)
