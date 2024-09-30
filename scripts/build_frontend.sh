#!/bin/bash
echo "Building frontend on EC2..."

cd /home/ec2-user/cumes-brasil/frontend || exit 1

# Instalar dependências e buildar o frontend
npm install
npm run build

echo "Frontend build completed!"
