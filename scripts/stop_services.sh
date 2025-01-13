#!/bin/bash
echo "Parando serviços antigos..."

# Parar a API no PM2
pm2 stop cumes-api || true

# Parar o banco de dados no Docker Compose
cd /home/ec2-user/cumes-brasil || exit 1
docker-compose down

echo "Serviços antigos parados."
