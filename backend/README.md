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

## 📜 Sobre

Cumes Brasil é um aplicativo PWA (Progressive Web Application) dedicado à comunidade de escalada no Brasil. Nosso objetivo é fornecer acesso rápido e offline a informações sobre vias de escalada, permitindo que escaladores de todos os níveis encontrem vias novas e desafiadoras.

## 🚧 Aviso

:warning: Escalada é um esporte de risco. Avalie sempre as condições de uma via e esteja devidamente preparado.

## 🚀 Funcionalidades

- 🧗‍♂️ **Exploração de Vias de Escalada:** Descubra vias com detalhes como graduação, extensão, e mais. 
- 📜 **Informações Detalhadas:** Cada via possui informações sobre conquistadores e ano de conquista. 
- 📱 **PWA Intuitivo:** Suporte offline para acessar informações sem conexão à internet. 
- 🌐 **Compartilhamento e Colaboração:** Colabore com a comunidade de escalada compartilhando suas experiências.

## 🔧 Tecnologias

Cumes Brasil é construído com as seguintes tecnologias:

![Vue Badge](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![Vite Badge](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Quasar Badge](https://img.shields.io/badge/Quasar-1976D2?style=for-the-badge&logo=quasar&logoColor=white)
![Node.js Badge](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Typescript Badge](https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js Badge](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Docker Badge](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL Badge](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Postman Badge](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

## 📚 Créditos

Os dados do Cumes Brasil são uma compilação de várias fontes, com créditos especiais para **André Ilha** pelas vias da Zona Sul, Pedro Bugim por seu blog querido e para a **Companhia da Escalada** e **Daflon** por diversas contribuições valiosas.

## 🚀 Passos para os Desenvolvedores

### Pré-requisitos

Antes de iniciar, certifique-se de ter os seguintes itens instalados:

- Node.js
- npm ou yarn
- Docker
- Git

### Clonar o Repositório

````git
git clone https://seu-repositorio.git
````

````bash
cd cumes-brasil
````

### Configurar o Banco de Dados

Você pode optar por rodar o banco de dados localmente ou via Docker.

#### Usando Docker

1. **Rodar Apenas o Banco de Dados Usando Docker Compose**

   `docker-compose up -d db`

2. **Atualizar o Arquivo `.env` para Docker**

   **Certifique-se de que o arquivo `.env` do seu PC esteja configurado para usar o banco de dados no contêiner Docker**

````env
   DB_HOST=db
   DB_PORT=5432  
   DB_USERNAME=cumesbr
   DB_PASSWORD=sua_senha
   DB_NAME=cumes_brasil
````

#### Usando Localhost

1. **Instalar e Configurar PostgreSQL Localmente**

   Certifique-se de que o PostgreSQL está rodando em sua máquina.

2. **Atualizar o Arquivo `.env` para Localhost**

   **Certifique-se de que o arquivo `.env` do seu PC esteja configurado para usar o banco de dados local**

````env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=seu_usuario
   DB_PASSWORD=sua_senha 
   DB_NAME=cumes_brasil
````

### Rodar o Backend e o Frontend Localmente

**Backend**

````bash
cd backend
npm install
npm start
````

**Frontend**

````bash
cd frontend
npm install
`quasar dev -m pwa`
````

## 🤝 Contribua

Sua contribuição é muito bem-vinda! Veja como:

1. **Fork** o projeto.
2. Crie sua **Feature Branch**: `git checkout -b minha-feature`
3. **Commit** suas mudanças: `git commit -m 'Add: minha nova feature'`
4. **Push** para a branch: `git push origin minha-feature`
5. Abra um **Pull Request**.

## 🤝 Participantes

Pessoas que contribuíram para o projeto Cumes Brasil:

| <img src="https://avatars.githubusercontent.com/u/28628701?s=100&v=4" alt="Foto do Participante 1" width="100px" height="100px" /> | <img src="https://avatars.githubusercontent.com/u/69773445?s=100&v=4" alt="Foto do Participante 2" width="100px" height="100px" /> | <img src="https://avatars.githubusercontent.com/u/88738275?s=100&v=4" alt="Foto do Participante 3" width="100px" height="100px" /> | <img src="https://avatars.githubusercontent.com/u/22893710?s=100&v=4" alt="Foto do Participante 4" width="100px" height="100px" /> | <img src="https://avatars.githubusercontent.com/u/13644652?v=4" alt="Foto do Participante 5" width="100px" height="100px" /> |
|:-----------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------:|
|                          [Rafael Ventura](https://github.com/rafael-ventura)                          |                            [Igor Costa](https://github.com/igordeo-costa)                             |                             [Vitor Indio](https://github.com/vitorindio)                              |                               [Elmo Junior](https://github.com/elmojuh)                               |                               [Luiz Fernando](https://github.com/luizfcneto)                               |
