#!/bin/bash

# Diretório onde o arquivo backend.zip será salvo
DEPLOY_DIR="/home/ec2-user/cumes-backend"
ZIP_FILE="$DEPLOY_DIR/backend.zip"

# Verifica se o arquivo backend.zip está no diretório certo
if [ ! -f "$ZIP_FILE" ]; then
    echo "Arquivo $ZIP_FILE não encontrado!"
    exit 1
fi

# Descompacta o arquivo backend.zip
echo "Descompactando $ZIP_FILE no diretório $DEPLOY_DIR..."
unzip "$ZIP_FILE" -d "$DEPLOY_DIR"

# Verifica se a descompactação foi bem-sucedida
if [ $? -ne 0 ]; then
    echo "Falha ao descompactar o arquivo $ZIP_FILE"
    exit 1
fi

# Navega até o diretório backend
cd "$DEPLOY_DIR/backend" || exit 1

# Instala as dependências do projeto
echo "Instalando dependências do projeto..."
npm install --legacy-peer-deps

# Verifica se as dependências foram instaladas com sucesso
if [ $? -ne 0 ]; then
    echo "Falha ao instalar as dependências"
    exit 1
fi

echo "Instalação e descompactação concluídas com sucesso."
