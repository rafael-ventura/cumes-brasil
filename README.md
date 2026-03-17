<h1 align="center">
    <img alt="Cumes Brasil Logo" src="assets/logo.png" width="200px" />
    <br>
    Cumes Brasil
</h1>

<p align="center">
    Catálogo digital de escalada para a comunidade brasileira.
</p>

<div align="center">

![Badge](https://img.shields.io/badge/status-in%20development-yellow)
![Badge](https://img.shields.io/badge/platform-PWA-blue)
![Badge](https://img.shields.io/badge/license-MIT-green)

</div>

---

## Sobre o Projeto

**Cumes Brasil** é um PWA (Progressive Web App) dedicado à comunidade de escalada no Brasil. Oferece acesso rápido — e offline — a informações sobre vias, montanhas e faces.

> :warning: Escalada é um esporte de risco. Avalie sempre as condições e esteja devidamente preparado.

## Funcionalidades

- Exploração de vias com graduação, extensão, conquistadores e dados técnicos
- Croquis e fotos por via
- Busca e filtros por dificuldade, montanha e localização
- Coleções pessoais e registro de escaladas
- Perfil de usuário com via predileta
- Suporte offline (PWA)

## Tecnologias

![Vue Badge](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![Quasar Badge](https://img.shields.io/badge/Quasar-1976D2?style=for-the-badge&logo=quasar&logoColor=white)
![Node.js Badge](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Typescript Badge](https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js Badge](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL Badge](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker Badge](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## Rodar o Projeto

Escolha a opção que preferir.

### Opção 1: Local

**Pré-requisitos:** Node.js 20+, PostgreSQL instalado localmente.

```bash
git clone https://github.com/rafael-ventura/cume-brasil.git
cd cumes-brasil
```

**Backend** — crie `backend/.env.development`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_NAME=cumes-brasil

API_HOSTNAME=localhost
API_PORT=3001
ASSETS_URL=http://localhost:3001/assets
SECRET_KEY=local-dev-secret
WEB_HOSTNAME=http://localhost:9200
MAIL_USER=cumesbrasil@gmail.com
MAIL_PASSWORD=seu_app_password
```

**Frontend** — crie `frontend/.env`:
```env
VITE_APP_API_URL=http://localhost:3001/api
VITE_APP_SERVER_IP=http://localhost:3001
VITE_APP_ASSETS_URL=http://localhost:3001/assets
VITE_GOOGLE_CLIENT_ID=seu_google_client_id
```

```bash
# Terminal 1 — Backend
cd backend && npm install && npm run db:fresh && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
```

### Opção 2: Docker

**Pré-requisitos:** Docker e Docker Compose.

Crie `.env` na **raiz do projeto**:
```env
SECRET_KEY=sua_secret_key
API_HOSTNAME=0.0.0.0
API_PORT=3001
ASSETS_URL=http://localhost:3001/assets
WEB_HOSTNAME=http://localhost:9200

POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=cumes-brasil

MAIL_USER=cumesbrasil@gmail.com
MAIL_PASSWORD=seu_app_password
```

Crie também `frontend/.env` com `VITE_APP_API_URL=http://localhost:3001/api` (igual ao local).

```bash
# Build e subir API + banco
cd backend && npm install && npm run build && cd ..
docker compose -f docker-compose.dev.yml up -d --build

# Migrations e seed
cd backend && npm run migration:run:dev && npm run seed

# Frontend (em outro terminal)
cd frontend && npm install && npm run dev
```

Para parar: `docker compose -f docker-compose.dev.yml down -v`

**URLs:** API → http://localhost:3001 · Frontend → http://localhost:9200

---

## Créditos dos Dados

- **André Ilha** — vias da Zona Sul
- **Pedro Bugim** — blog e registros históricos
- **Companhia da Escalada** e **Daflon** — contribuições

---

## Contribua

1. Fork o projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit: `git commit -m 'Add: minha nova feature'`
4. Push: `git push origin minha-feature`
5. Abra um Pull Request

---

## Equipe

| <img src="https://avatars.githubusercontent.com/u/28628701?s=100&v=4" width="80px" /> | <img src="https://avatars.githubusercontent.com/u/69773445?s=100&v=4" width="80px" /> | <img src="https://avatars.githubusercontent.com/u/88738275?s=100&v=4" width="80px" /> | <img src="https://avatars.githubusercontent.com/u/22893710?s=100&v=4" width="80px" /> | <img src="https://avatars.githubusercontent.com/u/13644652?v=4" width="80px" /> |
|:---:|:---:|:---:|:---:|:---:|
| [Rafael Ventura](https://github.com/rafael-ventura) | [Igor Costa](https://github.com/igordeo-costa) | [Vitor Indio](https://github.com/vitorindio) | [Elmo Junior](https://github.com/elmojuh) | [Luiz Fernando](https://github.com/luizfcneto) |
