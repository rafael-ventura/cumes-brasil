#!/bin/bash

# Navega até o diretório do backend
cd /home/ec2-user/cumes-backend/backend

# Limpa o cache do npm para evitar problemas de dependências
npm cache clean --force

# Remove qualquer versão anterior do Node.js e do npm que possa causar conflitos
sudo yum remove -y nodejs nodejs-full-i18n nodejs-npm

# Configura o repositório e instala o Node.js 20
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs --best --allowerasing

# Remove node_modules e package-lock.json para garantir uma instalação limpa
rm -rf node_modules package-lock.json

# Instala as dependências do projeto na pasta backend
npm install
