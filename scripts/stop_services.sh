#!/bin/bash
echo "Parando e limpando serviços antigos..."

# Parar e remover todos os contêineres em execução
docker-compose down

# Remover contêineres parados
docker container prune -f

# Remover imagens antigas não utilizadas
docker image prune -f

# Remover volumes e redes não utilizados
docker volume prune -f
docker network prune -f

echo "Serviços antigos parados e limpos com sucesso!"
