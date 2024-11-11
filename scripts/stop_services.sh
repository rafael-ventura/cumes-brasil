#!/bin/bash
echo "Parando e limpando serviços antigos..."

# Remover o diretório node_modules para evitar conflitos
rm -rf /home/ec2-user/cumes-brasil/backend/node_modules

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
