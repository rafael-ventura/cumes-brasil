#!/bin/bash

# Navega até o diretório backend
cd /home/ec2-user/cumes-backend/backend || exit 1

# Inicia a aplicação
echo "Iniciando o servidor Node.js..."
sudo systemctl start cumes-backend.service
