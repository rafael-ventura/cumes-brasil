#!/bin/bash
echo "Iniciando serviços..."

# Navegar até o diretório do projeto
cd /home/ec2-user/cumes-brasil || exit 1

# Rebuild das imagens (opcional, dependendo da sua estratégia de deploy)
docker-compose build

# Iniciar os containers Docker Compose
docker-compose up -d

echo "Aplicando migrações do TypeORM..."
# Rodar migrações no container da api
docker-compose run --rm api npm run migration:run

echo "Serviços iniciados e banco atualizado com sucesso!"
