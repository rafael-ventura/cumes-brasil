#!/bin/bash

echo "Iniciando a instalação das dependências..."

cd /home/ec2-user/cumes-brasil/backend || exit 1

# Versão requerida do Node.js
REQUIRED_NODE_VERSION="v20"

# Verificar se o Node.js já está instalado
if command -v node > /dev/null 2>&1; then
    INSTALLED_NODE_VERSION=$(node -v)
    echo "Versão do Node.js instalada: $INSTALLED_NODE_VERSION"

    if [[ "$INSTALLED_NODE_VERSION" == "$REQUIRED_NODE_VERSION"* ]]; then
        echo "Node.js já está na versão $REQUIRED_NODE_VERSION, não é necessário reinstalar."
    else
        echo "Versão do Node.js diferente da requerida. Instalando a versão $REQUIRED_NODE_VERSION..."
        curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
        sudo yum install -y nodejs
    fi
else
    echo "Node.js não está instalado. Instalando a versão $REQUIRED_NODE_VERSION..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs
fi

# Verifica novamente a versão do Node.js instalada
echo "Versão atual do Node.js"
node -v

# Instalar dependências apenas se houver mudanças no package-lock.json
if [ -d "node_modules" ] && [ -f "package-lock.json" ]; then
    echo "Verificando se há mudanças nas dependências..."

    # Calcular o hash atual do package-lock.json
    CURRENT_LOCKFILE_HASH=$(sha256sum package-lock.json | awk '{ print $1 }')

    # Verificar se existe um arquivo com o hash anterior
    if [ -f ".package-lock.hash" ]; then
        PREVIOUS_LOCKFILE_HASH=$(cat .package-lock.hash)
    else
        PREVIOUS_LOCKFILE_HASH=""
    fi

    if [ "$CURRENT_LOCKFILE_HASH" == "$PREVIOUS_LOCKFILE_HASH" ]; then
        echo "Dependências não mudaram. Pulando a reinstalação."
    else
        echo "Dependências mudaram. Instalando novamente."
        npm ci
        echo "$CURRENT_LOCKFILE_HASH" > .package-lock.hash
    fi
else
    echo "Diretório node_modules não existe ou package-lock.json não encontrado. Instalando dependências."
    npm ci
    # Salvar o hash do package-lock.json
    sha256sum package-lock.json | awk '{ print $1 }' > .package-lock.hash
fi

# Compila o projeto
echo "Compilando o projeto..."
npm run build
