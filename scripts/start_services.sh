#!/bin/bash
echo "Iniciando serviços..."

cd /home/ec2-user/cumes-brasil || exit 1

# Parar containers antigos
docker-compose down

# Subir containers com build atualizado
docker-compose up -d --build

echo "Serviços iniciados com sucesso via Docker!"
