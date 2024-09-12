#!/bin/bash

# Descompacta o arquivo backend.zip
echo "Descompactando backend.zip..."
unzip /home/ec2-user/cumes-backend/backend.zip -d /home/ec2-user/cumes-backend

# Navega até o diretório backend
cd /home/ec2-user/cumes-backend || exit 1

# Instala o Node.js se necessário
if ! command -v node &> /dev/null; then
    echo "Instalando Node.js..."
    curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs
fi

# Instala as dependências do projeto
echo "Instalando dependências do projeto..."
npm install --legacy-peer-deps
