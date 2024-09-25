#!/bin/bash
echo "Iniciando serviços..."

cd /home/ec2-user/cumes-brasil || exit 1

# Iniciar os containers Docker Compose
docker-compose up -d
