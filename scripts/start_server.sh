#!/bin/bash

# Navega até o diretório do backend
cd /home/ec2-user/cumes-backend/backend

# Inicia o servidor Node.js no modo de produção
npm run back-prod

# Reinicia o serviço do backend, se estiver configurado no systemd
sudo systemctl restart cumes-backend.service
