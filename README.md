<h1 align="center">
    <img alt="Cumes Brasil Logo" src="backend/assets/logo.png" width="180px" />
    <br>
    Cumes Brasil
</h1>

<p align="center">
    A digital climbing route catalog, built for the Brazilian climbing community.
</p>

<div align="center">

![Badge](https://img.shields.io/badge/status-archived-red)
![Badge](https://img.shields.io/badge/platform-PWA-blue)
![Badge](https://img.shields.io/badge/license-MIT-green)
![Badge](https://img.shields.io/badge/made%20with-%E2%9D%A4%EF%B8%8F%20and%20chalk%20dust-orange)

</div>

<p align="center">
  <img src="https://blinkies.cafe/b/display/0018-glitter.gif" alt="" height="20">
  <img src="https://blinkies.cafe/b/display/0138-greenglow.gif" alt="" height="20">
  <img src="https://blinkies.cafe/b/display/0111-glittergold.gif" alt="" height="20">
  <img src="https://blinkies.cafe/b/display/0109-gradientgreen.gif" alt="" height="20">
</p>

---

> ### 🪦 This project is archived
> Cumes Brasil is no longer actively developed or deployed. It lived in production for a while — real users, a real domain, a real AWS bill — before its infrastructure was decommissioned. The code stays here, public, as a record of what four friends built in their spare time. See [CONTRIBUTORS.md](CONTRIBUTORS.md) for the people, and the note at the bottom of this file for the why.

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

## About

**Cumes Brasil** is a Progressive Web App built for the climbing community in Brazil, with a focus on Rio de Janeiro. It's a digital catalog for exploring climbing routes (*vias*), viewing technical topo sketches (*croquis*), building personal collections, and logging climbs — with offline support baked in.

> ⚠️ Climbing is a risk sport. Always evaluate conditions and come prepared. Nothing in this catalog substitutes real training, real guides, or real judgment on the rock.

## Features

- **Route catalog** — grade, length, first ascent, technical details
- **Topo sketches & photos** per route, including community-submitted photos with a moderation workflow
- **Advanced search & filters** — by grade, mountain, face, location
- **Personal collections** — favorites, projects, custom lists
- **Climb logging** — with partners, notes, and climb type
- **Social features** — public/private profiles, following other climbers, persisted achievement badges, "on the rope" (*na cordada*) mentions across other people's climb logs
- **Admin panel** — role-based moderation (user / moderator / admin) for routes and community photo submissions
- **Offline-first PWA** — installable, works without a connection

## Tech Stack

![Vue Badge](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![Quasar Badge](https://img.shields.io/badge/Quasar-1976D2?style=for-the-badge&logo=quasar&logoColor=white)
![PrimeVue Badge](https://img.shields.io/badge/PrimeVue-06B6D4?style=for-the-badge)
![Node.js Badge](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Typescript Badge](https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js Badge](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TypeORM Badge](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge)
![PostgreSQL Badge](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker Badge](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**Frontend**: Vue 3 (Composition API) + Quasar (PWA shell, build, layouts) + PrimeVue (UI widgets) + TypeScript.
**Backend**: Node.js + Express 5 + TypeORM + PostgreSQL, following Domain-Driven Design (`Api → Application → Domain ← Infrastructure`).

Full architecture write-ups live in [`documentacao/`](documentacao/) — see [`ARQUITETURA-BACKEND.md`](documentacao/ARQUITETURA-BACKEND.md), [`ARQUITETURA-FRONTEND.md`](documentacao/ARQUITETURA-FRONTEND.md), and [`DESIGN_FRONTEND.md`](documentacao/DESIGN_FRONTEND.md). [`CLAUDE.md`](CLAUDE.md) is the project brief we used for AI-assisted development throughout.

<img src="https://user-images.githubusercontent.com/74038190/212284115-f47cd8ff-2ffb-4b04-b5bf-4d1c14c0247f.gif" width="100%">

## Running It Locally

Even though the project is archived, the codebase still runs. Pick whichever setup you prefer.

### Option 1: Local

**Requirements:** Node.js 20+, PostgreSQL installed locally.

```bash
git clone https://github.com/rafael-ventura/cumes-brasil.git
cd cumes-brasil
```

**Backend** — create `backend/.env.development`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=cumes-brasil

API_HOSTNAME=localhost
API_PORT=3001
ASSETS_URL=http://localhost:3001/assets
SECRET_KEY=local-dev-secret
WEB_HOSTNAME=http://localhost:9200
MAIL_USER=cumesbrasil@gmail.com
MAIL_PASSWORD=your_app_password
```

**Frontend** — create `frontend/.env`:
```env
VITE_APP_API_URL=http://localhost:3001/api
VITE_APP_SERVER_IP=http://localhost:3001
VITE_APP_ASSETS_URL=http://localhost:3001/assets
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
# Terminal 1 — Backend
cd backend && npm install && npm run db:fresh && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
```

### Option 2: Docker

**Requirements:** Docker and Docker Compose.

Create a `.env` file at the **project root**:
```env
SECRET_KEY=your_secret_key
API_HOSTNAME=0.0.0.0
API_PORT=3001
ASSETS_URL=http://localhost:3001/assets
WEB_HOSTNAME=http://localhost:9200

POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=cumes-brasil

MAIL_USER=cumesbrasil@gmail.com
MAIL_PASSWORD=your_app_password
```

Also create `frontend/.env` with `VITE_APP_API_URL=http://localhost:3001/api` (same as local).

```bash
# Build and start API + database
cd backend && npm install && npm run build && cd ..
docker compose -f docker-compose.dev.yml up -d --build

# Migrations and seed
cd backend && npm run migration:run:dev && npm run seed

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

To stop: `docker compose -f docker-compose.dev.yml down -v`

**URLs:** API → http://localhost:3001 · Frontend → http://localhost:9200

Test accounts (`teste123` for all) are documented in [`backend/README.md`](backend/README.md).

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

## Credits

This project was built by a small crew of friends — see [**CONTRIBUTORS.md**](CONTRIBUTORS.md) for the full team and the route-data sources that made the catalog possible.

## Contributing

The project is archived and not actively maintained, but it's MIT-licensed — fork it, learn from it, or pick up where we left off:

1. Fork the project
2. Create a branch: `git checkout -b my-feature`
3. Commit: `git commit -m 'feat: my new feature'`
4. Push: `git push origin my-feature`
5. Open a Pull Request (nobody's watching, but it's good practice)

---

<img src="https://user-images.githubusercontent.com/74038190/213911110-aedbef38-a29f-4b6b-a65c-11608b4f75a5.gif" width="100%">

## A Personal Note

I put off writing this section for a long time, because finishing this project meant admitting it was actually over. But it is, and it deserves a proper goodbye instead of just fading out.

Cumes Brasil was never just a CRUD app with a climbing theme on top. It was the excuse I needed to actually learn how software runs in the real world — not just "it works on my machine," but AWS, production deploys, nginx, domains, CI/CD pipelines, load balancers, CloudFront, and reading logs at odd hours trying to figure out why something broke. Every one of those lessons came with a scar, and I'd take every one of them again.

More than that, it was an excuse to build something with my friends. Since this project started, one of us made senior, one is finishing his thesis, and one became a father. Life moves fast, and it's rare to get a shared project that follows you through years like that.

So, thank you:

- **Igor** — for getting me into climbing in the first place, and for helping push this whole thing into existence.
- **Matera** — for starting this climbing journey with me. None of this happens without that.
- **Vitin** — one of the core developers, and honestly more of a mentor to me than a collaborator. A huge part of what this project became is because of you.
- **Elmo** — you co-wrote and built so much of the code that is still the backbone of this project today. Watching you learn along the way was one of the best parts of this whole thing.
- **Mohammed** — you joined last and didn't stay long, but you brought energy, care, and real backend standardization in the time you were here. It mattered.

Cumes Brasil is done, but I'm turning off these lights with pride, not regret — proud of what we built, and grateful for who I got to build it with. ❤️

— Rafael

<p align="center">
  <img src="https://blinkies.cafe/b/display/0018-glitter.gif" alt="" height="20">
  <img src="https://blinkies.cafe/b/display/0111-glittergold.gif" alt="" height="20">
  <img src="https://blinkies.cafe/b/display/0138-greenglow.gif" alt="" height="20">
</p>
