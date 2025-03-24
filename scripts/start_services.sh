#!/bin/bash
echo "Iniciando serviços..."

# Navegar até o diretório do projeto
cd /home/ec2-user/cumes-brasil || exit 1

# Instalar dependências
npm install

# Build do backend (se necessário)
npm run build

# Parar a API antiga no PM2 (se estiver rodando)
pm2 delete cumes-api || true

# Iniciar a API com PM2
pm2 start dist/Api/server.js --name cumes-api

# Salvar o estado do PM2 para iniciar automaticamente no reboot da VM
pm2 save

echo "API iniciada com PM2!"

# Subir o PostgreSQL no Docker (se ainda estiver usando)
docker-compose up -d postgres

echo "Serviços iniciados."
