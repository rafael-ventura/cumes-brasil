#!/bin/bash
echo "Parando e limpando serviços antigos..."

# Remover o diretório node_modules para evitar conflitos
rm -rf /home/ec2-user/cumes-brasil/backend/node_modules

# Parar e remover todos os contêineres em execução
docker-compose down

# Parar e remover todos os contêineres (ativos ou parados)
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

# Remover todos os volumes
docker volume rm $(docker volume ls -q)

# Remover todas as imagens
docker rmi $(docker images -q) -f

echo "Serviços antigos parados e limpos com sucesso!"
