#!/bin/bash

# Navega até o diretório do projeto
cd /home/ec2-user/cumes-backend

# Inicia o servidor Node.js usando o script definido no package.json
npm run back-prod

# Reinicia o serviço do backend caso já exista
sudo systemctl restart cumes-backend.service
