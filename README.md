<h1 align="center">
    <img alt="Cumes Brasil Logo" src="assets/logo.png" width="200px" />
    <br>
    🏞️ Cumes Brasil 🧗‍♂️
</h1>

<p align="center">
    Seu Catálogo Digital de Escalada.
</p>

<div align="center">

![Badge](https://img.shields.io/badge/status-in%20development-yellow)
![Badge](https://img.shields.io/badge/platform-web-blue)
![Badge](https://img.shields.io/badge/license-MIT-green)

</div>

---

## 📜 Sobre

**Cumes Brasil** é um PWA dedicado à comunidade de escalada no Brasil. Oferece acesso rápido e offline a informações sobre vias de escalada, montanhas e faces.

Stack: **Vue.js (Quasar)** + **Node.js (TypeORM)** + **PostgreSQL**. Hospedado na AWS EC2.

## 🚧 Aviso

:warning: **Escalada é um esporte de risco. Avalie sempre as condições e esteja devidamente preparado.**

---

## 🚀 Rodar o Projeto

Escolha uma das opções abaixo.

### Opção 1: Local (PostgreSQL + Node no seu PC)

**Pré-requisitos:** Node.js 18+, npm, PostgreSQL instalado localmente.

#### 1. Clonar e instalar

```bash
git clone https://github.com/rafael-ventura/cume-brasil.git
cd cumes-brasil
```

#### 2. Banco de dados

Crie o banco `cumes-brasil` no PostgreSQL (ou use um existente).

#### 3. Variáveis de ambiente

**Backend** – crie `backend/.env.development` (ou copie de `.env`):

```env
# Banco (localhost = PostgreSQL na sua máquina)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_NAME=cumes-brasil

# API
API_HOSTNAME=localhost
API_PORT=3001
ASSETS_URL=http://localhost:3001/assets

# Outros (podem deixar padrão)
SECRET_KEY=local-dev-secret
WEB_HOSTNAME=http://localhost:9200
MAIL_USER=cumesbrasil@gmail.com
MAIL_PASSWORD=seu_app_password
```

**Frontend** – crie `frontend/.env`:

```env
VITE_APP_API_URL=http://localhost:3001/api
VITE_APP_SERVER_IP=http://localhost:3001
VITE_APP_ASSETS_URL=http://localhost:3001/assets
VITE_GOOGLE_CLIENT_ID=seu_google_client_id
```

#### 4. Rodar

```bash
# Terminal 1 – Backend
cd backend
npm install
npm run build
npm run migration:run:dev
npm run dev

# Terminal 2 – Frontend
cd frontend
npm install
npm run dev
```

- **API:** http://localhost:3001  
- **Frontend:** http://localhost:9200  

---

### Opção 2: Docker (tudo em containers)

**Pré-requisitos:** Docker e Docker Compose instalados.

#### 1. Clonar e configurar

```bash
git clone https://github.com/rafael-ventura/cume-brasil.git
cd cumes-brasil
```

#### 2. Variáveis de ambiente

Crie o arquivo `.env` na **raiz do projeto** (usado pelo `docker-compose.dev.yml`):

**Backend (via .env na raiz):**

```env
SECRET_KEY=sua_secret_key

# API
API_HOSTNAME=0.0.0.0
API_PORT=3001
ASSETS_URL=http://localhost:3001/assets
WEB_HOSTNAME=http://localhost:9200

# Banco (host=postgres = nome do container)
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=cumes-brasil

# Email
MAIL_USER=cumesbrasil@gmail.com
MAIL_PASSWORD=seu_app_password
```

**Frontend** – crie `frontend/.env` apontando para a API:

```env
VITE_APP_API_URL=http://localhost:3001/api
VITE_APP_SERVER_IP=http://localhost:3001
VITE_APP_ASSETS_URL=http://localhost:3001/assets
VITE_GOOGLE_CLIENT_ID=seu_google_client_id
```

> **Importante:** No Docker, use `POSTGRES_HOST=postgres` (nome do serviço). Localmente use `DB_HOST=localhost`.

#### 3. Subir os containers

```bash
# Build do backend antes (o Dockerfile copia o dist/)
cd backend && npm install && npm run build && cd ..

# Subir API + PostgreSQL
docker compose -f docker-compose.dev.yml up -d --build
```

#### 4. Rodar migrations e frontend

```bash
# Migrations (uma vez, após subir o Docker)
cd backend && npm run migration:run:dev

# Frontend (em outro terminal)
cd frontend && npm install && npm run dev
```

#### 5. Parar

```bash
docker compose -f docker-compose.dev.yml down -v
```

- **API:** http://localhost:3001  
- **Frontend:** http://localhost:9200  

---

## 📋 Resumo dos comandos

| Ação | Local | Docker |
|------|-------|--------|
| Banco | PostgreSQL local | `docker compose -f docker-compose.dev.yml up -d --build` |
| Backend | `npm run dev` | Já sobe com o compose |
| Frontend | `npm run dev` | `npm run dev` (fora do Docker) |
| Migrations | `npm run migration:run:dev` | `npm run migration:run:dev` |
| Parar | Ctrl+C | `docker compose -f docker-compose.dev.yml down -v` |

---

## 🔧 Tecnologias

![Vue Badge](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![Vite Badge](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Quasar Badge](https://img.shields.io/badge/Quasar-1976D2?style=for-the-badge&logo=quasar&logoColor=white)
![Node.js Badge](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Typescript Badge](https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js Badge](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Docker Badge](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL Badge](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

---

## 🚀 Funcionalidades

- 🧗‍♂️ Exploração de vias com graduação, extensão e tipo de escalada
- 📜 Informações detalhadas (conquistadores, ano, dados técnicos)
- 📱 Suporte offline (PWA)
- 🔍 Pesquisa por dificuldade, localização e tipo de rocha
- 🌐 Compartilhamento e colaboração da comunidade

---

## 📦 Deploy

O projeto está na AWS EC2, com S3 e CloudFront. Pipeline via GitHub Actions.

**Deploy manual:** build do frontend → sync S3; backend via SSH + `git pull` + `pm2 restart`.

---

## 📚 Créditos

- **André Ilha** – vias da Zona Sul  
- **Pedro Bugim** – blog e registros históricos  
- **Companhia da Escalada** e **Daflon** – contribuições

---

## 🤝 Contribua

1. Fork o projeto  
2. Crie uma branch: `git checkout -b minha-feature`  
3. Commit: `git commit -m 'Add: minha nova feature'`  
4. Push: `git push origin minha-feature`  
5. Abra um Pull Request  

---

## 👥 Equipe

| <img src="https://avatars.githubusercontent.com/u/28628701?s=100&v=4" alt="Rafael Ventura" width="80px" /> | <img src="https://avatars.githubusercontent.com/u/69773445?s=100&v=4" alt="Igor Costa" width="80px" /> | <img src="https://avatars.githubusercontent.com/u/88738275?s=100&v=4" alt="Vitor Indio" width="80px" /> | <img src="https://avatars.githubusercontent.com/u/22893710?s=100&v=4" alt="Elmo Junior" width="80px" /> | <img src="https://avatars.githubusercontent.com/u/13644652?v=4" alt="Luiz Fernando" width="80px" /> |
|:---:|:---:|:---:|:---:|:---:|
| [Rafael Ventura](https://github.com/rafael-ventura) | [Igor Costa](https://github.com/igordeo-costa) | [Vitor Indio](https://github.com/vitorindio) | [Elmo Junior](https://github.com/elmojuh) | [Luiz Fernando](https://github.com/luizfcneto) |
