#!/bin/bash

# Navega até o diretório do projeto
cd /home/ec2-user/cumes-backend

# Altera as permissões do diretório e arquivos para garantir que o servidor possa acessar
sudo chown -R ec2-user:ec2-user /home/ec2-user/cumes-backend
sudo chmod -R 755 /home/ec2-user/cumes-backend
