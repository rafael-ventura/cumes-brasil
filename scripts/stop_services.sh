#!/bin/bash
echo "Parando serviços existentes..."

docker-compose down || true
