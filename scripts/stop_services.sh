#!/bin/bash
echo "Parando e limpando serviços antigos..."

# Parar e remover todos os contêineres em execução
docker-compose down

# Remover contêineres parados
docker container prune -f

# Remover imagens antigas (opcional: apenas imagens que não estão em uso)
docker image prune -f

# Remover volumes não utilizados
docker volume prune -f

# Remover redes não utilizadas
docker network prune -f

docker rmi cumes-brasil-frontend cumes-brasil-api

echo "Serviços antigos parados e limpos com sucesso!"
