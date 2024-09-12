#!/bin/bash

# Define o diretório onde o backend.zip foi salvo
DEPLOY_DIR="/home/ec2-user/cumes-backend"

# Verifica se o arquivo backend.zip está no diretório certo
if [ ! -f "$DEPLOY_DIR/backend.zip" ]; then
    echo "Arquivo backend.zip não encontrado no diretório $DEPLOY_DIR"
    exit 1
fi

# Descompacta o arquivo backend.zip
echo "Descompactando backend.zip..."
unzip "$DEPLOY_DIR/backend.zip" -d "$DEPLOY_DIR"

# Verifica se a descompactação foi bem-sucedida
if [ $? -ne 0 ]; then
    echo "Falha ao descompactar o backend.zip"
    exit 1
fi

# Navega até o diretório backend
cd "$DEPLOY_DIR/backend" || exit 1

# Instala o Node.js se necessário
if ! command -v node &> /dev/null; then
    echo "Instalando Node.js..."
    curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs
fi

# Instala as dependências do projeto
echo "Instalando dependências do projeto..."
npm install --legacy-peer-deps
