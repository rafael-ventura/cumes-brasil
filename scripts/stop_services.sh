#!/bin/bash
echo "Parando serviços antigos..."

cd /home/ec2-user/cumes-brasil || exit 1

docker-compose down

echo "Todos os serviços foram parados."
