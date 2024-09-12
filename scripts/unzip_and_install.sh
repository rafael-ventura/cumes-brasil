#!/bin/bash

# Define o caminho da pasta onde o CodeDeploy baixa os arquivos
DEPLOY_DIR=/opt/codedeploy-agent/deployment-root/deployment-archive

# Descompacta o arquivo backend.zip
echo "Descompactando backend.zip..."
unzip "$DEPLOY_DIR/backend.zip" -d /home/ec2-user/cumes-backend

# Verifica se a descompactação foi bem-sucedida
if [ $? -ne 0 ]; then
    echo "Falha ao descompactar o backend.zip"
    exit 1
fi

# Navega até o diretório backend
cd /home/ec2-user/cumes-backend/backend || exit 1

# Instala o Node.js se necessário
if ! command -v node &> /dev/null; then
    echo "Instalando Node.js..."
    curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs
fi

# Instala as dependências do projeto
echo "Instalando dependências do projeto..."
npm install --legacy-peer-deps