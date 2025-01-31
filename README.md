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

**Cumes Brasil** é um aplicativo **PWA (Progressive Web Application)** dedicado à comunidade de escalada no Brasil. Nosso objetivo é fornecer acesso rápido e offline a informações sobre vias de escalada, permitindo que escaladores de todos os níveis encontrem vias novas e desafiadoras.

O sistema conta com **frontend em Vue.js (Quasar)** e um **backend Node.js com TypeORM**, utilizando **Docker e PostgreSQL** para armazenar os dados. Além disso, o projeto está hospedado na **AWS EC2**, com um pipeline automatizado para deploy contínuo.

## 🚧 Aviso

:warning: **Escalada é um esporte de risco. Avalie sempre as condições de uma via e esteja devidamente preparado.**

## 🚀 Funcionalidades

- 🧗‍♂️ **Exploração de Vias de Escalada:** Descubra vias com detalhes como graduação, extensão e tipo de escalada.
- 📜 **Informações Detalhadas:** Cada via possui informações sobre conquistadores, ano de conquista e dados técnicos.
- 📱 **Suporte Offline (PWA):** Acesse informações de escalada mesmo sem conexão à internet.
- 🌐 **Compartilhamento e Colaboração:** Contribua com a comunidade adicionando novas vias e avaliações.
- 🔍 **Pesquisa Avançada:** Filtros para buscar vias por dificuldade, localização e tipo de rocha.
- 🔄 **Integração com APIs Externas:** Importação de dados de escaladas já registradas.

## 🔧 Tecnologias

O projeto utiliza as seguintes tecnologias:

![Vue Badge](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![Vite Badge](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Quasar Badge](https://img.shields.io/badge/Quasar-1976D2?style=for-the-badge&logo=quasar&logoColor=white)
![Node.js Badge](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Typescript Badge](https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js Badge](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Docker Badge](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL Badge](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![CloudFront Badge](https://img.shields.io/badge/AWS_CloudFront-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)
![S3 Badge](https://img.shields.io/badge/AWS_S3-569A31?style=for-the-badge&logo=amazonaws&logoColor=white)

## 📚 Créditos

Os dados do Cumes Brasil são uma compilação de várias fontes, com créditos especiais para:

- **André Ilha** pelas vias da Zona Sul.
- **Pedro Bugim** por seu blog e registros históricos.
- **Companhia da Escalada** e **Daflon** por diversas contribuições valiosas.

## 🚀 Configuração do Ambiente

### **Pré-requisitos**
Antes de iniciar, certifique-se de ter os seguintes itens instalados:

- **Node.js** (>= 18)
- **npm** ou **yarn**
- **Docker**
- **Git**

### **Clonar o Repositório**
```bash
git clone https://github.com/rafael-ventura/cume-brasil.git
cd cumes-brasil
```

### **Configurar o Banco de Dados**
Você pode rodar o banco de dados localmente ou via Docker.

#### **Usando Docker**
1. **Rodar Apenas o Banco de Dados:**
   ```bash
   docker-compose up -d db
   ```

2. **Atualizar o Arquivo `.env`:**
   ```env
   DB_HOST=db
   DB_PORT=5432  
   DB_USERNAME=cumesbr
   DB_PASSWORD=sua_senha
   DB_NAME=cumes_brasil
   ```

#### **Usando PostgreSQL Local**
1. **Instalar e Configurar o PostgreSQL**
2. **Atualizar o `.env` conforme o banco local:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=seu_usuario
   DB_PASSWORD=sua_senha 
   DB_NAME=cumes_brasil
   ```

### **Rodar a Aplicação**
#### **Backend**
```bash
cd backend
npm install
npm run start
```

#### **Frontend**
```bash
cd frontend
npm install
quasar dev -m pwa
```

## 📦 Deploy

O Cumes Brasil está hospedado na AWS EC2, utilizando S3 e CloudFront para servir os assets. O pipeline de CI/CD é gerenciado pelo GitHub Actions.

### **Passos para Deploy Manual**
1. **Atualizar o frontend:**
   ```bash
   npm run build
   aws s3 sync ./dist s3://cumes-brasil-front
   ```

2. **Atualizar o backend via SSH:**
   ```bash
   ssh ubuntu@seu-servidor "cd /caminho/backend && git pull && npm install && pm2 restart all"
   ```

## 🤝 Contribua

Quer ajudar no desenvolvimento do Cumes Brasil? Veja como:

1. **Fork** o projeto.
2. Crie uma **Feature Branch**:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça seu **commit**:
   ```bash
   git commit -m 'Add: minha nova feature'
   ```
4. Envie para o repositório:
   ```bash
   git push origin minha-feature
   ```
5. Abra um **Pull Request**.

## 👥 Equipe

Desenvolvido por:

| <img src="https://avatars.githubusercontent.com/u/28628701?s=100&v=4" alt="Rafael Ventura" width="100px" /> | <img src="https://avatars.githubusercontent.com/u/69773445?s=100&v=4" alt="Igor Costa" width="100px" /> | <img src="https://avatars.githubusercontent.com/u/88738275?s=100&v=4" alt="Vitor Indio" width="100px" /> | <img src="https://avatars.githubusercontent.com/u/22893710?s=100&v=4" alt="Elmo Junior" width="100px" /> | <img src="https://avatars.githubusercontent.com/u/13644652?v=4" alt="Luiz Fernando" width="100px" /> |
|:----------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------:|
|                          [Rafael Ventura](https://github.com/rafael-ventura)                               |                            [Igor Costa](https://github.com/igordeo-costa)                              |                             [Vitor Indio](https://github.com/vitorindio)                                |                               [Elmo Junior](https://github.com/elmojuh)                                 |                               [Luiz Fernando](https://github.com/luizfcneto)                        |
