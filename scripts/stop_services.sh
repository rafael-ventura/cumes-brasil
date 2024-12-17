#!/bin/bash
echo "Parando e limpando serviços antigos..."

# Navegar até o diretório do projeto
cd /home/ec2-user/cumes-brasil || exit 1

# Parar e remover todos os contêineres em execução
docker-compose down

# Parar e remover todos os contêineres (ativos ou parados) - não necessário se já rodamos docker-compose down, mas mantemos por segurança
docker stop $(docker ps -aq) || true
docker rm $(docker ps -aq) || true

# NÃO REMOVER VOLUMES E IMAGENS!
# Assim mantemos o banco de dados e dados persistentes intactos.
# docker volume rm $(docker volume ls -q)
# docker rmi $(docker images -q) -f

echo "Serviços antigos parados. Volumes e dados preservados."
