#!/bin/bash
echo "Parando serviços existentes..."

# Parar os containers Docker Compose
docker-compose down || true
