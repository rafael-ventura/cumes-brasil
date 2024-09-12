#!/bin/bash

# Navega até o diretório do backend
cd /home/ec2-user/cumes-backend/backend || exit 1

# Limpa o cache do npm para evitar problemas de dependências, caso o npm já esteja instalado
if command -v npm &> /dev/null; then
    echo "Limpando o cache do npm..."
    npm cache clean --force
else
    echo "npm não encontrado, pulando a limpeza de cache..."
fi

# Remove qualquer versão anterior do Node.js e do npm que possa causar conflitos
echo "Removendo versões anteriores do Node.js e do npm..."
sudo yum remove -y nodejs nodejs-full-i18n nodejs-npm

# Limpa pacotes em cache do yum
echo "Limpando o cache de pacotes do yum..."
sudo yum clean packages

# Configura o repositório e instala o Node.js 20
echo "Configurando o repositório do Node.js 20.x..."
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -

echo "Instalando o Node.js 20..."
sudo yum install -y nodejs --best --allowerasing

# Verifica se o Node.js e npm foram instalados corretamente
if command -v node &> /dev/null && command -v npm &> /dev/null; then
    echo "Node.js e npm instalados com sucesso."
else
    echo "Erro ao instalar Node.js e npm." >&2
    exit 1
fi

# Remove node_modules e package-lock.json para garantir uma instalação limpa
echo "Removendo node_modules e package-lock.json, se existirem..."
rm -rf node_modules package-lock.json

# Instala as dependências do projeto na pasta backend
echo "Instalando dependências do projeto..."
npm install --legacy-peer-deps

# Verifica se a instalação foi bem-sucedida
if [ $? -eq 0 ]; then
    echo "Dependências instaladas com sucesso!"
else
    echo "Erro ao instalar dependências." >&2
    exit 1
fi
