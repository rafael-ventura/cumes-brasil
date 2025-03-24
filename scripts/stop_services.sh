#!/bin/bash
echo "Parando serviços antigos..."

# Parar a API no PM2
pm2 stop cumes-api || true
pm2 delete cumes-api || true

# Parar apenas o banco no Docker (mantendo a API fora dele)
docker-compose stop postgres

echo "API e banco de dados parados."
