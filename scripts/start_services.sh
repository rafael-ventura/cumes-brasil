#!/bin/bash
echo "Iniciando serviços..."

# Navegar até o diretório do projeto
cd /home/ec2-user/cumes-brasil || exit 1

# Rebuild das imagens (opcional)
docker-compose build

# Iniciar os containers Docker Compose
docker-compose up -d

echo "Serviços iniciados."
