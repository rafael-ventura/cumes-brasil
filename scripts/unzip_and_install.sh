#!/bin/bash

# Diretório onde o arquivo backend.zip será salvo
DEPLOY_DIR="/home/ec2-user/cumes-backend"
ZIP_FILE="$DEPLOY_DIR/backend.zip"

# Verifica se o arquivo backend.zip está no diretório certo
if [ ! -f "$ZIP_FILE" ]; then
    echo "Arquivo $ZIP_FILE não encontrado!"
    exit 1
fi

# Descompacta o arquivo backend.zip, forçando a sobrescrita de arquivos existentes
echo "Descompactando $ZIP_FILE no diretório $DEPLOY_DIR..."
unzip -o "$ZIP_FILE" -d "$DEPLOY_DIR"

# Verifica se a descompactação foi bem-sucedida
if [ $? -ne 0 ]; then
    echo "Falha ao descompactar o arquivo $ZIP_FILE"
    exit 1
fi

# Navega até o diretório backend
cd "$DEPLOY_DIR/backend" || exit 1

# Limpa dependências antigas
echo "Removendo node_modules antigos, se houver..."
rm -rf node_modules
if [ $? -ne 0 ]; then
    echo "Falha ao remover node_modules"
    exit 1
fi

# Remove o cache do npm para evitar conflitos
echo "Limpando cache do npm..."
npm cache clean --force
if [ $? -ne 0 ]; then
    echo "Falha ao limpar o cache do npm"
    exit 1
fi

# Instalação do Node.js versão 20
echo "Instalando Node.js versão 20..."
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Verifica se a instalação do Node.js foi bem-sucedida
if [ $? -ne 0 ]; then
    echo "Falha ao instalar Node.js"
    exit 1
fi

# Verifica a versão do Node.js instalada
echo "Versão do Node.js:"
node -v

# Instala as dependências do projeto
echo "Instalando dependências do projeto..."
npm install

# Verifica se as dependências foram instaladas com sucesso
if [ $? -ne 0 ]; then
    echo "Falha ao instalar as dependências"
    exit 1
fi

echo "Instalação e descompactação concluídas com sucesso."
