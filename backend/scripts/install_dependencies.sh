#!/bin/bash

# Atualiza o sistema e instala Node.js e npm usando yum
sudo yum update -y
sudo yum install -y nodejs npm

# Navega até o diretório do projeto
cd /home/ec2-user/cumes-backend/backend

# Instala as dependências do projeto
npm install
